import Vue from 'vue'
export default {
  updateCustomers (state, customers) {
    const newCustomers = _.differenceBy(customers, state.customers, 'id')
    state.customers.push(...newCustomers)
  },
  updateSelectCustomers (state, customers) {
    state.selectCustomers = { ...state.selectCustomers, ..._.keyBy(customers, 'id') }
  },
  // 添加客户到废纸篓中
  addCustomersInTrash (state, customersInTrash) {
    let list = _.unionBy(customersInTrash, 'id')
    const ids = []
    _(list).each(function (customer) {
      ids.push(customer.id)
    })
    state.customersInTrash = state.customersInTrash.filter(item => !ids.includes(item.id))
    state.customersInTrash.push(...list)
  },
  /**
   * 解除删除客户
   * @param {*} state
   * @param {*} id
   */
  undeleteCustomerInTrash (state, id) {
    state.customersInTrash = state.customersInTrash.filter(a => a.id !== id)
  },
  setSearch (state, value) {
    state.search = value
  },
  setSort (state, value) {
    state.sort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  initPage (state) {
    state.page = {
      ...state.page,
      ...{
        offset: 0,
        total: 0
      }
    }
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setLoadedAll (state, value) {
    state.loadedAll = value
  },
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  emptyCustomers (state) {
    state.customers = []
    state.loadedAll = false
  },
  editCustomer (state, payload) {
    const indexOfItem = _.findIndex(state.customers, { id: payload.id })
    indexOfItem >= 0 && Vue.set(state.customers, indexOfItem, payload)
  },
  deleteCustomer (state, id) {
    Vue.delete(state.customers, _.findIndex(state.customers, { id }))
    Vue.delete(state.selectCustomers, id)
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  /**
     * 检索设定
     *
     * @param {*} state
     * @param {*} payload
     */
  setQuery (state, payload) {
    state.query = payload
  }
}
