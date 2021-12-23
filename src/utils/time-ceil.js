import { date } from 'quasar'
const { endOfDate, getDateDiff, addToDate, subtractFromDate } = date
/** 按照给定的精度进行上舍入时间 */
export default function timeCeil ({ date = Date.now(), precision = 'halfhour' } = {}) {
  let newDate = addToDate(endOfDate(date, 'hour'), { seconds: 1 })
  if (precision === 'halfhour') {
    if (getDateDiff(newDate, date, 'minutes') > 30) {
      return subtractFromDate(newDate, { minutes: 30 })
    } else {
      return newDate
    }
  } else if (precision === 'hour') {
    return newDate
  } else {
    return dete
  }
}
