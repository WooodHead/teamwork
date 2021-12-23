import { LocalStorage } from 'quasar'
export default {
  // 所有消息
  feedbacks: (state, getters) => {
    return getters.feedbacksSorted
  },
  // 分类消息
  filterFeedbacks: (state, getters) => (feedbackType) => {
    const myinfo = LocalStorage.getItem('myself')
    if (feedbackType === 'unassignedFeedback') {
      // 未指派的消息
      return _.filter(getters.feedbacks, item => item.assignedTo === 0)
    } else if (feedbackType === 'myFeedback') {
      // 我的消息
      return _.filter(getters.feedbacks, item => item.assignedTo === myinfo.id)
    } else if (feedbackType === 'myAssignedFeedback') {
      // 我指派的消息
      return _.filter(getters.feedbacks, item => item.assigner === myinfo.id)
    } else {
      return getters.feedbacks
    }
  },
  // 排序后的消息
  feedbacksSorted: (state) => {
    return _.orderBy(state.feedbacks, ['state', 'modifyTime'], ['asc', 'desc'])
  },
  // 登录用户所有消息
  feedbacksByProvider: (_state, getters) => {
    const myinfo = LocalStorage.getItem('myself')
    return _.filter(getters.feedbacks, item => item.provider === myinfo.id)
  },
  // 客户历史记录
  historyFeedbacksList: (_state, getters) => {
    let historyRecords = []
    let fs = _.filter(getters.feedbacksByProvider, item => item.state === 2)
    _.forEach(fs, item => {
      historyRecords.push({
        id: item.id,
        content: item.content
      })
    })
    return historyRecords
  },

  // 客户历史记录
  historyFeedbacks: (_state, getters) => {
    let historyRecords = []
    let fs = _.filter(getters.feedbacksByProvider, item => item.state === 2)
    return _.forEach(_.map(fs, 'content'), item => {
      historyRecords.push(item)
    })
  },

  // 客户最新消息
  newFeedbackByProvider: (_state, getters) => {
    let betterMessage = _.orderBy(getters.feedbacksByProvider, 'id', 'desc')[0]

    return !_.isEmpty(getters.feedbacksByProvider) ? betterMessage : {}
  },

  // 客户最新消息的state
  feedbackStateByProvider: (_state, getters) => {
    return !_.isEmpty(getters.newFeedbackByProvider) ? getters.newFeedbackByProvider.state : 3
  },

  // 消息content
  messageContent: state => {
    return _.uniqBy(state.messageContent, 'chatId')
  },
  // 通过id获取消息长度
  messageContentLen: (state) => (id) => {
    return state.feedbacks !== undefined && _.filter(state.feedbacks, item => item.id === id)[0].content.length
  },
  // 是否关闭聊天室
  closeRoom: state => {
    return state.closeRoom
  },
  // 管理员结束
  adminEndChat: state => {
    return state.adminEndChat
  },
  // 客户结束
  customerEndChat: state => {
    return state.customerEndChat
  },
  // feedbackId
  feedbackId: state => {
    return state.feedbackId
  },
  // adminMessageId
  adminMessageId: state => {
    return state.adminMessageId
  },
  // 设置feedbackState
  feedbackState: state => {
    return state.feedbackState
  },
  // 设置endChat
  endChat: state => {
    return state.endChat
  },
  // 设置assignId
  assignId: state => {
    return state.assignId
  },
  // 通过id获取消息
  feedback: (_state, getters) => (feedbackId = 0) => {
    let a = feedbackId ? _.filter(getters.feedbacks, item => item.id === feedbackId)[0] : {}
    return getters.feedbacks.length > 0 ? a : {}
  },
  // 设置isVisible
  isVisible: state => {
    return state.isVisible
  },
  // 设置roomState
  roomState: state => {
    return state.roomState
  },
  // 设置messageState
  messageState: state => {
    return state.messageState
  },
  // 设置unassignedFeedbackIndex
  unassignedFeedbackIndex: state => {
    return state.unassignedFeedbackIndex
  },
  // 设置myFeedbackIndex
  myFeedbackIndex: state => {
    return state.myFeedbackIndex
  },
  // 设置myAssignedFeedbackIndex
  myAssignedFeedbackIndex: state => {
    return state.myAssignedFeedbackIndex
  },
  // allFeedbackIndex
  allFeedbackIndex: state => {
    return state.allFeedbackIndex
  },
  // chatImageId
  chatImageId: state => {
    return state.chatImageId
  },
  // firstUpdateMessage
  firstUpdateMessage: state => {
    return state.firstUpdateMessage
  },
  // newChat
  newChat: state => {
    return state.newChat
  },
  // newChatId
  newChatId: state => {
    return state.newChatId
  },
  // showMessage
  showMessage: state => {
    return state.showMessage
  },
  // loadFromBackground
  loadFromBackground: state => {
    return state.loadFromBackground
  },
  // adminFeedbackId
  adminFeedbackId: state => {
    return state.adminFeedbackId
  },
  // adminChoose
  adminChoose: state => {
    return state.adminChoose
  }

}
