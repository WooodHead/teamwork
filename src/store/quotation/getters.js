import { LocalStorage } from 'quasar'
import { i18n } from '@/boot/i18n'
export default {
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
   * 排序
   * @param {*} state
   * @param {*} getters
   */
  opportunitysSorted: (state, getters) => {
    return _.orderBy(getters.opportunitysFiltered, [ 'title' ], ['desc'])
  },
  /**
   * 筛选
   */
  opportunitysFiltered: state => {
    let search = state.search
    if (search) {
      return _.filter(_.cloneDeep(state.opportunitys), opportunity =>
        opportunity.title.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return _.cloneDeep(state.opportunitys)
    }
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
      { Key: 'Members', Value: LocalStorage.getItem('myself').id, Oper: 'inset' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' }]
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
  getMyList: (state, getters) => (currentRouteName) => {
    return _.filter(getters.opportunitysSorted, (opportunity) => {
      return (currentRouteName && currentRouteName.toLowerCase().includes('archived') ? opportunity.archived : !opportunity.archived) && _.intersection(opportunity.members, [LocalStorage.getItem('myself').id.toString()]).length > 0
    })
  },
  // 获取所有商机列表数据
  getAllList: (state, getters) => (currentRouteName) => {
    return _.filter(getters.opportunitysSorted, (opportunity) => {
      return (currentRouteName && currentRouteName.toLowerCase().includes('archived') ? opportunity.archived : !opportunity.archived)
    })
  }
}
