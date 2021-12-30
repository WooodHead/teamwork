import { LocalStorage } from 'quasar'
import { i18n } from '../../boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Followup from '@/store/followup/model'

const url = {
  getModel: 'followups/getmodel',
  add: 'followups/add',
  update: 'followups/update',
  updatefields: 'followups/updatefields',
  delete: 'followups/delete',
  getList: 'followups/getlist',
  getPageList: 'followups/getpagelist',
  getCount: 'followups/getcount'
}

export default {
  /**
   * 获取指定跟进
   * @param {*} param0
   * @param {*} ID
   */
  loadFollowup ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let followup = _.find(state.followups, { 'id': +id })
    if (followup) {
      return followup
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let followup = Followup.from(res.data)
        commit('addFollowups', [followup])
        return followup
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
        return new Followup()
      })
    }
  },
  /**
   * 获取跟进列表
   * @param {*} param0
   * @param {*} param1
   */
  loadFollowups ({ commit, state }, { byPage = false, query, filter, returnData = true }) {
    let condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: state.sort,
      search: state.search,
      fields: 'List'
    }
    return request
      .get(url.getList, condition).then(res => {
        let followups = Followup.from(res.data)
        commit('addFollowups', followups)
        commit('updatePage',
          {
            offset: state.page.offset + followups.length,
            limit: state.page.limit
          })
        if (returnData) {
          return followups
        } else {
          return !byPage || res.nextPageToken === -1
        }
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
        return true
      })
  },
  /**
   * 重置列表
   * @param {*} param0
   */
  resetFollowups ({ commit, state }) {
    commit('updatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /**
   * 新建跟进
   * @param {*} param0
   * @param {*} payload
   */
  addFollowup ({ commit, dispatch }, payload) {
    let followup = Followup.to(payload)
    return request.post(url.add, followup).then(res => {
      let followup = Followup.from(res.data)
      // 更新缓存列表
      commit('addFollowups', [followup])
      return followup
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 修改跟进
   * @param {*} param0
   * @param {*} payload
   */
  updateFollowup ({ commit, dispatch }, payload) {
    let followup = Followup.to(payload)
    return request.put(url.update, followup).then(res => {
      let followup = Followup.from(res.data)
      commit('updateFollowup', followup)
      return followup
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 删除跟进
   * @param {*} param0
   * @param {*} id
   */
  deleteFollowup ({ state, commit, dispatch }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      commit('deleteFollowup', id)
      return true
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 我的跟进
   * @param {*} param0
   * @param {*} param
   */
  loadMyFollowups ({ state, commit }, param) {
    const my = LocalStorage.getItem('myself') || {}
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'Members', Value: my.id, Oper: 'inset' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.getFollowups, { query: JSON.stringify(query) }
    ).then(res => {
      let followups = Followup.from(res.data)
      return followups
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`followup.error.${error.userMessage}`))
      return false
    })
  }

}
