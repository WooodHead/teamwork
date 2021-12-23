import Vue from 'vue'
export default {
  /**
   * 将订单数据添加到前端orders中
   * @param {Object} state 上下文Model
   * @param {Object} payload 订单列表
   */
  addOrders (state, payload) {
    const newOrders = _.differenceBy(payload, state.orders, 'id')
    state.orders.push(...newOrders)
  },
  /**
   * 添加废纸篓订单数据
   *
   * @param {*} state
   * @param {*} payload
   */
  addOrdersInTrash (state, payload) {
    const newOrders = _.differenceBy(payload, state.ordersInTrash, 'id')
    state.ordersInTrash.push(...newOrders)
  },
  /**
   * 请求的下拉数据
   *
   * @param {*} state
   * @param {*} orders
   */
  addSelectOrders (state, orders) {
    state.selectOrders = { ...state.selectOrders, ..._.keyBy(orders, 'id') }
  },
  /**
   * 下拉数据是否已加载
   *
   * @param {*} state
   * @param {*} payload
   */
  setLoadedSelect (state, payload) {
    state.loadedSelect = payload
  },
  /**
   * 更新订单
   * @param {*} state
   * @param {*} order
   */
  updateOrder (state, order) {
    // 更新orders
    const indexOfItem = _.findIndex(state.orders, { id: order.id })
    indexOfItem >= 0 ? Vue.set(state.orders, indexOfItem, order) : state.orders.push(order)
    // 更新selectOrders
    state.selectOrders[order.id] = order
  },
  /**
   * 删除订单
   *
   * @param {*} state
   * @param {*} id
   */
  deleteOrder (state, id) {
    Vue.delete(state.orders, _.findIndex(state.orders, { id }))
    Vue.delete(state.selectOrders, id)
  },
  /**
   * 排序设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSort (state, payload) {
    state.sort = payload
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setQuery (state, payload) {
    state.query = payload
  },
  /**
   * 是否分页
   * @param {*} state
   * @param {*} payload
   */
  setByPage (state, payload) {
    state.byPage = payload
  },
  /**
   * 分页对象
   * @param {*} state
   * @param {*} payload
   */
  setPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.page, payload)
  },
  /**
   * 首页展示方式
   * @param {*} state
   * @param {*} value
   */
  setListStyle (state, payload) {
    state.listStyle = payload
  },
  /**
   * 当前数据页类别
   * @param {*} state
   * @param {*} payload
   */
  setListPageType (state, payload) {
    state.listPageType = payload
  },
  /**
   * 归档的订单数量
   * @param {*} state
   * @param {*} count
   */
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  undeleteOrderInTrash (state, id) {
    state.ordersInTrash = state.ordersInTrash.filter(a => a.id !== id)
  }
}
