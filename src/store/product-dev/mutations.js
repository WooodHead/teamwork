import Vue from 'vue'
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
  setListProductDevs (state, productDevs) {
    const newProductDevs = _.differenceBy(productDevs, state.listProductDevs, 'id')
    state.listProductDevs.push(...newProductDevs)
  },
  emptyProductDevs (state) {
    state.listProductDevs = []
  },
  setListStyle (state, value) {
    state.listStyle = value
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },

  // 增删改时要同时更新list,select,view的数据
  addProductDev (state, productDev) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.productDevs, r => r.id === productDev.id)
    index < 0 && state.productDevs.unshift(productDev)

    index = _.findIndex(state.listProductDevs, function (o) { return o.id === productDev.id })
    index < 0 && state.listProductDevs.unshift(productDev)

    index = _.findIndex(state.selectProductDevs.all, r => r.id === productDev.id)
    index < 0 && state.selectProductDevs.all.unshift(productDev)
    state.selectProductDevs[productDev.id] = productDev
  },
  updateProductDev (state, productDev) {
    const id = productDev.id
    let old = _.find(state.productDevs, { id })
    old ? Object.assign(old, productDev) : state.productDevs.push(productDev)

    old = _.find(state.listProductDevs, { id })
    old ? Object.assign(old, productDev) : state.listProductDevs.push(productDev)

    old = _.find(state.selectProductDevs.all, { id })
    old ? Object.assign(old, productDev) : state.selectProductDevs.all.push(productDev)
    state.selectProductDevs[id] = productDev
  },
  updateProductDevField (state, { id, fieldName, value }) {
    let productDev = _.find(state.productDevs, { id })
    productDev && (productDev[fieldName] = value)

    productDev = _.find(state.listProductDevs, { id })
    productDev && (productDev[fieldName] = value)

    productDev = _.find(state.selectProductDevs.all, { id })
    productDev && (productDev[fieldName] = value)
    state.selectProductDevs[id][fieldName] = value
  },
  deleteProductDev (state, id) {
    Vue.delete(state.productDevs, _.findIndex(state.productDevs, { id }))

    Vue.delete(state.listProductDevs, _.findIndex(state.listProductDevs, { id }))

    Vue.delete(state.selectProductDevs.all, _.findIndex(state.selectProductDevs.all, { id }))
    Vue.delete(state.selectProductDevs, id)
  },

  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  updateSelectProductDevs (state, productDevs) {
    state.selectProductDevs = { ...state.selectProductDevs, ..._.keyBy(productDevs, 'id') }
    state.selectProductDevs.all = productDevs
  },
  // 废纸篓（产品研发）
  addProductDevTrash (state, productDevs) {
    const newProductDevs = _.differenceBy(productDevs, state.productDevsInTrash, 'id')
    state.productDevsInTrash.push(...newProductDevs)
  },
  undeleteProductDevInTrash (state, id) {
    state.productDevsInTrash = state.productDevsInTrash.filter(a => a.id !== id)
  }
}
