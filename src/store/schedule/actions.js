import QCalendar from '@quasar/quasar-ui-qcalendar'
import { date } from 'quasar'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showSuccessMessage, showWarningMessage, showErrorMessage } from '@/utils/show-message'
import Event from './model'
const { formatDate, addToDate, getDateDiff } = date
const url = {
  model: 'schedules/getmodel',
  list: 'schedules/getlist',
  pageList: 'schedules/getPagelist',
  aMonthList: 'schedules/getAMonthList',
  count: 'schedules/getcount',
  add: 'schedules/add',
  addBatch: 'schedules/addbatch',
  update: 'schedules/update',
  updateBeforeEventsRepeatUntil: 'schedules/updateBeforeEventsRepeatUntil',
  setBeforeEventsToDontRepeat: 'schedules/setBeforeEventsToDontRepeat',
  setFutureEventsToDontRepeat: 'schedules/setFutureEventsToDontRepeat',
  move: 'schedules/move',
  copy: 'schedules/copy',
  delete: 'schedules/delete',
  archive: 'schedules/archive',
  unarchive: 'schedules/unarchive',
  getHistory: 'schedules/getHistory'
}
/**
 * 判断一个时间段是否与某月有交集
 * @param {string} startTime 时间段的开始时间，如：2020-03-29 6:54
 * @param {string} endTime 时间段的结束时间，格式同上
 * @param {object} monthDate 当前月份某日期对象，calendar的timestamp
 */
function intersectionWithCurMonth (startTime, endTime, monthDate) {
  const startDate = QCalendar.parseTimestamp(startTime)
  const startMonth = startDate.year * 12 + startDate.month
  const endDate = QCalendar.parseTimestamp(endTime)
  const endMonth = endDate.year * 12 + endDate.month
  const curMonth = monthDate.year * 12 + monthDate.month
  return !((curMonth - startMonth && curMonth - endMonth) || (startMonth - curMonth && endMonth - curMonth))
}
/**
 * 产生重复的事件
 *
 * @param {*} model
 * @param {*} repeatType
 * @returns
 */
