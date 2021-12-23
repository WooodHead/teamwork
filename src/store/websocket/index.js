/**
 @Name：消息服务器数据处理模块
 @Author：陈冬
 @date：2020/5/23
 @Copyright：西安精雕软件科技有限公司
 */
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
