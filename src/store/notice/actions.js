import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import { i18n } from '../../boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Notice from '@/store/notice/model'
const my = LocalStorage.getItem('myself') || {}

const url = {
  getModel: 'notices/getmodel',
  add: 'notices/add',
  update: 'notices/update',
  updatefields: 'notices/updatefields',
  delete: 'notices/delete',
  getList: 'notices/getlist',
  getPageList: 'notices/getpagelist',
  getCount: 'notices/getcount',
  getHistory: 'notices/getHistory',
  addhistorybysendmessage: 'notices/addhistorybysendmessage',
  copy: 'notices/copy',
  move: 'notices/move',
  getDeletedList: 'notices/getDeletedList',
  undelete: 'notices/Undelete',
  UpdateCommentCount: 'notices/UpdateCommentCount'
}
// 系统公告
export default {
  /**
   * 获取当前公告文档信息
   * @param {*} param0
   * @param {*} ID
   */
  loadNotice ({ state, commit }, id) {
    if (!id) return
    // 先从前台state列表缓存获取
    let notice = _.find(state.notices, { 'id': +id })
    if (notice) {
      return notice
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let notice = Notice.from(res.data)
        commit('pushNotices', [notice])
        return notice
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
        return {}
      })
    }
  },
  /**
   * 获取当前公告文档信息
   * @param {*} param0
   * @param {*} ID
   */
  loadPublicNotice ({ state, commit }, { id = 0, token = '' }) {
    // 先从前台state列表缓存获取
    let notice = _.find(state.notices, { 'id': id })
    if (notice) {
      return notice
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id,
        token: token
      }).then(res => {
        let notice = Notice.from(res.data)
        commit('pushNotices', [notice])
        return notice
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
        return {}
      })
    }
  },
  /**
   * 获取公告列表（发布、草稿、归档）
   * @param {*} param0
   * @param {*} param1
   */
  loadNotices ({ commit, state, getters }, { byPage = false, query = [], orderby = 'id DESC' }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      orderby: orderby
    }).then(res => {
      let notices = Notice.from(res.data)
      commit('pushNotices', notices)
      commit('updatePage', {
        offset: state.page.offset + notices.length,
        limit: state.page.limit
      })
      return res
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return []
    })
  },
  /**
   * 获取公告小卡片列表
   * @param {*} param0
   * @param {*} param1
   */
  loadWidgetNotices ({ commit, state }, { query = '', limit = 6 }) {
    return request.get(url.getPageList, {
      query: query,
      limit: limit,
      offset: 0,
      sort: 'orderNumber desc, modifyTime' // 公告小卡片排序与公告主页排序保持一致
    }).then(res => {
      let notices = Notice.from(res.data)
      return notices
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return false
    })
  },
  /**
* 更新公告评论数量
* @param {*} param0 id 公告id
* @param {*} param1 isAdd true：新建评论；false：删除评论
*/
  updateNoticeCommentCount ({ commit }, { id, isAdd }) {
    return request.put(url.UpdateCommentCount, { id, isAdd })
      .then(res => {
        let notice = Notice.from(res.data)
        commit('updateNotice', notice)
        return notice
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** 
  /**
   * 重置公告列表
   * @param {*} param0
   */
  resetNotices ({ commit, state }) {
    commit('updatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /**
   * 新建公告
   * @param {*} param0
   * @param {*} model
   */
  addNotice ({ commit }, model) {
    let notice = Notice.to(model)
    return request.post(url.add, notice).then(res => {
      let notice = Notice.from(res.data)
      // 更新缓存列表
      commit('pushNotices', [notice])
      notice.isPublish === 0 && commit('increaseDraftCount')
      return notice
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 修改公告
   * @param {*} param0
   * @param {*} model
   */
  updateNotice ({ state, commit }, model) {
    let old = _.find(state.notices, { 'id': model.id })
    let notice = Notice.to(model)
    return request.put(url.update, notice).then(res => {
      let notice = Notice.from(res.data)
      commit('updateNotice', notice)
      if (old.isPublish === 0 && notice.isPublish === 1) {
        // 更新草稿数量
        commit('decreaseDraftCount')
      }
      return notice
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return false
    })
  },
  addHistoryBySendMessage ({ state, commit }, payload) {
    return request.put(url.addhistorybysendmessage, payload).then(res => {
      let notice = Notice.from(res.data)
      commit('updateNotice', notice)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 删除公告
   * @param {*} param0
   * @param {*} id
   */
  deleteNotice ({ state, commit }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      let notice = _.find(state.notices, { id: id })
      commit('deleteNotice', id)
      // 加入Trash
      commit('addNoticesInTrash', notice)
      /// /
      if (notice && notice.isPublish === 0) {
        // 草稿数量-1
        commit('decreaseDraftCount')
      } else if (notice && notice.archived) {
        // 归档数量+1
        commit('decreaseArchivedCount')
        // 跳转至归档页面
        this.$router.push({
          name: 'archivedNotices',
          params: { category: notice.objectType, objectID: notice.objectID }
        })
      } else {
        // 跳转至列表页面
        this.$router.push({
          name: 'notice',
          params: { category: notice.objectType, objectID: notice.objectID }
        })
      }
      return true
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 解删除一个公告
   * @param {Object} param0 --
   * @param {Number} id 公告id
   */
  undeleteNotice ({ state, commit }, id) {
    return request.get(url.undelete, { id })
      .then((res) => {
        let notice = Notice.from(res.data)
        commit('addNotice', notice)
        commit('undeleteNoticeInTrash', id)
        if (notice && notice.isPublish === 0) {
          // 草稿数量+1
          commit('increaseDraftCount')
        } else if (notice && notice.archived) {
          // 更新归档数量
          commit('increaseArchivedCount')
        } else {
          // 跳转至列表页面
          this.$router.push({
            name: 'notice',
            params: { category: notice.objectType, objectID: notice.objectID }
          })
        }
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 归档公告
   * @param {*} param0
   * @param {*} ID
   */
  archiveNotice ({ commit, dispatch, rootState }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      Archived: 1,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }).then(res => {
      let notice = Notice.from(res.data)
      // 更新缓存列表
      commit('updateNotice', notice)
      // 归档数量+1
      commit('increaseArchivedCount')
      // 添加归档区面包屑
      if (rootState.breadcrumbs && rootState.breadcrumbs.widgetBreadcrumbs && 
        !rootState.breadcrumbs.widgetBreadcrumbs.some(b => b.id === 'archivedNotices')) {
        rootState.breadcrumbs.widgetBreadcrumbs.push({
          id: 'archivedNotices',
          title: '归档区',
          to: {
            name: 'archivedNotices',
            params: { category: notice.objectType, objectID: +notice.objectID }
          }
        })
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 解档公告
   * @param {*} param0
   * @param {*} ID
   */
  unarchiveNotice ({ commit, dispatch, rootState }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      Archived: 0,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }).then(res => {
      let notice = Notice.from(res.data)
      // 更新缓存列表
      commit('updateNotice', notice)
      // 归档数量-1
      commit('decreaseArchivedCount')
      rootState.breadcrumbs.widgetBreadcrumbs = rootState.breadcrumbs && _.filter(rootState.breadcrumbs.widgetBreadcrumbs, w => { return w.id !== 'archivedNotices' })
      return notice
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 删除归档公告
   * @param {*} param0
   * @param {*} ID
   */
  deleteArchiveItems ({ dispatch }, ID) {
    dispatch('deleteNotice', ID)
  },
  /**
   * 获取归档数量
   * @param {*} param0
   * @param {*} param1
   */
  loadArchivedCount ({ state, getters, commit }, { objectType, objectID }) {
    let queryCondition = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    queryCondition.push(...getters.queryOfType)
    queryCondition.push(...getters.queryOfSearch)
    return request.get(url.getCount, {
      query: JSON.stringify(queryCondition)
    }).then(res => {
      commit('loadArchivedCount', res.data)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return 0
    })
  },
  /**
   * 获取草稿数量
   * @param {*} param0
   * @param {*} param1
   */
  loadDraftCount ({ state, commit }, { objectType, objectID }) {
    if (!LocalStorage.getItem('myself')) return 0
    let queryCondition = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' },
      'and',
      { Key: 'IsPublish', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'CreateByID', Value: LocalStorage.getItem('myself').id, Oper: 'eq' }
    ]
    return request.get(url.getCount, {
      query: JSON.stringify(queryCondition)
    }).then(res => {
      commit('loadDraftCount', res.data)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`notice.error.${error.userMessage}`))
      return 0
    })
  },
  // 加载历史记录
  loadNoticeHistory ({ state, commit }, noticeID) {
    return request.get(url.getHistory, { id: noticeID })
      .then(res => {
        // return JSON.parse(res.data.History)
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          history.push(JSON.parse(list[i]))
        }
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *  复制公告
   * @param {*} payload
   */
  copyNotice ({ state, commit, dispatch }, payload) {
    return request.put(url.copy, payload)
      .then(res => {
        const model = Notice.from(res.data)
        commit('pushNotices', [model])
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 移动公告
   * @param {*} payload
   */
  moveNotice ({ state, commit, dispatch }, payload) {
    return request.put(url.move, payload)
      .then(res => {
        const model = Notice.from(res.data)
        commit('updateNotice', model)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
        return false
      })
  },

  /** ------------------------------获取已删除的公告------------------ */
  // 获取与我相关的已删除的公告
  loadNoticesInMyTrash ({ state, commit }) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.getDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Notice.from(res.data)
        commit('addNoticesInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除公告
  loadNoticesInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.getDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Notice.from(res.data)
        commit('addNoticesInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
