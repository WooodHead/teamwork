export default {
  breadcrumbs: (state) => {
    const mb = _.map(state.moduleBreadcrumbs, b => {
      b.type = 'module'
      return b
    })
    const wb = _.map(state.widgetBreadcrumbs, b => {
      b.type = 'widget'
      return b
    })
    return [...mb, ...wb]
  }
}
