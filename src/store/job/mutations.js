import Vue from 'vue'
export default {
  /**
   * 尾部追加列表
   * @param {*} state
   * @param {*} notices
   */
  pushJobs (state, jobs) {
    let newJobs = _.differenceBy(jobs, state.jobs, 'id')
    state.jobs.push(...newJobs)
  },
  /**
   * 更新列表
   * @param {*} state
   * @param {*} teams
   */
  setJobs (state, jobs) {
    state.jobs = jobs
  },
  /**
   * 设置列表样式
   * @param {*} state
   * @param {*} value
   */
  setListStyle (state, value) {
    state.listStyle = value
  },
  /**
   *设置岗位类别
   */
  setCategory (state, value) {
    state.category = value
  },
  /**
   * 更新岗位（一般用于列表页的更新）
   * @param {*} state
   * @param {*} job 公告Model
   */
  updateJob (state, job) {
    let index = state.jobs.findIndex(item => +item.id === +job.id)
    Vue.set(state.jobs, index, job)
  },
  /**
   * 删除岗位
   * @param {*} state
   * @param {*} ID
   */
  deleteJob (state, id) {
    let index = state.jobs.findIndex(item => item.id === id)
    Vue.delete(state.jobs, index)
  },
  /**
   * 设置草稿数量
   * @param {*} state
   * @param {*} value
   */
  loadDraftCount (state, value) {
    state.draftCount = value
  },
  /**
   * 设置归档数量
   * @param {*} state
   * @param {*} value
   */
  loadArchivedCount (state, value) {
    state.archiveCount = value
  },
  /**
   * 设置公告列表类型（草稿、发布、归档）
   * @param {*} state
   * @param {*} value
   */
  setListType (state, value) {
    if (value === 'job') {
      state.isArchivedList = false
      state.isDraftList = false
    }
    if (value === 'draftJobs') {
      state.isArchivedList = false
      state.isDraftList = true
    }
    if (value === 'archivedJobs') {
      state.isArchivedList = true
      state.isDraftList = false
    }
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
   * 设置检索关键词
   * @param {*} state
   * @param {*} value
   */
  setSearch (state, value) {
    state.search = value
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
