import { LocalStorage } from 'quasar'
import Vue from 'vue'
/**
 * 所有变更myinfo数据的地方，必须调用该方法，
 * 禁止直接LocalStorage.set('myself', myinfo)
 */
export default function (myinfo) {
  LocalStorage.set('myself', myinfo)
  Vue.prototype.$myinfo = myinfo
}
