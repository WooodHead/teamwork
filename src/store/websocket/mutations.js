export default {
  /**
   * 连接状态维护
   *
   * @param {*} state
   * @param {*} data
   */
  socket_connect (state, data) {
    state.connectStatus = data
  },
  /**
   * 发送的消息列表更新
   *
   * @param {*} state
   * @param {*} data
   */
  socket_messages (state, data) {
    console.log('mutations_socket_messages:' + data)
  },
  /**
  * 消息类别更新
  *
  * @param {*} state
  * @param {*} { objectId, objectType } objectId（接受到的消息的发送人ID或者群的ID），objectType对应消息类型
  */
  setObject (state, { objectId, messageType }) {
    state.messageType = messageType
    state.objectId = objectId
  }
}
