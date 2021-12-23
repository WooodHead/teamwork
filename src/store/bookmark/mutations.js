import Vue from 'vue'
export default {
  setListBookmarks (state, model) {
    state.bookmarks = model
  },
  addBookmarkTree (state, bookmarks) {
    const newBookmarks = _.differenceBy(bookmarks, state.bookmarkTree, 'id')
    state.bookmarkTree.push(...newBookmarks)
  },
  deleteBookmarkTree (state, id) {
    Vue.delete(state.bookmarkTree, _.findIndex(state.bookmarkTree, { id }))
  },
  addBookmark (state, model) {
    state.bookmarks.push(model)
  },
  deleteBookmark (state, id) {
    Vue.delete(state.bookmarks, _.findIndex(state.bookmarks, { id }))
  }
}
