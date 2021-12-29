export default {
  // 新建搜索结果
  addResults (state, results) {
    const newResults = _.differenceBy(results, state.results, 'id')
    state.results.push(...newResults)
  },
  // 新建资源
  addResources (state, resources) {
    const newResources = _.differenceBy(resources, state.resources, 'value')
    state.resources.push(...newResources)
  },
  // 新建机构
  addOrganizes (state, organizes) {
    const newOrganizes = _.differenceBy(organizes, state.organizes, 'value')
    state.organizes.push(...newOrganizes)
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  // 设置搜索条件
  setSearch (state, value) {
    state.search = value
  },
  setList (state, value) {
    state.recordLeaveList = value
  },
  setCount (state, value) {
    state.recordLeaveCount = value
  },
  // 设置搜索条件
  setModules (state, value) {
    state.modules = value
  },
  // 设置搜索日期
  setPerson (state, value) {
    state.person = value
  },
  // 设置搜索日期
  setSearchDate (state, value) {
    state.searchDate = value
  },
  // 设置搜索条件
  setObject (state, value) {
    state.object = value
  },
  // 设置搜索条件
  setOrganize (state, value) {
    state.organize = value
  }
}