function generateRepeatEvents (model, repeatType) {
  const repeatModels = [],
    startDate = new Date(model.startTime.replace(/-/g, '/')),
    endDate = new Date(model.endTime.replace(/-/g, '/')),
    untilDate = new Date(model.repeat.until.replace(/-/g, '/')),
    formatString = model.allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm',
    initIndex = model.repeat.index
  if (model.repeat.type === repeatType.EVERY_DAY) {
    const days = getDateDiff(untilDate, startDate, 'days')
    for (let day = 1; day <= days; day++) {
      let newModel = _.cloneDeep(model)
      newModel.startTime = formatDate(addToDate(startDate, { days: day }), formatString)
      newModel.startDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.startTime))
      newModel.endTime = formatDate(addToDate(endDate, { days: day }), formatString)
      newModel.endDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.endTime))
      newModel.repeat.index = initIndex + day
      repeatModels.push(newModel)
    }
  } else if (model.repeat.type === repeatType.EVERY_WEEK) {
    const weeks = Math.floor(getDateDiff(untilDate, startDate, 'days') / 7)
    for (let week = 1; week <= weeks; week++) {
      let newModel = _.cloneDeep(model)
      newModel.startTime = formatDate(addToDate(startDate, { days: week * 7 }), formatString)
      newModel.startDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.startTime))
      newModel.endTime = formatDate(addToDate(endDate, { days: week * 7 }), formatString)
      newModel.endDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.endTime))
      newModel.repeat.index = initIndex + week
      repeatModels.push(newModel)
    }
  } else if (model.repeat.type === repeatType.EVERY_MONTH) {
    const months = getDateDiff(untilDate, startDate, 'months')
    for (let month = 1; month <= months; month++) {
      let newModel = _.cloneDeep(model)
      newModel.startTime = formatDate(addToDate(startDate, { month: month }), formatString)
      newModel.startDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.startTime))
      newModel.endTime = formatDate(addToDate(endDate, { month: month }), formatString)
      newModel.endDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.endTime))
      newModel.repeat.index = initIndex + month
      repeatModels.push(newModel)
    }
  } else if (model.repeat.type === repeatType.EVERY_QUARTER) {
    const quarters = Math.floor(getDateDiff(untilDate, startDate, 'months') / 3)
    for (let quarter = 1; quarter <= quarters; quarter++) {
      let newModel = _.cloneDeep(model)
      newModel.startTime = formatDate(addToDate(startDate, { month: quarter * 3 }), formatString)
      newModel.startDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.startTime))
      newModel.endTime = formatDate(addToDate(endDate, { month: quarter * 3 }), formatString)
      newModel.endDay = QCalendar.getDayIdentifier(QCalendar.parseTimestamp(newModel.endTime))
      newModel.repeat.index = initIndex + quarter
      repeatModels.push(newModel)
    }
  }
  return repeatModels
}
function queryByResource ({ resourceCategory, resourceId }) {
  if (resourceCategory === 'person') {
    // 人员日程要穿透到所有资源中查找,
    // 要查找自建或别人给建立的
    const query =
      [
        [
          { Key: 'ObjectType', Value: resourceCategory, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: resourceId, Oper: 'eq' }
        ],
        'or',
        { Key: 'Withs', Value: resourceId, Oper: 'inset' }
      ]
    return query
  } else {
    const query =
      [
        { Key: 'ObjectType', Value: resourceCategory, Oper: 'eq' }
      ]
    if (resourceId) {
      query.push('and')
      query.push({ Key: 'ObjectID', Value: resourceId, Oper: 'eq' })
    }
    return query
  }
}
function queryByDateRange (firstDate, upToDate) {
  const firstDay = QCalendar.getDayIdentifier(firstDate)
  const upToDay = QCalendar.getDayIdentifier(upToDate)
  return [
    [
      { Key: 'StartDay', Value: firstDay, Oper: 'ge' },
      'and',
      { Key: 'StartDay', Value: upToDay, Oper: 'le' }
    ],
    'or',
    [
      { Key: 'EndDay', Value: firstDay, Oper: 'ge' },
      'and',
      { Key: 'EndDay', Value: upToDay, Oper: 'le' }
    ]
  ]
}
function queryByToday () {
  const today = QCalendar.getDayIdentifier(QCalendar.parseDate(new Date()))
  return [
    { Key: 'StartDay', Value: today, Oper: 'ge' },
    'or',
    { Key: 'EndDay', Value: today, Oper: 'ge' }
  ]
}
function queryByLast3Months () {
  const last3Months = QCalendar.getDayIdentifier(QCalendar.addToDate(QCalendar.parseDate(new Date()), { month: 3 }))
  return [
    { Key: 'StartDay', Value: last3Months, Oper: 'le' }
  ]
}
/** 日程工具对接后台服务
 *  可获取各个维度的代办任务：
 *  某人，某项目，某团队，某机构等
 *  可获取一个事物的使用计划：
 *  某机床，某工具，某会议室等
 *  获取的资源数据来源包括：
 *  任务（task）,事件（event）,
 */
