import Vue from 'vue'
import { LocalStorage } from 'quasar'
export default {
  addDashboards (state, boards) {
    let newBoards = _.differenceBy(boards, state.dashboards, 'id')
    let oldBoards = _.differenceBy(boards, newBoards, 'id')
    state.dashboards.push(...newBoards)
    oldBoards.map(board => {
      let index = _.findIndex(state.dashboards, item => item.id === board.id)
      Vue.set(state.dashboards, index, board)
    })
  },
  deleteChart (state, data) {
    if (data.isDefault) {
      let board = state.dashboards.find(i => i.category === data.category && i.psonID === 0)
      Vue.delete(state.dashboards, state.dashboards.findIndex(item => item.id === board.id))
      Vue.delete(board.charts, +data.uid)
      state.dashboards.push(board)
    } else {
      let board = state.dashboards.find(i => i.category === data.category && i.psonID === LocalStorage.getItem('myself').id)
      if (board) {
        Vue.delete(state.dashboards, state.dashboards.findIndex(item => item.id === board.id))
        Vue.delete(board.charts, +data.uid)
        state.dashboards.push(board)
      } else {
        let defaultBoard = state.dashboards.find(i => i.category === data.category && i.psonID === LocalStorage.getItem('myself').id)
        let copyBoard = _.cloneDeep(defaultBoard)
        Vue.delete(copyBoard.charts, +data.uid)
        copyBoard.charts.map(i => i.psonID === LocalStorage.getItem('myself').id)
        state.dashboards.push(copyBoard)
      }
    }
  }
}
