import { LocalStorage } from 'quasar'
import { i18n } from '@/boot/i18n'
import { searchToPersonIds, searchToOrganizeIds } from '@/utils/search-convert-helper'
export default {
  menus: (state) => (isBookmark) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    return menus
  },
  opportunitys: (state) => {
    return state.opportunitys
  },
  selectOpportunitys: state => {
    return _.values(state.selectOpportunitys)
  },
  opportunity: (state) => (id) => {
    id = Number(id)
    let model = _.find(state.opportunitys, c => {
      return c.id === +id
    })
    return model || {}
  },
  getFlowNodeID: (state) => (opportunity) => {
    let nodeID = 0
    _.forIn(opportunity.flowNodesStatus, function (value, key) {
      console.log(key)
      if (opportunity.status.toLowerCase().indexOf(key.toLowerCase()) > -1) {
        nodeID = value
        return false
      }
    })
    return nodeID
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
  },
  /**
   * 排序
   * @param {*} state
   * @param {*} getters
   */
  opportunitysSorted: (state, getters) => {
    return getters.opportunitysFiltered
  },
  /**
   * 筛选
   */
  opportunitysFiltered: (state, getters, rootState, rootGetters) => {
    let opportunitys = []
    let search = state.search
    if (search) {
      let statusId = _.find(_.values(state.status), item =>
        item.title.toLowerCase().includes(search.toLowerCase()))
        ? _.find(_.values(state.status), item => item.title.toLowerCase().includes(search.toLowerCase())).id
        : null
      let personIds = searchToPersonIds(rootGetters, search)
      let organizesIds = searchToOrganizeIds(rootGetters, search)
      opportunitys = _.filter(state.opportunitys, opportunity =>
        (opportunity.title && opportunity.title.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.opportunityNo && opportunity.opportunityNo.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.customerName && opportunity.customerName.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.leaderName && opportunity.leaderName.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.processType && opportunity.processType.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.leaderID && personIds.includes(opportunity.leaderID.toString())) ||
        (opportunity.organizesID && organizesIds.includes(opportunity.organizesID)) ||
        (opportunity.expectedDeliveryDate && opportunity.expectedDeliveryDate.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.createTime && opportunity.createTime.toLowerCase().includes(search.toLowerCase())) ||
        (opportunity.status && +opportunity.status === +statusId)
      )
    } else {
      opportunitys = state.opportunitys
    }
    // 多条件筛选
    let query = state.query
    if (query && query.length) {
      // 商机状态
      let statusList = _.map(_.filter(query, q => q.name === 'status'), qf => qf.value)
      if (statusList.length) {
        opportunitys = _.filter(opportunitys, opportunity => +opportunity.isLost === 0 && statusList.includes(+opportunity.status))
      }
      // 是否输单
      let isLost = _.find(query, q => q.name === 'isLost')
      if (isLost && isLost.value) {
        opportunitys = _.filter(opportunitys, opportunity => +opportunity.isLost === +isLost.value)
      }
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), qf => qf.value)
      if (customerTypeList.length) {
        opportunitys = _.filter(opportunitys, opportunity => customerTypeList.includes(opportunity.customerType))
      }
      // 创建日期
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        opportunitys = _.filter(opportunitys, opportunity => opportunity.createTime > minFromCreateTime && opportunity.createTime <= maxToCreateTime)
      }
    }
    return opportunitys
  },
  /**
   *首页展示样式
   */
  listStyle: state => {
    return state.listStyle
  },
  /**
   *归档的商机数
   */
  archivedCount: state => {
    return state.archivedCount
  },
  currentListPageParams: (state, getters) => {
    const typePayload = [
      {
        key: 'myList',
        selectCondition: { filter: { isDelete: 0 }, sort: state.sort, search: state.search }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  },
  /**
   * 组装query
   */
  listPageType: (state, _getters) => {
    const _allListQuery = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }]
    const _myListQuery = [
      { Key: 'JSON_UNQUOTE(Members ->\'$.all\')', Value: LocalStorage.getItem('myself').id, Oper: 'search' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' }]
    // 多条件检索
    let query = state.query
    if (query && query.length) {
      // 订单状态
      let statusList = _.map(_.filter(query, q => q.name === 'status'), qf => qf.value)
      if (statusList.length) {
        _allListQuery.push(...['and', { Key: 'Status', Value: _.join(statusList), Oper: 'in' }])
        _myListQuery.push(...['and', { Key: 'Status', Value: _.join(statusList), Oper: 'in' }])
      }
      // 是否输单
      let isLost = _.find(query, q => q.name === 'isLost')
      if (isLost && isLost.value) {
        _allListQuery.push(...['and', { Key: 'IsLost', Value: isLost.value, Oper: 'eq' }])
        _myListQuery.push(...['and', { Key: 'IsLost', Value: isLost.value, Oper: 'eq' }])
      }
      // 客户类型
      let customerTypeList = _.map(_.filter(query, q => q.name === 'customerType'), qf => qf.value)
      if (customerTypeList.length) {
        _allListQuery.push(...['and', { Key: 'CustomerType', Value: _.join(customerTypeList), Oper: 'in' }])
        _myListQuery.push(...['and', { Key: 'CustomerType', Value: _.join(customerTypeList), Oper: 'in' }])
      }
      // 创建日期
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
    }
    const typePayload = [
      {
        key: 'myList',
        title: i18n.t('opportunity.header.myOpportunity'),
        selectCondition: { query: _myListQuery, sort: state.sort, search: state.search }
      },
      {
        key: 'allList',
        title: i18n.t('opportunity.header.allOpportunity'),
        selectCondition: { query: _allListQuery, sort: state.sort, search: state.search }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  },
  // 获取我的商机列表数据
  getMyList: (state, getters) => (currentRoute) => {
    return _.filter(getters.opportunitysSorted, (opportunity) => {
      return (currentRoute && currentRoute.name && currentRoute.name.toLowerCase().includes('archived') ? opportunity.archived : !opportunity.archived) && _.intersection(opportunity.members, [LocalStorage.getItem('myself').id.toString()]).length > 0
    })
  },
  // 获取所有商机列表数据
  getAllList: (state, getters) => (currentRoute) => {
    return _.filter(getters.opportunitysSorted, (opportunity) => {
      return (currentRoute && currentRoute.name && currentRoute.name.toLowerCase().includes('archived') ? opportunity.archived : !opportunity.archived)
    })
  },
  getCustomerList: (_state, getters) => (currentRoute) => {
    return _.filter(getters.opportunitysSorted, (opportunity) => {
      return (currentRoute && currentRoute.name && +opportunity.customerID === +currentRoute.params.objectID)
    })
  },
  steps: (state) => ({ arrStatusFlow = state.statusFlow, currStatus = 10 }) => {
    let list = arrStatusFlow.map(item => {
      let status = state.status[item]
      if (currStatus % 10 && +status.name === +currStatus) {
        status.activeColor = 'primary'
      }
      return status
    })
    return list
  },
  // 我的废纸篓
  OpportunitysInMyTrash: (state) => {
    const my = LocalStorage.getItem('myself') || {}
    let list = state.opportunitysInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list.map(item => {
      item.resourceType = 'opportunity'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 资源废纸篓
  OpportunitysInTrash: (state) => (objectType, objectID) => {
    let list = state.opportunitysInTrash.filter(item => item.objectType === objectType && item.objectId === +objectID)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