export default {
  loadEvent ({ state, commit }, id) {
    let event = _.find(state.events, e => e.id === +id)
    if (!event) {
      return request.get(url.model, { id: +id })
        .then((res) => {
          event = Event.from(res.data)
          if (!(event.archived || event.deleted)) {
            commit('addEvents', [event])
          }
          commit('setEvent', event)
          return event
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else {
      commit('setEvent', event)
      return event
    }
  },
  loadEvents ({ state, getters, commit }
    , { resourceCategory = 'person', resourceId = 0, categorys = ['event', 'task'] } = {}) {
    // 转换为选中日期所在月份的第一天日期
    const firstDay = new Date(state.selectedDate.replace(/-/g, '/'))
    firstDay.setDate(1)
    const firstDate = QCalendar.parseDate(firstDay)
    let query = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    query.push(...['and', queryByDateRange(firstDate, getters.upToDate)])
    return request.get(url.list, {
      filter: JSON.stringify({ Categorys: categorys }),
      query: JSON.stringify(query)
    })
      .then((res) => {
        let events = Event.from(res.data)
        commit('addEvents', events)
        return true
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  loadArchivedCount ({ commit }
    , { resourceCategory = 'person', resourceId = 0 } = {}) {
    let query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    return request.get(url.count, {
      query: JSON.stringify(query)
    })
      .then((res) => {
        commit('setArchivedCount', res.data)
        return res.data
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  loadArchivedEvents ({ state, commit }
    , { resourceCategory = 'person', resourceId = 0 } = {}) {
    let query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    return request.get(url.list, {
      filter: JSON.stringify({ Categorys: ['event'] }),
      query: JSON.stringify(query)
    })
      .then((res) => {
        return Event.from(res.data)
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  loadDeletedEvents ({ state, commit }
    , { resourceCategory = 'person', resourceId = 0 } = {}) {
    let query = [
      { Key: 'IsDelete', Value: 1, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    return request.get(url.list, {
      filter: JSON.stringify({ Categorys: ['event'] }),
      query: JSON.stringify(query)
    })
      .then((res) => {
        return Event.from(res.data)
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  loadNextEvents ({ state, getters, commit }
    , {
      resourceCategory = 'person',
      resourceId = 0,
      categorys = ['event', 'task']
    } = {}) {
    const startDateNext = QCalendar.addToDate(getters.upToDate, { day: 1 })
    let query = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    query.push(...['and', queryByDateRange(startDateNext, getters.nextUpToDate)])
    return request.get(url.list, {
      filter: JSON.stringify({ Categorys: categorys }),
      query: JSON.stringify(query)
    })
      .then((res) => {
        commit('addEvents', Event.from(res.data))
        commit('addIntervalMonths')
        return true
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  loadCurrentMonthEvents ({ state, commit },
    {
      currentMonth
      , resourceCategory = 'person'
      , resourceId = 0
      , categorys = ['event', 'task']
    } = {}) {
    // 必须保证当前一两个月的事项要有，否则面板上不会出现红点
    // 获取当前第一个月的第一天日期
    const curStartdDay = new Date(currentMonth.replace(/-/g, '/'))
    curStartdDay.setDate(1)
    const curStartdDate = QCalendar.parseDate(curStartdDay)
    // 判读events中是否有这月份的事项
    const hasStartMonth = state.events.length ? _.every(state.events, function (e) {
      return intersectionWithCurMonth(e.startTime, e.endTime, curStartdDate)
    }) : false
    if (!hasStartMonth) {
      const curMonth = curStartdDate.year * 100000000 + curStartdDate.month * 1000000
      return request.get(url.aMonthList, {
        objectType: resourceCategory,
        objectId: resourceId,
        month: curMonth,
        filter: JSON.stringify({ Categorys: categorys })
      })
        .then((res) => {
          commit('addEvents', Event.from(res.data))
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    }
  },
  loadHenceforwardEvents ({ state, commit }, {
    count = 0
    , resourceCategory = 'person'
    , resourceId = 0
    , categorys = ['event', 'task']
  } = {}) {
    let query = [
      { Key: 'Archived', Value: 0, Oper: 'eq' }
    ]
    query.push(...['and', queryByResource({ resourceCategory, resourceId })])
    query.push(...['and', queryByToday()])
    if (count) {
      return request.get(url.pageList, {
        limit: count,
        offset: 0,
        filter: JSON.stringify({ Categorys: categorys }),
        query: JSON.stringify(query)
      })
        .then((res) => {
          let events = Event.from(res.data)
          commit('addEvents', events.slice(0, count))
          return events
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else {
      query.push(...['and', queryByLast3Months()])
      return request.get(url.list, {
        filter: JSON.stringify({ Categorys: categorys }),
        query: JSON.stringify(query)
      })
        .then((res) => {
          let events = Event.from(res.data)
          commit('addEvents', events)
          return events
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    }
  },
  addEvent ({ state, commit }, model) {
    const emodel = Event.to(model)
    if (model.repeat.type === state.repeatType.DONT_REPEAT) {
      return request.post(url.add, emodel)
        .then((res) => {
          commit('addEvents', [Event.from(res.data)])
          return true
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else {
      return request.post(url.add, emodel)
        .then((res) => {
          const newModel = Event.from(res.data)
          const repeatModels = generateRepeatEvents(newModel, state.repeatType)
          request.post(url.addBatch, Event.to(repeatModels))
            .then((ress) => {
              let id = ress.data.minId
              const { createTime, createBy, ModifyTime, ModifyBy } = ress.data
              _.map(repeatModels, rm => {
                Object.assign(rm, { id: id, createTime, createBy, ModifyTime, ModifyBy })
                ++id
                return rm
              })
              repeatModels.unshift(newModel)
              commit('addEvents', repeatModels)
            })
          return true
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    }
  },
  updateEvent ({ state, commit }, { justThis = false, model }) {
    const oldModel = _.cloneDeep(_.find(state.events, e => e.id === model.id))
    if (oldModel.repeat.type === state.repeatType.DONT_REPEAT &&
      model.repeat.type === state.repeatType.DONT_REPEAT) {
      // 只改当前事项
      return request.put(url.update, Event.to(model))
        .then((res) => {
          commit('updateEvent', Event.from(res.data))
          return true
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else if (justThis) {
      // 把自身和之前的都改为不重复,未来的重复事件不改动
      model.repeat = { id: 0, type: state.repeatType.DONT_REPEAT, until: '' }
      return request.all([
        request.put(url.update, Event.to(model)),
        request.put(url.setBeforeEventsToDontRepeat,
          {
            repeatId: oldModel.repeat.id,
            until: oldModel.startTime
          })
      ])
        .then(request.spread((resU, resS) => {
          const event = Event.from(resU.data)
          commit('updateEvent', event)
          resS.data && commit('setBeforeEventsToDontRepeat',
            {
              repeatId: oldModel.repeat.id,
              until: oldModel.startTime,
              modifyTime: event.ModifyTime,
              modifyBy: event.ModifyBy
            })
          return true
        }))
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else if (oldModel.repeat.type === state.repeatType.DONT_REPEAT &&
      model.repeat.type !== state.repeatType.DONT_REPEAT) {
      // 改为重复，产生未来的重复事件
      model.repeat.id = model.id
      const repeatModels = generateRepeatEvents(model, state.repeatType)
      return request.all([
        request.put(url.update, Event.to(model)),
        request.post(url.addBatch, Event.to(repeatModels))
      ]).then(request.spread((resU, resS) => {
        const event = Event.from(resU.data)
        commit('updateEvent', event)
        let id = resS.data.minId
        const { createTime, createBy, modifyTime, modifyBy } = resS.data
        _.map(repeatModels, rm => {
          Object.assign(rm, { id: id, createTime, createBy, modifyTime, modifyBy })
          ++id
          return rm
        })
        commit('addEvents', repeatModels)
        return true
      }))
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else if (oldModel.repeat.type !== state.repeatType.DONT_REPEAT &&
      model.repeat.type === state.repeatType.DONT_REPEAT) {
      // 改为不重复，之前的重复事项截止日期更新，删除未来所有的的重复事件
      let query = [
        { Key: 'Repeatable.Id', Value: oldModel.repeat.id, Oper: 'eq' },
        'and',
        { Key: 'StartTime', Value: oldModel.startTime, Oper: 'gt' }
      ]
      model.repeat = { id: 0, type: state.repeatType.DONT_REPEAT, until: '' }
      return request.all([
        request.put(url.updateBeforeEventsRepeatUntil, { repeatId: oldModel.repeat.id, until: oldModel.startTime }),
        request.put(url.update, Event.to(model)),
        request.delete(url.delete, { query: JSON.stringify(query) })
      ])
        .then(request.spread((resBefore, resThis, resFuture) => {
          const event = Event.from(resThis.data)
          resBefore.data && commit('updateBeforeEventsRepeatUntil', {
            repeatId: oldModel.repeat.id,
            until: oldModel.startTime,
            modifyTime: event.ModifyTime,
            modifyBy: event.ModifyBy
          })
          commit('updateEvent', event)
          resFuture.data && commit('deleteFutureRepeatEventsStart',
            { repeatId: oldModel.repeat.id, start: oldModel.startTime })
          return true
        }))
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    } else if (oldModel.repeat.type !== state.repeatType.DONT_REPEAT &&
      model.repeat.type !== state.repeatType.DONT_REPEAT) {
      // 修改前后都是重复的情况下，之前的变为不重复，未来的重复事件删除后重新生成
      model.repeat.id = model.id
      model.repeat.index = 0

      // 删除未来所有的的重复事件
      let query = [
        { Key: 'Repeatable.Id', Value: oldModel.repeat.id, Oper: 'eq' },
        'and',
        { Key: 'StartTime', Value: oldModel.startTime, Oper: 'gt' }
      ]
      return request.all([
        request.put(url.update, Event.to(model)),
        request.put(url.setBeforeEventsToDontRepeat, { repeatId: oldModel.repeat.id, until: oldModel.startTime }),
        request.delete(url.delete, { query: JSON.stringify(query) })
      ])
        .then(request.spread((self, before, future) => {
          // 更新自身
          const event = Event.from(self.data)
          commit('updateEvent', event)
          // 更新之前的重复事件
          before.data && commit('setBeforeEventsToDontRepeat',
            {
              repeatId: oldModel.repeat.id,
              until: oldModel.startTime,
              modifyTime: event.ModifyTime,
              modifyBy: event.ModifyBy
            })
          // 更新未来重复事件
          if (future.data) {
            // 删除未来所有的的重复事件
            commit('deleteFutureRepeatEventsStart',
              { repeatId: oldModel.repeat.id, start: oldModel.startTime })
            // 添加新的未来事件
            const repeatModels = generateRepeatEvents(model, state.repeatType)
            request.post(url.addBatch, Event.to(repeatModels))
              .then((resS) => {
                let id = resS.data.minId
                const { createTime, createBy, modifyTime, modifyBy } = resS.data
                _.map(repeatModels, rm => {
                  Object.assign(rm, { id: id, createTime, createBy, modifyTime, modifyBy })
                  ++id
                  return rm
                })
                commit('addEvents', repeatModels)
              })
          }
          return true
        }))
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          return false
        })
    }
  },
  moveEvent ({ commit }, payload) {
    return request.put(url.move, {
      ID: payload.ID,
      To: {
        ObjectType: payload.To.ObjectType,
        ObjectID: payload.To.ObjectID,
        TargetID: payload.To.TargetID
      }
    })
      .then((res) => {
        const event = Event.from(res.data)
        commit('updateEvent', event)
        return event
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  copyEvent ({ commit }, payload) {
    return request.post(url.copy, {
      ID: payload.ID,
      To: {
        ObjectType: payload.To.ObjectType,
        ObjectID: payload.To.ObjectID,
        TargetID: payload.To.TargetID
      }
    })
      .then((res) => {
        const event = Event.from(res.data)
        commit('addEvents', [event])
        return event
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  archiveEvent ({ state, commit }, { justThis = false, id }) {
    const oldModel = _.cloneDeep(_.find(state.events, e => e.id === +id))
    return request.get(url.archive, { id: +id, justThis })
      .then((res) => {
        if (res.data) {
          const event = Event.from(res.data)
          if (oldModel.repeat.type !== state.repeatType.DONT_REPEAT) {
            commit('updateBeforeEventsRepeatUntil', {
              repeatId: oldModel.repeat.id,
              until: oldModel.startTime,
              modifyTime: event.ModifyTime,
              modifyBy: event.ModifyBy
            })
          }
          if (oldModel.repeat.type !== state.repeatType.DONT_REPEAT && !justThis) {
            commit('deleteFutureRepeatEventsStart',
              { repeatId: oldModel.repeat.id, start: oldModel.startTime })
          }
          commit('deleteEvent', event.id)
          commit('setEvent', event)
          commit('setArchivedCount', state.archivedCount + res.total)
          return event
        }
      })
      .catch((error) => {
        error.userMessage
          ? showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
          : showErrorMessage(error)
        return false
      })
  },
  unarchiveEvent ({ state, commit }, id) {
    return request.get(url.unarchive, { id: +id })
      .then((res) => {
        const event = Event.from(res.data)
        commit('addEvents', [event])
        commit('setEvent', event)
        commit('setArchivedCount', state.archivedCount - 1)
        return event
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  deleteEvent ({ state, commit }, { justThis = false, id }) {
    return request.delete(url.delete, { id: +id, justThis })
      .then((res) => {
        if (res.data) {
          const event = Event.from(res.data)
          if (event.repeat.type !== state.repeatType.DONT_REPEAT) {
            commit('updateBeforeEventsRepeatUntil', {
              repeatId: event.repeat.id,
              until: event.startTime,
              modifyTime: event.ModifyTime,
              modifyBy: event.ModifyBy
            })
          }
          if (!justThis && event.repeat.type !== state.repeatType.DONT_REPEAT) {
            commit('deleteFutureRepeatEventsStart', { repeatId: event.repeat.id, start: event.startTime })
          }
          commit('deleteEvent', id)
          if (event.archived) {
            // 如果删除的是已归档的事项，则归档数量-1
            commit('setArchivedCount', state.archivedCount - 1)
          }
          showSuccessMessage(i18n.t('app.success.deleted'))
          return event
        }
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`schedule.error.${error.userMessage}`))
        return false
      })
  },
  // 加载历史记录
  loadEventHistory ({ state, commit }, id) {
    return request.get(url.getHistory, { id })
      .then(res => {
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          history.push(JSON.parse(list[i]))
        }
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
