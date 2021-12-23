import Vue from 'vue'
export default {
  /**
   * 尾部追加列表
   * @param {*} state
   * @param {*} subscribes
   */
  pushSubscribes (state, subscribes) {
    let newSubscribes = _.differenceBy(subscribes, state.subscribes, 'id')
    state.subscribes.push(...newSubscribes)
  },
  /**
   * 更新订阅
   * @param {*} state
   * @param {*} subscribe 订阅Model
   */
  updateSubscribe (state, subscribe) {
    let index = state.subscribes.findIndex(item => item.id === subscribe.id)
    Vue.set(state.subscribes, index, subscribe)
  }
}
