import { date, LocalStorage, Platform } from 'quasar'
const my = LocalStorage.getItem('myself') || {}
export default {
  menus: (state) => (isBookmark, status) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    status && menus.push({ group: state.progressMenus[status] })
    return menus
  },
  productDev: (state) => (id) => {
    return _.find(state.productDevs, { id: id }) || {}
  },
  productDevs: (state, getters) => {
    return getters.productDevsSorted
  },
  productDevsSorted: (state, getters) => {
    // sort Firefox例外
    const isFirefox = Platform.is.firefox
    return state.listProductDevs.sort((a, b) => {
      return a[state.sort] < b[state.sort] ? (isFirefox ? 1 : -1) : (isFirefox ? -1 : 1)
    })
  },
  // 过滤团队列表。返回本机构及子机构的团队列表
  selectProductDevsFiltered: (state, getters, rootState) => (organizeId) => {
    let selectProductDevs = _.values(state.selectProductDevs.all)
    const org = rootState.organize.selectOrganizes[organizeId] || {}
    let arrOrgIds = org.childPath ? org.childPath.split(',') : [organizeId + '']
    return _.filter(selectProductDevs, productDev => arrOrgIds.includes(productDev.organizeID + ''))
  },
  selectCondition: (state, getters) => {
    const _allListQuery = [
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { 'Key': 'forManagement', 'Value': 1, 'Oper': 'eq' },
      'and',
      { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
    ]
    // 多条件检索
    let query = state.query
    if (query && query.length) {
      let queryCondition = []
      const groupNameArr = _.groupBy(query, 'name')
      // 产品状态、产品类型可以直接拼接
      // 开始时间、结束时间需要拼接大于和小于时间
      let inGroup = _.pick(groupNameArr, ['Status', 'Type'])
      let gtLtGroup = _.pick(groupNameArr, ['BeginDate', 'EndDate'])
      if (_.keys(inGroup).length) {
        _.forEach(inGroup, (value, key) => {
          let valueStr = _.join(_.map(value, 'value'))
          if (key === 'Status' && valueStr.includes('putoff')) {
            let putOffCondition = []
            let putOffCondition1 = []
            let now = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
            putOffCondition1.push({ Key: key, Value: 'doing', Oper: 'eq' })
            putOffCondition1.push('And', { Key: 'PredictEndDate', Value: now, Oper: 'lt' })
            putOffCondition.push(putOffCondition1)
            putOffCondition.push('Or', { Key: key, Value: valueStr, Oper: 'in' })
            queryCondition.push('and', putOffCondition)
          } else {
            queryCondition.push('and', { Key: key, Value: valueStr, Oper: 'in' })
          }
        })
      }
      if (_.keys(gtLtGroup).length) {
        let gtLtGroupCondition = []
        _.forEach(gtLtGroup, (value, key) => {
          gtLtGroupCondition.push('and')
          let packsgeCondition = []
          _.forEach(value, (valueV, index) => {
            if (index !== 0) {
              packsgeCondition.push('or')
            }
            let everyCondition = []
            everyCondition.push(
              { Key: key, Value: valueV.value.from.toString(), Oper: 'gt' },
              'and',
              { Key: key, Value: valueV.value.to.toString(), Oper: 'lt' })
            packsgeCondition.push(everyCondition)
          })
          gtLtGroupCondition.push(packsgeCondition)
        })
        queryCondition.push(...gtLtGroupCondition)
      }
      _allListQuery.push(...queryCondition)
    }
    return { query: _allListQuery, sort: state.sort, order: state.order, search: state.search }
  },
  // 获取我的列表数据
  getMyList: (state, getters) => (currentRouteName) => {
    return _.filter(getters.productDevsSorted, (item) => {
      return (currentRouteName.includes('archived') ? item.archived : !item.archived) && _.intersection(item.members, [LocalStorage.getItem('myself').id.toString()]).length > 0 &&
        !item.isTemplate
    })
  },
  // 获取所有列表数据
  getAllList: (state, getters) => (currentRouteName) => {
    return _.filter(getters.productDevsSorted, (item) => {
      return (currentRouteName.includes('archived') ? item.archived : !item.archived) && !item.isTemplate
    })
  },
  // 获取用于科技申报列表数据
  getDeclarationList: (state, getters) => (currentRouteName) => {
    return _.filter(getters.productDevsSorted, (item) => {
      return (currentRouteName.includes('archived') ? item.archived : !item.archived) && item.forDeclaration
    })
  },
  // 我的废纸篓
  ProductDevsInMyTrash: (state) => {
    let list = state.productDevsInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list.map(item => {
      item.resourceType = 'productDev'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
