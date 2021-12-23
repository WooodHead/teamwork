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
   * @param {*} recruitPlans
   */
  pushRecruitPlans (state, recruitPlans) {
    let newRecruitPlans = _.differenceBy(recruitPlans, state.recruitPlans, 'id')
    state.recruitPlans.push(...newRecruitPlans)
  },
  /**
   *更新面试官信息
   * @param {*} state
   * @param {*} recruitPlan
   */
  updateRecruitPlan (state, recruitPlan) {
    let index = state.recruitPlans.findIndex(item => +item.id === +recruitPlan.id)
    Vue.set(state.recruitPlans, index, recruitPlan)
  },
  /**
   *删除指定的招聘计划
   * @param {*} state
   * @param {*} id
   */
  deleteRecruitPlan (state, id) {
    let index = state.recruitPlans.findIndex(item => item.id === id)
    Vue.delete(state.recruitPlans, index)
  },
  /**
   * 设置归档数量
   * @param {*} state
   * @param {*} value
   */
  loadArchivedCount (state, value) {
    state.archiveCount = value
  },
  // 归档区搜索
  setSearch (state, value) {
    state.search = value
  },
  setPage (state, page) {
    Object.assign(state.page, page)
  },
  emptyRecruitPlans (state) {
    state.recruitPlans = []
    state.page = {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    }
  },
  updateRecruitPlans (state, recruitPlans) {
    state.recruitPlans = []
    state.recruitPlans = recruitPlans
  }
}
