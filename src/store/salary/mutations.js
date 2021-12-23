// import Vue from 'vue'
export default {
  setSearch (state, val) {
    state.search = val
  },
  setSalarydateAndtype (state, list) {
    state.allSalaryDateAndType = list
  },
  deleteSalarydateAndtype (state, fileds) {
    state.allSalaryDateAndType = _.filter(state.allSalaryDateAndType, item => {
      return !(item.salaryYear === fileds.salaryYear && item.salaryMonth === fileds.salaryMonth && item.type === fileds.type)
    })
  },
  addSalarydateAndType (state, dateAndtype) {
    let index = _.findIndex(state.allSalaryDateAndType, item => {
      return item.salaryYear === dateAndtype.salaryYear && item.salaryMonth === dateAndtype.salaryMonth && item.type === dateAndtype.type
    })
    if (index < 0) {
      state.allSalaryDateAndType.unshift(dateAndtype)
    }
  },
  setCurrentDateAndType (state, model) {
    state.currentDateAndType = model
  },
  setIsReSend (state, value) {
    state.isReSend = value
  },
  setSalaryModel (state, model) {
    state.salaryModel = model
  },
  setAdminSalaryModel (state, model) {
    state.adminSalaryModel = model
  },
  formatPage (state) {
    Object.assign(state.page, {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    })
  },
  updatePage (state, page) {
    let o = {}
    o[`${page.year}-${page.month}-${page.type}`] = { offset: page.offset, limit: 20, nextPageToken: page.nextPageToken }
    Object.assign(state.page, o)
  },
  initTypePage (state, page) {
    let o = {}
    o[`${page.salaryYear}-${page.salaryMonth}-${page.type}`] = { limit: 20, offset: 0, nextPageToken: 0 }
    Object.assign(state.page, o)
  },
  setAdminSalarys (state, list) {
    const ids = _.map(list, 'id')
    state.adminSalarys = state.adminSalarys.filter(a => !ids.includes(a.id))
    state.adminSalarys.push(...list)
  },
  updateAdminSalarys (state, list) {
    _(list).forEach(l => {
      const id = l.id
      let old = _.find(state.adminSalarys, { id })
      old ? Object.assign(old, l) : state.adminSalarys.push(l)
    })
  },
  deleteAdminSalarys (state, fileds) {
    state.adminSalarys = _.filter(state.adminSalarys, item => {
      return !(item.salaryYear === fileds.salaryYear && item.salaryMonth === fileds.salaryMonth && item.type === fileds.type)
    })
  },
  deleteAdminSalary (state, id) {
    state.adminSalarys = _.filter(state.adminSalarys, item => {
      return item.id !== id
    })
  },
  emptyAdminSalary (state) {
    state.adminSalarys = []
  },
  setAdminSecurityCode (state, code) {
    var objCode = {}
    objCode[`${state.currentDateAndType.salaryYear}-${state.currentDateAndType.salaryMonth}-${state.currentDateAndType.type}`] = code
    Object.assign(state.adminSecurityCode, objCode)
  },
  setSalaryCountAndStatus (state, payload) {
    var obj = {}
    const salaryYear = payload.salaryYear
    const salaryMonth = payload.salaryMonth
    const type = payload.type
    payload = _.omit(payload, ['salaryYear', 'salaryMonth', 'type'])
    obj[`${salaryYear}-${salaryMonth}-${type}`] = JSON.parse(JSON.stringify(payload))
    state.salaryCountAndStatus = { ...state.salaryCountAndStatus, ...obj }
  },
  resetSalaryCountAndStatus (state, payload) {
    var obj = {}
    const salaryYear = payload.salaryYear
    const salaryMonth = payload.salaryMonth
    const type = payload.type
    obj[`${salaryYear}-${salaryMonth}-${type}`] = {
      all: 0,
      error: 0,
      sended: 0,
      success: 0
    }
    state.salaryCountAndStatus = { ...state.salaryCountAndStatus, ...obj }
  },
  setSalaryFilterStatus (state, payload) {
    var obj = {}
    const salaryYear = payload.salaryYear
    const salaryMonth = payload.salaryMonth
    const type = payload.type
    payload = _.omit(payload, ['salaryYear', 'salaryMonth', 'type', 'isSending'])
    obj[`${salaryYear}-${salaryMonth}-${type}`] = JSON.parse(JSON.stringify(payload))
    state.salaryFilterStatus = { ...state.salaryFilterStatus, ...obj }
  },
  deleteSalaryCountAndStatus (state, countAndStauts) {
    const salaryYear = countAndStauts.salaryYear
    const salaryMonth = countAndStauts.salaryMonth
    const type = countAndStauts.type
    state.salaryCountAndStatus = _.omit(state.salaryCountAndStatus, [`${salaryYear}-${salaryMonth}-${type}`])
  },
  deleteSalaryFilterStatus (state, filterStauts) {
    const salaryYear = filterStauts.salaryYear
    const salaryMonth = filterStauts.salaryMonth
    const type = filterStauts.type
    state.salaryFilterStauts = _.omit(state.salaryFilterStauts, [`${salaryYear}-${salaryMonth}-${type}`])
  },
  setImportProgress (state, progress) {
    state.importProgress = (+progress.toFixed(2)) * 100
  }
}
