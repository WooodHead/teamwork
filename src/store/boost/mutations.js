import Vue from 'vue'
export default {
  addBoosts (state, boosts) {
    const newBoosts = _.differenceBy(boosts, state.boosts, 'id')
    state.boosts.push(...newBoosts)
  },
  addBoostsPlates (state, boosts) {
    const newBoosts = _.differenceBy(boosts, state.boostsPlates, 'id')
    state.boostsPlates.push(...newBoosts)
  },
  deleteBoost (state, id) {
    let index = state.boosts.findIndex(item => item.id === id)
    Vue.delete(state.boosts, index)
  },
  updateBoostPlate (state, plate) {
    const index = state.boostsPlates.findIndex(p => p.id === plate.id)
    Vue.set(state.boostsPlates, index, plate)
  },
  deleteBoostPlate (state, id) {
    let index = state.boostsPlates.findIndex(item => item.id === id)
    Vue.delete(state.boostsPlates, index)
  },
  filterBoostPlate (state, { objectID, objectType }) {
    let boosts = state.boosts.filter(p => p.objectID === objectID && p.objectType === objectType)
    if (!boosts.length) {
      Vue.delete(state.boostsPlates, state.boostsPlates.findIndex(p => p.objectID === objectID && p.objectType === objectType))
    }
  },
  // 记录哪些资源的数据已经被加载
  setLoaded (state, loaded) {
    loaded && state.loaded.push(...loaded)
  }
}
