import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import OpportunityAssess from './model'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  getList: '/opportunityassess/getlist',
  getPagelist: '/opportunityassess/getpagelist',
  getModel: '/opportunityassess/getModel',
  getCount: '/opportunityassess/getCount',
  add: '/opportunityassess/Add',
  update: '/opportunityassess/update',
  updateFields: '/opportunityassess/updateFields',
  updateResult: '/opportunityassess/updateResult',
  delete: '/opportunityassess/delete'
}
export default {
  /**
   * 通过id获取评估信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadAssess ({ state, commit }, id) {
    let assess = _.find(state.allAssess, o => o.id === +id)
    if (!assess) {
      return request.get('opportunityassess/getmodel', { id: +id })
        .then((res) => {
          assess = OpportunityAssess.from(res.data)
          commit('updateAssess', assess)
          return assess
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
          return null
        })
    } else {
      return assess
    }
  },
  /**
   *刷新评估
   *
   * @param {*} { state, commit }
   * @param {*} id 评估ID
   * @returns
   */
  refreshAssess ({ state, commit }, id) {
    return request.get('opportunityassess/getmodel', { id: +id })
      .then((res) => {
        let assess = OpportunityAssess.from(res.data)
        commit('updateAssess', assess)
        return assess
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  loadAssessByOpportunityID ({ state, commit }, id) {
    let quotation = _.find(state.quotations, { 'id': id })
    if (quotation) {
      return quotation
    } else {
      return request.get('/opportunityassess/getModelByOpportunity', { opportunityID: id }).then(res => {
        if (res.data) {
          let assess = OpportunityAssess.from(res.data)
          commit('updateAssess', assess)
          return assess
        } else {
          return null
        }
      })
    }
  },
  /**
   *获取所有的评估列表信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadAllAssess ({ state, commit },
    {
      query,
      filter,
      sort,
      search,
      fields = 'List',
      limit = state.page.limit,
      offset = state.page.offset,
      byPage = state.byPage
    }) {
    let params = {}, url = ''
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
      url = '/opportunityassess/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = '/opportunityassess/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let assessList = OpportunityAssess.from(res.data)
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('setPage', { offset: offset + assessList.length, nextPageToken })
        } else {
          commit('setPage', { nextPageToken: -1 })
        }
        commit('addAssess', assessList)
        return !byPage || res.nextPageToken === -1
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return true
      })
  },
  /**
   * 加载归档数量
   * @param {*} param0
   */
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: state.s_category === 'opportunity' ? 'OpportunityID' : 'ManufacturerID', Value: +state.s_objectID, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    request.get(url.getCount, condition)
      .then((res) => {
        let count = res.data
        commit('setArchivedCount', count)
        return count
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return 0
      })
  },
  /**
   * 添加评估
   * @param {*} param0
   * @param {Object} assess
   */
  addAssess ({ commit }, assess) {
    assess = OpportunityAssess.to(assess)
    return request.post(url.add, assess)
      .then(res => {
        assess = OpportunityAssess.from(res.data)
        commit('addAssess', [assess])
        return assess
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 编辑评估
   * @param {Object} param0
   * @param {Object} assess
   */
  updateAssess ({ state, commit }, assess) {
    assess = OpportunityAssess.to(assess)
    return request.put(url.update, assess)
      .then(res => {
        assess = OpportunityAssess.from(res.data)
        commit('updateAssess', assess)
        return assess
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 更新评估结果
   * @param {*} id  商机ID
   * @param {*} active  动作
   * @param {*} status  商机结果
   */
  updateResult ({ commit }, { id, result, notes }) {
    return request.put(url.updateResult, { id, result, notes })
      .then(res => {
        let assess = OpportunityAssess.from(res.data)
        commit('updateAssess', assess)
        return assess
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   *  更新评估字段
   * @param {*} param0
   * @param {*} param1
   */
  updateAssessField ({ state, commit }, fields) {
    let assess = OpportunityAssess.to(fields)
    return request.put(url.updateFields, assess)
      .then(res => {
        assess = OpportunityAssess.from(res.data)
        commit('updateAssess', assess)
        return assess
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 重置商机评估列表
   * @param {*} param0
   */
  resetAssess ({ commit, state }) {
    commit('updatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /**
   * 删除一个评估
   * @param {Object} param0 --
   * @param {Number} id
   */
  deleteAssess ({ state, commit }, id) {
    return request.delete(url.delete, { id })
      .then(res => {
        let assess = _.find(state.allAssess, { id: id })
        commit('deleteAssess', id)
        // 跳转至列表页面
        this.$router.push({
          name: 'assess',
          params: { category: 'opportunity', objectID: assess.opportunityID }
        })
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`assess.error.${assess.userMessage}`))
        return false
      })
  },
  /**
   * 归档一个评估
   * @param {*} param0
   * @param {*} id
   */
  archiveAssess ({ commit, dispatch }, id) {
    return request.get(`opportunityassess/archive`, { id })
      .then(res => {
        let assess = OpportunityAssess.from(res.data)
        // 更新缓存列表
        commit('updateAssess', assess)
        // 更新归档数量
        dispatch('loadArchivedCount')
      }).catch((error) => {
        showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return {}
      })
  },
  /**
  * 解档一个评估
  * @param {*} id 评估id
  */
  unarchiveAssess ({ commit }, id) {
    request.get(`opportunityassess/unarchive`, { id })
      .then(res => {
        const assess = OpportunityAssess.from(res.data)
        commit('updateAssess', assess)
        return assess
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return null
      })
  }
}
