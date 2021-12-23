import request from '@/boot/axios'
import Subscriber from './model'

const url = {
  getSubscribe: 'subscribes/getsubscribe',
  add: 'subscribes/add',
  update: 'subscribes/update'
}
export default {
  /**
  *获取订阅model
  *
  * @param {*} { commit }
  * @param {*} payload {objectID:{0},objectType:{1}}
  * @returns
  */
  loadSubscribe ({ state, commit }, { objectID = 0, objectType = '' }) {
    return request.get(url.getSubscribe, {
      objectID: objectID,
      objectType: objectType
    }).then(res => {
      let subscribe = null
      if (res.data) {
        subscribe = Subscriber.from(res.data)
        commit('pushSubscribes', [subscribe])
      }
      return subscribe
    })
  },
  /**
   *
   * @param {*} param0
   * @param {*} payload
   */
  addOrUpdateSubscribe ({ commit }, payload) {
    let subscribe = Subscriber.to(payload)
    return request.post(payload.id ? url.update : url.add, subscribe).then(res => {
      subscribe = null
      if (res.data) {
        subscribe = Subscriber.from(res.data)
        if (payload.id) {
          commit('updateSubscribe', subscribe)
        } else {
          commit('pushSubscribes', [subscribe])
        }
      }
      return subscribe
    })
  }
}
