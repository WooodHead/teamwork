export default {
  allocation: (state) => (id) => {
    return _.find(state.allocations, { id }) || {}
  },
  allocations: (_state, getters) => ({ category = 'order', objectID = 0, currentRouteName = 'allocation' }) => {
    return getters.allocationsFiltered({ category, objectID, currentRouteName })
  },
  sort: state => {
    return state.sort
  },
  sortOptions: state => {
    return state.sortOptions
  },
  search: state => {
    return state.search
  },
  allocationsFiltered: (_state, getters) => ({ category, objectID, currentRouteName }) => {
    let allocations = getters.allocationsSorted
    if (allocations.length) {
      allocations = allocations.filter(allocation => {
        if (category === 'order') {
          if (currentRouteName && currentRouteName.toLowerCase().includes('archived')) {
            return (allocation && allocation.orderID === +objectID && allocation.archived)
          } else {
            return (allocation && allocation.orderID === +objectID && !allocation.archived)
          }
        } else {
          if (currentRouteName && currentRouteName.toLowerCase().includes('archived')) {
            return (allocation && allocation.manufacturerID === +objectID && allocation.archived)
          } else {
            return (allocation && allocation.manufacturerID === +objectID && !allocation.archived)
          }
        }
      })
    }
    return allocations
  },
  allocationsSorted: (state) => {
    return _.orderBy(state.allocations, [ 'expectedDeliveryDate' ], ['asc'])
  },
  archivedCount: state => {
    return state.archivedCount
  },
  allCount: state => {
    return state.allCount
  },
  statusList: state => {
    return state.statusList
  }
}
