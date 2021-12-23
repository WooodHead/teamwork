import { date } from 'quasar'

const times = ['00:00', '08:30', '12:00', '13:00', '17:30', '24:00']
const hoursOfWork = [3.5, 4.5]
/**
 * 计算一天中一个时间点后的工时之和
 *
 * @param {*} time HH:mm
 */
function calcHoursOfWorkAfter (time) {
  let ts = [time, ...times]
  ts = ts.sort(stableSorting)
  const index = ts.lastIndexOf(time)
  let n = Math.floor(index / 2)
  if (index % 2) {
    if (n === 0) {
      return hoursOfWork[0] + hoursOfWork[1]
    } else if (n === 1) {
      return hoursOfWork[1]
    } else {
      return 0
    }
  } else {
    if (n === 1) {
      return getHourBetween(time, '12:00') + hoursOfWork[1]
    } else if (n === 2) {
      return getHourBetween(time, '17:30')
    } else {
      return 0
    }
  }
}
const stableSorting = (s1, s2) => {
  if (s1 < s2) return -1
  return 1
}
/**
 * 获取两个时间点相差小时数
 *
 * @param {String} time1 HH:mm
 * @param {String} time2 HH:mm
 * @returns
 */
function getHourBetween (time1, time2) {
  const hm1 = time1.split(':'), hm2 = time2.split(':')
  return ((+hm2[0] * 60 + (+hm2[1])) - (+hm1[0] * 60 + (+hm1[1]))) / 60
}
/**
 * 计算两个日期时间之间的工时总和(向下取小数点后一位)
 *
 * @export
 * @param {Date} date1 开始时间
 * @param {Date} date2 结束时间
 * @returns
 */
export function calcHoursOfWork (date1, date2) {
  if (date.isSameDate(date1, date2, 'day')) {
    return Math.floor((calcHoursOfWorkAfter(date.formatDate(date1, 'HH:mm')) -
    calcHoursOfWorkAfter(date.formatDate(date2, 'HH:mm'))) * 10) / 10
  } else {
    const diffDays = date.getDateDiff(date2, date1, 'days')
    return Math.floor((calcHoursOfWorkAfter(date.formatDate(date1, 'HH:mm')) +
      diffDays * 8 - calcHoursOfWorkAfter(date.formatDate(date2, 'HH:mm'))) * 10) / 10
  }
}
