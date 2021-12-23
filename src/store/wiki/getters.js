export default {
  menus: (state) => (isBookmark) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    return menus
  },

  editWikiAuth: (state) => (id) => {
    return state.inMembers.hasOwnProperty(id) && state.inMembers[id]
  },

  wiki: (state) => (id) => {
    return _.find(state.wikis, { id }) || {}
  },

  wikisSorted: (state) => {
    return state.listWikis.sort((a, b) => {
      if (a[state.sort] < b[state.sort]) return -1
      return 1
    })
  },

  wikis: (_state, getters) => {
    return getters.wikisSorted
  },
  
  // 废纸篓中的知识空间
  WikisInMyTrash: (state) => {
    let list = state.wikisInTrash
    list.map(item => {
      item.resourceType = 'wiki'
    })
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
