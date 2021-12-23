import { i18n } from '@/boot/i18n'
import { date, LocalStorage } from 'quasar'
const my = LocalStorage.getItem('myself') || {}
// import Project from '../../store/project/model'
export default {
  menus: (state) => (isBookmark, status) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    status && menus.push({ group: state.progressMenus[status] })
    return menus
  },
  // 获取一个项目,要确保已经加载过该项目
  project: (state) => (id) => {
    id = Number(id)
    return _.find(state.projects, { id }) || {}
  },
  projectsSorted: (state, getters) => {
    return state.listProjects.sort((a, b) => {
      if (a[state.sort] < b[state.sort]) return -1
      return 1
    })
  },
  // 是否审批
  needApply: (state, getters) => (type) => {
    return type && !(`,${type}`.includes(',P：'))
  },
  // 获取项目列表
  projects: (_state, getters) => {
    return getters.projectsSorted
  },
  currentListPageParams: (state, getters, _rootState, rootGetters) => {
    const _allListQuery =
      [
        { Key: 'Archived', Value: 0, Oper: 'eq' },
        'and',
        { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
      ]
    const _myListQuery = [
      { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' },
      'and',
      ..._allListQuery
    ]
    // 多条件检索
    let query = state.query
    let queryCondition = []
    if (query && query.length) {
      const groupNameArr = _.groupBy(query, 'name')
      // 项目状态、项目等级、项目类型、项目类型、形成销售可以直接拼接
      // 立项时间、结项时间需要拼接大于和小于时间
      let inGroup = _.pick(groupNameArr, ['Status', 'ProjLevel', 'ProjType', 'Classify', 'Saled'])
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
    }
    let search = _.cloneDeep(state.search)
    if (search) {
      let okPersons = rootGetters['person/getMatchList'](search)
      let okPersonsIds = _.map(okPersons, 'id').toString()
      queryCondition.push('And')
      let searchQuery = []
      // 拼人员条件
      okPersonsIds && searchQuery.push({ Key: 'LeaderID', Value: okPersonsIds, Oper: 'in' })

      // 拼机构条件
      let okOrganizes = rootGetters['organize/getMatchList'](search)
      let okOrganizesIds = _.map(okOrganizes, 'id').toString()
      if (okOrganizesIds) {
        okPersonsIds && searchQuery.push('Or')
        searchQuery.push({ Key: 'OrganizeID', Value: okOrganizesIds, Oper: 'in' })
      }
      // 拼名称条件
      if (okPersonsIds || okOrganizesIds) { searchQuery.push('Or') }
      searchQuery.push({ Key: 'ProjName', Value: `%${search}%`, Oper: 'like' })
      searchQuery.push('Or', { Key: 'Description', Value: `%${search}%`, Oper: 'like' })
      queryCondition.push(searchQuery)
      search = ''
    }
    if (queryCondition.length) {
      _myListQuery.push(...queryCondition)
      _allListQuery.push(...queryCondition)
    }
    const typePayload = [
      {
        key: 'myList',
        title: i18n.t('project.headerList.myProjectHeader'),
        selectCondition: { query: _myListQuery, sort: state.sort, order: state.order, search: search || '' }
      },
      {
        key: 'allList',
        title: i18n.t('project.headerList.allProjectHeader'),
        selectCondition: { query: _allListQuery, sort: state.sort, order: state.order, search: search || '' }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  },
  // 获取我的项目列表数据
  getMyList: (state, getters) => (currentRouteName) => {
    return _.filter(state.listProjects, (project) => {
      return (currentRouteName.includes('archived') ? project.archived : !project.archived) &&
        _.intersection(project.members,
          [LocalStorage.getItem('myself').id.toString()]).length > 0 &&
        !project.isTemplate
    })
  },
  // 获取所有项目列表数据
  getAllList: (state, getters) => (currentRouteName) => {
    return _.filter(state.listProjects, (project) => {
      return currentRouteName.includes('archived') ? project.archived : !project.archived &&
        !project.isTemplate
    })
  },
  // 我的废纸篓
  ProjectsInMyTrash: (state) => {
    let list = state.projectsInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list.map(item => {
      item.resourceType = 'project'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 如果是外网，则图表类型下拉框有大区和分公司
  // 如果是内网，则图表类型下拉框为自己所在机构的最高父级下面的所有部机构
  projectDashboardType: (state, getters, rootState) => {
    return state.dashBoardType
  }
}
