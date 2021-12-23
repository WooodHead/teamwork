import request from '@/boot/axios'
import Bookmark from './model'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
export default {
  /**
   * 加载收藏列表
   */
  loadBookmarks ({ state, commit }, {
    filter,
    query,
    search,
    fields = 'List',
    orderby
  } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby
    }
    return request.get('bookmarks/getlist', params)
      .then(res => {
        let bookmarks = Bookmark.from(res.data)
        commit('setListBookmarks', bookmarks)
        return bookmarks
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`bookmark.error.${error.userMessage}`))
        return []
      })
  },
  /**
   * 添加收藏
   * @param {*} param0
   */
  addBookmark ({ state, commit }, bookmark) {
    return request.post('bookmarks/add', Bookmark.to(bookmark))
      .then(res => {
        const model = Bookmark.from(res.data)
        commit('addBookmark', model)
        commit('addBookmarkTree', [model])
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`bookmark.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 删除收藏
   */
  deleteBookmark ({ state, commit }, query) {
    return request.delete('bookmarks/delete', { query: JSON.stringify(query) })
      .then((res) => {
        const model = Bookmark.from(res.data)
        commit('deleteBookmark', model.id)
        commit('deleteBookmarkTree', model.id)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`bookmark.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 判断某个元素是否已经收藏
   */
  existBookmark ({ state, commit }, query) {
    return request.get('bookmarks/exists', { query: JSON.stringify(query) })
      .then(res => {
        return res.data
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`bookmark.error.${error.userMessage}`))
        return false
      })
  }
}
