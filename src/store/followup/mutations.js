import Vue from 'vue'
export default {
  /**
   *添加跟进
   * @param {Object} state
   * @param {Object} payload
   */
  addFollowups (state, payload) {
    const newFollowups = _.differenceBy(payload, state.followups, 'id')
    state.followups.push(...newFollowups)
  },
  /**
   * 更新跟进
   * @param {*} state
   * @param {*} followup
   */
  updateFollowup (state, followup) {
    // 更新followups
    const indexOfItem = _.findIndex(state.followups, { id: followup.id })
    indexOfItem >= 0 ? Vue.set(state.followups, indexOfItem, followup) : state.followups.push(followup)
  },
  /**
   * 删除跟进
   * @param {*} state
   * @param {*} ID
   */
  deleteFollowup (state, id) {
    let index = state.followups.findIndex(item => item.id === id)
    Vue.delete(state.followups, index)
  },
  /**
   * 设置是否分页
   * @param {*} state
   * @param {*} value
   */
  setByPage (state, value) {
    state.byPage = value
  },
  /** 设置新建事件 */
  setAddingEvent (state, value) {
    state.addingEvent = value
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, page) {
    Object.assign(state.page, page)
  }
}
