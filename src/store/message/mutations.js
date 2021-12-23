import Vue from 'vue'
import { LocalStorage } from 'quasar'
export default {
  loadMessagesUnread (state, messages) {
    state.messages.push(..._.differenceBy(messages, state.messages, 'id'))
  },
  loadMessagesReadedMore (state, messages) {
    state.messages.push(..._.differenceBy(messages, state.messages, 'id'))
  },
  updateMessage (state, message) {
    // 未读变已读/已读变未读，均显示在当前列表的第一个。步骤：先删掉state中这条消息，再将消息添加到第一个
    Vue.delete(state.messages, state.messages.findIndex(item => item.id === message.id))
    state.messages.unshift(message)
  },
  markAllRead (state, messages) {
    for (const msg of messages) {
      Vue.delete(state.messages, state.messages.findIndex(item => item.id === msg.id))
      state.messages.unshift(msg)
    }
  },
  addMessage (state, message) {
    let messageModel = state.messages && _.find(state.messages, item => item.id === message.id)
    if (messageModel) {
      Object.assign(messageModel, message)
    } else {
      state.messages.unshift(message)// 添加的消息一直在第一个
    }
  },
  setReadPage (state, { offset, nextPageToken }) {
    state.readPage.offset = offset
    state.readPage.nextPageToken = nextPageToken
  },
  setEmptyMessages (state) {
    state.messages = []
  },
  toggleMessagePanelFloat (state) {
    state.messagePanelFloat = !state.messagePanelFloat
  },
  initMessagePanelFloat (state) {
    const msgInRightDrawer = LocalStorage.getItem('msgInRightDrawer') || []
    const myinfo = LocalStorage.getItem('myself')
    state.messagePanelFloat = !msgInRightDrawer.includes(myinfo.id)
  },
  // 设置搜索人员
  setPerson (state, value) {
    state.person = value
  }
}
