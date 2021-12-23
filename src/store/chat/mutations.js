export default {
  /**
   * 即时通讯消息追加
   * @param {*} state
   * @param {Object} message 推送的消息对象
   */
  addMessages (state, messages) {
    // 更新客户端messages，实现同步显示
    const newMessages = _.differenceBy(messages, state.messages, 'id')
    state.messages.push(...newMessages)
    // 更新消息文件列表
    let fileMes = _.filter(messages, res => { return typeof res.text[0] === 'object' })
    const fm = _.differenceBy(fileMes, state.fileMessages, 'id')
    state.fileMessages.push(...fm)
  },
  /**
   * 文件消息追加
   * @param {*} state
   * @param {Object} message 推送的消息对象
   */
  addFilesMessages (state, filesMessages) {
    // 更新客户端messages，实现同步显示
    const fileMes = _.differenceBy(filesMessages, state.filesMessages, 'id')
    state.fileMessages.push(...fileMes)
  },
  /**
   * 即时通讯消息服务器推送的消息
   * @param {*} state
   * @param {Object} message 推送的消息对象
   */
  addMessage (state, message) {
    // 更新客户端messages，实现同步显示
    const newMessages = _.differenceBy([message], state.messages, 'id')
    state.messages.push(...newMessages)
    // 更新消息文件列表
    let fileMes = _.filter([message], res => { return typeof res.text[0] === 'object' })
    const fm = _.differenceBy(fileMes, state.fileMessages, 'id')
    state.fileMessages.push(...fm)
  },
  /**
  * 更新消息数组中指定的值
  * @param {*} state
  * @param {Object} payload { oldMsgID: message.MsgID, newMsgID: model.id }
  */
  updateMessage (state, payload) {
    let oldMessage = _.find(state.messages, m => m.id === payload.oldMsgID)
    Object.assign(oldMessage, { id: payload.newMsgID })
  },
  /**
   * 分页对象
   * @param {*} state
   * @param {*} payload
   */
  setPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.page, payload)
  },
  /**
   * 文件分页对象
   * @param {*} state
   * @param {*} payload
   */
  setFilesPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.filesPage, payload)
  },
  /**
   * 初始化分页对象
   * @param {*} state
   * @param {*} payload
   */
  initPage (state) {
    Object.assign(state.page, {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    })
  }
}
