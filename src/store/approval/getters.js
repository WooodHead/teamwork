export default {
  approval: state => id => {
    return _.find(state.approvals, { id })
  },
  approvals: (_state, getters) => {
    return getters.approvalsFiltered
  },
  search: state => {
    return state.search
  },
  approvalsFiltered: (_state, getters) => {
    let approvals = getters.approvalsSorted
    return approvals
  },
  approvalsSorted: state => {
    return _.orderBy(state.approvals, [ 'id' ], ['asc'])
  },
  quickLinks: state => {
    return state.quickLinks
  },
  templates: state => {
    return state.templates
  },
  template: state => templateId => {
    return _.find(state.templates, temp => temp.templateId === templateId)
  }
}
