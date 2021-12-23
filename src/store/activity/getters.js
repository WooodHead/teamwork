import Activity from './model'
import { date } from 'quasar'
export default {
  // 获取一个任务
  activity: state => id => {
    return _.find(state.activitys, p => { return p.id === taskId })
  },

  // 获取所有任务
  activitys: (state, getters) => {
    return _.filter(state.activitys, p => { return !p.deleted })
  },
  // 获取所有讨论数据
  activityList: (state, getters) => ({
    objectID = state.objectID,
    objectType = state.objectType
  } = {}) => {
    let activitys = _.filter(state.activitys, p => { return p.objectId === +objectID && p.objectType === objectType })
    if (activitys.length > 0) {
      _.sortBy(activitys, ['actTime'])
    }
    return activitys
  },

  /** 所有动态 */
  activitysAll: (state) => {
    return activitysSortGroup(state.activitys)
  },
  /** 某人的动态 */
  activitysOfPerson: (state, getters) => (actorId) => {
    const activitys = _.filter(state.activitys, a => a.actorId === actorId)
    return activitysSortGroup(activitys)
  },
  /** 某模块的动态 */
  activitysOfModule: (state, getters) => ({
    objectID = state.objectID,
    objectType = state.objectType
  } = {}) => {
    const activitys = _.filter(state.activitys, p => { return p.objectId === +objectID && p.objectType === objectType })
    return activitysSortGroup(activitys)
  },
  /** 简历筛选模块：邀约动态 */
  activitysOfResumeInvite: (state, getters) => ({
    objectID = state.objectID,
    objectType = state.objectType,
    jobID = 0
  } = {}) => {
    const activitys = _.filter(state.activitys, p => { return p.objectId === +objectID && p.objectType === objectType && p.widget.id === +jobID })
    return activitysSortGroup(activitys)
  }
}
/**
 * 动态的排序分组整理
 *
 * @param {*} activitys
 * @returns
 */
function activitysSortGroup (activitys) {
  const activitysOrderBy = _.orderBy(activitys, ['actTime'], ['desc'])
  const activitysGroupByDate = _.groupBy(activitysOrderBy, (item) => { return date.formatDate(item.actTime.replace(/-/g, '/'), 'YYYY-MM-DD') })

  for (const date in activitysGroupByDate) {
    if (activitysGroupByDate.hasOwnProperty(date)) {
      activitysGroupByDate[date] = adjacentOnInOne(activitysGroupByDate[date])
    }
  }
  return activitysGroupByDate
}
/**
 * 在相同on的相同操作项合成一个
 * @param {Array} activitysInSomeDate
 */
function adjacentOnInOne (activitysInSomeDate) {
  const activitys = []
  let prev = new Activity()
  for (const activity of activitysInSomeDate) {
    if (activity.widget.on.id &&
      (activity.widget.type === 'task' || activity.widget.type === 'schedule') &&
      activity.action === prev.action &&
      activity.actorId === prev.actorId &&
      activity.widget.on.type === prev.widget.on.type &&
      activity.widget.on.id === prev.widget.on.id) {
      const last = _.last(activitys)
      last.widgets
        ? last.widgets.push(activity.widget)
        : last.widgets = [activity.widget]
    } else {
      activity.widgets = [activity.widget]
      activitys.push(activity)
    }
    prev = activity
  }
  return activitys
}
