import Vue from 'vue'
export default {
  /**
   * 设置是否分页
   * @param {*} state
   * @param {*} value
   */
  setByPage (state, value) {
    state.byPage = value
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
 *追加推荐码
 * @param {*} state
 * @param {*} codes
 */
  pushCodes (state, codes) {
    let newCodes = _.differenceBy(codes, state.recommendCodes, 'id')
    state.recommendCodes.push(...newCodes)
  },
  /**
  *更新推荐码
  * @param {*} state
  * @param {*} code
  */
  updateCode (state, code) {
    let index = state.recommendCodes.findIndex(item => +item.id === +code.id)
    Vue.set(state.recommendCodes, index, code)
  }
}
