export default {
  menus: (state) => (isBookmark) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    return menus
  },
  manufacturers: (state) => {
    return state.manufacturers
  },

  /** 前端筛选模式 */
  manufacturersFiltered: state => {
    // 普通的条件搜索
    let listManufacturers = []
    const search = state.search
    const manufacturers = state.manufacturers
    // manufacturers = state.listPageType === 'myList'
    //     ? state.manufacturers.filter(a => _.indexOf(a.members.map(Number), LocalStorage.getItem('myself').id) >= 0)
    //     : state.manufacturers
    if (search) {
      listManufacturers = _.filter(manufacturers, manufacturer =>
        manufacturer.title.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      listManufacturers = state.manufacturers
    }

    // 多条件筛选
    let query = state.query
    if (query && query.length) {
      // 创建时间
      let fromDateList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toDateList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromDateList.length && toDateList.length) {
        listManufacturers = _.filter(listManufacturers, listTeam => new Date(listTeam.createTime).getTime() >= new Date(_.min(fromDateList)).getTime() &&
          new Date(listTeam.createTime).getTime() < new Date(_.max(toDateList)).getTime())
      }

      // 生产单位类型
      let manufacturerType = _.map(_.filter(query, q => q.name === 'classification'), 'value')
      if (manufacturerType.length) {
        listManufacturers = _.filter(listManufacturers, listManufacturer => manufacturerType.includes(listManufacturer.classification))
      }

      // 生产管控
      let _canControl = _.map(_.filter(query, q => q.name === 'canControl'), 'value')
      if (_canControl.length) {
        listManufacturers = _.filter(listManufacturers, listManufacturer => _canControl.includes(listManufacturer.canControl))
      }

      // 单位等级
      let _level = _.map(_.filter(query, q => q.name === 'level'), 'value')
      if (_level.length) {
        listManufacturers = _.filter(listManufacturers, listManufacturer => _level.includes(listManufacturer.level))
      }
    }
    return listManufacturers
  },

  selectManufacturers: state => {
    return _.values(state.selectManufacturers)
  },
  manufacturer: (state) => (id) => {
    id = Number(id)
    let model = _.find(state.manufacturers, c => {
      return c.id === +id
    })
    return model || {}
  },
  // 获取我的列表数据
  getAllList: (state, getters) => () => {
    return getters.manufacturersFiltered
  },
  /**
 *多条件初始化
 * @param {*} state
 * @returns
 */
  queryList: state => {
    return state.queryList
  },
  /**
  * 多条件检索
  * @param {*} state
  */
  query: state => {
    return state.query
  },
  /**
  * 检索
  * @param {*} state
  */
  search: state => {
    return state.search
  },

  currentCondition: (state, getters) => {
    const _allListQuery = [{ 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]

    // 多条件筛选
    let query = state.query
    if (query && query.length) {
      // 创建时间
      let fromDateList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.from)
      let toDateList = _.map(_.filter(query, q => q.name === 'createTime'), qf => qf.value.to)
      if (fromDateList.length && toDateList.length) {
        _allListQuery.push(...['and', { Key: 'CreateTime', Value: _.min(fromDateList), Oper: 'gt' }, 'and', { Key: 'CreateTime', Value: _.max(toDateList), Oper: 'lt' }])
      }

      let params = ['classification', 'canControl', 'level']
      params.forEach(param => {
        const paramValues = query.filter(p => p.name === param).map(pv => pv.value)
        if (paramValues.length > 0) {
          _allListQuery.push('and')
          _allListQuery.push({ Key: param, Value: paramValues.join(','), Oper: 'in' })
        }
      })
    }

    return {
      query: _allListQuery,
      sort: state.sort,
      order: state.order,
      search: state.search
    }
  }
}
