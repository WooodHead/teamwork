import QCalendar from '@quasar/quasar-ui-qcalendar'

function getLastDay (date, months) {
  const newDay = new Date(date.replace(/-/g, '/'))
  newDay.setDate(1) // 变为本月1号
  newDay.setMonth(QCalendar.parseTimestamp(date).month + months) // 后延n个月
  return QCalendar.parseDate(newDay)
}

export default {
  event: state => (id) => {
    return _.find(state.event, { id: +id }) || undefined
  },
  upToDate: (state) => {
    const date = getLastDay(state.selectedDate, state.intervalMonths)
    return QCalendar.addToDate(date, { day: -1 })
  },
  nextUpToDate: (state, getters) => {
    const upToDate = QCalendar.addToDate(getters.upToDate, { day: 1 })
    const date = getLastDay(upToDate.date, state.constMonths)
    return QCalendar.addToDate(date, { day: -1 })
  },
  eventsOneDay: (state) => (date, events = state.events) => {
    const currentDayIdentifier = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(date))
    return events.filter(event => currentDayIdentifier >= event.startDay && currentDayIdentifier <= event.endDay)
  },
  haveEventsOneDay: (state) => (date) => {
    const currentDayIdentifier = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(date))
    return state.events.some(event => currentDayIdentifier >= event.startDay && currentDayIdentifier <= event.endDay)
  }
}
