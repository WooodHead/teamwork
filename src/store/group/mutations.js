
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
   *职位选择组件判断是否已经加载过
   *
   * @param {*} state
   * @param {*} loaded
   */
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  /**
   *添加群组
   * @param {*} state
   * @param {*} groups
   */
  updateGroups (state, groups) {
    state.groups = { ...state.groups, ...groups }
  },
  /**
   *更新指定字段
   *
   * @param {*} state
   * @param {*} { id, fieldName, value }
   */
  updateGroupField (state, { id, fieldName, value }) {
    state.groups[id][fieldName] = value
  },
  /**
   *下拉数据列表初始化
   *
   * @param {*} state
   * @param {*} groups
   */
  updateSelectGroups (state, groups) {
    state.selectGroups = { ...state.selectGroups, ...groups }
  },
  /**
   * 删除群组
   * @param {Object} state 上下文Model
   * @param {Object} id 群组id
   */
  deleteGroup (state, id) {
    state.groups = _.omit(state.groups, id)
    state.selectGroups = _.omit(state.selectGroups, id)
  }
}
