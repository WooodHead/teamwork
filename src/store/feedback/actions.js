import request from '@/boot/axios'
import Feedback from './model'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import { LocalStorage } from 'quasar'
import confetti from 'canvas-confetti'
const url = {
  getList: 'feedback/getlist',
  getPageList: 'feedback/getpagelist',
  getModel: 'feedback/getModel',
  add: 'feedback/add',
  updateFields: 'feedback/feedbackChat',
  assign: 'feedback/feedbackAssign',
  end: 'feedback/endChat'
}

export default {
  /**
   * 加载在线反馈列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   */
  loadFeedbacks (
    { state, commit },
    {
      query,
      filter,
      sort,
      search,
      pageIndex,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset
    } = {}
  ) {
    // 首页请求，初始化offset和nextPageToken
    if (pageIndex === 1) {
      state.page = {
        offset: 0,
        limit: limit,
        nextPageToken: 0
      }
      offset = 0
    }
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    Object.assign(condition, byPage ? { limit, offset } : {})
    return request
      .get(byPage ? url.getPageList : url.getList, condition)
      .then(res => {
        const feedbacks = Feedback.from(res.data)
        commit('setFeedbacks', feedbacks)
        // 更新页码
        commit('updatePage',
          {
            offset: state.page.offset + feedbacks.length,
            nextPageToken: res.nextPageToken
          })
        if (!byPage || res.nextPageToken === -1) {
          commit('updateLoadFromBackground', true)
        }
        return !byPage || res.nextPageToken === -1
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },

  /**
   * 获取一个feedback
   * @param {*} {commit}
   * @param {array} [feedback] 在线反馈
   */
  loadFeedback ({ state, commit }, id) {
    let feedback = state.feedbacks[id]
    if (!feedback) {
      return request.get(url.getModel, { id }).then(res => {
        if (res.data) {
          feedback = Feedback.from(res.data)
          commit('setFeedbacks', [feedback])
          return feedback
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return null
      })
    } else {
      return feedback
    }
  },

  /**
   * 新建在线反馈
   * @param {*} {commit}
   * @param {array} [feedback] 在线反馈
   */
  addFeedback ({ commit, rootState }, feedback) {
    let to = Feedback.to(feedback)
    to.CMessage = getMessage(rootState, to, this.$router.currentRoute)
    return request.post(url.add, to)
      .then(res => {
        let from = Feedback.from(res.data)
        commit('addFeedback', [from])
        commit('setFeedbackId', from.id)
        return from
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 更新在线反馈中content字段
   * @param {*} {commit }
   * @param {array} content 在线反馈的内容
   */
  updateFeedbackField ({ rootState, state, commit }, payload) {
    if (payload === undefined) {
      return false
    }
    let pl = Feedback.to(payload)
    pl.CMessage = getMessage(rootState, pl, this.$router.currentRoute)
    return request.put(url.updateFields, pl)
      .then(res => {
        let from = Feedback.from(res.data)

        commit('updateFeedback', from)
        return from
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 指派消息
   * @param {*} {commit }
   * @param {int} payload
   */
  assignFeedback ({ commit, rootState }, payload) {
    let pl = Feedback.to(payload)
    pl.CMessage = getAssignMessage(rootState, pl, this.$router.currentRoute)
    return request.put(url.assign, pl)
      .then(res => {
        let feedback = Feedback.from(res.data)
        commit('assignFeedback', feedback)
        commit('setAssignId', feedback.assignedTo)
        return feedback.assignedTo
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 结束聊天
   * @param {*} {commit }
   * @param {int} payload
   */
  endFeedback ({ state, commit, rootState }, payload) {
    if (payload === undefined) {
      return false
    }
    let pl = Feedback.to(payload)
    pl.CMessage = getEndChatMessage(rootState, pl, this.$router.currentRoute)
    return request.put(url.end, pl)
      .then(res => {
        let feedback = Feedback.from(res.data)
        commit('endFeedback', feedback)
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}

// 定义一个消息model(聊天)
function getMessage (rootState, payload, route) {
  const myinfo = LocalStorage.getItem('myself')
  var tag = ''
  var title = i18n.t('message.tag.feedback')
  var content = ''
  var text = ''
  // 表情动画
  // 庆祝
  const fire = function (particleRatio, opts) {
    var count = 200
    var defaults = {
      origin: { y: 0.7 },
      zIndex: 2030
    }
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }))
  }
  if (JSON.parse(payload.Content).content === '🎉') {
    fire(0.25, {
      spread: 26,
      startVelocity: 55
    })
    fire(0.2, {
      spread: 60
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    })
  }
  // 彩球
  const randomInRange = function (min, max) {
    return Math.random() * (max - min) + min
  }
  if (JSON.parse(payload.Content).content === '🎊') {
    var duration = 15 * 1000
    var animationEnd = Date.now() + duration
    var defaults = { startVelocity: 30, spread: 360, ticks: 60 }
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        return clearInterval(interval)
      }
      var particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, zIndex: 2030 }))
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, zIndex: 2030 }))
    }, 250)
  }
  // 满分、得奖
  const frame = function () {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      zIndex: 2030
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      zIndex: 2030
    })
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  if (JSON.parse(payload.Content).content === '💯' || JSON.parse(payload.Content).content === '🥇') {
    var end = Date.now() + (15 * 1000)
    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff']
    frame()
  }
  if (!(_.isEmpty(payload.Content)) && !(_.isArray(payload.Content))) {
    let c = payload.Content.content
    if (_.isObject(c)) {
      content = c[0].title + c[0].extension
    } else {
      content = c
    }
    text = myinfo.auth.role.isSupporter ? myinfo.name + '给您发送了一条消息,请您登录TeamWork,进入在线反馈查看' : myinfo.name + '给您发送了一条消息'
  }
  route.params.objectID = payload.Id || 0
  return {
    Module: {
      Id: payload.Id || 0,
      Title: title,
      Type: 'feedback' // 消息类型
    },
    Route: myinfo.auth.role.isSupporter ? {
      Name: 'chatRoom',
      Params: JSON.stringify({ id: payload.Id || 0 }),
      Path: '/'
    } : {
      Name: 'chatRoom',
      Params: JSON.stringify({ id: payload.Id || 0 }),
      Path: '/feedback/chat-room/' + payload.Id
    },
    SenderID: myinfo.id,
    SenderName: '',
    SenderImg: myinfo.img,
    SendTime: '',
    Title: text,
    Tag: tag,
    Type: 'feedback',
    Extra: {
      Content: content
    }
  }
}
// 定义一个消息model(结束聊天)
function getEndChatMessage (rootState, payload, route) {
  const myinfo = LocalStorage.getItem('myself')
  var tag = ''
  var title = i18n.t('message.tag.feedback')
  var content = ''
  var text = myinfo.name + '刚刚结束了聊天'
  route.params.objectID = payload.Id || 0
  return {
    Module: {
      Id: payload.Id || 0,
      Title: title,
      Type: 'feedback' // 消息类型
    },
    Route: {
      Name: 'chatRoom',
      Params: JSON.stringify({ id: payload.Id || 0 }),
      Path: '/feedback/chat-room/' + payload.Id
    },
    SenderID: myinfo.id,
    SenderName: '',
    SenderImg: myinfo.img,
    SendTime: '',
    Title: text,
    Tag: tag,
    Type: 'feedback',
    Extra: {
      Content: content
    }
  }
}

// 定义一个消息model(指派)
function getAssignMessage (rootState, payload, route) {
  const myinfo = LocalStorage.getItem('myself')
  var tag = ''
  var title = i18n.t('message.tag.feedback')
  var content = ''
  var text = myinfo.name + '指派给您一条任务'
  route.params.objectID = payload.Id || 0
  return {
    Module: {
      Id: payload.Id || 0,
      Title: title,
      Type: 'feedback' // 消息类型
    },
    Route: {
      Name: 'chatRoom',
      Params: JSON.stringify({ id: payload.Id || 0 }),
      Path: '/feedback/chat-room/' + payload.Id
    },
    SenderID: myinfo.id,
    SenderName: '',
    SenderImg: myinfo.img,
    SendTime: '',
    Title: text,
    Tag: tag,
    Type: 'feedback',
    Extra: {
      Content: content
    }
  }
}
