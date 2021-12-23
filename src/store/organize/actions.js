import request from '@/boot/axios'
import indexedDB from '@/boot/indexed-db'
import Organize from './model'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
export default {
  /**
   *获取所有的机构列表信息
   * @param {*} { state, commit }
   */
  loadOrganizes ({
    state,
    commit
  }) {
    if (!state.loadedAll) {
      return request.get('/organizes/getlist').then(res => {
        let organizes = Organize.from(res.data)
        commit('updateOrganizes', _.keyBy(organizes, 'id'))
        commit('setLoadedAll', true)
        return organizes
      })
    } else {
      return _.values(state.organizes)
    }
  },
  /**
   *获取一个机构信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadOrganize ({
    state,
    commit
  }, id) {
    let organize = state.organizes[id]
    if (!organize) {
      return request.get('/organizes/GetModel', {
        id: id
      }).then(res => {
        if (res.data) {
          organize = Organize.from(res.data)
          commit('updateOrganizes', _.keyBy([_.cloneDeep(organize)], 'id'))
          return organize
        }
      })
    } else {
      return organize
    }
  },
  /**
   *获取一个机构信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadCompany ({
    state,
    commit
  }, id) {
    let organize = state.organizes[id]
    if (!organize) {
      return request.get('/organizes/GetCompany', {
        id: id
      }).then(res => {
        if (res.data) {
          organize = Organize.from(res.data)
          commit('updateOrganizes', _.keyBy([_.cloneDeep(organize)], 'id'))
          return organize
        }
      })
    } else {
      return organize
    }
  },
  /**
   * 提供给选择控件的机构数据
   * @param {*} { state,commit }
   * @returns
   */
  loadSelectOrganizes ({ state, commit }) {
    indexedDB.loadList('organize').then(data => {
      data && data.length > 0 && commit('updateSelectOrganizes', data[0].organizes)
      indexedDB.getLastUpdateTime().then(res => {
        let lastRecvTime = res || '1000-01-01 00:00:00'
        let fields = 'Select'
        let query = JSON.stringify([
          { Key: 'CreateTime', Value: lastRecvTime, Oper: 'gt' },
          'or',
          { Key: 'ModifyTime', Value: lastRecvTime, Oper: 'gt' }
        ])
        return request.get('/organizes/getlist', { fields, query }).then(res => {
          if (res.data) {
            let addOrganizes = Organize.from(res.data)
            if (addOrganizes.length) {
              commit('updateSelectOrganizes', _.keyBy(addOrganizes, 'id'))
              indexedDB.update('organize', { id: 1, organizes: state.selectOrganizes })
            }
          }
          return Object.values(state.selectOrganizes)
        })
      })
    })
  },
  /**
   * 维护机构信息
   * @param {*} { commit }
   * @param {*} organize
   * @returns
   */
  updateOrganize ({
    commit
  }, organize) {
    var model = Organize.to(organize)
    if (organize.id === 0) {
      // 后台数据库中添加数据
      return request.post('/organizes/Add', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var organize = Organize.from(res.data)
          commit('updateOrganizes', _.keyBy([_.cloneDeep(organize)], 'id'))
          return organize
        }
      }, error => {
        // 处理异常
        error.userMessage && showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
        return false
      })
    } else {
      // 后台数据库中更新数据
      return request.put('/organizes/Update', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var organize = Organize.from(res.data)
          commit('updateOrganizes', _.keyBy([_.cloneDeep(organize)], 'id'))
          return organize
        }
      }, error => {
        // 处理异常
        error.userMessage && showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
      })
    }
  },
  /**
   * 更新机构字段
   * @param {*} param0
   * @param {*} payload
   */
  updateOrganizeField ({
    commit
  }, payload) {
    const model = Organize.to(payload)
    return request.put('/organizes/updatefields', model)
      .then(res => {
        const model = Organize.from(res.data)
        commit('updateOrganizes', _.keyBy([_.cloneDeep(model)], 'id'))
        return model
      }).catch(error => {
        console.log(error)
        return false
      })
  },
  /**
   * 更新机构成员
   * @param {*} id:机构ID
   * @param {*} psonIDs 机构成员的IDs的集合
   */
  updateOrganizeMembers ({
    dispatch
  }, {
    organizeID,
    psonIDs
  }) {
    // 后台人员接口中更新数据
    psonIDs = _.isArray(psonIDs) ? personIDs.join(',') : psonIDs
    return dispatch('/organizes/UpdateMember', {
      organizeID,
      psonIDs
    }).then(res => {
      const model = Organize.from(res.data)
      commit('updateOrganizes', _.keyBy([_.cloneDeep(model)], 'id'))
      return model
    }).catch(error => {
      console.log(error)
      return false
    })
  },
  /**
   * 删除机构信息
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  deleteOrganize ({
    state, commit
  }, id) {
    return request.delete('/organizes/Delete', {
      id
    }).then(res => {
      // 更新前台数据
      if (res.data) {
        commit('deleteOrganize', [id])
        indexedDB.update('organize', { id: 1, organizes: state.selectOrganizes })
        return res.data
      }
    }).catch(error => {
      console.log(error)
      return false
    })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（机构）start ***************************************/
  /** ************************************************************************************************/
  /**
   * 取消删除
   * @param {*} param0
   * @param {*} id
   */
  undeleteOrganize ({
    state,
    commit
  }, id) {
    return request.get('/organizes/Undelete', { id })
      .then(res => {
        if (res.data) {
          let organize = Organize.from(res.data)
          commit('updateOrganizes', [organize])
          commit('undeleteOrganizeInTrash', id)
          return organize
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 获取与我相关的已删除机构
   * @param {*} param0
   */
  loadOrganizesInMyTrash ({
    state,
    commit
  }) {
    const my = LocalStorage.getItem('myself')
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'LeaderID', Value: my.id, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get('/organizes/GetDeletedList', { query: JSON.stringify(query) }).then(res => {
      let list = Organize.from(res.data)
      commit('addOrganizesTrash', list)
      return list
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  }
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（机构）end *****************************************/
  /** ************************************************************************************************/
}
