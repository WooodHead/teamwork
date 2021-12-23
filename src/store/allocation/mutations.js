import Vue from 'vue'
export default {

  addAllocations (state, allocations) {
    const newAllocations = _.differenceBy(allocations, state.allocations, 'id')
    state.allocations.push(...newAllocations)
  },
  updateAllocation (state, allocation) {
    let index = state.allocations.findIndex(item => item.id === allocation.id)
    Vue.set(state.allocations, index, allocation)
  },
  deleteAllocation (state, id) {
    Vue.delete(state.allocations, _.findIndex(state.allocations, { id }))
    Vue.delete(state.selectAllocations, id)
  },
  setLoadedSelect (state, payload) {
    state.loadedSelect = payload
  },
  setSort (state, payload) {
    state.sort = payload
  },
  setSearch (state, payload) {
    state.search = payload
  },
  setByPage (state, payload) {
    state.byPage = payload
  },
  setPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.page, payload)
  },
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  setAllCount (state, count) {
    state.allCount = count
  }
}
