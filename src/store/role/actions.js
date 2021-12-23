import request from '@/boot/axios'
import indexedDB from '@/boot/indexed-db'
import Role from './model'
import Person from '../person/model'
import { showWarningMessage } from '@/utils/show-message'
export default {
  /**
   *获取所有的角色信息
   * @param {*} { commit }
   */
  loadRoles ({ commit, state }) {
    if (!state.loadedAll) {
      return request.get('/roles/getlist').then(res => {
        let roles = Role.from(res.data)
        commit('updateRoles', _.keyBy(_.cloneDeep(roles), 'id'))
        commit('setLoadedAll', true)
        return roles
      })
    } else {
      return _.values(state.roles)
    }
  },
  /**
   *获取一个角色信息通过id
   *
   * @param {*} { state }
   * @param {*} id
   */
  loadRole ({ state, commit }, id) {
    let role = state.roles[id]
    if (!role) {
      return request.get('/roles/GetModel', { id: id }).then(res => {
        if (res.data) {
          role = Role.from(res.data)
          commit('updateRoles', _.keyBy([_.cloneDeep(role)], 'id'))
          return role
        }
      })
    } else {
      return role
    }
  },
  /**
  * 提供给选择控件的角色数据
  * @param {*} { state, commit }
  * @returns
  */
  loadSelectRoles ({ state, commit }) {
    indexedDB.loadList('role').then(data => {
      data && data.length > 0 && commit('updateSelectRoles', data[0].roles)
      indexedDB.getLastUpdateTime().then(res => {
        let lastRecvTime = res || '1000-01-01 00:00:00'
        let fields = 'Select'
        let query = JSON.stringify([
          { Key: 'CreateTime', Value: lastRecvTime, Oper: 'gt' },
          'or',
          { Key: 'ModifyTime', Value: lastRecvTime, Oper: 'gt' }
        ])
        return request.get('/roles/getlist', { fields, query }).then(res => {
          if (res.data) {
            let addRoles = Role.from(res.data)
            if (addRoles.length) {
              commit('updateSelectRoles', _.keyBy(addRoles, 'id'))
              indexedDB.update('role', { id: 1, roles: state.selectRoles })
            }
          }
          return Object.values(state.selectRoles)
        })
      })
    })
  },
  /**
   * 维护角色信息
   * @param {*} { commit }
   * @param {*} role
   * @returns
   */
  updateRole ({ commit }, role) {
    var model = Role.to(role)
    if (role.id === 0) {
      // 后台数据库中添加数据
      return request.post('/roles/Add', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var role = Role.from(res.data)
          commit('updateRoles', _.keyBy([_.cloneDeep(role)], 'id'))
          return role
        }
      })
    } else {
      // 后台数据库中更新数据
      return request.put('/roles/Update', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var role = Role.from(res.data)
          commit('updateRoles', _.keyBy([_.cloneDeep(role)], 'id'))
          return role
        }
      })
    }
  },
  /**
   * 更新角色下成员
   * @param {*} id:角色ID
   * @param {*} personIDs： 角色成员的IDs的集合
   */
  updateRoleMembers ({ commit }, { roleID, newMembers, oldMembers }) {
    return request.put('roles/UpdateMembers', { roleID, newMembers: _.join(newMembers), oldMembers: _.join(oldMembers) }).then(res => {
      if (res.data) {
        if (res.data) {
          var persons = Person.from(res.data)
          commit('person/updatePersons', _.keyBy(_.cloneDeep(persons), 'id'), { root: true })
          return persons
        }
      }
    })
  },
  /**
   * 删除角色信息
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  deleteRole ({ state, commit }, id) {
    return request.delete('/roles/Delete', { id: id }).then(res => {
      // 更新前台数据
      if (res.data) {
        commit('deleteRole', [id])
        indexedDB.update('role', { id: 1, roles: state.selectRoles })
        return res.data
      } else {
        showWarningMessage('请先移除该角色下成员')
      }
    })
  }
}
