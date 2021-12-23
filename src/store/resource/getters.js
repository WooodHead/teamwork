export default {
  // 获取一个资源类型
  category: (state) => (name) => {
    return _.keyBy(state.categorys, 'name')[name]
  },
  // 获取资源类型的工具包（返回工具包name数组）
  widgets: (_state, getters) => (categoryName) => {
    let category = getters.category(categoryName)
    if (category) {
      let widgets = _.map(category.widgets, item => item).filter(w => !w.deleted && w.default)
      return _.map(_.orderBy(widgets, ['order']), w => w.value)
    } else {
      return []
    }
  },
  // 获取资源工具包，返回形如chat:{setting的value,order:1}，用于插入资源（比如项目）model的widget
  initWidgets: (_state, getters) => (categoryName) => {
    let category = getters.category(categoryName)
    if (category) {
      let widgetObj = {},
        widgets = _.map(_.orderBy(_.values(category.widgets).filter(w => !w.deleted && w.default), ['order']), w => w.value)
      _.forEach(widgets, r => {
        widgetObj[r] = _.assign({}, category.widgets[r].setting, { order: category.widgets[r].order })
      })
      return widgetObj
    } else {
      return {}
    }
  },
  // 获取一个资源项
  item: (state, _getters, _rootState, rootGetters) => (category, id) => {
    const categorys = _.keyBy(state.categorys, 'name')
    if (categorys[category].custom) {
      return _.find(state.items[category], p => { return p.id === id })
    } else {
      return rootGetters[`${category}/${category}`](+id)
    }
  },
  /** 前端筛选模式 */
  itemsFiltered: state => (category = state.selectedCategory.name) => {
    const search = state.search
    if (search) {
      return _.filter(state.items[category], item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.notes.toLowerCase().includes(search.toLowerCase()))
    } else {
      return state.items[category]
    }
  },
  itemsSorted: (state, getters) => category => {
    return getters.itemsFiltered(category).sort((a, b) => {
      if (a[state.sort] < b[state.sort]) return -1
      return 1
    })
  },
  // 获取一个资源列表
  items: (_state, getters) => category => {
    return getters.itemsSorted(category)
  },

  //* **************资源关联关系 start*************** */
  // 获取关联关系数据
  resourceRelations: state => ({ category1, id1, category2, type = 'correlation' } = {}) => {
    let resourceRelations = {}
    if (type === 'correlation') {
      resourceRelations = _.filter(state.resourceRelations, p => { return p.type === type && ((p.category1 === category1 && p.id1 === id1 && p.category2 === category2) || (p.category2 === category1 && p.id2 === id1 && p.category1 === category2)) })
    } else {
      resourceRelations = _.filter(state.resourceRelations, p => { return p.type === type && (p.category1 === category1 && p.id1 === id1 && p.category2 === category2) })
    }
    // selectIds列赋值（因为查询的条件不一致导致查出两条相同的数据，state只会存一条，后台返回的selectId不准确，所以要给selectId重新赋值）
    _.forEach(resourceRelations, m => {
      (m.category1 === category1 && m.id1 === id1) ? m.selectId = _.cloneDeep(m.id2) : m.selectId = _.cloneDeep(m.id1)
    })
    // 如果需要selectIds,需要自己筛选selectId字段
    return resourceRelations
  },
  // 获取资源数据 category:即category2
  categoryRelations: state => ({ category, ids } = {}) => {
    let categoryRelations = _.filter(state.categoryRelations[category], p => { return _.indexOf(ids, p.id) >= 0 })
    if (categoryRelations.length > 0) {
      _.sortBy(categoryRelations, ['id'])
    }
    return categoryRelations
  },
  // 不能勾选的资源关系数据。可用于继承关系的选择界面
  disableResourceRelation: (state) => ({ category, id, type = 'inherit' } = {}) => {
    return _.find(state.resourceRelations, p => { return p.category2 === category && p.id2 === id && p.type === type })
  },
  // 资源关系对象
  resourceRelation: (state) => (id) => {
    return _.find(state.resourceRelations, { id }) || {}
  }
  //* **************资源关联关系 end*************** */

}
