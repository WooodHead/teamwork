export default {
  subscribe: (state) => ({ objectType = '', objectID = 0 }) => {
    return _.find(state.subscribes, { objectType: objectType, objectID: objectID })
  }
}
