import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import Allocation from './model'
import Message from '../message/model'
import { LocalStorage } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  getList: 'orderallocations/getlist',
  getPagelist: 'orderallocations/getpagelist',
  getModel: 'orderallocations/getModel',
  getCount: 'orderallocations/getCount',
  Add: 'orderallocations/Add',
  Update: 'orderallocations/Update',
  UpdateFields: 'orderallocations/UpdateFields',
  Delete: 'orderallocations/Delete',
  Archive: `orderallocations/archive`,
  UnArchive: `orderallocations/unarchive`
}
export default {
  loadAllocation ({ state, commit }, id) {
    let allocation = _.find(state.allocations, o => o.id === +id)
    if (!allocation) {
      return request.get(url.getModel, { id: +id })
        .then((res) => {
          allocation = Allocation.from(res.data)
          commit('addAllocations', [allocation])
          return allocation
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
          return null
        })
    } else {
      return allocation
    }
  },
  loadAllocations ({ state, commit },
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
    let condition =
    {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: sort,
      search: search,
      fields: fields
    },
      reqUrl = url.getList
    if (byPage) {
      Object.assign(condition, { limit: limit, offset: offset })
      reqUrl = url.getPagelist
    }
    return request.get(reqUrl, condition)
      .then(res => {
        let allocations = res.data ? Allocation.from(res.data) : []
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('setPage', { offset: offset + allocations.length, nextPageToken })
        } else {
          commit('setPage', { nextPageToken: -1 })
        }
        commit('addAllocations', allocations)
        return allocations
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return true
      })
  },
  loadArchivedCount ({ state, commit }, params) {
    let _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    if (params && params.query) {
      _query = params.query
    }
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
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
  loadAllCount ({ state, commit }, params) {
    let _query = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }
    ]
    if (params && params.query) {
      _query = params.query
    }
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request.get(url.getCount, condition)
      .then((res) => {
        let count = res.data
        commit('setAllCount', count)
        return count
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return 0
      })
  },
  addAllocation ({ commit }, allocation) {
    allocation = Allocation.to(allocation)
    return request.post(url.Add, allocation)
      .then(res => {
        allocation = Allocation.from(res.data)
        commit('addAllocations', [allocation])
        return allocation
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  updateAllocation ({ commit }, allocation) {
    allocation = Allocation.to(allocation)
    return request.put(url.Update, allocation)
      .then(res => {
        allocation = Allocation.from(res.data)
        commit('updateAllocation', allocation)
        return allocation
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  updateAllocationField ({ commit }, fields) {
    let allocation = Allocation.to(fields)
    !_.has(fields, 'workpieceList') && delete allocation['WorkpieceList']
    !_.has(fields, 'expectedDeliveryDate') && delete allocation['ExpectedDeliveryDate']
    !_.has(fields, 'status') && delete allocation['Status']
    !_.has(fields, 'whiteList') && delete allocation['WhiteList']
    !_.has(fields, 'widgets') && delete allocation['Widgets']
    !_.has(fields, 'members') && delete allocation['Members']
    return request.put(url.UpdateFields, allocation)
      .then(res => {
        allocation = Allocation.from(res.data)
        commit('updateAllocation', allocation)
        return allocation
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return null
      })
  },
  deleteAllocation ({ state, commit }, id) {
    return request.delete(url.Delete, { id })
      .then(res => {
        let allocation = _.find(state.allocations, { id })
        commit('deleteAllocation', id)
        this.$router.push({
          name: 'allocation',
          params: { category: 'order', objectID: allocation.orderID }
        })
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`assess.error.${assess.userMessage}`))
        return false
      })
  },
  archiveAllocation ({ commit, dispatch }, id) {
    return request.get(url.Archive, { id })
      .then(res => {
        let allocation = Allocation.from(res.data)
        commit('updateAllocation', allocation)
        return dispatch('loadArchivedCount')
      }).catch((error) => {
        showWarningMessage(i18n.t(`assess.error.${error.userMessage}`))
        return {}
      })
  },
  unarchiveAllocation ({ commit }, id) {
    request.get(url.UnArchive, { id })
      .then(res => {
        const allocation = Allocation.from(res.data)
        commit('updateAllocation', allocation)
        return allocation
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return null
      })
  },
  /**
   *
   * @param {*} id  订单ID
   * @param {*} status  订单状态
   */
  updateStatus ({ dispatch, commit }, { id, status }) {
    return request.put(url.UpdateFields, {
      Id: id,
      Status: status
    })
      .then(res => {
        const allocation = Allocation.from(res.data)
        commit('updateAllocation', allocation)
        dispatch('sendMessage', { allocation, status })
        return allocation
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  async sendMessage ({ dispatch }, { allocation, status }) {
    // 获取当前用户信息
    const my = LocalStorage.getItem('myself') || {}
    // 定义消息标题
    let title = i18n.t(`allocation.messageTitle`, { status, name: my.name, title: allocation.title })
    let order = await dispatch('order/loadOrder', allocation.orderID, { root: true })
    let subscribe = await dispatch('subscribe/loadSubscribe', { objectID: allocation.id, objectType: 'allocation' }, { root: true })
    let receiveBy = _.uniq(_.concat(subscribe.subscribers, order ? [order.leaderID] : []))
    // 消息对应路由
    let route = {
      name: 'allocationDetail',
      params: { category: 'order', objectID: allocation.orderID, id: allocation.id },
      path: `/order/${allocation.orderID}/allocation/${allocation.id}(\\d+)`
    }
    // 组装消息对象
    let message = {
      type: 'allocation',
      title: title,
      module: {
        id: allocation.id,
        type: 'allocation',
        title: allocation.title
      },
      route,
      senderID: my.id,
      senderName: my.name,
      senderImg: my.img,
      receiveBy: receiveBy,
      extra: { Content: allocation.notes || `订单${order ? order.title : ''}的生产需求${allocation.title}` }
    }
    // 发送消息
    let model = Message.to(message)
    return request.post('messages/add', model)
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  }
}
