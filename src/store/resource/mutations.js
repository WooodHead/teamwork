
import Vue from 'vue'
export default {
  setSearch (state, value) {
    state.search = value
  },
  setSort (state, value) {
    state.sort = value
  },
  setByPage (state, value) {
    state.byPage = value
  },
  initPage (state) {
    state.page = {
      ...state.page,
      ...{
        offset: 0,
        total: 0
      }
    }
  },
  updatePage (state, page) {
    if (page.offset > page.total) {
      page.offset = page.total - state.page.limit
    }
    Object.assign(state.page, page)
  },
  setAllListStyle (state, payload) {
    let that = this
    // 注意：builtInModules未包含招聘模块job,interviewer,recruitPlan
    // 所以偏好设置目前对招聘模块无效 20210326
    let allCategorys = state.builtInModules
    _.forEach(allCategorys, category => {
      that._mutations[`${category}/setListStyle`] &&
        that.commit(`${category}/setListStyle`, payload, { root: true })
    })
  },
  setSelectedCategory (state, category) {
    state.selectedCategory = category
  },
  setSelectedItem (state, item) {
    state.selectedItem = item
  },
  setTitle (state, title) {
    state.title = title
  },
  setCategorys (state, categorys) {
    for (const cty of categorys) {
      Vue.set(state.categorys, cty.name, cty)
    }
  },
  deleteACategory (state, category) {
    state.categorys[category] = undefined
  },
  setCategoryOfItems (state, { category, items }) {
    const newItems = _.differenceBy(items, state.items[category], 'id')
    state.items[category].push(...newItems)
  },
  addACategoryOfItem (state, { category, item }) {
    state.items[category].push(item)
  },
  updateACategoryOfItem (state, { category, item }) {
    Object.assign(state.items[category].find(c => c.id === item.id), item)
  },
  deleteACategoryOfItem (state, { category, itemId }) {
    Vue.delete(state.items[category], state.items[category].findIndex(c => c.id === item.id))
  },

  //* **************资源关联关系 start*************** */
  // 获取关系数据
  loadResourceRelations (state, relations) {
    state.resourceRelations.push(..._.differenceBy(relations, state.resourceRelations, 'id'))
  },
  addResourceRelations (state, payload) {
    // 原理：将原category1对应的关系全部删掉，再存入
    // 需要删除的
    let oldRelation = _.filter(state.resourceRelations, p => { return p.type === payload.type && ((p.category1 === payload.category1 && p.id1 === payload.id1 && p.category2 === payload.category2) || (p.category2 === payload.category1 && p.id2 === payload.id1 && p.category1 === payload.category2)) })
    // 差集。去除想要删除的
    state.resourceRelations = _.differenceBy(state.resourceRelations, oldRelation, 'id')
    state.resourceRelations.push(..._.differenceBy(payload.relations, state.resourceRelations, 'id'))
  },
  deleteResourceRelations (state, payload) {
    let oldRelation = _.filter(state.resourceRelations, p => { return p.type === payload.type && ((p.category1 === payload.category1 && p.id1 === payload.id1 && p.category2 === payload.category2) || (p.category2 === payload.category1 && p.id2 === payload.id1 && p.category1 === payload.category2)) })
    state.resourceRelations = _.differenceBy(state.resourceRelations, oldRelation, 'id')
  },
  deleteResourceRelation (state, payload) {
    let oldRelations = _.filter(state.resourceRelations, p => { return p.type === payload.type && ((p.category1 === payload.category1 && p.id1 === payload.id1 && p.category2 === payload.category2 && p.id2 === payload.id2) || (p.category2 === payload.category1 && p.id2 === payload.id1 && p.category1 === payload.category2 && p.id1 === payload.id2)) })
    state.resourceRelations = _.differenceBy(state.resourceRelations, oldRelations, 'id')
  },
  loadCategoryRelations (state, { category, categoryRelations }) {
    let categoryValue = {}
    categoryValue[category] = categoryRelations
    if (state.categoryRelations[category]) {
      state.categoryRelations[category].push(..._.differenceBy(categoryRelations, state.categoryRelations[category], 'id'))
    } else {
      state.categoryRelations = Object.assign({}, state.categoryRelations, categoryValue)
    }
  },
  updateRelation (state, payload) {
    Object.assign(_.find(state.resourceRelations, { id: payload.id }), payload)
  },
  //* **************资源关联关系 end*************** */

  //* **************资源类型 start*************** */
  // 更新
  updateCategory (state, category) {
    Vue.set(state.categorys, category.name, category)
  }

  //* **************资源类型 end*************** */
}
