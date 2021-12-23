import { date } from 'quasar'
/**
 * 状态过滤器，目前只是把结束日期大于当前日期的doing改为putoff
 * @param {string} value 状态
 * @param {string} endDate 结束日期
 */
export function statusFilter (value, endDate) {
  if (value === 'doing' && endDate) {
    let days = date.getDateDiff(endDate.replace(/-/g, '/'), new Date(), 'days')
    return days < 0 ? 'putoff' : value
  } else {
    return value
  }
}
