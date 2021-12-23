/**
 *职位职级
 */
import Vue from 'vue'
export default {
  setSearch (state, value) {
    state.search = value
  },
  setFilterType (state, value) {
    state.filterType = value
  },
  setPositions (state, positions) {
    state.positions = positions
  },
  /**
   * 尾部追加列表
   * @param {*} state
   * @param {*} positions
   */
  pushPositions (state, positions) {
    let newPositions = _.differenceBy(positions, state.positions, 'id')
    state.positions.push(...newPositions)
  },
  /**
   * 更新职级（一般用于列表页的更新）
   * @param {*} state
   * @param {*} position 职级Model
   */
  updatePosition (state, position) {
    let index = state.positions.findIndex(item => item.id === position.id)
    Vue.set(state.positions, index, position)
  },
  updatePositionsSendStatus (state, list) {
    list.map(l => {
      const id = l.id
      let old = _.find(state.positions, { id })
      old && (old.sendStatus = l.sendStatus)
    })
  },
  setPositionCountAndStatus (state, payload) {
    state.positionCountAndStatus = payload
  },
  setPositionBatchCountAndStatus (state, payload) {
    state.positionBatchCountAndStatus = payload
  },
  setImportProgress (state, progress) {
    state.importProgress = (+progress.toFixed(2)) * 100
  },
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
  }
}
