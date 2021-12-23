export default {
  // 已读的消息数据
  messagesReaded: (state, getters) => {
    if (state.messages) {
      return state.messages.filter(a => a.readed === true)
    } else {
      return state.messages
    }
  },
  // 未读的消息数据
  messagesUnread: (state, getters) => {
    if (state.messages) {
      return _.orderBy(state.messages.filter(a => a.readed === false), ['sendTime'], ['desc'])
    } else {
      return state.messages
    }
  },
  // 是否存在未读
  unRead: (state, getters) => {
    return getters.messagesUnread.length
  },
  // 消息对象
  message: state => id => {
    return _.find(state.messages, { id })
  }
}
