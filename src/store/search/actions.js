import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Task from '../task/model'
import Checkin from '../checkins/model'
import Discuss from '../discuss/model'
import Message from '../message/model'
import Notice from '../notice/model'
import Document from '../document/model'
import Schedule from '../schedule/model'
import Project from '../project/model'
import ProductDev from '../product-dev/model'
import Team from '../team/model'
import { date } from 'quasar'
const { formatDate } = date
// 搜索条件
function getQuery ({ object = {}, person, modules, searchDate, selectOptions, organize, search, filter, matchTag }) {
  let queryCondition = []
  if (searchDate) {
    queryCondition.push(getDateQuery(modules.value, searchDate))
    queryCondition.push('and')
  }
  if (person.type !== 'all') {
    queryCondition.push(getPersonQuery(modules.value, person, selectOptions))
    queryCondition.push('and')
  }
  if (organize && organize.id) {
    queryCondition.push({ Key: 'OrganizeID', Value: organize.id, Oper: 'eq' })
    queryCondition.push('and')
  }
  if (object.value && object.value !== 'all') {
    if (modules.value === 'discuss') {
      queryCondition.push({ Key: " Module -> '$.Type'", Value: object.type, Oper: 'eq' })
      queryCondition.push('and')
      queryCondition.push({ Key: " Module -> '$.Id'", Value: object.value, Oper: 'eq' })
    } else {
      queryCondition.push({ Key: 'ObjectType', Value: object.type, Oper: 'eq' })
      queryCondition.push('and')
      queryCondition.push({ Key: 'ObjectID', Value: object.value, Oper: 'eq' })
    }
    queryCondition.push('and')
  }
  queryCondition.pop()

  const condition = {
    filter: matchTag ? JSON.stringify({ matchTag: false }) : filter,
    query: JSON.stringify(queryCondition),
    search: search.trim().replace(/，/ig, ',')
  }
  return condition
}
/**
 * 获取日期相关查询条件
 * @param {String} searchType 查询的业务模块
 * @param {*} searchDate 搜索的日期条件
 * @returns 
 */
function getDateQuery (searchType, searchDate) {
  const beginDate = searchDate.from
  const endDate = formatDate(new Date(searchDate.to).getTime() + 24 * 3600 * 1000, 'YYYY-MM-DD')
  const dateField = searchType === 'schedule' ? 'StartTime' : 'CreateTime'
  return [
    { Key: dateField, Value: beginDate, Oper: 'ge' },
    'and',
    { Key: dateField, Value: endDate, Oper: 'le' }
  ]
}
/**
 * 获取人员相关查询条件
 * @param {String} searchType 查询的业务模块
 * @param {Object}} person 查询人员相关参数
 */
function getPersonQuery (searchType, person, selectOptions) {
  const moduleQuery = [
    { Key: 'LeaderID', Value: person.id, Oper: 'eq' },
    'or',
    { Key: 'Members ->\'$.all\'', Value: _.toString(person.id), Oper: 'search' }]
  const toolQuery = {
    task: taskSelectToQuery(selectOptions, person),
    schedule: [{ Key: 'Withs', Value: person.id, Oper: 'inset' }],
    document: [{ Key: 'AuthorID', Value: person.id, Oper: 'inset' }]
  }
  return ['project', 'team', 'productDev'].includes(searchType)
    ? moduleQuery
    : toolQuery[searchType] || { Key: 'CreateBy', Value: person.name, Oper: 'eq' }
}
// 搜索筛选条件
function taskSelectToQuery (selectOptions, person) {
  const select = {
    assigned: { Key: 'AssignedTo', Value: person.id, Oper: 'inset' },
    finished: { Key: 'FinishedBy', Value: person.id, Oper: 'eq' },
    created: { Key: 'CreateByID', Value: person.id, Oper: 'eq' },
    archived: { Key: 'ArchiveBy', Value: person.name, Oper: 'eq' }
  }
  const query = []
  if (selectOptions && selectOptions.length) {
    selectOptions.forEach(item => {
      query.push(select[item], 'or')
    })
  } else {
    Object.values(select).forEach(item => {
      query.push(item, 'or')
    })
  }
  query.pop()// 把最后一个'or'去掉
  return query
}

export default {
  /**
   *
   * 获取项目列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {boolean} [byPage] 是否分页查询
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   * 如果不分页，这不用传byPage
   */
  loadSearchResultsByPage (
    { state, commit },
    { object = {},
      person,
      filter,
      modules,
      searchDate,
      search,
      organize,
      fields = 'List',
      selectOptions = state.selectOptions,
      matchTag = state.matchTag,
      sort = state.sort,
      order = state.order,
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset } = {}
  ) {
    const page = state.page
    const condition = getQuery({ object, person, modules, searchDate, selectOptions, organize, search, filter, matchTag })
    const sortField = {
      schedule: 'Id',
      task: 'TaskID'
    }
    Object.assign(condition, { sort: sortField[modules.value] || sort, order }, byPage ? { limit, offset } : {})
    let results = []
    let url = byPage ? `${modules.controller}/getpagelist` : `${modules.controller}/getlist`
    return request.get(url, condition).then(res => {
      const searchType = {
        task: Task,
        checkins: Checkin.Answer,
        discuss: Discuss,
        notice: Notice,
        document: Document,
        message: Message,
        schedule: Schedule,
        project: Project,
        productDev: ProductDev,
        team: Team
      }
      results = searchType[modules.value].from(res.data)
      let list = results.map((item, index) => {
        let model = state.resources.find(a => a.value === item.objectId && a.type === item.objectType)
        return Object.assign({}, item,
          {
            modules: modules.value,
            resource: model ? model.label : ''
          })
      })
      commit('updatePage', {
        offset: page.offset + list.length,
        nextPageToken: res.nextPageToken
      })
      return list
    })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return []
      })
  },
  // 获取数量
  loadCount ({ state, commit }, {
    object,
    person,
    modules,
    organize,
    search,
    searchDate,
    selectOptions = state.selectOptions,
    matchTag = state.matchTag
  }) {
    const condition = getQuery({ object, person, modules, searchDate, selectOptions, organize, search, filter: '', matchTag })
    return request.get(`${modules.controller}/getcount`, condition)
      .then(res => {
        let count = res.data
        return count
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
