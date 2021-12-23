import Vue from 'vue'
// 系统公告
export default {
  /**
   * 即时通讯消息服务器推送的消息
   * @param {*} param0
   * @param {Object} data 推送的消息对象
   */
  addNotice (state, notice) {
    let index = state.notices.findIndex(item => item.id === notice.id)
    if (index === -1) {
      state.notices.push(notice)
    } else {
      Vue.set(state.notices, index, notice)
    }
  },
  /**
   * 更新列表
   * @param {*} state
   * @param {*} teams
   */
  setNotices (state, notices) {
    state.notices = notices
  },
  /**
   * 尾部追加列表
   * @param {*} state
   * @param {*} notices
   */
  pushNotices (state, notices) {
    let newNotices = _.differenceBy(notices, state.notices, 'id')
    state.notices.push(...newNotices)
  },
  /**
   * 更新公告（一般用于列表页的更新）
   * @param {*} state
   * @param {*} notice 公告Model
   */
  updateNotice (state, notice) {
    let index = state.notices.findIndex(item => item.id === notice.id)
    Vue.set(state.notices, index, notice)
  },
  /**
   * 删除公告
   * @param {*} state
   * @param {*} ID 类别ID
   */
  deleteNotice (state, id) {
    let index = state.notices.findIndex(item => item.id === id)
    Vue.delete(state.notices, index)
  },
  /**
   * 设置草稿数量
   * @param {*} state
   * @param {*} value
   */
  loadDraftCount (state, value) {
    state.draftCount = value
  },
  increaseDraftCount (state) {
    state.draftCount += state.draftCount
  },
  decreaseDraftCount (state, value) {
    state.draftCount -= state.draftCount
  },
  /**
   * 设置归档数量
   * @param {*} state
   * @param {*} value
   */
  loadArchivedCount (state, value) {
    state.archiveCount = value
  },
  increaseArchivedCount (state) {
    state.archiveCount += state.archiveCount
  },
  decreaseArchivedCount (state, value) {
    state.archiveCount -= state.archiveCount
  },
  /**
   * 设置检索关键词
   * @param {*} state
   * @param {*} value
   */
  setSearch (state, value) {
    state.search = value
  },
  /**
   * 设置类别关键词
   * @param {*} state
   * @param {*} value
   */
  setType (state, value) {
    state.type = value
  },
  /**
   * 设置是否分页
   * @param {*} state
   * @param {*} value
   */
  setByPage (state, value) {
    state.byPage = value
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  /** ------------------废纸篓相关---------------------- */
  /**
   * 废纸篓中的公告
   * @param {*} state
   * @param {*} notices
   */
  addNoticesInTrash (state, notices) {
    let list = _.unionBy(notices, 'id')
    const ids = []
    _(list).each(function (notice) {
      ids.push(notice.id)
    })
    state.noticesInTrash = state.noticesInTrash.filter(a => !ids.includes(a.id))
    state.noticesInTrash.push(...list)
  },
  /**
   * 解删除公告
   * @param {*} state
   * @param {*} ID 类别ID
   */
  undeleteNoticeInTrash (state, id) {
    state.noticesInTrash = state.noticesInTrash.filter(a => a.id !== id)
  }

}
