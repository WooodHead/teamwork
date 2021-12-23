import Vue from 'vue'
export default {
  setSearch (state, value) {
    state.search = value
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
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setProcessJson (state, value) {
    state.processJson = value
  },
  emptyProductSelections (state) {
    state.selections = []
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  /**
   *初始化我的配置单
   */
  initSelection (state, selection) {
    state.selections.push(..._.differenceBy([selection], state.selections, 'id'))
  },
  setSelections (state, selections) {
    const newSelections = _.differenceBy(selections, state.selections, 'id')
    state.selections.push(...newSelections)
  },
  addSelection (state, selection) {
    state.selections.push(selection)
  },
  /**
   *更新我的配置单字段
   */
  updateSelection (state, selection) {
    Object.assign(_.find(state.selections, { id: selection.id }), selection)
  },
  /**
     *通过id删除我的配置单
     *id我的配置单对应id
     */
  deleteSelection (state, id) {
    Vue.delete(state.selections, state.selections.findIndex(a => a.id === id))
  }
}
