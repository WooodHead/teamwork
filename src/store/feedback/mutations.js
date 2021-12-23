import Vue from 'vue'
import { LocalStorage } from 'quasar'
export default {
  /**
   * 在线反馈列表存储和追加
   * @param {*} state
   * @param {*} payload 在线反馈
   */
  setFeedbacks (state, feedbacks) {
    let newFeedbacks = _.differenceBy(feedbacks, state.feedbacks, 'id')
    state.feedbacks.push(...newFeedbacks)
  },

  /**
   * 新增在线反馈
   * @param {*} state
   * @param {*} feedback 文件Model
   */
  addFeedback (state, feedback) {
    // 新增feedbacks
    let fb = _.differenceBy(feedback, state.feedbacks, 'id')
    state.feedbacks.push(...fb)
    // 新增feedbacksbyquestionsID
    let fq = _.differenceBy(feedback, state.feedbacksByProvider, 'id')
    state.feedbacksByProvider.push(...fq)
  },
  /**
   * 更新在线反馈
   * @param {*} state
   * @param {*} file 文件Model
   */
  updateFeedback (state, feedback) {
    // 更新feedbacks
    let index = state.feedbacks.findIndex(item => item.id === feedback.id)
    Vue.set(state.feedbacks, index, feedback)
    // 更新feedbacksbyquestionsID
    let len = state.feedbacksByProvider.length
    Vue.set(state.feedbacksByProvider, len - 1, feedback)
  },

  /**
   * 设置firstUpdateMessage
   * @param {*} state
   * @param {*} val 值
   */
  setFirstUpdateMessage (state, val) {
    state.firstUpdateMessage = val
  },
  /**
   * 设置ifCloseRoom
   * @param {*} state
   * @param {*} val 值
   */
  setCloseRoom  (state, val) {
    state.closeRoom = val
  },
  /**
   * 设置结束聊天
   * @param {*} state
   * @param {*} val 值
   * cyt 1126
   */
  setEndChat (state, val) {
    state.endChat = val
  },
  /**
   * 设置管理员端结束聊天的角色
   * @param {*} state
   * @param {*} person 角色
   * cyt 1126
   */
  setAdminEndChat (state, person) {
    state.adminEndChat = person
  },
  /**
   * 设置客户端结束聊天的角色
   * @param {*} state
   * @param {*} person 角色
   * cyt 1126
   */
  setCustomerEndChat (state, person) {
    state.customerEndChat = person
  },

  /**
   * 设置当前聊天咨询feedbackId
   * @param {*} state
   * @param {*} feedbackId id
   */
  setFeedbackId (state, feedbackId) {
    state.feedbackId = feedbackId
  },
  /**
   * 设置当前聊天咨询feedbackId
   * @param {*} state
   * @param {*} feedbackId id
   */
  setAdminMessageId (state, id) {
    state.adminMessageId = id
  },
  /**
   * 设置当前聊天咨询feedbackState
   * @param {*} state
   * @param {*} feedbackState 状态
   */
  setFeedbackState (state, feedbackState) {
    state.feedbackState = feedbackState
  },

  /**
   * 设置聊天室消息内容
   * @param {*} state
   * @param {*} chatObj 值
   */
  setMessageContent (state, chatObj) {
    if (_.isArray(chatObj[0].content)) {
      chatObj[0].text = chatObj[0].content
    } else {
      chatObj[0].text = [chatObj[0].content]
    }
    let ctObj = _.uniqBy(chatObj, 'chatId')
    if (state.feedbackId === 0) {
      const fb = _.differenceBy(ctObj, state.messageContent, 'chatId')
      state.messageContent.push(...fb)
    } else {
      state.messageContent = []
      let filterFeedback = _.filter(state.feedbacks, (item) => item.id === state.feedbackId)[0]
      filterFeedback.content.push(...ctObj)
      state.messageContent = filterFeedback.content
    }
  },

  /**
   * 更新feedback
   * @param {*} state
   * @param {*} payload 值
   */
  updateFeedbackFromWebsocket (state, payload) {
    const myInfo = LocalStorage.getItem('myself')
    let sf = {}
    if (_.isEmpty(state.feedbacks)) {
      return false
    } else {
      sf = _.find(state.feedbacks, item => item.id === payload.id)
      if (_.isEmpty(sf)) {
        // 1.新增
        if (payload.content.chatId > 1) {
          return false
        } else {
          state.feedbacks.push(...[payload])
        }
      } else {
        if (_.isArray(payload.content)) {
        // 2.更新其他
          sf.state = payload.state
          sf.assignedTo = payload.assignedTo
          sf.assigner = payload.assigner
        } else {
          if (payload.assignedTo > 0) {
            sf.assignedTo = payload.assignedTo
            sf.state = payload.state
          }
          // 3.更新content
          payload.content.text = [payload.content.content]
          sf.content.push(payload.content)
          let index = state.feedbacks.findIndex(item => item.id === payload.id)
          Vue.set(state.feedbacks, index, sf)
        }
        if (payload.state === 2 && state.adminEndChat !== 'admin' && payload.assignedTo === myInfo.id) {
          state.adminEndChat = 'customer'
        }
      }
    }
  },

  /**
   * 更新指派人和对接人
   * @param {*} state
   * @param {*} feedback
   */
  assignFeedback (state, feedback) {
    _.find(state.feedbacks, item => item.id === feedback.id).assignedTo = feedback.assignedTo
    _.find(state.feedbacks, item => item.id === feedback.id).assigner = feedback.assigner
  },

  /**
   * 设置指派人
   * @param {*} state
   * @param {*} feedback
   */
  setAssignId (state, id) {
    // 设置指派人的id
    state.assignId = id
  },

  /**
   * 结束聊天
   * @param {*} state
   * @param {*} feedback
   */
  endFeedback (state, feedback) {
    _.find(state.feedbacks, item => item.id === feedback.id).state = feedback.state
  },

  /**
   * 弹框显示
   * @param {*} state
   * @param {*} val
   */
  setIsVisible (state, val) {
    state.isVisible = val
  },

  /**
   * 聊天室打开或关闭
   * @param {*} state
   * @param {*} val
   */
  setRoom (state, val) {
    state.roomState = val
  },
  /**
   * 消息页面显隐
   * @param {*} state
   * @param {*} val
   */
  setMessage (state, val) {
    state.messageState = val
  },
  /**
   * 设置未指派消息的滚动页码
   * @param {*} state
   * @param {*} val
   */
  setUnassignedFeedbackIndex (state, val) {
    state.unassignedFeedbackIndex = val
  },
  /**
   * 设置我指派的消息的滚动页码
   * @param {*} state
   * @param {*} val
   */
  setMyAssignedFeedbackIndex (state, val) {
    state.myAssignedFeedbackIndex = val
  },
  /**
   * 设置我的消息的滚动页码
   * @param {*} state
   * @param {*} val
   */
  setMyFeedbackIndex (state, val) {
    state.myFeedbackIndex = val
  },
  /**
   * 设置所有消息的滚动页码
   * @param {*} state
   * @param {*} val
   */
  setAllFeedbackIndex (state, val) {
    state.allFeedbackIndex = val
  },
  /**
   * 更新Page
   * @param {*} state
   * @param {*} payload 值
   */
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  /**
  * 设置图像id
  * @param {*} state
  * @param {*} payload 值
  */
  setChatImage (state, imageId) {
    state.chatImageId = imageId
  },
  /**
  * 设置新聊天室
  * @param {*} state
  * @param {*} payload 值
  */
  setNewChat (state, newChat) {
    state.newChat = newChat
  },
  /**
  * 追加消息时消息弹框打开时存储消息id
  * @param {*} state
  * @param {*} id 值
  */
  setNewChatId  (state, id) {
    state.newChatId = id
  },
  /**
  * 显示消息列表
  * @param {*} state
  * @param {*} val 值
  */
  setShowMessage (state, val) {
    state.showMessage = val
  },
  /**
  * 是否从后台获取数据
  * @param {*} state
  * @param {*} val 值
  */
  updateLoadFromBackground (state, val) {
    state.LoadFromBackground = val
  },
  /**
  * 设置管理员端咨询的id
  * @param {*} state
  * @param {*} val 值
  */
  setAdminFeedbackId (state, id) {
    state.setAdminFeedbackId = id
  },
  /**
  * 设置管理员端列表页选择的项
  * @param {*} state
  * @param {*} val 值
  */
  setAdminChoose (state, val) {
    state.adminChoose = val
  }
}
