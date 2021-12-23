export default {
  // 提供给外部的转换器
  roles: (_state, getters) => {
    return getters.rolesFiltered
  },
  // 选择组件数据
  selectRoles: state => {
    return _.values(state.selectRoles)
  },
  /**
   * 前端筛选
   */
  rolesFiltered: state => {
    let search = state.search
    if (_.isObject(search)) {
      const roleIds = search.roleIds
      search = search.search
      return _.filter(_.values(state.roles), role =>
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.notes.toLowerCase().includes(search.toLowerCase()) ||
        roleIds.includes(role.id)
      )
    } else {
      if (search) {
        return _.filter(_.values(state.roles), role =>
          role.name.toLowerCase().includes(search.toLowerCase()) ||
          role.notes.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return _.values(state.roles)
      }
    }
  }
}
