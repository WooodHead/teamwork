import { date } from 'quasar'
const { formatDate, getDateDiff } = date

/**
 * 同一天只显示一次日期，本年度不显示年份，如果没有开始时间，则只格式化结束时间
 *
 * @export
 * @param {*} { startTime, endTime, allDay = false, charMonth = false }
 * @param {Boolean} isShowDiffDay 是否显示开始时间与结束时间后面的天数差，默认显示
 * @returns 03-27 01:00 ~ 04-04 18:00 (8天)/三月 27 01:00 - 四月 04 18:00 (8天)
 */
export default function timeRangeFormat ({ startTime, endTime, allDay = false, charMonth = false, isShowDiffDay = true }) {
  const separaterInside = charMonth ? ' ' : '-',
    separaterOutside = charMonth ? ' - ' : ' ~ ',
    monthFormat = charMonth ? 'MMM' : 'MM',
    startDate = startTime ? new Date(startTime.replace(/-/g, '/')) : new Date('1000/01/01'),
    endDate = endTime ? new Date(endTime.replace(/-/g, '/')) : new Date('1000/01/01'),
    today = new Date(),
    startYearFormat = getDateDiff(startDate, today, 'years') ? `YYYY${separaterInside}` : '',
    endYearFormat = getDateDiff(endDate, today, 'years') ? `YYYY${separaterInside}` : '',
    dateFormat = `${monthFormat}${separaterInside}DD`,
    timeFormat = allDay ? '' : ' HH:mm'
  if (startDate.getFullYear() > 1000 && endDate.getFullYear() > 1000) {
    return `${formatDate(startDate, startYearFormat + dateFormat + timeFormat)}
    ${separaterOutside}
    ${formatDate(endDate, endYearFormat + dateFormat + timeFormat)} 
    ${isShowDiffDay ? `(${getDateDiff(endDate, startDate, 'days') + 1}天)` : ''}`
  } else if (startDate.getFullYear() > 1000 && endDate.getFullYear() <= 1000) {
    return `${formatDate(startDate, startYearFormat + dateFormat + timeFormat)}${separaterOutside}-- `
  } else if (startDate.getFullYear() <= 1000 && endDate.getFullYear() > 1000) {
    return ` --${separaterOutside}${formatDate(endDate, endYearFormat + dateFormat + timeFormat)}`
  } else {
    return ''
  }
}
