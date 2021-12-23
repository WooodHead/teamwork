import Vue from 'vue'

export default {
  updateManufacturers (state, manufacturers) {
    const newManufacturers = _.differenceBy(manufacturers, state.manufacturers, 'id')
    state.manufacturers.push(...newManufacturers)
  },
  updateSelectManufacturers (state, manufacturers) {
    state.selectManufacturers = { ...state.selectManufacturers, ..._.keyBy(manufacturers, 'id') }
  },
  setSort (state, value) {
    state.sort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setPage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
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
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  emptyManufacturers (state) {
    state.manufacturers = []
    state.loadedAll = false
  },
  updateManufacturer (state, payload) {
    const indexOfItem = _.findIndex(state.manufacturers, { id: payload.id })
    indexOfItem >= 0 && Vue.set(state.manufacturers, indexOfItem, payload)
  },
  deleteManufacturer (state, id) {
    Vue.delete(state.manufacturers, _.findIndex(state.manufacturers, { id }))
  },
  setListStyle (state, value) {
    state.listStyle = value
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
  }
}
