import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Product from './model'
import ResourceModel from '../resource/model'

const url = {
  model: 'products/getmodel',
  list: 'products/getlist',
  pageList: 'products/getpagelist',
  childList: 'products/getchildlist',
  count: 'products/getcount',
  add: 'products/add',
  update: 'products/update',
  updateFields: 'products/updatefields',
  move: 'products/move',
  delete: 'products/delete',
  archive: 'products/archive',
  unarchive: 'products/unarchive',
  batchAddHistory: 'products/batchaddhistory',
  matchByProcess: 'products/matchbyprocess',
  reverseByProcess: 'products/reversebyprocess',
  relationsWithProductsById: 'products/pathrelationswithproducts'
}

export default {
  /**
   * load products
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {boolean} [byPage] 分页
   * @param {number} [limit] 每页记录条数
   */
  loadProducts ({ state, commit },
    { query,
      filter,
      sort = '',
      search,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit } = {}) {
    const offset = state.page.offset
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    byPage && Object.assign(condition, { limit, offset })
    return request.get(byPage ? url.pageList : url.list, condition)
      .then(res => {
        const products = Product.from(res.data)
        byPage && commit('updatePage', {
          offset: offset + products.length,
          nextPageToken: res.nextPageToken
        })
        commit('setProducts', products)
        return products
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   * 获得一类产品树（不包含叶子节点）
   * @param {*} param0
   * @param {*} classification
   */
  loadProductTree ({ state, commit }, classification = state.currentProductClassification) {
    if (state.productTree[classification].length) {
      return state.productTree[classification]
    }
    const leafLevel = state.classifications.find(c => c.name === classification).leafLevel
    const query = [
      { Key: 'Classification', Value: classification, Oper: 'eq' },
      'and',
      { Key: 'Level', Value: leafLevel, Oper: 'lt' }
    ]
    request.get(url.list, { query: JSON.stringify(query), fields: 'Tree' })
      .then(res => {
        const products = Product.from(res.data)
        commit('setProductTree', products)
        return products
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   *  获得子产品数组
   * @param {} param0
   * @param {*} id
   */
  loadProductChildren ({ state, commit }, id) {
    request.get(url.childList, { id })
      .then(res => {
        const products = Product.from(res.data)
        commit('setProducts', products)
        return products
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   * 获取选择的产品
   * @param {*} param0
   */
  loadSelectProducts ({ state, commit }) {
    return []
  },
  /**
   * 获取首页快捷链接
   * @param {*} { state, commit }
   * @returns
   */
  loadQuickLinks ({ state, commit }) {
    const condition = {
      query: JSON.stringify([{ Key: 'Level', Value: 1, Oper: 'eq' }])
    }
    let products = []
    return state.quickLinksLoaded
      ? state.products.filter(p => p.level === 1)
      : request.get(url.list, condition)
        .then(res => {
          products = Product.from(res.data)
          commit('setProducts', products)
          commit('setQuickLinksLoaded', true)
          return products
        })
        .catch(error => {
          error.userMessage && showWarningMessage(error.userMessage)
          return []
        })
  },
  /**
   * 获取产品对象
   * @param {Object} param0 --
   * @param {Number} id 产品id
   */
  loadProduct ({ state, commit }, id) {
    let product = _.find(state.productDetails, { id })
    if (!product) {
      return request.get(url.model, { id })
        .then(res => {
          product = Product.from(res.data)
          commit('setProducts', [product])
          commit('setProductDetails', [product])
          return product
        })
    }
    return product
  },
  /**
   * 获取产品对象
   * @param {Object} param0 --
   * @param {Number} id 产品id
   */
  loadProductAccessoryIds ({ state, commit, dispatch, rootGetters }, id) {
    return dispatch('resource/loadResourceRelations', {
      category1: 'product',
      id1: id,
      category2: 'product',
      fields: 'Select'
    }, { root: true }).then(res => {
      return _.map(rootGetters['resource/resourceRelations']({
        category1: 'product',
        id1: id,
        category2: 'product'
      }), 'selectId')
    })
  },
  /**
   * 新建产品
   * @param {Object} param0 --
   * @param {Object} product 新建的产品对象
   */
  addProduct ({ state, commit, dispatch }, product) {
    const endModel = Product.to(product)
    return request.post('products/add', endModel)
      .then(res => {
        const model = Product.from(res.data)
        commit('addProduct', model)
        // 如果是复制，同步产品文档
        if (product.id > 0) {
          dispatch('document/loadDocument', model.docId, { root: true })
        }
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },
  /**
   * 编辑产品
   * @param {Object} param0 --
   * @param {Object} product 编辑后的产品对象
   */
  updateProduct ({ state, commit, dispatch, rootGetters }, product) {
    const endModel = Product.to(product)
    return request.put(url.update, endModel)
      .then(res => {
        const model = Product.from(res.data)

        // 如果名称或父级id有变化，同步变更产品文档
        let oldModel = _.find(state.products, { id: product.id })
        // 产品名称变更
        if (product.title !== oldModel.title) {
          let doc = rootGetters['document/productDocument'](product.id)
          if (doc) {
            doc.title = product.title
            commit('document/updateDocument', doc, { root: true })
          }
        }
        // 产品所属父级变更
        if (product.parentId !== oldModel.parentId) {
          model.docId && model.targetDocId &&
            dispatch('document/moveDocument', { ID: model.docId, To: { TargetID: model.targetDocId } }, { root: true })
        }

        commit('updateProduct', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },
  /**
   * 更新产品某个字段
   * @param {Object} param0 --
   * @param {Number} payload 待更新对象（product的子集），包含产品id
   */
  updateProductField ({ state, commit }, payload) {
    return request.put(url.updateFields, payload)
      .then(res => {
        const model = Product.from(res.data)
        commit('updateProduct', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 移动产品
   * @param {Object} param0 --
   * @param {Object} payload 移动及被移动的产品id信息
   * @returns
   */
  moveProduct ({ state, commit, dispatch }, payload) {
    // 校验参数的合法性
    let sourceId = payload.ID
    let targetId = payload.To.TargetID
    let sourceItem = state.products.find(p => p.id === sourceId)
    if (targetId > 0) {
      return request.put(url.move, { sourceId, targetId })
        .then(res => {
          const model = Product.from(res.data)
          commit('updateProduct', model)

          // 产品文档同步移动
          model.docId && model.targetDocId &&
            dispatch('document/moveDocument', { ID: model.docId, To: { TargetID: model.targetDocId } }, { root: true })

          return model
        })
    } else {
      // 已在ProductMove组件排除无效移动（eg.移动到自身父级上），且只能移动到叶子节点的父级
      return { error: targetId === sourceItem.parentId ? '' : '请选择具体的产品直属分类' }
    }
  },
  /**
   * 删除一个产品
   * @param {Object} param0 --
   * @param {Number} id 产品id
   */
  deleteProduct ({ state, commit }, id) {
    request.delete(url.delete, { id })
      .then(res => {
        commit('deleteProduct', id)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 归档
   * @param {*} ID ID
   */
  archiveProduct ({ commit }, id) {
    return request.get(url.archive, { id })
      .then(res => {
        const model = Product.from(res.data)
        commit('updateProduct', model)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 解档一个
   * @param {*} ID ID
   */
  unarchiveProduct ({ commit }, id) {
    request.get(url.unarchive, { id })
      .then(res => {
        const model = Product.from(res.data)
        commit('updateProduct', model)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 获取产品历史记录
   * @param {*} id 产品id
   */
  loadProductHistory ({ state, commit }, id) {
    return request.get(url.model, { id, fields: 'History' })
      .then(res => {
        return JSON.parse(res.data.History)
      }).catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },
  /**
   * 添加产品历史记录
   *
   * @param {*} { state, commit }
   * @param {*} historys 待插入历史记录数据
   * @param {*} id 产品id
   * @returns
   */
  batchAddHistory ({ state, commit }, { historys, id }) {
    // 处理Extra.OldContent中包含的英文单引号，以免引起mysql语句错误
    // 处理Extra.OldContent中包含的换行符，以免引起JSON.parse错误
    _.forEach(historys, h => {
      h.Extra.OldContent !== void 0 && (h.Extra.OldContent = (h.Extra.OldContent + '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\'\'')
        .replace(/"/g, '\\"')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t'))
    })
    let data = { historys: historys, id }
    return request.put(url.batchAddHistory, JSON.stringify(data))
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 基于工艺参数筛选机床
   * @param {*} { state, commit }
   * @param {*} process 工艺参数
   * @returns
   */
  matchByProcess ({ state, commit }, process) {
    return request.get(url.matchByProcess, { process: JSON.stringify(process) })
      .then(res => {
        state.process = _.cloneDeep(process)
        state.productMatchs = Product.from(res.data)
        return state.productMatchs
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 基于工艺参数反向校验单台机床
   * @param {*} { state, commit }
   * @param {*} { process, modelId, accessoryIds }
   * @returns
   */
  reverseByProcess ({ state, commit }, { process, modelId, accessoryIds }) {
    return request.get(url.reverseByProcess, { process: JSON.stringify(process), modelId, accessoryIds })
      .then(res => {
        state.productCheck = res.data
        return state.productCheck
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 根据产品id，获取所有关联产品
   * @param {*} { state }
   * @param {*} id productId
   */
  loadPathRelationsWithProducts ({ state, commit }, { id, category1, category2 }) {
    return request.get(url.relationsWithProductsById, { id, category1, category2 })
      .then(res => {
        let relations = []
        let products = []
        if (res.data) {
          relations = ResourceModel.ResourceRelation.from(res.data.dtRelation)
          products = Product.from(res.data.dtProduct)
          commit('setProducts', products)
        }
        return { relations, products }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 根据路由组装面包屑,主要匹配以下路由
   * [product/:id] [product/:id/:openType]
   * @param {*} { state, commit, dispatch }
   */
  setProductBreadcrumbs ({ state, commit, dispatch }) {
    commit('breadcrumbs/clearBreadcrumbs', '', { root: true })

    let breadcrumbs = []
    let arrPath = this.$router.currentRoute.path.split('/')

    // 一级面包屑【产品选型】
    breadcrumbs.push({
      id: 'productHome',
      title: '产品选型',
      to: { name: 'productHome' }
    })

    let param = arrPath[2]
    if (!isNaN(param)) {
      // 如果是产品详情页
      +param > 0 && dispatch('loadProduct', +param).then(p => {
        // 父级产品集
        p.parents.forEach(pp => {
          breadcrumbs.push({
            id: `productDetail${pp.id}`,
            title: pp.title,
            to: { name: 'productDetail', params: { id: pp.id } }
          })
        })

        // 如果有编辑等参数
        if (_.intersection(arrPath, ['add', 'edit', 'move', 'history', 'document']).length) {
          breadcrumbs.push({
            id: 'productItem',
            title: p.title,
            to: { name: 'productDetail', params: { id: p.id } }
          })
        }
      })
    } else {
      // 选型面包屑
      if (param === 'selection') {
        if (arrPath.length > 3) {
          breadcrumbs.push({
            id: 'myConfigList',
            title: '我的配置单',
            to: { name: 'productSelection' }
          })
          let curSelectionId = arrPath.length === 4
            ? this.$router.currentRoute.params.id : this.$router.currentRoute.params.selectionId
          !isNaN(curSelectionId) &&
            dispatch('productSelection/loadProductSelection', curSelectionId, { root: true })
              .then(res => {
                if (arrPath.includes('edit')) {
                  breadcrumbs.push({
                    id: 'productSelectionItem',
                    title: res.title,
                    to: { name: 'productSelectionDetail', params: { id: curSelectionId } }
                  })
                }
                if (res.archived) {
                  breadcrumbs.push({
                    id: 'archivedProductSelectionItem',
                    title: '归档区',
                    to: { name: 'archivedProductSelection' }
                  })
                }
              })
        }
      }
    }
    commit('breadcrumbs/setModuleBreadcrumbs', breadcrumbs, { root: true })
  }
}
