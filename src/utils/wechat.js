import { Platform } from 'quasar'
import request from '@/boot/axios'
const { wechat, appUrl, extranet } = require('app/app.config.js')

export function wechatAuthUrl (state = '/') {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechat.wx_appid}&response_type=code&scope=snsapi_base&agentid=${wechat.wx_agentid}&state=${state}&redirect_uri=${appUrl.client}/wxlogin#wechat_redirect`
}

export function wechatConfig () {
  if (!wechat || !extranet || Platform.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
    return
  }
  request.get('wechat/getSignPackage', { requestUrl: window.location.href.split('#')[0] }).then(res => {
    window.wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wechat.wx_appid, // 必填，企业微信的corpID
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.noncentr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: ['closeWindow', 'agentConfig', 'openUserProfile', 'thirdPartyOpenPage', 'selectExternalContact'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    })
  })
  window.wx.ready(function () {
    console.log('成功配置')
  })
  window.wx.error(function (res) {
    console.log('错误配置')
    console.log(res)
  })
}

export function oaApproval ({ openTemplateId, thirdNo }) {
  if (!wechat || !extranet || Platform.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
    return
  }
  request.get('wechat/getAppSignPackage', { requestUrl: window.location.href.split('#')[0] }).then(res => {
    wx.agentConfig({
      corpid: wechat.wx_appid, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: wechat.wx_agentid, // 必填，企业微信的应用id
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.noncentr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名，见附录1
      jsApiList: ['thirdPartyOpenPage'], // 必填
      success: function (res) {
        // 查看审批详情
        wx.invoke('thirdPartyOpenPage',
          { 'oaType': '10002', 'templateId': openTemplateId, 'thirdNo': thirdNo },
          function (res) {
            console.log('agentConfig回调信息')
            // 输出接口的回调信息
            console.log(res)
          })
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
        if (res.errMsg.indexOf('function not exist') > -1) {
          console.log('版本过低请升级')
        }
      }
    })
  })
}
