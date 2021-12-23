import Vue from 'vue'
export default {
  pushPublicLinks (state, links) {
    const newLink = _.differenceBy(links, state.publicLinks, 'id')
    state.publicLinks.push(...newLink)
  },
  updatePublicLink (state, link) {
    let index = _.findIndex(state.publicLinks, item => item.id === link.id)
    Vue.set(state.publicLinks, index, link)
  }
}
