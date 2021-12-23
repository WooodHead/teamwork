
import Vue from 'vue'
export default {
  setResource (state, model) {
    state.resource = model
  },
  clearBreadcrumbs (state) {
    state.moduleBreadcrumbs = []
    state.widgetBreadcrumbs = []
  },
  clearModuleBreadcrumbs (state) {
    state.moduleBreadcrumbs = []
  },
  setModuleBreadcrumbs (state, breads) {
    state.moduleBreadcrumbs = breads
  },
  pushModuleBreadcrumb (state, bread) {
    if (!state.moduleBreadcrumbs.some(b => b.id === bread.id && b.title === bread.title)) {
      state.moduleBreadcrumbs.push(bread)
    }
  },
  insertModuleBreadcrumb (state, { id, bread }) {
    const indexOfItem = state.moduleBreadcrumbs.findIndex(item => item.id === id)
    state.moduleBreadcrumbs.splice(indexOfItem, 0, bread)
  },
  updateModuleBreadcrumb (state, bread) {
    const indexOfItem = _.find(state.moduleBreadcrumbs, { id: bread.id })
    if (indexOfItem >= 0) {
      Vue.set(state.moduleBreadcrumbs, indexOfItem, bread)
    }
  },
  deleteModuleBreadcrumb (state, id) {
    Vue.delete(state.moduleBreadcrumbs, state.moduleBreadcrumbs.findIndex(item => item.id === id))
  },
  deleteAfterModuleBreadcrumbs (state, id) {
    const index = _.findIndex(state.moduleBreadcrumbs, { id })
    index >= 0 && state.moduleBreadcrumbs.splice(index + 1)
  },

  clearWidgetBreadcrumbs (state) {
    state.widgetBreadcrumbs = []
  },
  setWidgetBreadcrumbs (state, breads) {
    state.widgetBreadcrumbs = breads
  },
  pushWidgetBreadcrumb (state, bread) {
    if (!state.widgetBreadcrumbs.some(b => b.id === bread.id)) {
      state.widgetBreadcrumbs.push(bread)
    }
  },
  insertWidgetBreadcrumb (state, { id, bread }) {
    const indexOfItem = state.widgetBreadcrumbs.findIndex(item => item.id === id)
    state.widgetBreadcrumbs.splice(indexOfItem, 0, bread)
  },
  updateWidgetBreadcrumb (state, bread) {
    const indexOfItem = _.find(state.widgetBreadcrumbs, { id: bread.id })
    if (indexOfItem >= 0) {
      Vue.set(state.widgetBreadcrumbs, indexOfItem, bread)
    }
  },
  deleteWidgetBreadcrumb (state, id) {
    Vue.delete(state.widgetBreadcrumbs, state.widgetBreadcrumbs.findIndex(item => item.id === id))
  },
  deleteAfterWidgetBreadcrumbs (state, id) {
    const index = _.findIndex(state.widgetBreadcrumbs, { id })
    index >= 0 && state.widgetBreadcrumbs.splice(index + 1)
  },

  initSwitcherIconColor (state) {
    _(state.moduleBreadcrumbs).forEach(b => b.switcher && (b.switcher.color = 'grey'))
  },
  setSwitcherIconColor (state, { id, color = 'primary' }) {
    const bread = _.find(state.moduleBreadcrumbs, b => b.id === id)
    bread && bread.switcher && (bread.switcher.color = color)
  }
}
