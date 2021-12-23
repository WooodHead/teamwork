import request from '@/boot/axios'
import Group from './model'
import { LocalStorage } from 'quasar'
export default {
  /**
   *获取所有的群组信息
   * @param {*} { commit }
   */
  loadGroups ({ state, commit }) {
    if (!state.loadedAll) {
      return request.get('/groups/getlist').then(res => {
        let groups = Group.from(res.data)
        commit('updateGroups', _.keyBy(_.cloneDeep(groups), 'id'))
        commit('setLoadedAll', true)
        return groups
      })
    } else {
      return _.values(state.groups)
    }
  },
  /**
   *获取一个群组信息通过id
   *
   * @param {*} { state }
   * @param {*} id
   */
  loadGroup ({ state, commit }, id) {
    let group = state.groups[id]
    if (!group) {
      return request.get('/groups/GetModel', { id: id }).then(res => {
        if (res.data) {
          group = Group.from(res.data)
          commit('updateGroups', _.keyBy([_.cloneDeep(group)], 'id'))
          return group
        }
      })
    } else {
      return group
    }
  },
  /**
   * 维护群组信息
   * @param {*} { commit }
   * @param {*} group
   * @returns
   */
  updateGroup ({ commit }, group) {
    group.psonId = LocalStorage.getItem('myself').id
    var model = Group.to(group)
    if (group.id === 0) {
      // 后台数据库中添加数据
      return request.post('/groups/Add', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var group = Group.from(res.data)
          commit('updateGroups', _.keyBy([_.cloneDeep(group)], 'id'))
          return group
        }
      })
    } else {
      // 后台数据库中更新数据
      return request.put('/groups/Update', model).then(res => {
        // 更新前台数据
        if (res) {
          var group = Group.from(res)
          commit('updateGroups', _.keyBy([_.cloneDeep(group)], 'id'))
          return group
        }
      })
    }
  },
  /**
   * 维护群组指定字段
   *
   * @param {*} { commit }
   * @param {*} { id, fieldName, value }
   * @returns
   */
  updateGroupField ({ commit }, { id, fieldName, value }) {
    fieldName = _.findKey(Group.FieldsConvert(), f => f === fieldName)
    // 后台数据库中更新数据
    return request.put('/groups/updatefields', { Id: id, [fieldName]: value }).then(res => {
      // 更新前台数据
      if (res.data) {
        var group = Group.from(res.data)
        fieldName = Group.FieldsConvert()[fieldName]
        commit('updateGroupField', { id, fieldName, value: value.split(',') })
        return group
      } else {
        return false
      }
    }, error => {
      console.log(error)
      return false
    })
  },
  /**
   * 删除群组信息
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  deleteGroup ({ commit }, id) {
    return request.delete('/groups/delete', { id: id }).then(res => {
      // 更新前台数据
      if (res.data) {
        commit('deleteGroup', id)
        return res.data
      }
    })
  }
}
