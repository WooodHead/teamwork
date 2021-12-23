import Vue from 'vue'

export default {
  /**
   * 添加商机
   * @param {*} state
   * @param {*} payload
   */
  addQuotations (state, payload) {
    const newOpportunitys = _.differenceBy(payload, state.quotations, 'id')
    state.quotations.push(...newOpportunitys)
  },
  /**
   *更新商机报价
   * @param {*} state
   * @param {*} payload
   */
  updateQuotation (state, payload) {
    const indexOfItem = _.findIndex(state.quotations, { id: payload.id })
    indexOfItem >= 0 && Vue.set(state.quotations, indexOfItem, payload)
    indexOfItem < 0 && state.quotations.push(...[payload])
  },
  /**
   * 删除商机
   *
   * @param {*} state
   * @param {*} id
   */
  deleteOpportunity (state, id) {
    Vue.delete(state.quotations, _.findIndex(state.quotations, { id }))
  },
  /**
   * 排序设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSort (state, payload) {
    state.sort = payload
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 是否分页
   * @param {*} state
   * @param {*} payload
   */
  setByPage (state, value) {
    state.byPage = value
  },
  initPage (state) {
    state.page = {
      ...state.page,
      ...{
        offset: 0,
        total: 0
      }
    }
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setLoadedAll (state, value) {
    state.loadedAll = value
  },
  emptyOpportunitys (state) {
    state.quotations = []
    state.loadedAll = false
  }
}
