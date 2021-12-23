
import { mapActions } from 'vuex'
import { Loading, QSpinnerGears, Platform, LocalStorage } from 'quasar'
import Vue from 'vue'
import Push from 'push.js'
import request from '@/boot/axios'
// import im from '@/boot/im'
import socket from '@/boot/websocket'
import Person from '@/store/person/model'
import User from '@/store/auth/model'
import { wechatConfig } from '@/utils/wechat'
import setMyinfo from '@/utils/local-storage-myinfo'

const config = require('app/app.config.js')
const myInfo = LocalStorage.getItem('myself') || {}

Loading.setDefaults({ spinner: QSpinnerGears })

/**
 * 校验应用的版本
 * @returns 
 */
function verifyVersion () {
  let versionLocalStorage = LocalStorage.getItem('version')
  const versionCurrent = require('app/package.json').version
  if (versionCurrent !== versionLocalStorage) {
    return request.all([
      request.get('/persons/GetModel', { id: myInfo.id }),
      request.get('/auths/GetModel', { id: myInfo.userId })
    ]).then(request.spread((resP, resU) => {
      if (resP.data) {
        const person = Person.from(resP.data)
        setMyinfo(person)
      }
      if (resU.data) {
        const user = new User().from(resU.data)
        LocalStorage.set('user', user)
        LocalStorage.set('version', versionCurrent)
      }
    }))
  }
}

function browserFit () {
  if (Platform.is.chrome) {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = '.q-badge{padding-top: 4px;}'
    document.head.appendChild(style)
  }
  if (Platform.is.firefox) {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `.q-icon{padding-top:4px;}
        .q-avatar__content > span {margin-bottom: 4px;}
        .q-badge{padding-bottom: 4px;}
        .q-badge .q-icon{padding: 0px;}`
    document.head.appendChild(style)
  }
}
/**
 * 引用方式是在created钩子中init.call(this)
 * 不要在mounted中调用，原因是挂载时用到了$myinfo
 * 而这个时候可能还没有执行init，导致$myinfo未定义
 */
export default function () {
  wechatConfig()
  browserFit()
  verifyVersion()
  Vue.prototype.$myinfo = myInfo
  const action = {
    ...mapActions('settings', ['loadSettings']),
    ...mapActions('person', ['loadSelectPersons']),
    ...mapActions('organize', ['loadSelectOrganizes']),
    ...mapActions('duty', ['loadSelectDutys']),
    ...mapActions('role', ['loadSelectRoles'])
  }
  for (const load of Object.values(action)) {
    load.call(this)
  }
  socket.connect(
    myInfo.id,
    config.socket.appMark,
    { store: this.$store, storeNamespaced: 'websocket', actionPrefix: 'socket_' })
  // 定时监控用户在线状态
  // im.init(this.$store)
  // 外网条件需要执行的操作
  if (config.extranet) {
    // 请求用户浏览器弹框通知授权
    Push.Permission.request()
    // 清除本地存储的数据，相关数据直接从redis中获取
    LocalStorage.getItem('selectOrganizesLoc') && LocalStorage.remove('selectOrganizesLoc')
    LocalStorage.getItem('selectPersonsLoc') && LocalStorage.remove('selectPersonsLoc')
    LocalStorage.getItem('selectRolesLoc') && LocalStorage.remove('selectRolesLoc')
    LocalStorage.getItem('selectDutysLoc') && LocalStorage.remove('selectDutysLoc')
  }
}
