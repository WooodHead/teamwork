import Vue from 'vue'
export default {
  setSort (state, value) {
    state.sort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setPage (state, page) {
    Object.assign(state.page, page)
  },
  setAllTeams (state, teams) {
    state.allTeams = teams
  },
  setListTeams (state, teams) {
    const newTeams = _.differenceBy(teams, state.listTeams, 'id')
    state.listTeams.push(...newTeams)
  },
  emptyTeams (state) {
    state.listTeams = []
    state.page = {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    }
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },

  // 增删改时要同时更新list,select,view的数据
  addTeam (state, team) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.teams, r => r.id === team.id)
    index < 0 && state.teams.unshift(team)

    index = _.findIndex(state.listTeams, function (o) { return o.id === team.id })
    index < 0 && state.listTeams.unshift(team)

    index = _.findIndex(state.selectTeams.all, r => r.id === team.id)
    index < 0 && state.selectTeams.all.unshift(team)
    state.selectTeams[team.id] = team
  },

  updateTeam (state, team) {
    const id = team.id
    let old = _.find(state.teams, { id })
    old ? Object.assign(old, team) : state.teams.push(team)

    old = _.find(state.listTeams, { id })
    old ? Object.assign(old, team) : state.listTeams.push(team)

    old = _.find(state.selectTeams.all, { id })
    old ? Object.assign(old, team) : state.selectTeams.all.push(team)
    state.selectTeams[id] = team
  },

  updateTeamField (state, { id, fieldName, value }) {
    let team = _.find(state.teams, { id })
    team && (team[fieldName] = value)

    team = _.find(state.listTeams, { id })
    team && (team[fieldName] = value)

    team = _.find(state.selectTeams.all, { id })
    team && (team[fieldName] = value)
    state.selectTeams[id][fieldName] = value
  },

  deleteTeam (state, id) {
    let team = _.filter(state.teams, { id })
    state.teamsInTrash.push(team[0])
    Vue.delete(state.teams, _.findIndex(state.teams, { id }))

    Vue.delete(state.listTeams, _.findIndex(state.listTeams, { id }))

    Vue.delete(state.selectTeams.all, _.findIndex(state.selectTeams.all, { id }))
    Vue.delete(state.selectTeams, id)
  },
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  updateSelectTeams (state, teams) {
    state.selectTeams = { ...state.selectTeams, ..._.keyBy(teams, 'id') }
    state.selectTeams.all = teams
  },

  /** ------------------废纸篓相关---------------------- */
  /**
   * 解删除团队
   * @param {*} state
   * @param {*} ID 类别ID
   */
  undeleteTeamInTrash (state, id) {
    state.teamsInTrash = state.teamsInTrash.filter(a => a.id !== id)
  },
  // 废纸篓中新增数据
  addTeamsInTrash (state, teamsInTrash) {
    let list = _.unionBy(teamsInTrash, 'id')
    const ids = []
    _(list).each(function (team) {
      ids.push(team.id)
    })
    state.teamsInTrash = state.teamsInTrash.filter(a => !ids.includes(a.id))
    state.teamsInTrash.push(...list)
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setQuery (state, payload) {
    state.query = payload
  }
}
