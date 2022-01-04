import { searchToPersonIds } from '@/utils/search-convert-helper'
export default {
  currentModel: (state, getters) => (id) => {
    return _.find(state.followups, { 'id': +id }) || {}
  },
  /**
   * 跟进列表（
   */
  followups: (state, getters) => ({ objectID, objectType } = { objectID: state.ObjectID,
    objectType: state.ObjectType }) => {
    state.ObjectID = objectID
    state.ObjectType = objectType
    return getters.filesSorted
  },
  /** 列表排序 */
  followupsSorted: (state, getters) => {
    return _.orderBy(getters.followupsFiltered, state.sort)
  },
  /** 列表排序 */
  filesSorted: state => {
    return _.orderBy(state.followups, state.sort)
  },
  /** 跟进列表过滤 */
  followupsFiltered: state => {
    let followups = []
    let search = state.search
    if (state.followups.length > 0 && search) {
      if (search) {
        let personIds = searchToPersonIds(rootGetters, search)
        followups = _.filter(state.followups, followup =>
          (followup.title && followup.title.toLowerCase().includes(search.toLowerCase())) ||
        (followup.contactForm && followup.contactForm.toLowerCase().includes(search.toLowerCase())) ||
        (followup.leaderID && personIds.includes(followup.leaderID.toString())) ||
        (followup.content && followup.content.toLowerCase().includes(search.toLowerCase())))
      }
    } else {
      followups = state.followups
    }
    return followups
  },
  search: state => {
    return state.search
  },
  /**
   *首页展示样式
   */
  listStyle: state => {
    return state.listStyle
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
   * 组装query
   */
  listPageType: (state, _getters) => {
    debugger
    const _allListQuery = []
    // 多条件检索
    let query = state.query
    if (query && query.length) {
      // 跟进方式
      let contactFormList = _.map(_.filter(query, q => q.name === 'contactForm'), qf => qf.value)
      if (contactFormList.length) {
        _allListQuery.push(...['and', { Key: 'contactForm', Value: _.join(contactFormList), Oper: 'eq' }])
      }
      // 跟进日期
      let fromCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toCreateTimeList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromCreateTimeList.length && toCreateTimeList.length) {
        let minFromCreateTime = _.min(fromCreateTimeList)
        let maxToCreateTime = _.max(toCreateTimeList)
        if (minFromCreateTime.length === 10) minFromCreateTime = minFromCreateTime + ' 00:00:00'
        if (maxToCreateTime.length === 10) maxToCreateTime = maxToCreateTime + ' 23:59:59'
        _allListQuery.push(...['and', { Key: 'CreateTime', Value: minFromCreateTime, Oper: 'gt' }, 'and', { Key: 'CreateTime', Value: maxToCreateTime, Oper: 'le' }])
      }
    }
    const typePayload = [
      {
        title: '跟进列表',
        selectCondition: { query: _allListQuery, sort: state.sort, search: state.search }
      }
    ]
    return typePayload[0]
  },
  /**
   * 多条件检索
   * @param {*} state
   */
  query: state => {
    return state.query
  }
}
