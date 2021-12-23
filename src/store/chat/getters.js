export default {
  // 处理聊天记录中的发送消息时间格式
  messages: state => {
    return state.messages
  },
  // 处理聊天记录中的发送消息时间格式
  messagesResource: state => (objectID, category) => {
    let orderBySendTime = _.orderBy(state.messages, ['stamp'], 'asc')
    let groupMessages = _.groupBy(
      _.filter(
        orderBySendTime,
        m =>
          (m.type === category && m.toId === Number(objectID)) ||
          (m.type === category && m.fromId === Number(objectID))
      ),
      'group'
    )
    return groupMessages
  },
  // 过滤消息中的文件
  filesMessagesResource: state => (objectID, category) => {
    let filterFiles = _.filter(
      state.fileMessages,
      m =>
        (m.type === category && m.toId === Number(objectID)) ||
        (m.type === category && m.fromId === Number(objectID))
    )
    return filterFiles
  }
}
