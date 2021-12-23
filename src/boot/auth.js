import { SessionStorage, LocalStorage, Platform } from 'quasar'
import { wechatAuthUrl } from '@/utils/wechat.js'
const jwtDecode = require('jwt-decode')
const { extranet } = require('app/app.config.js')

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const protectedRoute = to.matched.some(route => route.meta.requiresAuth)
    if (to.name === 'login') {
      const user = LocalStorage.getItem('user')
      if (user) {
        // 解析jwt令牌,存储token过期时间
        const token = LocalStorage.getItem('token')
        const jwtPayload = jwtDecode(token)
        const tokenExp = new Date(jwtPayload.exp * 1000)
        const now = new Date()
        if (now < tokenExp) {
          next({ path: '/' })
        }
      }
    }
    // Allow guest routes
    if (!protectedRoute) return next()
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const loggedIn = SessionStorage.getItem('loggedIn')
    if (!loggedIn) {
      // 如果不在线，判断在LocalStorage是否有上次登录人的消息
      // 如果有的话就不用登录了
      const user = LocalStorage.getItem('user')
      if (user) {
        if (to.query.userid) {
          // 判断route.query中是否有userid, 如果有的话，说明是通过邮件打开的
          // 判断下邮件接受人userid是否和LocalStorage是同一个，是的话就直接打开
          // 否则需要登录
          if (Number(to.query.userid) === user.userId) {
            SessionStorage.set('loggedIn', true)
            next()
          } else {
            // 跳转登录
            toLogin(to, next)
          }
        } else {
          SessionStorage.set('loggedIn', true)
          next()
        }
      } else {
        // 跳转登录
        toLogin(to, next)
      }
    } else {
      next()
    }
  })
}
/**
 * 跳转登录
 * @param {*} to
 * @param {*} next
 */
function toLogin (to, next) {
  // 主动退出需要清缓存
  SessionStorage.clear()
  LocalStorage.clear()
  // 内网或非微信浏览器打开，采用普通登录
  if (!extranet || Platform.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else { // 外网且微信浏览器打开，采用微信认证登录
    window.location.href = wechatAuthUrl(to.fullPath)
  }
}
