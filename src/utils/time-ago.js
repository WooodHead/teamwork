import { format } from 'timeago.js'
import { Quasar, date } from 'quasar'
const { formatDate, getDateDiff } = date,
  lang = Quasar.lang.getLocale(),
  langAlias = {
    'en-us': 'en_US',
    'zh-cn': 'zh_CN'
  }
/**
 * 使用timeago格式化时间
 *
 * @export
 * @param {*} { dateTime, allDay = false, days = 1 } 几天内的使用timeago
 * @returns an hour ago/一小时前
 */
export default function timeAgo ({ dateTime = '', allDay = false, days = 1 } = {}) {
  const today = new Date(),
    thisDate = new Date(dateTime.replace(/-/g, '/')),
    timeFormat = allDay ? '' : ' HH:mm'
  if (getDateDiff(today, thisDate, 'days') > days - 1) {
    if (getDateDiff(today, thisDate, 'years') > 0) {
      return formatDate(dateTime, 'YYYY MMM DD' + timeFormat)
    } else {
      return formatDate(dateTime, 'MMM DD ddd' + timeFormat)
    }
  } else {
    const tg = format(dateTime, langAlias[lang])
    return tg.includes('后') ? '刚刚' : tg
  }
}
