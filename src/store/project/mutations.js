import Vue from 'vue'
export default {
  setSort (state, value) {
    state.sort = value
  },
  setOrder (state, value) {
    state.order = value
  },
  setSearch (state, value) {
    state.search = value
  },
  setQuery (state, value) {
    state.query = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  setListProjects (state, projects) {
    const newProjects = _.differenceBy(projects, state.listProjects, 'id')
    state.listProjects.push(...newProjects)
  },
  emptyProjects (state) {
    state.listProjects = []
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },

  // 增删改时要同时更新list,select,view的数据
  addProject (state, project) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.projects, r => r.id === project.id)
    index < 0 && state.projects.unshift(project)

    index = _.findIndex(state.listProjects, function (o) { return o.id === project.id })
    index < 0 && state.listProjects.unshift(project)

    index = _.findIndex(state.selectProjects.all, r => r.id === project.id)
    index < 0 && state.selectProjects.all.unshift(project)
    state.selectProjects[project.id] = project
  },
  updateProject (state, project) {
    const id = project.id
    let old = _.find(state.projects, { id })
    old ? Object.assign(old, project) : state.projects.push(project)

    old = _.find(state.listProjects, { id })
    old ? Object.assign(old, project) : state.listProjects.push(project)

    old = _.find(state.selectProjects.all, { id })
    old ? Object.assign(old, project) : state.selectProjects.all.push(project)
    state.selectProjects[id] = project
  },
  updateProjectField (state, { id, fieldName, value }) {
    let project = _.find(state.projects, { id })
    project && (project[fieldName] = value)

    project = _.find(state.listProjects, { id })
    project && (project[fieldName] = value)

    project = _.find(state.selectProjects.all, { id })
    project && (project[fieldName] = value)
    state.selectProjects[id][fieldName] = value
  },
  deleteProject (state, id) {
    Vue.delete(state.projects, _.findIndex(state.projects, { id }))

    Vue.delete(state.listProjects, _.findIndex(state.listProjects, { id }))

    Vue.delete(state.selectProjects.all, _.findIndex(state.selectProjects.all, { id }))
    Vue.delete(state.selectProjects, id)
  },

  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  updateSelectProjects (state, projects) {
    state.selectProjects = { ...state.selectProjects, ..._.keyBy(projects, 'id') }
    state.selectProjects.all = projects
  },

  updateDashboardRank (state, payload) {
    let obj = {}
    obj[payload.key] = payload.value
    state.dashboardRank = Object.assign({}, state.dashboardRank, obj)
  },
  removeDashboardRankKey (state, key) {
    state.dashboardRank = _.omit(state.dashboardRank, [key])
  },
  // 废纸篓（项目）
  addProjectsTrash (state, projects) {
    const newProjects = _.differenceBy(projects, state.projectsInTrash, 'id')
    state.projectsInTrash.push(...newProjects)
  },
  undeleteProjectInTrash (state, id) {
    state.projectsInTrash = state.projectsInTrash.filter(a => a.id !== id)
  },
  setDashboardData (state, model) {
    state.dashboardModel = model
  },
  setProjectRank (state, value) {
    state.projectRank = value
  }
}
