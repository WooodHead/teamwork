import { LocalStorage } from 'quasar'
import { i18n } from '@/boot/i18n'
export default {

  /**
   * 获取对象
   * @param {*} _state
   */
  assess: (state) => (id) => {
    return _.find(state.allAssess, { id }) || {}
  },
  /**
   * 获取集合
   * @param {*} state
   */
  allAssess: (state) => ({ category, objectID }) => {
    return _.filter(state.allAssess, (assess) => {
      if (category === 'opportunity') {
        return (assess && assess.opportunityID === +objectID)
      } else {
        return (assess && assess.manufacturerID === +objectID)
      }
    })
  },
  /** 列表数据，归档过滤 */
  assessFiltered: state => ({ category, objectID }) => {
    let assessList = state.allAssess
    if (category === 'opportunity') { // 商机
      return assessList.filter(assess => {
        if (state.isArchivedList) {
          return (assess && assess.opportunityID === +objectID && assess.archived)
        } else {
          return (assess && assess.opportunityID === +objectID && !assess.archived)
        }
      })
    } else { // 生产单位
      return assessList.filter(assess => {
        if (state.isArchivedList) {
          return (assess && assess.manufacturerID === +objectID && assess.archived)
        } else {
          return (assess && assess.manufacturerID === +objectID && !assess.archived)
        }
      })
    }
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
   */
  assessSorted: (state) => {
    return _.orderBy(state.allAssess, [ 'manufacturerName' ], ['desc'])
  },
  /**
   *首页展示样式
   */
  listStyle: state => {
    return state.listStyle
  },
  /**
   *归档的评估数
   */
  archivedCount: state => {
    return state.archivedCount
  },
  /**
   *状态色获取
   */
  statusColor: state => {
    return state.statusColor
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
        title: i18n.t('order.header.myOrder'),
        selectCondition: { query: _myListQuery, sort: state.sort, search: state.search }
      },
      {
        key: 'allList',
        title: i18n.t('order.header.allOrder'),
        selectCondition: { query: _allListQuery, sort: state.sort, search: state.search }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  }
}
