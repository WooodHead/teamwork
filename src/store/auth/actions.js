import { SessionStorage, LocalStorage, date } from 'quasar'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import custom from '@/boot/custom'
import md5 from 'js-md5'
import User from './model'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Person from '@/store/person/model'
import emailResetPassword from '@/email/email-reset-password.html'
import setMyinfo from '@/utils/local-storage-myinfo'

const { formatDate } = date
const url = {
  wxlogin: 'wechat/login',
  login: 'auths/login',
  register: 'auths/register',
  sendSmsCode: 'auths/SendSmsCode',
  logout: 'auths/Logout',
  sendResetPasswordEmail: 'auths/sendResetPasswordEmail',
  sendSupportEmail: 'auths/sendSupportEmail',
  resetPassword: 'auths/ResetPassword',
  add: 'auths/Add',
  update: 'auths/UpdateFields',
  changePassword: 'auths/ChangePassword',
  activated: 'auths/Activate',
  delete: 'auths/Delete'
}
export default {
  registerUser ({ commit, rootState }, payload) {
    const { userName, password, email, tel } = payload,
      user = new User({ userName, password, email, tel }).to()
    user.registerInfo = {
      RecordNum: payload.jobNumber,
      OrganizeName: payload.organize,
      DutyName: payload.duty
    }
    user.CMessage = getMessage(rootState, user)
    user.CMessage.Title = userName + '申请注册成为新用户'
    return request.post(url.register, user)
      .then(() => {
        return true
      }, error => {
        showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loginUser ({ commit }, payload) {
    if (payload.type === 'pwd') {
      payload.password = md5(payload.password)
    }
    return request.get(payload.type === 'wx' ? url.wxlogin : url.login, payload)
      .then(res => {
        commit('setLoggedIn', true)
        SessionStorage.set('loggedIn', true)
        const data = res.data
        const user = new User().from(data.user)
        const person = Person.from(data.person)
        commit('setUserInfo', user)
        LocalStorage.set('user', user)
        setMyinfo(person)
        LocalStorage.set('token', data.token)
        return { isOK: true }
      }).catch(error => {
        payload.type !== 'wx' && error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return { isOK: false, message: error.userMessage && i18n.t(`auth.error.${error.userMessage}`) }
      })
  },
  logoutUser ({ state, commit }) {
    // const user = LocalStorage.getItem('user') || {}
    // request.put(url.logout, { id: user.userId })
    commit('setLoggedIn', false)
    commit('setUserInfo', null)
    // commit('project/setLoadedDashboard', false, { 'root': true })
    SessionStorage.clear()
    LocalStorage.remove('user')
    LocalStorage.remove('myself')
    LocalStorage.remove('token')
    // LocalStorage.clear() // 主动退出需要清缓存
  },
  sendVerificationCode ({ commit }, userName) {
    return request.get(url.sendSmsCode, { userName })
      .then((res) => {
        showSuccessMessage(i18n.t('auth.success.sentSuccessfully'))
        return true
      }).catch(error => {
        showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  sendResetPasswordEmail ({ commit }, email) {
    return request.post(url.sendResetPasswordEmail,
      {
        email,
        title: i18n.t('auth.resetYourPassword'),
        content: emailResetPassword
          .replace('{logoSrc}', custom.logoSrc)
          .replace('{lang}', i18n.locale)
          .replace('{hiThere}', i18n.t('auth.hiThere', { name: '{name}' }))
          .replace('{cantRememberYourPassword}', i18n.t('auth.cantRememberYourPassword'))
          .replace('{setANewPasswordNow}', i18n.t('auth.setANewPasswordNow'))
          .replace('{resetPasswordUrl}', `${window.location.origin}/reset-password?token={token}`)
          .replace('{theValidityTimeIs15Minutes}', i18n.t('auth.theValidityTimeIs15Minutes'))
          .replace('{contactoOurSupportTeam}', i18n.t('auth.contactoOurSupportTeam'))
          .replace('{wellGetBackToYou}', i18n.t('auth.wellGetBackToYou'))
      })
      .then((res) => {
        showSuccessMessage(i18n.t('auth.success.sentSuccessfully'))
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // cyt 发送问题反馈邮件
  sendSupportEmail ({ commit }, email) {
    return request.post(url.sendSupportEmail, email)
      .then((res) => {
        showSuccessMessage(i18n.t('auth.success.sentSuccessfully'))
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  resetPassword ({ commit }, { password, token }) {
    password = md5(password)
    return request.put(`${url.resetPassword}?token=${token}`,
      { password, token })
      .then((res) => {
        showSuccessMessage(i18n.t('auth.success.resetPasswordSuccessfully'))
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  addUser ({ commit }, payload) {
    if (!payload.noMd5) {
      payload.password = md5(payload.password)
    }
    _.unset(payload, 'noMd5')
    const { userName, password, email, tel } = payload,
      user = new User({ userName, password, email, tel }).to()
    user.Activated = 1
    return request.post(url.add, user)
      .then(res => {
        const data = res.data
        const user = new User().from(data)
        return user
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  updatePassword ({ commit }, payload) {
    payload.password = md5(payload.password)
    const { userId, password } = payload
    return request.put(url.changePassword, { UserId: userId, Password: password })
      .then(res => {
        const data = res.data
        const user = new User().from(data)
        return user
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  updateUser ({ commit }, payload) {
    payload.password = payload.password ? md5(payload.password) : ''
    const { userId, userName, email, tel, password } = payload
    let fields = { userId }
    userName && userName !== '' && Object.assign(fields, { userName })
    email && email !== '' && Object.assign(fields, { email })
    tel && tel !== '' && Object.assign(fields, { tel })
    password && password !== '' && Object.assign(fields, { password })
    let user = new User(fields).to()
    !_.has(fields, 'userName') && delete user['UserName']
    !_.has(fields, 'password') && delete user['Password']
    !_.has(fields, 'email') && delete user['Email']
    !_.has(fields, 'tel') && delete user['Tel']
    !_.has(fields, 'activated') && delete user['Activated']
    return request.put(url.update, user)
      .then(res => {
        const data = res.data
        const user = new User().from(data)
        return user
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  activatedUser ({ commit }, payload) {
    let { userId, activated } = payload
    activated = activated ? 1 : 0
    let user = new User({ userId, activated }).to()
    return request.put(url.activated, user)
      .then(res => {
        const data = res.data
        const user = new User().from(data)
        return user
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  deleteUser ({ state, commit }, id) {
    return request.delete(url.delete, { id: id })
      .then(res => {
        return res.data
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}

// 定义一个消息model
function getMessage (rootState, user) {
  var type = 'approval' // 消息类型
  const messageType = rootState.message.messageType[type]
  var datetime = new Date().getTime()
  return {
    Module: {
      Id: 0,
      Title: '用户注册审批',
      Type: 'person'
    },
    Route: {
      Name: 'personApproval',
      Params: JSON.stringify({ datetime: datetime }),
      Path: `/person/${datetime}/approval`
    },
    SenderID: 0,
    SenderName: '',
    SenderImg: '',
    SendTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    Tag: messageType.tag,
    Type: type,
    Extra: _.clone(user)
  }
}
