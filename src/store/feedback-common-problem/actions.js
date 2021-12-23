import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import feedbackDocument from './model'
const url = {
  list: 'documents/getlist'
}
export default {
  /**
   * 加载常见问题文档
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   */
  loadFeedbackDocuments ({ state, commit }, {
    query,
    filter,
    sort = '',
    search,
    fields = 'List' } = {}) {
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort,
      search,
      fields
    }
    let feedbackDocuments = []
    return request.get(url.list, condition)
      .then(res => {
        feedbackDocuments = feedbackDocument.from(res.data)
        commit('setFeedbackDocuments', feedbackDocuments)
        return feedbackDocuments
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  }
}
