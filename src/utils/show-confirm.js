import { Dialog } from 'quasar'
import { i18n } from '../boot/i18n'
/**
 * 显示确认信息
 * @param {String} message 消息文本
 * @param {Function} okCallback 确认后的回调函数
 * @param {Function} cancelCallback 取消后的回调函数
 * @param {String | Object | Boolean} okProps Props for an 'OK' button
 * @param {String | Object | Boolean} cancelProps Props for a 'CANCEL' button
 */
export function showConfirm (message, okCallback, cancelCallback, okProps, cancelProps) {
  Dialog.create({
    title: i18n.t('title.confirm'),
    message: message || i18n.t('message.reallyDelete'),
    ok: okProps !== void 0 ? okProps : true,
    cancel: cancelProps !== void 0 ? cancelProps : true,
    persistent: true,
    html: true
  }).onOk(okCallback).onCancel(cancelCallback)
}
