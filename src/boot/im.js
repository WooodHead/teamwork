import request from '@/boot/axios'
const config = require('app/app.config.js')
var heartbeatTimer, store
var im = {
  // 初始化
  init: (vuex) => {
    // 获取store对象
    store = vuex
    // 首次登陆更新在线状态
    im.sendHeartBeat()
    // 定时发送心跳消息(每5分钟一次)，更新所有用户在线状态
    heartbeatTimer = setInterval(im.sendHeartBeat, config.imHeartBeatTime)
  },
  /**
   * 检测在线用户
   */
  sendHeartBeat: () => {
    request.get('/ims/heartbeatonline').then(res => {
      res.data ? refreshUserOnline(res.data) : clearInterval(heartbeatTimer)
    }).catch(e => { clearInterval(heartbeatTimer) })
  },
  /**
   * 清除定时器
   */
  clearInterval: () => {
    clearInterval(heartbeatTimer)
  }
}

/**
 * 更新所有用户在线状态
 * @param {*} psonIds 在线用户PsonIDs字符串
 */
function refreshUserOnline (psonIds) {
  store.dispatch('person/updatePersonsOnlineStatus', psonIds, { root: true })
  // console.log('在线人数：' + psonIds.length)
}
// 导出调用对象
export default im
