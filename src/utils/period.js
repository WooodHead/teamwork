import { date } from 'quasar'
import { i18n } from '@/boot/i18n'
const { formatDate, getDateDiff } = date
const nullTime = '1000-01-01'
function totalDays ({ status, beginDate, endDate, predictEndDate }) {
  let unit = 'days'
  const days = getDateDiff(status === 'done' ? endDate : predictEndDate, beginDate, unit)
  return Number.isNaN(days) ? 0 : days
}
/**
 * 弹出删除说明的填写提示，调用
 * @param {*} param0 
 */
export default function ({ status, beginDate, endDate, predictEndDate }) {
  if (!status) return
  let time = (beginDate && beginDate !== nullTime)
    ? formatDate(beginDate.replace(/-/g, '/'), 'YYYY.MM.DD')
    : ''
  time += ' - '
  if (status === 'done') {
    time += (endDate && endDate !== nullTime)
      ? formatDate(endDate.replace(/-/g, '/'), 'YYYY.MM.DD')
      : ''
  } else {
    time += (predictEndDate && predictEndDate !== nullTime)
      ? formatDate(predictEndDate.replace(/-/g, '/'), 'YYYY.MM.DD')
      : ''
  }
  let days = totalDays({ status, beginDate, endDate, predictEndDate })
  return days === 0
    ? time
    : days
      ? `${time}(${i18n.t('date.totalDays', { totalDays: days })})`
      : null
}
