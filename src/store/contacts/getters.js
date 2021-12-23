import { format, LocalStorage } from 'quasar' // 格式化工具
const { capitalize } = format // 字符串首字母大写
import { listToTree } from '@/utils/list-to-tree'
export default {
  // 通讯录下拉树数据转换器
  selects: (state, _getters, rootState, rootGetters) => {
    _.forEach(state.selects, s => {
      switch (s.name) {
        case 'team':
          s.data = rootGetters[`team/allTeams`]
          break
        case 'organize':
          s.data = listToTree(_.cloneDeep(rootGetters[`organize/filterOrganizesByContactsAcl`](rootGetters[`organize/selectOrganizes`])), 'id', 'parentId')
          break
        default:
          s.data = rootGetters[`${s.name}/${s.name}s`]
          break
      }
    })
    return state.selects
  },
  // 类型选项选中的对象
  selected: (_state, getters) => {
    return _.find(getters.selects, s => { return s.selected })
  },
  // 树节点选中的对象
  treed: (state, getters) => {
    var myinfo = LocalStorage.getItem('myself')
    var treedList = []
    if (state[`selected${capitalize(getters.selected.name)}`] === 0) {
      if (getters.selected.name === 'group') {
        treedList = getters.selected.data.filter(t => { return t.psonId === myinfo.id })
      } else {
        treedList = getters.selected.data.length > 0 ? getters.selected.data : [{ id: 0 }]
      }
    } else {
      filterTreed(getters.selected.data, state[`selected${capitalize(getters.selected.name)}`], treedList)
      if (getters.selected.name === 'group') {
        treedList = treedList.filter(t => { return t.psonId === myinfo.id })
      } else {
        treedList = treedList.length > 0 ? treedList : [{ id: 0 }]
      }
    }
    return treedList.length > 0 ? treedList[0] : { id: 0 }
  }
}
/**
 * 筛选出左边树的选中node
 */
function filterTreed (data, treedId, treedList) {
  data && data.length > 0 && _.forEach(data, d => {
    if (d.id === treedId) treedList.push(d)
    else filterTreed(d.children, treedId, treedList)
  })
}
