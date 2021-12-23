
import Vue from 'vue'
export default {
  setFields (state, value) {
    state.fields = value
  },
  setQuickLinksLoaded (state, value) {
    state.quickLinksLoaded = value
  },
  setInSelection (state, value) {
    state.inSelection = value
  },
  setShowProductTree (state, value) {
    state.showProductTree = value
  },
  setShowWorkPiece (state, value) {
    state.showWorkPiece = value
  },
  setSort (state, value) {
    state.sort = value
  },
  setSearch (state, value) {
    state.search = value
  },
  resetPage (state, value) {
    state.page = {
      offset: 0,
      limit: 10,
      nextPageToken: 0
    }
  },
  setByPage (state, value) {
    state.byPage = value
  },
  updatePage (state, page) {
    if (page.offset > page.total) {
      page.offset = page.total - state.page.limit
    }
    Object.assign(state.page, page)
  },
  setProducts (state, products) {
    const newProducts = _.differenceBy(products, state.products, 'id')
    state.products.push(...newProducts)
  },
  setProductDetails (state, products) {
    const newProducts = _.differenceBy(products, state.productDetails, 'id')
    state.productDetails.push(...newProducts)
  },
  addProduct (state, product) {
    state.products.push(product)
    state.productDetails.push(product)
  },
  updateProduct (state, product) {
    Object.assign(_.find(state.products, { id: product.id }), product)
    Object.assign(_.find(state.productDetails, { id: product.id }), product)
  },
  deleteProduct (state, id) {
    let curNode = _.find(state.products, { id })

    // 如果有子节点，删除该节点下的所有节点
    if (curNode.level < 3) {
      const subNodes = _.filter(state.products, p => new RegExp(`^${curNode.path},.*`).test(p.path))
      _.forEach(subNodes, n => {
        Vue.delete(state.products, _.findIndex(state.products, { id: n.id }))
      })
      const subNodeDetails = _.filter(state.productDetails, pd => new RegExp(`^${curNode.path},.*`).test(pd.path))
      _.forEach(subNodeDetails, n => {
        Vue.delete(state.productDetails, _.findIndex(state.productDetails, { id: n.id }))
      })
    }

    // 删除当前节点
    Vue.delete(state.products, _.findIndex(state.products, { id }))
    Vue.delete(state.productDetails, _.findIndex(state.productDetails, { id }))
  },
  // 选型相关
  setCheckAccessoryIds (state, value) {
    state.checkAccessoryIds = value
  },
  setCurrentProductClassification (state, value) {
    state.currentProductClassification = value
  },
  setProductTree (state, value) {
    state.productTree[state.currentProductClassification] = value
  }
}
