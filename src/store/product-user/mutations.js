export default {
  setOrder (state, value) {
    state.order = value
  },
  setSort (state, value) {
    state.sort = value
  },
  setSearch (state, value) {
    state.search = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  setQuery (state, value) {
    state.query = value
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setPage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setListProductUsers (state, productUsers) {
    const newProductUsers = _.differenceBy(productUsers, state.listProductUsers, 'id')
    state.listProductUsers.push(...newProductUsers)
  },
  emptyProductUsers (state) {
    state.listProductUsers = []
  },
  // 增删改时要同时更新list,select,view的数据
  addProductUser (state, productUser) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.productUsers, r => r.id === productUser.id)
    index < 0 && state.productUsers.unshift(productUser)

    index = _.findIndex(state.listProductUsers, function (o) { return o.id === productUser.id })
    index < 0 && state.listProductUsers.unshift(productUser)

    index = _.findIndex(state.selectProductUsers.all, r => r.id === productUser.id)
    index < 0 && state.selectProductUsers.all.unshift(productUser)
    state.selectProductUsers[productUser.id] = productUser
  }
}
