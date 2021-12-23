import { i18n } from '@/boot/i18n'
import logo from '@/boot/logo'
import { Notify, LocalStorage } from 'quasar'
const config = require('app/app.config.js')
import Push from 'push.js'
import Message from '../message/model'
import Discuss from '../discuss/model'
import Chat from '../chat/model'
import Notice from '@/store/notice/model'
import Feedback from '@/store/feedback/model'
import Consult from '@/store/consult/model'
import Assess from '@/store/assess/model'
import { getUrl } from '@/boot/file'
import htmlToText from '@/utils/html-to-text'
import request from '@/boot/axios'
import confetti from 'canvas-confetti'
// 即时类消息类别定义，目前有chat、discuss，consult后面可以追加新的即时类消息
var InstantType = ['chat', 'discuss', 'consult', 'notice', 'feedback', 'assess', 'answer', 'salary', 'position']
export default {
  /**
   * 接收消息
   *
   * @param {*} context
   * @param {*} m
   */
  socket_onmessage (context, m) {
    // 获取消息体
    var message = JSON.parse(m.Message)
    // 消息类别判断
    if (_.includes(InstantType, m.MssgType)) {
      InstantMessageProcessMethod(this, context, message, m.MssgType)
    } else if (m.MssgType === 'message') {
      message = Message.from(message)
      context.commit('message/addMessage', message, { root: true })
      if (notificationsOn() && allowsPopup() && rightTime() && hasLegalWay(message)) {
        popupMessage(this, context, message)
      }
    }
  },
  /**
   * 连接websocket
   *
   * @param {*} context
   * @param {*} data
   */
  socket_connect (context) {
    context.commit('socket_connect', true)
  },
  /**
   * 断开websocket
   *
   * @param {*} context
   * @param {*} data
   */
  socket_onclose (context, data) {
    // 更改连接状态为false
    context.commit('socket_connect', false)
    // 强制下线
    if (Number(data.reason) === -3) {
      // 1.清缓存
      // context.dispatch('auth/logoutUser', null, { root: true })
      // 2.发通知
      // Notify.create({
      //   message: '您的账号已在别处登录，如果怀疑帐号密码泄漏，请及时联系管理员修改密码',
      //   color: 'warning',
      //   icon: 'warning',
      //   classes: 'q-pa-sm'
      // })
    }
  },

  /**
   * 连接websocket发生错误
   *
   * @param {*} context
   * @param {*} data
   */
  socket_onerror (context, data) {
    console.log('actions_socket_onerror' + JSON.stringify(data))
  }
}

/**
 * 即时类消息处理方法定义
 * @param {*} _this Store object
 * @param {*} context websocket module
 * @param {*} model business model
 * @param {*} type business type
 */
function InstantMessageProcessMethod (_this, context, model, type) {
  // 根据业务类型，更新业务数据
  switch (type) {
    case 'chat': // 聊天数据更新
      var chat = Chat.from(model)
      chat.fromName = context.rootState.person.selectPersons && context.rootState.person.selectPersons[chat.fromId].name
      chat.fromAvatar = context.rootState.person.selectPersons && context.rootState.person.selectPersons[chat.fromId].img
      context.commit('chat/addMessage', chat, { root: true })
      break
    case 'discuss': // 讨论数据更新
      context.commit('discuss/addComment', Discuss.from(model), { root: true })
      break
    case 'notice': // 公告数据更新
      context.commit('notice/addNotice', Notice.from(model), { root: true })
      break
    case 'answer': // 公告数据更新
      context.commit('checkins/addAnswer', answer.from(model), { root: true })
      break
    case 'consult': // 咨询数据更新
      context.commit('consult/updateConsult', Consult.Consult.from(model), { root: true })
      break
    case 'feedback': // 在线反馈数据更新
      context.commit('feedback/updateFeedbackFromWebsocket', Feedback.from(model), { root: true })
      break
    case 'assess': // 商机评估数据更新
      context.commit('assess/updateAssessExt', Assess.from(model), { root: true })
      break
    case 'salary': // 工资条数量更新
      context.commit('salary/setSalaryCountAndStatus', _.isArray(model) ? model[0] : model, { root: true })
      break
    case 'position': // 职位职级数量更新
      context.commit('position/setPositionBatchCountAndStatus', _.isArray(model) ? model[0] : model, { root: true })
      break
    default:
      break
  }
}
// 弹框数组
var PushArray = []
/**
 * 弹出消息
 *
 * @param {*} context
 * @param {*} message
 */
