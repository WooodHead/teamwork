import { LocalStorage } from 'quasar'
import { i18n } from '@/boot/i18n'
import { searchToPersonIds, searchToOrganizeIds } from '@/utils/search-convert-helper'
export default {
  /**
   * 获取对象
   * @param {*} _state
   * @param {*} getters
   */
  order: (_state, getters) => (id) => {
    return _.find(getters.ordersFiltered, { id }) || {}
  },
  /**
   * 获取集合
   * @param {*} _state
   * @param {*} getters
   */
  orders: (_state, getters) => {
    return getters.ordersFiltered
  },
  /**
   * 排序
   * @param {*} state
   */
  sort: state => {
    return state.sort
  },
  /**
   * 获取排序列表
   * @param {*} state
   */
  sortOptions: state => {
    return state.sortOptions
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
  },
  /**
   * 检索
   * @param {*} state
   */
  search: state => {
    return state.search
  },
  /**
   * 筛选
   */
  ordersFiltered: (state, _getters, _rootState, rootGetters) => {
    let orders = []
    let search = state.search
    // 普通字段的检索
    if (search) {
      let statusId = _.find(_.values(state.status), item =>
        item.title.toLowerCase().includes(search.toLowerCase()))
        ? _.find(_.values(state.status), item => item.title.toLowerCase().includes(search.toLowerCase())).id
        : null
      let personIds = searchToPersonIds(rootGetters, search)
      let organizesIds = searchToOrganizeIds(rootGetters, search)
      orders = _.filter(state.orders, order =>
        (order.title && order.title.toLowerCase().includes(search.toLowerCase())) ||
          (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) ||
          (order.expectedDeliveryDate && order.expectedDeliveryDate.toLowerCase().includes(search.toLowerCase())) ||
          (order.opportunityName && order.opportunityName.toLowerCase().includes(search.toLowerCase())) ||
          (order.status && (order.status + '').includes(statusId)) ||
          (order.leaderID && personIds.includes(order.leaderID.toString())) ||
          (order.organizeID && organizesIds.includes(order.organizeID.toString()))
      )
    } else {
      orders = state.orders
    }
    // 多条件筛选
    let query = state.query
    if (query && query.length) {
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), 'value')
      if (customerTypeList.length) {
        orders = _.filter(orders, order => customerTypeList.includes(order.customerType))
      }
      // 订单状态
      let statusList = _.map(_.filter(query, q => q.name === 'status'), 'value')
      if (statusList.length) {
        orders = _.filter(orders, order => statusList.includes(+order.status))
      }
      // 创建时间
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        orders = _.filter(orders, order => order.createTime > minFromCreateTime && order.createTime <= maxToCreateTime)
      }
      // 预计交期
      let fromExpectedDeliveryDateList = _.map(_.filter(query, q => q.name === 'expectedDeliveryDate'), qf => qf.value.from)
      let toExpectedDeliveryDateList = _.map(_.filter(query, q => q.name === 'expectedDeliveryDate'), qf => qf.value.to)
      if (fromExpectedDeliveryDateList.length && toExpectedDeliveryDateList.length) {
        let fromExpectedDeliveryDate = _.min(fromExpectedDeliveryDateList)
        let toExpectedDeliveryDate = _.max(toExpectedDeliveryDateList)
        if (fromExpectedDeliveryDate.length === 10) fromExpectedDeliveryDate = fromExpectedDeliveryDate + ' 00:00:00'
        if (toExpectedDeliveryDate.length === 10) toExpectedDeliveryDate = toExpectedDeliveryDate + ' 23:59:59'
        orders = _.filter(orders, order => order.expectedDeliveryDate > fromExpectedDeliveryDate && order.expectedDeliveryDate <= toExpectedDeliveryDate)
      }
    }
    return orders
  },
  /**
   *首页展示样式
   */
  listStyle: state => {
    return state.listStyle
  },
  /**
   *归档的订单数
   */
  archivedCount: state => {
    return state.archivedCount
  },
  /**
   * 获取state定义的status的状态对象
   * @param {*} state
   * @returns
   * */
  status: (state) => step => {
    return state.status[step]
  },
  /**
   * 获取步进器状态列表
   * @param {*} state
   * @returns
  */
  statusFlow: (state) => ({ arrStatusFlow = [100, 200, 600], currStatus = 10 }) => {
    return _.map(arrStatusFlow, item => state.status[item])
  },
  /**
   * 组装query
   */
  listPageType: (state, _getters, _rootState, rootGetters) => {
    const _allListQuery = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }]
    const _myListQuery = [
      { Key: 'JSON_UNQUOTE(Members ->\'$.all\')', Value: LocalStorage.getItem('myself').id, Oper: 'search' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' }]

    // 多条件检索
    let query = state.query
    if (query && query.length) {
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), 'value')
      if (customerTypeList.length) {
        _allListQuery.push(...['and', { Key: 'CustomerType', Value: _.join(customerTypeList), Oper: 'in' }])
        _myListQuery.push(...['and', { Key: 'CustomerType', Value: _.join(customerTypeList), Oper: 'in' }])
      }
      // 订单状态
      let statusList = _.map(_.filter(query, q => q.name === 'status'), 'value')
      if (statusList.length) {
        _allListQuery.push(...['and', { Key: 'Status', Value: _.join(statusList), Oper: 'in' }])
        _myListQuery.push(...['and', { Key: 'Status', Value: _.join(statusList), Oper: 'in' }])
      }
      // 创建时间
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        _allListQuery.push(...['and', { Key: 'CreateTime', Value: minFromCreateTime, Oper: 'gt' }, 'and', { Key: 'CreateTime', Value: maxToCreateTime, Oper: 'le' }])
        _myListQuery.push(...['and', { Key: 'CreateTime', Value: minFromCreateTime, Oper: 'gt' }, 'and', { Key: 'CreateTime', Value: maxToCreateTime, Oper: 'le' }])
      }
      // 预计交期
      let fromExpectedDeliveryDateList = _.map(_.filter(query, q => q.name === 'expectedDeliveryDate'), qf => qf.value.from)
      let toExpectedDeliveryDateList = _.map(_.filter(query, q => q.name === 'expectedDeliveryDate'), qf => qf.value.to)
      if (fromExpectedDeliveryDateList.length && toExpectedDeliveryDateList.length) {
        let fromExpectedDeliveryDate = _.min(fromExpectedDeliveryDateList)
        let toExpectedDeliveryDate = _.max(toExpectedDeliveryDateList)
        if (fromExpectedDeliveryDate.length === 10) fromExpectedDeliveryDate = fromExpectedDeliveryDate + ' 00:00:00'
        if (toExpectedDeliveryDate.length === 10) toExpectedDeliveryDate = toExpectedDeliveryDate + ' 23:59:59'
        _allListQuery.push(...['and', { Key: 'ExpectedDeliveryDate', Value: fromExpectedDeliveryDate, Oper: 'gt' }, 'and', { Key: 'ExpectedDeliveryDate', Value: toExpectedDeliveryDate, Oper: 'le' }])
        _myListQuery.push(...['and', { Key: 'ExpectedDeliveryDate', Value: fromExpectedDeliveryDate, Oper: 'gt' }, 'and', { Key: 'ExpectedDeliveryDate', Value: toExpectedDeliveryDate, Oper: 'le' }])
      }
    }
    // 检索条件拼接
    let search = _.cloneDeep(state.search)
    if (search) {
      let searchQuery = []
      // 拼人员条件
      let okPersonsIds = searchToPersonIds(rootGetters, search)
      if (okPersonsIds) {
        searchQuery.push({ Key: 'LeaderID', Value: okPersonsIds, Oper: 'in' })
      }
      if (okPersonsIds) {
        _allListQuery.push('And')
        _myListQuery.push('And')
        _allListQuery.push(searchQuery)
        _myListQuery.push(searchQuery)
        search = ''
      } else {
        search = state.search
      }
    }
    // 条件组装
    const typePayload = [
      {
        key: 'myList',
        title: i18n.t('order.header.myOrder'),
        selectCondition: { query: _myListQuery, sort: state.sort, search }
      },
      {
        key: 'allList',
        title: i18n.t('order.header.allOrder'),
        selectCondition: { query: _allListQuery, sort: state.sort, search }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  },
  // 获取我的订单列表数据
  getMyList: (_state, getters) => (currentRoute) => {
    return _.filter(getters.ordersFiltered, (order) => {
      return (currentRoute && currentRoute.name && currentRoute.name.toLowerCase().includes('archived') ? order.archived : !order.archived) && _.intersection(order.members, [LocalStorage.getItem('myself').id.toString()]).length > 0
    })
  },
  // 获取所有订单列表数据
  getAllList: (_state, getters) => (currentRoute) => {
    return _.filter(getters.ordersFiltered, (order) => {
      return (currentRoute && currentRoute.name && currentRoute.name.toLowerCase().includes('archived') ? order.archived : !order.archived)
    })
  },
  getCustomerList: (_state, getters) => (currentRoute) => {
    return _.filter(getters.ordersFiltered, (order) => {
      return (currentRoute && currentRoute.name && +order.customerID === +currentRoute.params.objectID)
    })
  },
  // 我的废纸篓
  OrdersInMyTrash: (state) => {
    let my = LocalStorage.getItem('myself')
    let list = state.ordersInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name || _.intersection(item.members, [LocalStorage.getItem('myself').id.toString()]).length > 0)
    list.map(item => {
      item.resourceType = 'order'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
