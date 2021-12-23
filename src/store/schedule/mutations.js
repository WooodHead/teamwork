
import Vue from 'vue'
import { LocalStorage, date } from 'quasar'
const { formatDate, isBetweenDates, subtractFromDate } = date
export default {
  setAddingEvent (state, adding) {
    state.addingEvent = adding
  },
  setClickEvent (state, click) {
    state.clickEvent = click
  },
  setSelectedDate (state, date) {
    state.selectedDate = date
  },
  /**
   * 如果当前选定的日期不在给定的时间范围内，这设置选定时间为起始时间
   *
   * @param {*} state
   * @param {*} {startTime,endTime}
   */
  setSelectedDateBetween (state, { startTime, endTime }) {
    const dateTarget = new Date(state.selectedDate.replace(/-/g, '/')),
      dateFrom = new Date(startTime.replace(/-/g, '/')),
      dateTo = new Date(endTime.replace(/-/g, '/'))
    if (!isBetweenDates(dateTarget, dateFrom, dateTo, { inclusiveFrom: true, inclusiveTo: true })) {
      state.selectedDate = formatDate(dateFrom, 'YYYY-MM-DD')
    }
  },
  addIntervalMonths (state) {
    // +1是因为constMonths加上一个本月才是每次显示的月数
    state.intervalMonths += (state.constMonths + 1)
  },
  initIntervalMonths (state) {
    state.intervalMonths = state.constMonths
  },
  setEvent (state, event) {
    state.event = event
  },
  clearEvents (state) {
    state.events.splice(0)
  },
  /**
   * 有则更新，无则新建
   *
   * @param {*} state
   * @param {*} events
   */
  addEvents (state, events) {
    const diff = _.differenceBy(events, state.events, 'id')
    state.events.push(...diff)
    const inter = _.intersectionBy(events, state.events, 'id')
    _(inter).each(function (event) {
      Object.assign(_.find(state.events, e => e.id === event.id), event)
    })
    state.events = _.sortBy(state.events, ['startTime', 'id'])
  },
  updateEvent (state, event) {
    Object.assign(_.find(state.events, e => e.id === event.id), event)
  },
  updateBeforeEventsRepeatUntil (state, { repeatId, until, modifyTime, modifyBy }) {
    const untilDate = formatDate(subtractFromDate(new Date(until.replace(/-/g, '/')), { days: 1 }), 'YYYY-MM-DD HH:mm:ss')
    _(_.filter(state.events, e => e.repeat.id === repeatId && e.startTime < until)).each(function (event) {
      event.repeat.until = untilDate
      event.modifyTime = modifyTime
      event.modifyBy = modifyBy
    })
  },
  setBeforeEventsToDontRepeat (state, { repeatId, until, modifyTime, modifyBy }) {
    _(_.filter(state.events, e => e.repeat.id === repeatId && e.startTime < until)).each(function (event) {
      event.repeat = { id: 0, type: state.repeatType.DONT_REPEAT, until: '' }
      event.modifyTime = modifyTime
      event.modifyBy = modifyBy
    })
  },
  setFutureEventsToDontRepeat (state, { repeatId, start, modifyTime, modifyBy }) {
    _(_.filter(state.events, e => e.repeat.id === repeatId && e.startTime > start)).each(function (event) {
      event.repeat = { id: 0, type: state.repeatType.DONT_REPEAT, until: '' }
      event.modifyTime = modifyTime
      event.modifyBy = modifyBy
    })
  },
  setArchivedCount (state, count) {
    state.archivedCount = count
  },
  setFutureEventsToArchived (state, { repeatId, start }) {
    _(_.filter(state.events, e => e.repeat.id === repeatId && e.startTime > start)).each(function (event) {
      const archived = true,
        archiveTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        archiveBy = LocalStorage.get('myself').name
      Object.assign(event, { archived, archiveTime, archiveBy })
    })
  },
  deleteEvent (state, id) {
    Vue.delete(state.events, state.events.findIndex(de => de.id === id))
  },
  deleteFutureRepeatEventsToo (state, id) {
    const startTime = _.find(state.events, e => e.repeat.id === id).startTime
    _(_.filter(state.events, e => e.repeat.id === id && e.startTime >= startTime)).each(function (e) {
      Vue.delete(state.events, state.events.findIndex(de => de.id === e.id))
    })
  },
  deleteFutureRepeatEventsStart (state, { repeatId, start }) {
    _(_.filter(state.events, e => e.repeat.id === repeatId && e.startTime > start)).each(function (e) {
      Vue.delete(state.events, state.events.findIndex(de => de.id === e.id))
    })
  }
}
