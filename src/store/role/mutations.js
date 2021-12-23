
export default {
  /**
   * 检索条件设置
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 是否已经加载所有数据
   * @param {*} state
   * @param {*} payload
   */
  setLoadedAll (state, payload) {
    state.loadedAll = payload
  },
  /**
   *角色选择组件判断是否已经加载过
   *
   * @param {*} state
   * @param {*} loaded
   */
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  /**
   *添加角色
   * @param {*} state
   * @param {*} roles
   */
  updateRoles (state, roles) {
    state.roles = { ...state.roles, ...roles }
  },
  /**
   *下拉数据列表初始化
   *
   * @param {*} state
   * @param {*} roles
   */
  updateSelectRoles (state, roles) {
    state.selectRoles = { ...state.selectRoles, ...roles }
  },
  /**
   * 删除角色
   * @param {Object} state 上下文Model
   * @param {Object} id 角色id
   */
  deleteRole (state, id) {
    state.roles = _.omit(state.roles, id)
    state.selectRoles = _.omit(state.selectRoles, id)
  }
}
