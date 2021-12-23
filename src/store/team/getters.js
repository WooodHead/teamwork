import { LocalStorage } from 'quasar'
export default {
  menus: (state) => (isBookmark) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    return menus
  },
  // 获取一个项目,要确保已经加载过该项目
  team: (state) => (id) => {
    id = Number(id)
    return _.find(state.teams, { id }) || {}
  },
  // 过滤团队列表。返回本机构及子机构的团队列表
  selectTeamsFiltered: (state, getters, rootState) => (organizeId) => {
    let selectTeams = _.values(state.selectTeams.all)
    const org = rootState.organize.selectOrganizes[organizeId] || {}
    let arrOrgIds = org.childPath ? org.childPath.split(',') : [organizeId + '']
    return _.filter(selectTeams, team => arrOrgIds.includes(team.organizeID + ''))
  },

  teamsSorted: (state, getters) => {
    return state.listTeams.sort((a, b) => {
      if (a[state.sort] < b[state.sort]) return -1
      return 1
    })
  },

  teams: (_state, getters) => {
    return getters.teamsSorted
  },

  allTeams: state => {
    let search = state.search
    if (_.isObject(search)) {
      const teamIds = search.teamIds
      search = search.search
      return _.filter(state.allTeams, team =>
        team.title.toLowerCase().includes(search.toLowerCase()) ||
        teamIds.includes(team.id)
      )
    } else {
      if (search) {
        return _.filter(state.allTeams, team =>
          team.title.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return state.allTeams
      }
    }
  },

  selectCondition: (state, getters) => {
    const _allListQuery = [
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }]

    // 多条件检索
    let query = state.query
    if (query && query.length) {
      let queryCondition = []
      const groupNameArr = _.groupBy(query, 'name')
      // 项目状态、项目等级、项目类型、项目类型、形成销售可以直接拼接
      // 立项时间、结项时间需要拼接大于和小于时间
      let inGroup = _.pick(groupNameArr, ['Type'])
      let gtLtGroup = _.pick(groupNameArr, ['CreateTime'])
      if (_.keys(inGroup).length) {
        _.forEach(inGroup, (value, key) => {
          queryCondition.push('and', { Key: key, Value: _.join(_.map(value, 'value')), Oper: 'in' })
        })
      }
      if (_.keys(gtLtGroup).length) {
        let gtLtGroupCondition = []
        let packsgeCondition = []
        _.forEach(gtLtGroup, (value, key) => {
          gtLtGroupCondition.push('and')

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
    return { query: _allListQuery, sort: state.sort, search: state.search }
  },

  // 获取我的项目列表数据
  getMyList: (state, getters) => (currentRouteName) => {
    return _.filter(state.listTeams, (team) => {
      return !team.isTemplate && (currentRouteName.includes('archived') ? team.archived : !team.archived) && _.intersection(team.members, [LocalStorage.getItem('myself').id.toString()]).length > 0
    })
  },

  // 获取所有项目列表数据
  getAllList: (state, getters) => (currentRouteName) => {
    return _.filter(state.listTeams, (team) => {
      return (currentRouteName.includes('archived') ? team.archived : !team.archived) && !team.isTemplate
    })
  },
  // 废纸篓中的团队
  TeamsInMyTrash: (state) => {
    let list = state.teamsInTrash
    list.map(item => {
      item.resourceType = 'team'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
