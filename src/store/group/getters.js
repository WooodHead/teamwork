export default {
  // 获取一个群组对象
  group: state => id => {
    return _.find(state.groups, p => { return p.id === id })
  },
  // 提供给外部的转换器
  groups: (_state, getters) => {
    return getters.groupsFiltered
  },
  /**
   * 前端筛选
   */
  groupsFiltered: state => {
    let search = state.search
    if (_.isObject(search)) {
      const groupIds = search.groupIds
      search = search.search
      return _.filter(_.values(state.groups), group =>
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        groupIds.includes(group.id)
      )
    } else {
      if (search) {
        return _.filter(_.values(state.groups), group =>
          group.name.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return _.values(state.groups)
      }
    }
  }
}
