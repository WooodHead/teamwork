export default {
  // 获取所有未删除点赞数据
  boosts: (state) => {
    return state.boosts.filter(b => !b.deleted)
  },
  // 获取单个点赞
  boost: (getters) => id => {
    return _.find(getters.boosts, b => { return b.id === id })
  },
  // 获取单个点赞面板
  boostPlate: (state) => (objectID, objectType) => {
    return _.find(state.boostsPlates, b => { return b.objectID === objectID && b.objectType === objectType })
  },
  // 获取资源收获的赞
  boostsOfObject: (state) => (objectID, objectType) => {
    let boosts = state.boosts.filter(b => b.objectID === objectID && b.objectType === objectType)
    return boosts
  },
  // 获取当前用户所有点赞面板
  boostsPlates: (state) => {
    return state.boostsPlates.filter(b => !b.deleted)
  }
}
