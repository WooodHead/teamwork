export default {
  menus: (state, getter, rootState, rootGetters) => {
    const route = this.$router.currentRoute
    const category = route.params.category || route.name
    const id = route.params.id || 0
    const model = rootGetters[`${category}/${category}`](+id)
    routeMenu = {
      project: [
        getter.edit({ category, id: model.id, isTemplate: model.isTemplate }),
        getter.delete({ category, id: model.id, status: model.status }),
        getter.settings({ category, id: model.id })
      ]
    }
    return routeMenu[route.name]
  }
}
