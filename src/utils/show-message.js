import { Dialog, Loading, Notify, format } from 'quasar'
import { i18n } from '../boot/i18n'
const { capitalize } = format
/**
 * 显示错误信息
 * @param {String} message 消息文本
 */
export function showErrorMessage (message) {
  Loading.hide()
  Dialog.create({
    title: i18n.t('title.error'),
    message: message,
    cancel: false,
    persistent: true
  })
}
/**
 * 显示成功信息
 * @param {String} message 消息文本
 */
export function showSuccessMessage (message = i18n.t('message.submitted')) {
  Loading.hide()
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: message,
    timeout: '900'
  })
}
/**
 * 显示警告消息
 * @param {String} message 消息文本
 */
export function showWarningMessage (message) {
  if (capitalize(message) !== 'Undefined') {
    Loading.hide()
    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: message,
      timeout: '900'
    })
  }
}