async function popupMessage (_this, context, message) {
  var myInfo = LocalStorage.getItem('myself')
  let feedback = {}
  if (message.type === 'feedback' && !myInfo.auth.role.isSupporter) {
    let res = await request.get('feedback/getModel', { id: message.route.params.id })
    feedback = Feedback.from(res.data)
  }
  // 判断路由是否是当前打开页面
  if (((message.type !== 'feedback' || (message.type === 'feedback' && myInfo.auth.role.isSupporter)) && message.route.name !== _this.$router.currentRoute.name) ||
    (message.type === 'feedback' && !myInfo.auth.role.isSupporter && !context.rootState.feedback.isVisible) ||
    (message.type === 'feedback' && !myInfo.auth.role.isSupporter && context.rootState.feedback.isVisible && !context.rootState.feedback.roomState && feedback.state < 2) ||
    (message.type === 'feedback' && !myInfo.auth.role.isSupporter && context.rootState.feedback.isVisible && !context.rootState.feedback.newChat && feedback.state === 2)
  ) {
    // a.获取弹框图标
    let img = logo['favicon.ico']
    if (message.senderImg !== '') {
      img = getUrl(message.senderImg)
    }
    // b.获取title
    var title = ''
    if (message.type === 'chat') {
      title = message.senderName + ' ' + message.title
    } else {
      title = message.title !== '' ? message.title : ''
    }
    // c.获取body
    var body = ''
    if (message.type === 'chat' || message.type === 'boost') {
      body = htmlToText(message.extra && message.extra.Content)
    } else {
      body = message.module.title !== '' ? message.module.title : ''
    }
    // 判断是否外网
    if (config.extranet) {
      // b.桌面弹框气泡提醒
      Push.create(title, {
        body: body,
        icon: img, // 可以设置通知界面上大小为16x16或32x32像素的小图标。
        // requireInteraction: true, // 如果设置成true的话，通知不会自动关闭，除非人工手动点击关闭。
        timeout: 30000,
        onClick: function () {
          // 消息点击变成已读，并且跳转相应的业务路由
          context.dispatch('message/readMessage', message.id, { root: true }).then(res => {
            if (message.type === 'feedback' && !myInfo.auth.role.isSupporter) {
              context.commit('feedback/setFeedbacks', [feedback], { root: true })
              if (feedback.state === 2) {
                context.commit('feedback/setNewChat', true, { root: true })
                context.commit('feedback/setRoom', false, { root: true })
                context.commit('feedback/setIsVisible', true, { root: true })
                context.commit('feedback/setMessage', true, { root: true })
                context.commit('feedback/setNewChatId', message.route.params.id, { root: true })
              } else {
                context.commit('feedback/setNewChat', false, { root: true })
                context.commit('feedback/setIsVisible', true, { root: true })
                context.commit('feedback/setRoom', true, { root: true })
                context.commit('feedback/setMessage', false, { root: true })
              }
            } else {
              // 消息对应路由跳转
              _this.$router.push(message.route)
            }
          })
          window.focus()
          this.close()
        }
      })
    } else {
      // 定义弹框的key值
      var popupKey = message.id + new Date().getTime()
      // 弹出框
      const dismiss = Notify.create({
        position: 'bottom-right',
        timeout: 0,
        message: `<div onclick="RouteJump(${popupKey})" style="cursor: pointer;width: 200px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">${title}</div>`,
        caption: `<div onclick="RouteJump(${popupKey})" style="cursor: pointer;width: 200px;min-height:36px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">${body}</div>`,
        html: true,
        textColor: 'cyan-9',
        color: 'blue-1',
        avatar: img,
        actions: [
          {
            icon: 'close',
            dense: true,
            round: true,
            label: '',
            color: 'cyan-9',
            handler: () => {
              PushArray.splice(0, 1)
            }
          }
        ],
        multiLine: false
      })
      // 弹框添加到数据，用户后面的弹框数量控制
      PushArray.push(dismiss)
      // 存储需要跳转的路由信息以及跳帧方法
      context.state.push = { ...context.state.push, ...{ [popupKey]: { id: message.id, message: message, dismiss: dismiss } } }
      // 点击方法定义
      window.RouteJump = (key) => {
        var push = context.state.push[key]
        // 关闭跟当前点击需要跳转的路由相同的所有消息弹框（也包括当前弹框）
        _.forEach(_.values(context.state.push), e => {
          if (e.message.route.path === push.message.route.path) {
            e.dismiss()
          }
        })
        // 变成已读
        context.dispatch('message/readMessage', push.message.id, { root: true })
        // 路由跳转
        if (message.type === 'feedback' && !myInfo.auth.role.isSupporter) {
          context.commit('feedback/setFeedbacks', [feedback], { root: true })
          if (feedback.state === 2) {
            context.commit('feedback/setNewChat', true, { root: true })
            context.commit('feedback/setRoom', false, { root: true })
            context.commit('feedback/setIsVisible', true, { root: true })
            context.commit('feedback/setMessage', true, { root: true })
            context.commit('feedback/setNewChatId', message.route.params.id, { root: true })
          } else {
            context.commit('feedback/setNewChat', false, { root: true })
            context.commit('feedback/setIsVisible', true, { root: true })
            context.commit('feedback/setRoom', true, { root: true })
            context.commit('feedback/setMessage', false, { root: true })
          }
        } else {
          // 消息对应路由跳转
          _this.$router.push(push.message.route)
        }
      }
      // 判断弹框的数量
      if (PushArray.length > 5) {
        PushArray[0]()
        PushArray.splice(0, 1)
      }
    }
  } else {
    // 非打开当前路由状态
    // 消息变成已读
    context.dispatch('message/readMessage', message.id, { root: true })
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
    // 彩球
    const randomInRange = function (min, max) {
      return Math.random() * (max - min) + min
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
    var messcontent = ''
    if (message.type === 'feedback') {
      let feedback = {}
      let res = await request.get('feedback/getModel', { id: message.route.params.id })
      feedback = Feedback.from(res.data)
      messcontent = feedback.content[feedback.content.length - 1].content
    } else {
      messcontent = message.extra.Content
    }
    // 庆祝
    if (messcontent === '🎉') {
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
    } else if (messcontent === '🎊') {
      // 彩球
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
    } else if (messcontent === '💯' || messcontent === '🥇') {
      // 满分、得奖
      var end = Date.now() + (15 * 1000)
      // go Buckeyes!
      var colors = ['#bb0000', '#ffffff']
      frame()
    }
  }
}
// 通知是否打开
function notificationsOn () {
  var myInfo = LocalStorage.getItem('myself')
  return !myInfo.settings.notificationsOff && !myInfo.settings.focusMode
}
// 有通知方式（number类型不影响）
function allowsPopup () {
  var myInfo = LocalStorage.getItem('myself')
  return myInfo.settings.howToNotify.includes('popup')
}
// 合适的时间
function rightTime () {
  var myInfo = LocalStorage.getItem('myself')
  let date = new Date()
  let index = date.getDay()
  let nowTime = date.getTime()
  let indexDay = i18n.t('settings.weekOptions')[index]
  let startTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + myInfo.settings.whenToNotify.startTime
  let endTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + myInfo.settings.whenToNotify.endTime
  startTime = new Date(startTime).getTime()
  endTime = new Date(endTime).getTime()
  let anytime = myInfo.settings.whenToNotify.type === 'always'
  let rightTm = myInfo.settings.whenToNotify.days.split(',').includes(indexDay.value) && startTime <= nowTime && nowTime <= endTime
  return anytime || rightTm
}

// 是否包含允许的类型
function hasLegalWay (message) {
  var myInfo = LocalStorage.getItem('myself')
  if (myInfo.settings.whatToNotify.type === 'everything') {
    return true
  } else if (myInfo.settings.whatToNotify.type === 'ping') {
    return myInfo.settings.whatToNotify.selection.includes('chat')
  } else {
    return myInfo.settings.whatToNotify.selection.includes(message.type)
  }
}
