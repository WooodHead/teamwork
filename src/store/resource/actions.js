import { uid } from 'quasar'
import { i18n } from '../../boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Model from './model'
import Project from '../project/model'
import Team from '../team/model'
import ProductDev from '../product-dev/model'
import Product from '../product/model'
import Customer from '../customer/model'
import Person from '../person/model'
const url = {
  GetModel: 'resourceItems/GetResourceModel',
  getCategory: 'resourceCategorys/getModelByCode',
  addCategory: 'resourceCategorys/add',
  updateCategory: 'resourceCategorys/update',
  loadCategorys: 'resourceCategorys/getlist'
}
const visitedApi = []
export default {
  loadResourceItem ({ state, commit }, { objectID, objectType }) {
    return request.get(url.GetModel, { objectID, objectType })
      .then(res => {
        return Model.Resource.from(res.data)
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadCategory ({ state, commit }, name) {
    let category = state.categorys[name]
    if (!category) {
      return request.get(url.getCategory, { code: name })
        .then(res => {
          let from = Model.Category.from(res.data)
          commit('setCategorys', [from])
          return from
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return category
    }
  },
  loadCategorys ({ state, commit }) {
    if (!visitedApi.includes(url.loadCategorys)) {
      visitedApi.push(url.loadCategorys)
      return request.get(url.loadCategorys, {}).then(res => {
        let categorys = Model.Category.from(res.data)
        commit('setCategorys', categorys)
        return state.categorys
      })
    } else {
      return state.categorys
    }
  },
  addCategory ({ commit }, category) {
    let to = Model.Category.to(category)
    return request.post(url.addCategory, to)
      .then(res => {
        let from = Model.Category.from(res.data)
        commit('setCategorys', [from])
        return from
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  updateCategory ({ commit }, category) {
    let to = Model.Category.to(category)
    return request.put(url.updateCategory, to)
      .then(res => {
        let from = Model.Category.from(res.data)
        commit('updateCategory', from)
        return from
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  deleteACategory ({ commit }, category) {
    commit('deleteACategory', category)
  },
  loadCustomCategoryOfItem ({ state, commit }, { category, id }) {
    let item = _.find(state.items, res => (res.category === category && res.id === id))
    if (!item) {
      return request.get('resourceItems/getModel', { id: id }).then(res => {
        let item = Model.Resource.from(res.data)
        commit('setCategoryOfItems', { category: item.category, items: [item] })
        return item
      })
    }
  },
  /**
   * ???????????????????????????????????????????????????
   * ????????????????????????????????????????????????
   * @param {*} { state, commit }
   * @param {boolean} [byPage=true] ??????????????????
   */
  loadCustomCategoryOfItems ({ state, commit }, {
    query,
    filter,
    sort,
    search,
    fields = 'List',
    limit = state.page.limit,
    offset = state.page.offset,
    category = state.selectedCategory.name,
    byPage = true } = {}) {
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        sort: sort,
        fields: fields
      }
      url = 'resourceItems/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'resourceItems/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let items = Model.Resource.from(res.data)
        byPage && commit('updatePage', {
          offset: page.offset + items.length,
          nextPageToken: res.nextPageToken
        })
        commit('setCategoryOfItems', { category: category, items })
        return items
      })
  },
  addACategoryOfItem ({ state, commit }, item) {
    item.id = uid()
    const category = state.selectedCategory
    commit('addACategoryOfItem', { category, item })
  },
  updateACategoryOfItem ({ state, commit }, item) {
    const category = state.selectedCategory
    commit('updateACategoryOfItem', { category, item })
  },
  deleteACategoryOfItem ({ state, commit }, itemId) {
    const category = state.selectedCategory
    commit('deleteACategoryOfItem', { category, itemId })
  },

  //* **************?????????????????? start*************** */
  /**
   * ??????????????????.
   *  ????????????1????????????category1???id1??????category2???????????????.??????fields???select?????????3??????????????????????????????
   * 2??????????????????????????????????????????????????????????????????action????????????toCategoryList?????????????????????????????????????????????????????????
   * 3???type????????????inherit?????????????????????A??????B???B??????C?????????B???????????????????????????????????????A???C,???B?????????????????????
   * 4???res???????????????????????????????????????????????????????????????????????????
   * 5????????????????????????????????????resource???state ???resourceType?????????????????????????????????????????????????????????
   * @param {*} category1 ????????????1
   * @param {*} id1 ????????????Id1??????category1?????????
   * @param {*} category2 ???????????????????????????2
   */
  loadResourceRelations ({ state, commit }, { category1, id1, category2, type = 'correlation', fields = 'List' }) {
    const api = `resourcerelations/getlist/${category1}${id1}${category2}${type}${fields}`
    if (!visitedApi.includes(api)) {
      visitedApi.push(api)
      const query = [
        { Key: 'Category1', Value: category1, Oper: 'eq' },
        'and',
        { Key: 'Id1', Value: id1, Oper: 'eq' },
        'and',
        { Key: 'Category2', Value: category2, Oper: 'eq' },
        'or',
        [
          { Key: 'Category2', Value: category1, Oper: 'eq' },
          'and',
          { Key: 'Id2', Value: id1, Oper: 'eq' },
          'and',
          { Key: 'Category1', Value: category2, Oper: 'eq' }
        ],
        'and',
        { Key: 'Type', Value: type, Oper: 'eq' }
      ]
      return request.get('resourcerelations/getlist', { query: JSON.stringify(query), fields: fields })
        .then(res => {
          let categoryData = [], relationData = []
          if (res && res.data && res.data.RelationData.length > 0) {
            relationData = Model.ResourceRelation.from(res.data.RelationData)
            commit('loadResourceRelations', relationData)
          }
          if (res && res.data && res.data.CategoryData.length > 0) {
            categoryData = toCategoryList(category2, res.data.CategoryData)
            commit('loadCategoryRelations', { category: category2, categoryRelations: categoryData })
          }
          return { relationData: relationData, categoryData: categoryData }
        })
        .catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return { relationData: state.resourceRelations, categoryData: state.categoryRelations[category2] }
    }
  },
  // ????????????????????????
  // ?????????????????????A?????????B???Category1?????????A???Id1?????????A1???Category2???B
  addResourceRelations ({ state, commit }, resourceRelations) {
    let models = Model.ResourceRelation.to(resourceRelations)
    return request.post('resourcerelations/addbatch', models)
      .then(res => {
        let categoryData = [], relationData = []
        if (res && res.data && res.data.RelationData.length > 0) {
          relationData = Model.ResourceRelation.from(res.data.RelationData)
          let relationModel = resourceRelations[0]
          commit('addResourceRelations', { category1: relationModel.category1, id1: +relationModel.id1, category2: relationModel.category2, type: relationModel.type, relations: relationData })
        }
        if (res && res.data && res.data.CategoryData.length > 0) {
          categoryData = toCategoryList(resourceRelations[0].category2, res.data.CategoryData)
          commit('loadCategoryRelations', { category: resourceRelations[0].category2, categoryRelations: categoryData })
        }
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  addRelationsWithoutDel ({ commit }, relations) {
    let models = Model.ResourceRelation.to(relations)
    return request.post('resourcerelations/addbatchwithoutdel', models)
      .then(res => {
        let categoryData = [], relationData = []
        let relationModel = relations[0]
        if (res && res.data && res.data.RelationData.length > 0) {
          relationData = Model.ResourceRelation.from(res.data.RelationData)
          commit('addResourceRelations', { category1: relationModel.category1, id1: +relationModel.id1, category2: relationModel.category2, type: relationModel.type, relations: relationData })
        }
        if (res && res.data && res.data.CategoryData.length > 0) {
          categoryData = toCategoryList(relationModel.category2, res.data.CategoryData)
          commit('loadCategoryRelations', { category: relationModel.category2, categoryRelations: categoryData })
        }
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // ?????????????????????category???objectId????????????????????????
  deleteResourceRelations ({ state, commit }, { category1, objectId, category2, type }) {
    return request.put('resourcerelations/deletebatch', { Category1: category1, ObjectID: objectId, Category2: category2, Type: type })
      .then((res) => {
        commit('deleteResourceRelations', { category1: category1, id1: objectId, category2: category2, type: type })
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // options { category1, id1, category2, id2, type }
  deleteRelationByOptions ({ commit }, options) {
    return request.put('resourcerelations/delete', options)
      .then((res) => {
        commit('deleteResourceRelation', options)
        return res.data
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(error.userMessage))
        return false
      })
  },
  // ????????????????????????path
  updateRelation ({ state, commit }, payload) {
    const endModel = Model.ResourceRelation.to(payload)
    return request.put('resourcerelations/update', endModel)
      .then(res => {
        const model = Model.ResourceRelation.from(res)
        commit('updateRelation', model)
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
  //* **************?????????????????? end*************** */
}

// ??????????????????????????????????????????????????????
function toCategoryList (category, categoryData) {
  let categoryList = {}
  switch (category) {
    case 'project':
      categoryList = Project.from(categoryData)
      break
    case 'team':
      categoryList = Team.from(categoryData)
      break
    case 'productDev':
      categoryList = ProductDev.from(categoryData)
      break
    case 'product':
    case 'sample':
      categoryList = Product.from(categoryData)
      break
    case 'customer':
      categoryList = Customer.from(categoryData)
      break
    case 'user':
      categoryList = Person.from(categoryData)
      break
    default:
      break
  }
  return categoryList
}
