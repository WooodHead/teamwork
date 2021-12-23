import Vue from 'vue'
export default {
  /**
   * 设置列表样式
   * @param {*} state
   * @param {*} value
   */
  setListStyle (state, value) {
    state.listStyle = value
  },
  /**
   * 更新查询条件
   */
  updateSearch (state, value) {
    state.search = value
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
  /**
   * 追加面试官列表
   * @param {*} state
   * @param {*} interviewers
   */
  pushInterviewers (state, interviewers) {
    let newInterviewers = _.differenceBy(interviewers, state.interviewers, 'id')
    state.interviewers.push(...newInterviewers)
  },
  /**
   *更新面试官信息
   * @param {*} state
   * @param {*} interviewer
   */
  updateInterviewer (state, interviewer) {
    let index = state.interviewers.findIndex(item => +item.id === +interviewer.id)
    Vue.set(state.interviewers, index, interviewer)
  },
  /**
   *删除指定的面试官
   * @param {*} state
   * @param {*} id
   */
  deleteInterviewer (state, id) {
    let index = state.interviewers.findIndex(item => item.id === id)
    Vue.delete(state.interviewers, index)
  },

  /**
   *
   * @param {*} state
   * @param {*} psonId
   */
  byIdDeleteInterviewer (state, psonId) {
    state.interviewers = _.filter(state.interviewers, item => +item.psonId === +psonId)
  },
  setSearch (state, payload) {
    state.search = payload
  }
}
