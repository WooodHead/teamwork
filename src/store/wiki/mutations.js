import Vue from 'vue'
export default {
  setSort (state, value) {
    state.sort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setPage (state, page) {
    Object.assign(state.page, page)
  },
  setListWikis (state, wikis) {
    const newWikis = _.differenceBy(wikis, state.listWikis, 'id')
    state.listWikis.push(...newWikis)
  },
  emptyWikis (state) {
    state.listWikis = []
    state.page = {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    }
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },

  // 增删改时要同时更新list,select,view的数据
  addWiki (state, wiki) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.wikis, r => r.id === wiki.id)
    index < 0 && state.wikis.unshift(wiki)

    index = _.findIndex(state.listWikis, function (o) { return o.id === wiki.id })
    index < 0 && state.listWikis.unshift(wiki)

    index = _.findIndex(state.selectWikis.all, r => r.id === wiki.id)
    index < 0 && state.selectWikis.all.unshift(wiki)
    state.selectWikis[wiki.id] = wiki
  },

  updateWiki (state, wiki) {
    const id = wiki.id
    let old = _.find(state.wikis, { id })
    old ? Object.assign(old, wiki) : state.wikis.push(wiki)

    old = _.find(state.listWikis, { id })
    old ? Object.assign(old, wiki) : state.listWikis.push(wiki)

    old = _.find(state.selectWikis.all, { id })
    old ? Object.assign(old, wiki) : state.selectWikis.all.push(wiki)
    state.selectWikis[id] = wiki
  },

  updateWikiField (state, { id, fieldName, value }) {
    let wiki = _.find(state.wikis, { id })
    wiki && (wiki[fieldName] = value)

    wiki = _.find(state.listWikis, { id })
    wiki && (wiki[fieldName] = value)

    wiki = _.find(state.selectWikis.all, { id })
    wiki && (wiki[fieldName] = value)
    state.selectWikis[id][fieldName] = value
  },

  deleteWiki (state, id) {
    let wiki = _.filter(state.wikis, { id })
    state.wikisInTrash.push(wiki[0])
    Vue.delete(state.wikis, _.findIndex(state.wikis, { id }))

    Vue.delete(state.listWikis, _.findIndex(state.listWikis, { id }))

    Vue.delete(state.selectWikis.all, _.findIndex(state.selectWikis.all, { id }))
    Vue.delete(state.selectWikis, id)
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setSearch (state, payload) {
    state.search = payload
  },
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  updateSelectWikis (state, wikis) {
    state.selectWikis = { ...state.selectWikis, ..._.keyBy(wikis, 'id') }
    state.selectWikis.all = wikis
  },
  updateInMembers (state, payload) {
    let obj = {}
    obj[payload.key] = payload.value
    state.inMembers = Object.assign({}, state.inMembers, obj)
  },

  /** ------------------废纸篓相关---------------------- */
  /**
   * 解删除知识空间
   * @param {*} state
   * @param {*} ID 类别ID
   */
  undeleteWikiInTrash (state, id) {
    state.wikisInTrash = state.wikisInTrash.filter(a => a.id !== id)
  },
  // 废纸篓中新增数据
  addWikisInTrash (state, wikisInTrash) {
    let list = _.unionBy(wikisInTrash, 'id')
    const ids = []
    _(list).each(function (wiki) {
      ids.push(wiki.id)
    })
    state.wikisInTrash = state.wikisInTrash.filter(a => !ids.includes(a.id))
    state.wikisInTrash.push(...list)
  }
}
