export default {
  loadWorkflow (state, { type, payload }) {
    let categoryValue = {}
    let typeValue = {}
    _.forEach(payload, m => {
      categoryValue = {}
      categoryValue[m.type] = m
      if (state.workflows[type]) {
        state.workflows[type] = Object.assign({}, state.workflows[type], categoryValue)
      } else {
        typeValue = {}
        typeValue[type] = categoryValue
        state.workflows = Object.assign({}, state.workflows, typeValue)
      }
    })
  }
}
