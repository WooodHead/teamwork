export default {
  // -----------主页面方法 start
  consultsFiltered: (state, getters) => {
    let consults = _.cloneDeep(state.consults)
    if (+state.selectedStatus) {
      consults = state.consults.filter(a => a.status === +state.selectedStatus)
    }
    if (state.consultSearch) {
      let consultSearch = []
      consults.forEach(item => {
        if (item.content && item.content.toLowerCase().includes(state.consultSearch.toLowerCase())) {
          consultSearch.push(item)
        }
      })
      consults = _.cloneDeep(consultSearch)
    }
    return consults
  },
  consultsSorted: (state, getters) => {
    return getters.consultsFiltered.sort((a, b) => {
      if (a[state.consultSort] < b[state.consultSort]) return 1
      return -1
    })
  },
  consults: (state, getters) => {
    let consults = [],
      consultFilteredSorted = getters.consultsSorted
    Object.keys(consultFilteredSorted).forEach(key => {
      let consult = consultFilteredSorted[key]
      consults[key] = consult
    })
    return consults
  },
  consult: (state) => (id) => {
    return _.find(state.consults, { id }) || {}
  },
  // -----------主页面方法 end
  // -----------咨询何事方法 start
  consultItemsFiltered: state => {
    if (state.consultItemSearch) {
      let items = []
      state.consultItems.forEach(item => {
        if ((item.title && item.title.toLowerCase().includes(state.consultItemSearch.toLowerCase())) ||
          (item.type && item.type.toLowerCase().includes(state.consultItemSearch.toLowerCase()))) {
          items.push(item)
        }
      })
      return items
    } else {
      return state.consultItems
    }
  },
  consultItemsSorted: (state, getters) => {
    return getters.consultItemsFiltered.sort((a, b) => {
      return String(a.title).localeCompare(String(b.title))
    })
  },
  consultItems: (state, getters) => {
    return getters.consultItemsSorted
  },
  consultItem: (state) => (id) => {
    return _.find(state.consultItems, { id }) || {}
  },
  // -----------咨询何事方法 end

  // -----------向谁咨询方法 start
  transactorsFiltered: (state, getters, rootState) => {
    let allPersons = rootState.person.selectPersons
    if (_.isEmpty(allPersons)) {
      return []
    } else {
      const transactorsList = [],
        filterInService = _.filter(state.transactors, n => allPersons[n.psonID] && allPersons[n.psonID].isInService)
      _.forEach(filterInService, m => {
        if (allPersons[m.psonID]) {
          transactorsList.push(Object.assign({}, {
            psonID: m.psonID,
            items: m.items,
            id: allPersons[m.psonID].organizeId,
            name: allPersons[m.psonID].organizeName,
            shortName: allPersons[m.psonID].orgShortName
          }))
        }
      })
      let search = state.transactorSearch
      if (_.isObject(search)) {
        const consultOrganizeIds = search.consultOrganizeIds
        search = search.search
        return _.filter(transactorsList, item =>
          (item.name && item.name.toLowerCase().includes(search && search.toLowerCase())) ||
        (item.shortName && item.shortName.toLowerCase().includes(search && search.toLowerCase())) ||
        consultOrganizeIds.includes(item.id)
        )
      } else {
        if (search) {
          return _.filter(transactorsList, item =>
            (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
          (item.shortName && item.shortName.toLowerCase().includes(search.toLowerCase())) ||
           (item.psonName && item.psonName.toLowerCase().includes(search.toLowerCase()))
          )
        } else {
          return transactorsList
        }
      }
    }
  },
  transactors: (state, getters) => {
    return getters.transactorsFiltered
  }
  // -----------向谁咨询方法 end
}
