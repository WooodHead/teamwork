
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
 *添加职位
 * @param {*} state
 * @param {*} duty
 */
  updateDutys (state, dutys) {
    state.dutys = { ...state.dutys, ...dutys }
  },
  /**
   *下拉数据列表初始化
   *
   * @param {*} state
   * @param {*} dutys
   */
  updateSelectDutys (state, dutys) {
    state.selectDutys = { ...state.selectDutys, ...dutys }
  },
  /**
   * 删除职位
   * @param {Object} state 上下文Model
   * @param {Object} id 职位id
   */
  deleteDuty (state, id) {
    state.dutys = _.omit(state.dutys, id)
    state.selectDutys = _.omit(state.selectDutys, id)
  }
}
