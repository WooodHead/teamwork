
/**
 @Name：消息服务器JS客户端
 @Author：陈冬
 @date：2020/5/23
 @Copyright：西安精雕软件科技有限公司
 */
import Vue from 'vue'
const config = require('app/app.config.js')
// WebSocket客户端对象
var wsClient
// 封装WebSocket对外暴露对象
var socket = {
  /**
   * 初始化客户端对象信息
   * @param {Object} userID 登录人员ID
   * @param {Object} appMark 应用MARK
   */
  connect: function (userID, appMark, vuex) {
    // 初始化客户端信息
    ClientInfo.LoginUserID = userID
    ClientInfo.AppMark = appMark
    ClientInfo.ClientGUID = socket.uuid()
    ClientInfo.Vuex = {
      store: vuex && vuex.store,
      storeNamespaced: vuex && vuex.storeNamespaced,
      actionPrefix: vuex && vuex.actionPrefix
    }
    // 连接推送服务器
    try {
      const serverUrl = config.socket.serverUrl
      if ('WebSocket' in window) {
        wsClient = new WebSocket(serverUrl)
      } else if ('MozWebSocket' in window) {
        wsClient = new MozWebSocket(serverUrl)
      } else {
        wsClient = new SockJS(serverUrl)
      }
      // 启动后加载websocket事件
      socket.initEvent()
    } catch (e) {
      // 启动发生异常进行重连，直到连接成功为止
      socket.reconnect()
    }
  },
  /**
   * WebSocket客户端事件方法对象
   */
  initEvent: function () {
    // 事件绑定
    wsClient.onopen = function (event) {
      wsClient && wsClient.readyState === 1 && socket.regist()
    }
    wsClient.onmessage = function (event) {
      // 根据类型分发消息结果
      DistributeMessage(JSON.parse(event.data))
      // 获取消息后 重置心跳
      socket.heartCheck.reset()
    }
    wsClient.onerror = function (event) {
      ClientInfo.Vuex && ClientInfo.Vuex.store && ClientInfo.Vuex.storeNamespaced && ClientInfo.Vuex.actionPrefix && ClientInfo.Vuex.store.dispatch(`${ClientInfo.Vuex.storeNamespaced}/${ClientInfo.Vuex.actionPrefix}onerror`, event, { root: true })
      // 异常重连
      socket.reconnect()
    }
    wsClient.onclose = function (event) {
      ClientInfo.Vuex && ClientInfo.Vuex.store && ClientInfo.Vuex.storeNamespaced && ClientInfo.Vuex.actionPrefix && ClientInfo.Vuex.store.dispatch(`${ClientInfo.Vuex.storeNamespaced}/${ClientInfo.Vuex.actionPrefix}onclose`, event, { root: true })
      // 异常重连
      socket.reconnect()
    }
  },
  /**
   * 注册至推送服务器
   */
  regist: function () {
    if (wsClient && wsClient.send) {
      wsClient.send(JSON.stringify({
        actionType: 'Regist',
        messageContent: ClientInfo.LoginUserID + ',' +
          ClientInfo.ClientGUID + ',' +
          ClientInfo.AppMark
      }))
    }
  },
  /**
   * 强行登录
   */
  toLogin: function () {
    if (wsClient && wsClient.send) {
      wsClient.send(JSON.stringify({
        actionType: 'ToLogin',
        messageContent: ClientInfo.LoginUserID + ',' +
          ClientInfo.ClientGUID + ',' +
          ClientInfo.AppMark
      }))
    }
  },
  /**
   * 心跳检测
   */
  heartBeat () {
    if (wsClient && wsClient.send) {
      wsClient.send(JSON.stringify({
        actionType: 'HeartBeat',
        messageContent: ClientInfo.LoginUserID + ',' +
        ClientInfo.ClientGUID + ',' +
          ClientInfo.AppMark
      }))
    }
  },
  /**
   * 退出当前客户端
   */
  exit: function () {
    if (wsClient && wsClient.close) {
      wsClient.close()
      wsClient = null
    }
  },
  /**
   * websocket重连
   */
  isConnect: false,
  rec: null,
  reconnect: function () {
    // 如果已经连上就不在重连了
    if (socket.isConnect) return
    socket.isConnect = true
    socket.rec && clearTimeout(socket.rec)
    // 延迟5秒重连  避免过多次过频繁请求重连
    socket.rec = setTimeout(function () {
      socket.connect(ClientInfo.LoginUserID, ClientInfo.AppMark, ClientInfo.Vuex)
      socket.isConnect = false
    }, 5000)
  },
  /**
  * 心跳设置
  */
  heartCheck: {
    timeout: 20000,
    timeoutObj: null,
    // 一段时间后发送心跳包
    start: function () {
      this.timeoutObj = setTimeout(function () {
        wsClient && wsClient.readyState === 1 && socket.heartBeat()
      }, this.timeout)
    },
    //    接收到服务器的信息之后要重置心跳发送的方法
    reset: function () {
      clearTimeout(this.timeoutObj)
      this.start()
    }
  },
  /**
  * UUID工具
  */
  uuid: function () {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = ''
    var uuid = s.join('')
    return uuid.toUpperCase()
  }
}

/**
 * 消息分发
 * @param {Object} mssgObj
 */
function DistributeMessage (mssgObj) {
  if (mssgObj.MssgType === 'RegistResult') {
    // 如果是注册结果消息
    switch (Number(mssgObj.Message)) {
      case -8:
        console.log('注册失败，连接已断开，不能注册')
        break
      case -2:
        console.log('注册失败，服务端注册代码报错')
        break
      case -1:
        console.log('注册失败，客户端注册代码报错')
        break
      case 0:
        // console.log('注册失败，该用户已经登录')
        socket.toLogin()
        break
      case 1:
        // console.log('注册成功')
        break
      default:
        break
    }
  } else if (mssgObj.MssgType === 'HeartBeatBack') {
    // 如果是心跳检测消息
    let psonIds = _.uniq(_.map(mssgObj.Message.split(',').filter(p => p && p), item => item && Number(item)))
    ClientInfo.Vuex && ClientInfo.Vuex.store && ClientInfo.Vuex.storeNamespaced && ClientInfo.Vuex.actionPrefix && ClientInfo.Vuex.store.dispatch('person/updatePersonsOnlineStatus', psonIds, { root: true })
  } else {
    // 其它业务消息结果分发到store进行处理
    ClientInfo.Vuex && ClientInfo.Vuex.store && ClientInfo.Vuex.storeNamespaced && ClientInfo.Vuex.actionPrefix && ClientInfo.Vuex.store.dispatch(`${ClientInfo.Vuex.storeNamespaced}/${ClientInfo.Vuex.actionPrefix}connect`, { root: true })
    ClientInfo.Vuex && ClientInfo.Vuex.store && ClientInfo.Vuex.storeNamespaced && ClientInfo.Vuex.actionPrefix && ClientInfo.Vuex.store.dispatch(`${ClientInfo.Vuex.storeNamespaced}/${ClientInfo.Vuex.actionPrefix}onmessage`, mssgObj, { root: true })
  }
}

/**
 * 客户端信息
 */
var ClientInfo = {
  LoginUserID: '', // 登录用户ID
  AppMark: '', // 应用MARK
  ClientGUID: '', // 客户端GUID凭据
  Vuex: null // 客户端store配置参数
}

// 全局调用
Vue.prototype.$socket = socket // 组件中使用this.$socket
export default socket // js中引用 import socket from '@/boot/websocket'
