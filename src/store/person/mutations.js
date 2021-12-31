export default {
  setSort (state, value) {
    state.sort = value
  },
  setSearch (state, value) {
    state.search = value
  },
  setIsInService (state, value) {
    state.isInService = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setOrganizeId (state, value) {
    state.organizeId = value
  },
  setTeamId (state, value) {
    state.teamId = value
  },
  setDutyId (state, value) {
    state.dutyId = value
  },
  setGroupId (state, value) {
    state.groupId = value
  },
  setRoleId (state, value) {
    state.roleId = value
  },
  initPage (state) {
    state.page = { offset: 0, limit: 12, total: 0, nextPageToken: -1 }
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  updateSelectPage (state, selectPage) {
    if (selectPage.nextPageToken === -1) {
      selectPage.offset = 0
    }
    Object.assign(state.selectPage, selectPage)
  },
  updatePersons (state, persons) {
    state.persons = { ...state.persons, ...persons }
    state.selectPersons = { ...state.selectPersons, ...persons }
  },
  updateSelectPersons (state, persons) {
    state.selectPersons = { ...state.selectPersons, ...persons }
  },
  updatePersonField (state, { id, fieldName, value }) {
    if (state.persons && state.persons[id]) {
      state.persons[id][fieldName] = value
      state.selectPersons[id][fieldName] = value
    }
  },
  deletePersons (state, ids) {
    state.persons = _.omit(state.persons, ids)
    state.selectPersons = _.omit(state.selectPersons, ids)
  },
  setMyQuickLinks (state, val) {
    state.myQuickLinksDefault = val
  }
}
