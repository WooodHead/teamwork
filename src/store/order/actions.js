import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import Order from './model'
import Message from '../message/model'
import { showWarningMessage } from '@/utils/show-message'
export default {
  /**
   * 通过id获取订单信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadOrder ({ state, commit }, id) {
    let order = _.find(state.orders, o => o.id === +id)
    if (!order) {
      return request.get('orders/getModel', { id })
        .then((res) => {
          order = Order.from(res.data)
          commit('addOrders', [order])
          return order
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
          return null
        })
    } else {
      return order
    }
  },
  /**
   *获取所有的机构列表信息
   * @param {*} { commit }
   * @param {*} payload
   */
  loadOrders ({ state, commit },
    {
      query,
      filter,
      sort = state.sort,
      search = state.search,
      fields = 'List',
      limit = state.page.limit,
      offset = state.page.offset,
      byPage = state.byPage
    }) {
    // 后台参数拼接
    let params =
    {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    },
      url = 'orders/getlist'
    if (byPage) {
      Object.assign(params, {
        limit,
        offset,
        sort
      })
      url = 'orders/getpagelist'
    }
    return request.get(url, params)
      .then(res => {
        let orders = Order.from(res.data)
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('setPage', { offset: offset + orders.length, nextPageToken })
        }
        commit('addOrders', orders)
        return orders
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return []
      })
  },
  /**
   * 获取供选择的订单
   * @param {*} param0
   */
  loadSelectOrders ({ state, commit }) {
    if (_.isEmpty(state.selectOrders) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request.get('orders/getlist', { fields: 'Select' }).then(res => {
        const orders = Order.from(res.data)
        commit('addSelectOrders', orders)
        return orders
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return false
      })
    } else {
      return _.values(state.selectOrders)
    }
  },
  /**
   * 添加订单
   * @param {*} param0
   * @param {Object} order
   */
  addOrder ({ commit }, order) {
    order = Order.to(order)
    return request.post('orders/add', order)
      .then(res => {
        order = Order.from(res.data)
        commit('addOrders', [order])
        return order
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 编辑订单
   * @param {Object} param0 --
   * @param {Object} order
   */
  updateOrder ({ commit }, order) {
    order = Order.to(order)
    return request.put('orders/update', order)
      .then(res => {
        order = Order.from(res.data)
        commit('updateOrder', order)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
   *  更新订单字段
   * @param {*} param0
   * @param {*} param1
   */
  updateOrderField ({ commit }, fields) {
    let order = Order.to(fields)
    !_.has(fields, 'classification') && delete order['Classification']
    !_.has(fields, 'status') && delete order['Status']
    !_.has(fields, 'expectedDeliveryDate') && delete order['ExpectedDeliveryDate']
    !_.has(fields, 'history') && delete order['History']
    !_.has(fields, 'acl') && delete order['Acl']
    !_.has(fields, 'whiteList') && delete order['WhiteList']
    !_.has(fields, 'members') && delete order['Members']
    !_.has(fields, 'widgets') && delete order['Widgets']
    return request.put('orders/updatefields', order)
      .then(res => {
        order = Order.from(res.data)
        commit('updateOrder', order)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 删除一个订单
   * @param {Object} param0 --
   * @param {Number} id
   */
  deleteOrder ({ commit }, { id, notes = '' }) {
    return request.delete('orders/delete', { id, notes })
      .then(res => {
        commit('deleteOrder', id)
        const route = this.$router.currentRoute
        if (route.name === 'orderDetail') {
          this.$router.push({ name: 'orderHome' })
        }
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 恢复订单
   *
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  undeleteOrder ({ state, commit }, id) {
    // order = Order.to(order)
    return request.get('orders/undelete', { id })
      .then(res => {
        const order = Order.from(res.data)
        commit('updateOrder', order)
        commit('undeleteOrderInTrash', id)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
  * 加载归档数量
  */
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    if (state.listPageType === 'myList') {
      _query.push(
        ...['and',
          {
            Key: 'Members',
            Value: LocalStorage.getItem('myself').id,
            Oper: 'inset'
          }
        ]
      )
    }
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request.get('orders/getcount', condition)
      .then((res) => {
        let count = res.data
        commit('setArchivedCount', count)
        return count
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return 0
      })
  },
  /**
* 归档订单
* @param {*} ID 订单ID
*/
  archiveOrder ({ commit }, id) {
    return request.get(`orders/archive`, { id })
      .then(res => {
        const order = Order.from(res.data)
        commit('updateOrder', order)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
 * 解档一个订单
 * @param {*} ID 订单ID
 */
  unarchiveOrder ({ commit }, id) {
    request.get(`orders/unarchive`, { id })
      .then(res => {
        const order = Order.from(res.data)
        commit('updateOrder', order)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 更新订单成员
   * @param {*} id 订单ID
   * @param {*} newMemberIds： 目前订单成员的IDs的集合
   * @param {*} oldMemberIds： 原订单成员的IDs的集合
   * @param {*} identify 人员职责 //member、leader、visitor
   */
  updateOrderMembers ({ commit }, { id, newMemberIds, oldMemberIds, identify }) {
    return request
      .put('orders/updatemember', {
        id,
        newMemberIds: _.join(newMemberIds),
        oldMemberIds: _.join(oldMemberIds),
        identify: identify
      })
      .then(res => {
        const order = Order.from(res.data)
        commit('updateOrder', order)
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
   *
   * @param {*} id  订单ID
   * @param {*} status  订单状态
   */
  updateStatus ({ state, dispatch, commit }, { id, status }) {
    return request.put('orders/updatefields', {
      Id: id,
      Status: status
    })
      .then(res => {
        const order = Order.from(res.data)
        commit('updateOrder', order)
        dispatch('sendMessage', { order, status: state.status[status].title })
        return order
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return {}
      })
  },
  async sendMessage ({ state, dispatch }, { order, status }) {
    // 获取当前用户信息
    const my = LocalStorage.getItem('myself') || {}
    // 定义消息标题
    let title = i18n.t(`order.messageTitle`, { status, name: my.name, title: order.title })
    // 消息对应路由
    let route = {
      name: 'orderDetail',
      params: { id: order.id },
      path: `/order/${order.id}(\\d+)`
    }
    // 组装消息对象
    let message = {
      type: 'order',
      title: title,
      module: {
        id: order.id,
        type: 'order',
        title: order.title
      },
      route,
      senderID: my.id,
      senderName: my.name,
      senderImg: my.img,
      receiveBy: order.members,
      extra: { Content: order.notes || `客户${order.customerName}的订单` }
    }
    // 发送消息
    let model = Message.to(message)
    return request.post('messages/add', model)
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return false
      })
  },

  /** ------------------------------获取已删除的订单------------------ */
  // 获取与我相关的已删除的订单
  loadOrdersInMyTrash ({ state, commit }) {
    const my = LocalStorage.getItem('myself') || {}
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'Members', Value: my.id, Oper: 'inset' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get('orders/GetDeletedList', { query: JSON.stringify(query) })
      .then(res => {
        let orders = Order.from(res.data)
        commit('addOrdersInTrash', orders)
        return orders
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return []
      })
  },
  processDataOfExportExcel ({ state, rootState }, { list }) {
    let data = []
    const modellist = _.cloneDeep(list)
    modellist.forEach(item => {
      let name = item
      name.LeaderID = item.LeaderID ? rootState.person.selectPersons[item.LeaderID].name : ''
      name.Status = item.Status ? state.status[item.Status].title : ''
      data.push(name)
    })
    return data
  }
}
