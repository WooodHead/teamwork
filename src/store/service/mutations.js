import Vue from 'vue'
export default {
  setCurPsonId (state, value) {
    state.curPsonId = value
  },
  setCurTab (state, value) {
    state.curTab = value
  },
  setSort (state, value) {
    state.sort = value
  },
  setOrder (state, value) {
    state.order = value
  },
  setSearch (state, value) {
    state.search = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setPage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  setCurrentListPageType (state, type) {
    state.listPageType = type
  },
  addServices (state, services) {
    let newServices = _.differenceBy(services, state.listServices, 'id')
    state.listServices.push(...newServices)
  },
  setListServices (state, services) {
    const newServices = _.differenceBy(services, state.listServices, 'id')
    state.listServices.push(...newServices)
  },
  emptyServices (state) {
    state.listServices = []
  },
  addService (state, service) {
    state.services.unshift(service)

    state.listServices.unshift(service)

    state.selectServices.all.unshift(service)
    state.selectServices[service.id] = service
  },
  updateService (state, service) {
    const id = service.id
    let old = _.find(state.services, { id })
    old ? Object.assign(old, service) : state.services.push(service)

    old = _.find(state.listServices, { id })
    old ? Object.assign(old, service) : state.listServices.push(service)

    old = _.find(state.selectServices.all, { id })
    old ? Object.assign(old, service) : state.selectServices.all.push(service)
    state.selectServices[id] = service
  },
  updateConnectorInServiceCount (state, connectorInServiceCount) {
    state.connectorInServiceCount = connectorInServiceCount
  },
  deleteService (state, id) {
    Vue.delete(state.services, _.findIndex(state.services, { id }))

    Vue.delete(state.listServices, _.findIndex(state.listServices, { id }))

    Vue.delete(state.selectServices.all, _.findIndex(state.selectServices.all, { id }))
    Vue.delete(state.selectServices, id)
  },
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  updateSelectServices (state, services) {
    state.selectServices = { ...state.selectServices, ..._.keyBy(services, 'id') }
    state.selectServices.all = services
  }
}
