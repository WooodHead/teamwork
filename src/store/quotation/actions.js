import request from '@/boot/axios'
import Quotation from './model'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  getList: '/opportunityquotations/getList',
  getModel: '/opportunityquotations/getModel',
  getCount: '/opportunityquotations/getCount',
  add: '/opportunityquotations/add',
  update: '/opportunityquotations/update',
  updateFields: '/opportunityquotations/updateFields',
  delete: '/opportunityquotations/delete'
}
export default {
  /**
   *获取当前商机对象
   *
   * @param {*} { state, commit }
   * @param {*} id 商机ID
   * @returns
   */
  loadQuotation ({ state, commit }, id) {
    let quotation = _.find(state.quotations, { 'id': id })
    if (quotation) {
      return quotation
    } else {
      return request.get(url.getModel, { id: id }).then(res => {
        if (res.data) {
          quotation = Quotation.from(res.data)
          commit('updateQuotation', quotation)
          return quotation
        } else {
          return null
        }
      })
    }
  },
  loadQuotationByOpportunityID ({ state, commit }, id) {
    let quotation = _.find(state.quotations, { 'id': id })
    if (quotation) {
      return quotation
    } else {
      return request.get('/opportunityquotations/getModelByOpportunity', { opportunityID: id }).then(res => {
        if (res.data) {
          quotation = Quotation.from(res.data)
          commit('updateQuotation', quotation)
          return quotation
        } else {
          return null
        }
      })
    }
  },
  /**
   *
   *获取商机报价所有信息
   *
   * @param {*} { state, commit }
     * @param {string} [query] 查询条件
     * @param {string} [filter] 模糊查询对象
     * @param {string} [sort] 排序
     * @param {string} [search] 搜索
     * @param {string} [fields] 查询字段
   * @returns
   */
  loadQuotations ({ commit, state }, { query, filter, byPage = state.byPage } = {}) {
    const page = state.page
    let condition = {
        query: JSON.stringify(query),
        filter: JSON.stringify(filter),
        sort: state.sort,
        search: state.search,
        fields: 'List'
      }, url = ''
    if (byPage) {
      Object.assign(condition, {
        limit: state.page.limit,
        offset: state.page.offset
      })
      url = '/quotations/getpagelist'
    } else {
      url = '/quotations/getlist'
    }
    return request.get(url, condition).then(res => {
      let quotations = Quotation.from(res.data)
      if (byPage) {
        const nextPageToken = res.nextPageToken
        commit('updatePage', { offset: Math.min(page.offset + page.limit), nextPageToken })
      }
      commit('addQuotations', quotations)
      return quotations
    })
  },
  /**
   *添加商机报价
   *
   * @param {*} { state, commit }
   * @param {*} quotation
   * @returns
   */
  addQuotation ({ commit }, quotation) {
    let model = Quotation.to(quotation)
    return request.post(url.add, model).then(res => {
      if (res.data) {
        let quotation = Quotation.from(res.data)
        commit('addQuotations', [quotation])
        return quotation
      } else {
        return null
      }
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`quotation.error.${error.userMessage}`))
      return false
    })
  },
  /**
  *编辑商机报价
  *
  * @param {*} { state, commit }
  * @param {*} customer
  * @returns
  */
  updateQuotation ({ commit }, quotation) {
    let model = Quotation.to(quotation)
    return request.put(url.update, model)
      .then(res => {
        let quotation = Quotation.from(res.data)
        commit('updateQuotation', quotation)
        return quotation
      })
  },
  /**
 *删除商机评估信息
 *
 * @param {*} { state, commit }
 * @param {*} id 客户ID
 * @returns
 */
  deleteQuotation ({ commit }, id) {
    request.delete(url.delete, { id: id })
      .then(res => {
        commit('deleteOpportunity', id)
        return res.data
      })
  },
  /**
  * 更新商机报价字段
  * @param {*} param0
  * @param {*} payload
  */
  updateQuotationField ({ commit }, payload) {
    return request.put(url.updateFields, payload)
      .then(res => {
        const model = Quotation.from(res.data)
        commit('updateQuotation', model)
        return model
      })
  }
}
