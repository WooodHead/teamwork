import { uid } from 'quasar'
import Vue from 'vue'
const state = {
  emailData: {
    'ID1': {
      server: 'smtp.ailyun.com',
      portNumber: '25',
      senderMailbox: 'xianxin@layui-inc.com',
      senderNickname: '贤心',
      emailPassword: '......'
    },
    'ID2': {
      server: 'baidu.com',
      portNumber: '456',
      senderMailbox: '123456@qq.com',
      senderNickname: '西安',
      emailPassword: '......'
    }
  }
}
const mutations = {
  addEmailData (state, { id, emaildata }) {
    Vue.set(state.emailData, id, emaildata)
    console.log(state.emailData)
  }
}
const actions = {
  addEmailData ({ commit }, emaildata) {
    let id = uid()
    commit('addEmailData', { id, emaildata })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
