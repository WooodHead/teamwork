import Vue from 'vue'

export default {
  /**
   * 添加商机
   * @param {*} state
   * @param {*} payload
   */
  addOpportunitys (state, payload) {
    const newOpportunitys = _.differenceBy(payload, state.opportunitys, 'id')
    state.opportunitys.push(...newOpportunitys)
  },
  // 添加商机到废纸篓中
  addOpportunitysInTrash (state, opportunitysInTrash) {
    let list = _.unionBy(opportunitysInTrash, 'id')
    const ids = []
    _(list).each(function (opportunity) {
      ids.push(opportunity.id)
    })
    state.opportunitysInTrash = state.opportunitysInTrash.filter(item => !ids.includes(item.id))
    state.opportunitysInTrash.push(...list)
  },
  /**
   * 解除删除商机
   * @param {*} state
   * @param {*} id
   */
  undeleteOpportunityInTrash (state, id) {
    state.opportunitysInTrash = state.opportunitysInTrash.filter(a => a.id !== id)
  },
  /**
   *更新商机
   * @param {*} state
   * @param {*} payload
   */
  updateOpportunity (state, payload) {
    const indexOfItem = _.findIndex(state.opportunitys, { id: payload.id })
    indexOfItem >= 0 && Vue.set(state.opportunitys, indexOfItem, payload)
    indexOfItem < 0 && state.opportunitys.push(...[payload])

    const index = _.findIndex(_.values(state.selectOpportunitys), r => r.id === payload.id)
    index < 0 && _.values(state.selectOpportunitys).unshift(payload)
    state.selectOpportunitys[payload.id] = payload
  },
  /**
   * 删除商机
   *
   * @param {*} state
   * @param {*} id
   */
  deleteOpportunity (state, id) {
    Vue.delete(state.opportunitys, _.findIndex(state.opportunitys, { id }))
    Vue.delete(state.selectOpportunitys, id)
  },
  updateSelectOpportunitys (state, opportunity) {
    state.selectOpportunitys = { ...state.selectOpportunitys, ..._.keyBy(opportunity, 'id') }
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
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setQuery (state, payload) {
    state.query = payload
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
    state.opportunitys = []
    state.page = {
      offset: 0,
      limit: 10,
      nextPageToken: 0,
      total: 0
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
  /**
   * 下拉数据是否已加载
   *
   * @param {*} state
   * @param {*} payload
   */
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  emptyOpportunitys (state) {
    state.opportunitys = []
    state.loadedAll = false
  },
  /**
   * 归档的商机数量
   * @param {*} state
   * @param {*} count
   */
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  /**
   * 首页展示方式
   * @param {*} state
   * @param {*} value
   */
  setListStyle (state, value) {
    state.listStyle = value
  },
  /**
   * 当前数据页类别
   * @param {*} state
   * @param {*} payload
   */
  setListPageType (state, payload) {
    state.listPageType = payload
  }
}
