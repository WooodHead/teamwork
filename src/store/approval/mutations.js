import Vue from 'vue'
export default {
  pushTemplateFormFields (state, payload) {
    let temp = _.find(state.templates, l => l.templateId === payload.templateId)
    if (temp) temp.formFields = payload.formFields
  },
  addApprovals (state, approvals) {
    const newApprovals = _.differenceBy(approvals, state.approvals, 'id')
    state.approvals.push(...newApprovals)
  },
  updateApproval (state, approval) {
    let index = state.approvals.findIndex(item => item.id === approval.id)
    Vue.set(state.approvals, index, approval)
  },
  deleteApproval (state, id) {
    Vue.delete(state.approvals, _.findIndex(state.approvals, { id }))
  },
  setPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.page, payload)
  }
}
