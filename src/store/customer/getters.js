import { LocalStorage } from 'quasar'
export default {
  customers: (state) => {
    return state.customers
  },
  selectCustomers: state => {
    return _.values(state.selectCustomers)
  },
  customersFiltered: (state, getters, rootState) => {
    let customers = state.customers
    const search = state.search
    if (search) {
      let psonIDs = _.some(rootState.person.selectPersons, item =>
        item.name.toLowerCase().includes(search.toLowerCase()))
        ? _.map(_.filter(rootState.person.selectPersons, item => item.name.toLowerCase().includes(search.toLowerCase())), 'id')
        : []
      customers = _.filter(state.customers, customer =>
        (customer.title && customer.title.toLowerCase().includes(search.toLowerCase())) ||
        (customer.leaderID && psonIDs.includes(customer.leaderID)) ||
        (customer.notes && customer.notes.toLowerCase().includes(search.toLowerCase())) ||
        (customer.province && customer.province.toLowerCase().includes(search.toLowerCase())) ||
        (customer.city && customer.city.toLowerCase().includes(search.toLowerCase())) ||
        (customer.address && customer.address.toLowerCase().includes(search.toLowerCase())) ||
        (customer.createTime && customer.createTime.toLowerCase().includes(search.toLowerCase()))
      )
    }
    // 多条件筛选
    let query = state.query
    if (query && query.length) {
      // 创建时间
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        customers = _.filter(customers, customer => customer.createTime > minFromCreateTime && customer.createTime <= maxToCreateTime)
      }
      // 客户等级
      let customerGradeList = _.map(_.filter(query, q => q.name === 'grade'), qf => qf.value)
      if (customerGradeList.length) {
        customers = _.filter(customers, customer => customerGradeList.includes(customer.grade))
      }
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), qf => qf.value)
      if (customerTypeList.length) {
        customers = _.filter(customers, customer => customerTypeList.includes(+customer.customerType))
      }
      // 行业
      let applyIndustryList = _.map(_.filter(query, q => q.name === 'applyIndustry'), qf => qf.value)
      if (applyIndustryList.length) {
        customers = _.filter(customers, customer => applyIndustryList.includes(+customer.applyIndustry))
      }
      // 来源
      let infoSourceList = _.map(_.filter(query, q => q.name === 'infoSource'), qf => qf.value)
      if (infoSourceList.length) {
        customers = _.filter(customers, customer => infoSourceList.includes(+customer.infoSource))
      }
    }
    return customers
  },
  customersSorted: (state, getters) => {
    return _.orderBy(getters.customersFiltered, [state.sort], ['desc'])
  },
  customer: (state) => (id) => {
    id = Number(id)
    let model = _.find(state.customers, c => { return c.id === +id })
    return model || {}
  },
  currentListPageParams: (state, getters) => {
    const _queryList = [{ Key: '1', Value: 1, Oper: 'eq' }]
    // 多条件检索
    let query = state.query
    if (query && query.length) {
      // 创建时间
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        _queryList.push(...['and', { Key: 'CreateTime', Value: minFromCreateTime, Oper: 'gt' }, 'and', { Key: 'CreateTime', Value: maxToCreateTime, Oper: 'le' }])
      }
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), qf => qf.value)
      if (customerTypeList.length) {
        _queryList.push(...['and', { Key: 'CustomerType', Value: _.join(customerTypeList), Oper: 'in' }])
      }
      // 客户等级
      let customerGradeList = _.map(_.filter(query, q => q.name === 'grade'), qf => qf.value)
      if (customerGradeList.length) {
        _queryList.push(...['and', { Key: 'Grade', Value: _.join(customerGradeList), Oper: 'in' }])
      }
      // 行业
      let applyIndustryList = _.map(_.filter(query, q => q.name === 'applyIndustry'), qf => qf.value)
      if (applyIndustryList.length) {
        _queryList.push(...['and', { Key: 'ApplyIndustry', Value: _.join(applyIndustryList), Oper: 'in' }])
      }
      // 来源
      let infoSourceList = _.map(_.filter(query, q => q.name === 'infoSource'), qf => qf.value)
      if (infoSourceList.length) {
        _queryList.push(...['and', { Key: 'InfoSource', Value: _.join(infoSourceList), Oper: 'in' }])
      }
    }
    const typePayload = [{
      key: 'allList',
      selectCondition: { query: _queryList, sort: state.sort, search: state.search }
    }]
    return _.find(typePayload, { key: state.listPageType })
  },
  // 获取所有列表数据
  getAllList: (_state, getters) => (currentRouteName) => {
    return getters.customersSorted
  },
  // 我的废纸篓
  CustomersInMyTrash: (state) => {
    const my = LocalStorage.getItem('myself') || {}
    let list = state.customersInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list.map(item => {
      item.resourceType = 'customer'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 资源废纸篓
  CustomersInTrash: (state) => (objectType, objectID) => {
    let list = state.customersInTrash.filter(item => item.objectType === objectType && item.objectId === +objectID)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  /**
   * 检索
   * @param {*} state
   */
  search: state => {
    return state.search
  },
  /**
   *多条件初始化
   * @param {*} state
   * @returns
   */
  queryList: state => {
    return state.queryList
  },
  /**
     * 多条件检索
     * @param {*} state
     */
  query: state => {
    return state.query
  }
}
