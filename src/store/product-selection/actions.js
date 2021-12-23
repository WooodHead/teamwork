import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import Selection from './model'
const url = {
  getModel: 'productSelections/getModel',
  getcount: 'productSelections/getcount',
  archive: 'productSelections/archive',
  unarchive: 'productSelections/unarchive',
  add: 'productSelections/add',
  update: 'productSelections/updatefields',
  delete: 'productSelections/delete'
}
export default {
  /**
   *
   * 获取我的配置单列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   */
  loadProductSelections ({ state, commit },
    {
      query,
      filter,
      sort,
      search = '',
      fields = 'List',
      limit = state.page.limit,
      offset = state.page.offset,
      byPage = state.byPage } = {}) {
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        sort: sort,
        fields: fields
      }
      url = 'productSelections/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'productSelections/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let selections = Selection.from(res.data)
        commit('setPage', { offset: page.offset + selections.length, nextPageToken: res.nextPageToken })
        commit('setSelections', selections)
        return selections
      })
  },
  // 加载当前数据
  loadProductSelection ({ state, commit }, id) {
    let selection = _.find(state.selections, { id })
    if (!selection) {
      return request.get(url.getModel, { id })
        .then(res => {
          selection = Selection.from(res.data)
          commit('setSelections', [selection])
          return selection
        })
    }
    return selection
  },
  addproductSelection ({ state, commit }, selection) {
    const endModel = Selection.to(selection)
    return request.post(url.add, endModel)
      .then(res => {
        // 前台
        const model = Selection.from(res.data)
        commit('addSelection', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`product.error.${error.userMessage}`))
        return null
      })
  },
  // 编辑我的配置单字段
  updateproductSelection ({ state, commit }, selection) {
    let endModel = Selection.to(selection)
    return request.put(url.update, endModel)
      .then(res => {
        // 更新前台数据
        if (res.data) {
          const model = Selection.from(res.data)
          commit('updateSelection', model)
          return model
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`product.error.${error.userMessage}`))
        return null
      })
  },
  // 通过id删除我的配置单
  deleteProductSelection ({ state, commit }, id) {
    return request.delete(url.delete, { id })
      .then((res) => {
        commit('deleteSelection', id)
        this.$router.push({ name: 'productSelection' })
      })
  },
  /**
  * 加载归档数量
  */
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    request.get(url.getcount, condition)
      .then((res) => {
        commit('setArchivedCount', res.data)
      })
  },
  /**
 * 归档我的配置单
 * @param {*} ID 我的配置单ID
 */
  archiveProductSelection ({ commit }, id) {
    return request.get(url.archive, { id })
      .then(res => {
        const model = Selection.from(res.data)
        commit('updateSelection', model)
      })
  },
  /**
   * 解档一个我的配置单
   * @param {*} ID 我的配置单ID
   */
  unarchiveProductSelection ({ commit }, id) {
    return request.get(url.unarchive, { id })
      .then(res => {
        const model = Selection.from(res.data)
        commit('updateSelection', model)
      })
  }
}
