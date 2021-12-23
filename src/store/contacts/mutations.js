import { format } from 'quasar' // 格式化工具
const { capitalize } = format // 字符串首字母大写
export default {
  /**
   * 左侧树数据更新，同步更新下拉选中、树菜单选中、表格数据
   * @param {*} state 上下文Model
   * @param {*} data selected、treed参数对象
   */
  updateSelected (state, selected) {
    state.selects = _.filter(state.selects, s => {
      s.selected = false
      if (s.id === selected.id) s.selected = true
      return s
    })
  },
  /**
   * 左侧树数据更新，同步更新下拉选中、树菜单选中、表格数据
   * @param {*} state 上下文Model
   * @param {*} data selected、treed参数对象
   */
  updateTreed (state, payload) {
    state[`selected${capitalize(payload.name)}`] = payload.id
  },
  /**
   * 给节点追加人员列表
   * @param {Object} state 上下文Model
   * @param {Object} data  人员列表数据
   */
  setTreedPersons (state, payload) {
    state.selects = _.filter(state.selects, s => {
      if (s.selected) filterTreedAndAddPersons(s.data, payload)
      return s
    })
  },
  setMhome (state, payload) {
    state.mhome = payload
  }
}
/**
 * 给选中的节点添加人员列表
 */
function filterTreedAndAddPersons (trees, payload) {
  payload && trees && trees.length > 0 && trees.forEach(t => {
    if (t.id === payload.treedId) t.persons = payload.persons
    filterTreedAndAddPersons(t.children, payload)
  })
}
