export default {
  initMembers (state, payload) {
    state.members = _.groupBy(payload, m => m.objectType + '_' + m.objectID)
  },
  updateMembers (state, payload) {
    let oldMembers = _.flattenDeep(_.values(state.members))
    let newMembers = _.differenceBy(oldMembers, payload, 'id')
    payload.push(...newMembers)
    state.members = _.groupBy(payload, m => m.objectType + '_' + m.objectID)
  }
}
