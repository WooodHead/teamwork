export default {
  // 获取一条收藏
  bookmark: (state) => id => {
    return _.find(state.bookmarks, p => { return p.id === id })
  },
  // 获取所有收藏
  bookmarks: (state, getters) => {
    let bookmarksGroupBy = _.groupBy(state.bookmarks, item => {
      return item.module.id + item.module.type
    })
    return bookmarksGroupBy
  },
  // 获取收藏树
  bookmarkTree: (state, getters) => (type, id) => {
    let bookmarkTree = _.filter(state.bookmarkTree, item => {
      return item.module.type === type && item.module.id === +id
    })
    return bookmarkTree
  }
}
