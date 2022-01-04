import { LocalStorage, date } from 'quasar'
import { i18n } from '@/boot/i18n'
const { formatDate } = date
import { listToTree } from '@/utils/list-to-tree'
import { Math } from 'core-js'
export default {
  // 包含某个tag的所有任务
  tasksIncludesTag: (state) => ({ objectType = state.objectType, objectID = state.objectID, tag }) => {
    return state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'item' &&
      task.tags.includes(tag))
  },
  // 任务仪表盘，加载所有任务
  allTasks: (state) => ({ objectType = state.objectType, objectID = state.objectID }) => {
    const tasks = state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'list')
    let rootIds = Array.from(new Set(tasks.map(t => t.id)))
    return state.tasks.filter(t => rootIds.includes(t.rootId) && t.type === 'item')
  },
  // 任务仪表盘，加载所有任务
  bugTasks: (state) => ({ objectType = state.objectType, objectID = state.objectID }) => {
    const tasks = state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'list' &&
      task.tags.includes('缺陷'))
    let rootIds = Array.from(new Set(tasks.map(t => t.id)))
    return state.tasks.filter(t => rootIds.includes(t.rootId) && t.type === 'item')
  },
  // 任务仪表盘，加载所有任务
  listAndMilestoneTasks: (state) => ({ objectType = state.objectType, objectID = state.objectID }) => {
    const tasks = state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'list' && (task.tags.includes('清单') || task.tags.includes('里程碑'))
    )
    let rootIds = Array.from(new Set(tasks.map(t => t.id)))
    return state.tasks.filter(t => rootIds.includes(t.rootId) && t.type === 'item')
  },
  /** 任务工具卡中的数据 */
  tasksInWidget: (state) => ({ objectType = state.objectType, objectID = state.objectID }) => {
    return state.tasksInWidget[objectType + objectID] || []
  },
  // 获取一个任务
  task: state => id => {
    return _.find(state.tasks, p => { return p.id === id })
  },
  /** 一个资源所有（未删除,未归档）的任务清单 */
  allTaskLists: (state) => ({ objectType = state.objectType, objectID = state.objectID } = {}) => {
    const taskLists = state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'list' &&
      !task.deleted &&
      !task.archived
    )
    return taskLists.sort((b, a) => {
      return String(a.orderNumber).localeCompare(String(b.orderNumber))
    })
  },
  overview: (state) => ({ objectType = state.objectType, objectID = state.objectID } = {}) => {
    const filterType = {
      list: '清单',
      bug: '缺陷',
      milestone: '里程碑'
    }
    const taskLists = state.tasks.filter(task =>
      task.objectType === objectType &&
      task.objectId === objectID &&
      task.type === 'list' &&
      !task.deleted &&
      !task.archived &&
      (filterType[state.filterType] ? task.tags.includes(filterType[state.filterType]) : true))
    const overview = {
      allCount: 0,
      finishedAllCount: 0,
      seriousCount: 0,
      finishedSeriousCount: 0,
      difficultCount: 0,
      finishedDifficultCount: 0
    }
    taskLists.forEach(task => {
      overview.allCount += task.overview.allCount
      overview.finishedAllCount += task.overview.finishedAllCount
      overview.seriousCount += task.overview.seriousCount
      overview.finishedSeriousCount += task.overview.finishedSeriousCount
      overview.difficultCount += task.overview.difficultCount
      overview.finishedDifficultCount += task.overview.finishedDifficultCount
    })
    return overview
  },
  /** 一个资源下的未归档的任务清单 */
  unarchivedTaskLists: (state) => ({ objectType = state.objectType, objectID = state.objectID } = {}) => {
    let taskLists = state.tasks.filter(task =>
      task.objectType === objectType &&
      +task.objectId === objectID &&
      task.type === 'list' &&
      !task.archived &&
      !task.deleted)
    if (state.filterType === 'list') {
      taskLists = taskLists.filter(a => a.tags.join('').includes('清单'))
    } else if (state.filterType === 'bug') {
      taskLists = taskLists.filter(a => a.tags.join('').includes('缺陷'))
    } else if (state.filterType === 'milestone') {
      taskLists = taskLists.filter(a => a.tags.join('').includes('里程碑'))
    }
    return taskLists.sort((b, a) => {
      return String(a.orderNumber).localeCompare(String(b.orderNumber))
    })
  },
  /** 一个清单中包含清单自身的任务 */
  tasksOfList: (state) => id => {
    const dirtyGroupsInList = state.tasks.filter(task =>
      task.rootId === +id &&
      task.type === 'group' &&
      (task.archived || task.deleted))
    // 获取清单下所有任务（不包括自身）
    let tasksInList = state.tasks.filter(task =>
      task.rootId === id &&
      task.id !== +id &&
      !task.archived &&
      !task.deleted &&
      !dirtyGroupsInList.some(g => g.id === task.parentId))
    // 获取清单自身
    const task = state.tasks.find(t => t.id === +id)
    // 清单下任务排序
    tasksInList = sortTasksInList(tasksInList, id)
    return [task, tasksInList].flat()
  },
  /** 一个分组中包含清单自身的任务 */
  tasksOfGroup: (state) => id => {
    const dirtyGroupsInList = state.tasks.filter(task =>
      task.rootId === +id &&
      task.type === 'group' &&
      (task.archived || task.deleted))
    let tasksInGroup = state.tasks.filter(task =>
      task.parentId === id &&
      task.id !== +id &&
      !task.archived &&
      !task.deleted &&
      !dirtyGroupsInList.some(g => g.id === task.parentId))
    const task = state.tasks.find(t => t.id === +id)
    tasksInGroup = sortTasksInList(tasksInGroup, id)
    return [task, tasksInGroup].flat()
  },
  /** 一个清单里面的任务（不包含自身，和归档/删除的分组） */
  tasksInList: (state) => id => {
    const dirtyGroupsInList = state.tasks.filter(task =>
      task.rootId === +id &&
      task.type === 'group' &&
      (task.archived || task.deleted))
    const tasksInList = state.tasks.filter(task =>
      task.rootId === +id &&
      task.id !== +id &&
      !task.archived &&
      !task.deleted &&
      !dirtyGroupsInList.some(g => g.id === task.parentId))
    return sortTasksInList(tasksInList, id)
  },
  /** 一个清单里面的任务（不包含自身，和删除的分组，有可能包含已归档的） */
  tasksInListContainsArchived: (state) => (id, tasks = state.tasks, archived = false) => {
    const dirtyGroupsInList = archived ? tasks.filter(task =>
      task.rootId === +id &&
      task.type === 'group' &&
      task.deleted)
      : tasks.filter(task =>
        task.rootId === +id &&
      task.type === 'group' &&
      (task.archived || task.deleted))
    const tasksInList = archived ? tasks.filter(task =>
      task.rootId === +id &&
      task.id !== +id &&
      !task.deleted &&
      !dirtyGroupsInList.some(g => g.id === task.parentId)) : tasks.filter(task =>
      task.rootId === +id &&
      task.id !== +id &&
      !task.archived &&
      !task.deleted &&
      !dirtyGroupsInList.some(g => g.id === task.parentId))
    return sortTasksInList(tasksInList, id)
  },
  /** 一个分组里面的任务（不包含自身） */
  tasksInGroup: (state) => id => {
    const tasksInGroup = state.tasks.filter(task =>
      task.parentId === id &&
      !task.archived &&
      !task.deleted)
    return tasksInGroup.sort((a, b) => {
      return String(a.orderNumber).localeCompare(String(b.orderNumber))
    })
  },
  /** 一个清单中未归档的任务数量 */
  unfinishedCountInList: (state) => id => {
    return state.tasks.filter(task =>
      task.rootId === id &&
      task.type === 'item' &&
      !task.archived &&
      !task.deleted).length
  },
  /** 一个分组中未归档的任务数量 */
  unfinishedCountInGroup: (state) => id => {
    return state.tasks.filter(task =>
      task.parentId === id &&
      task.type === 'item' &&
      !task.archived &&
      !task.deleted).length
  },
  /** 一个资源下的已归档的任务清单 */
  archivedTaskLists: (state) =>
    ({ objectType = state.objectType, objectID = state.objectID } = {}) => {
      const taskLists = state.tasks.filter(task =>
        task.objectType === objectType &&
        task.objectId === objectID &&
        task.type === 'list' &&
        task.archived &&
        !task.deleted)
      return taskLists.sort((a, b) => {
        return b.archiveTime.localeCompare(a.archiveTime)
      })
    },
  /** 一个清单中已归档的任务 */
  archivedTasksInList: (state) => id => {
    const tasksInList = state.tasks.filter(task =>
      task.rootId === +id &&
      task.id !== +id &&
      task.archived &&
      !task.deleted)
    return tasksInList.sort((a, b) => {
      return b.archiveTime.localeCompare(a.archiveTime)
    })
  },
  /** 一个分组中已归档的任务 */
  archivedTasksInGroup: (state) => id => {
    const tasksInList = state.tasks.filter(task =>
      task.parentId === +id &&
      task.archived &&
      !task.deleted)
    return tasksInList.sort((a, b) => {
      return b.archiveTime.localeCompare(a.archiveTime)
    })
  },
  /** 导出excel的fields集合 */
  exportExcelFields: (state) => (widgets) => {
    let exportFields = state.exportExcelFields
    if (widgets && Object.keys(widgets).length && widgets.task.taskForm) {
      if (widgets.task.taskForm.indexOf('predictHour') >= 0) {
        exportFields = _.concat(exportFields, ['PredictHour'])
      }
      if (widgets.task.taskForm.indexOf('actualHour') >= 0) {
        exportFields = _.concat(exportFields, ['WorkHour'])
      }
    }
    return exportFields
  },
  // 导出excel按照完成人、完成时间等过滤
  filterExportExcel: (state) => (exportExcelList) => {
    let list = _.cloneDeep(exportExcelList)
    if (!state.exportArchived) {
      list = list.filter(r => r.type !== 'item' || (r.type === 'item' && !r.archived))
    }
    if (state.exportFinished) {
      list = list.filter(r => r.type !== 'item' || (r.type === 'item' && r.finished))
    }
    if (state.person.id) {
      list = list.filter(r => r.type !== 'item' || (r.type === 'item' && r.finished && +r.finishedBy === +state.person.id))
    }
    if (state.fromToDate) {
      list = list.filter(r => r.type !== 'item' || (r.type === 'item' && r.finished && formatDate(r.finishedTime, 'YYYY-MM-DD') >= state.fromToDate.from && formatDate(r.finishedTime, 'YYYY-MM-DD') <= state.fromToDate.to))
    }
    return list
  },
  // 待办任务主页导出查询条件
  exportExcelQuery: (state) => (objectType, objectID) => {
    let query = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: +objectID, Oper: 'eq' }
    ] 
    if (!state.exportArchived) {
      query.push('and', { Key: 'Archived', value: 0, oper: 'eq' })
    }

    let selectQuery = []

    if (state.exportFinished) {
      selectQuery.push({ Key: 'Finished', value: 1, oper: 'eq' })
    }
    if (state.person.id) {
      selectQuery.length ? selectQuery.push('and') : selectQuery.push({ Key: 'Finished', value: 1, oper: 'eq' }, 'and')
      selectQuery.push({ Key: 'FinishedBy', value: +state.person.id, oper: 'eq' })
    }
    if (state.fromToDate) {
      selectQuery.length ? selectQuery.push('and') : selectQuery.push({ Key: 'Finished', value: 1, oper: 'eq' }, 'and')
      selectQuery.push({ Key: 'Finished', value: 1, oper: 'eq' }, 'and', { Key: 'FinishedTime', value: state.fromToDate.from, oper: 'ge' },
        'and', { Key: 'FinishedTime', value: formatDate(date.addToDate(new Date(state.fromToDate.to), { days: 1 }), 'YYYY-MM-DD'), oper: 'le' })
    }
    if (selectQuery.length) {
      query = [query, 'and', [
        { Key: 'Type', value: 'item', oper: 'ne' },
        'or',
        [
          { Key: 'Type', value: 'item', oper: 'eq' },
          'and',
          selectQuery
        ]
      ]]
    }
    return query
  },
  /** ---------------我的任务相关接口 start--------------- */
  /** 获取所有指派给我的任务所在的清单 */
  taskListsOfAssignedToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.assignedTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有指派给我的任务(含分组) */
  assignedToMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      !t.finished &&
      t.assignedTo.includes(psonId) &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有指派给我的带有日期的任务所在的清单 */
  taskListsOfAssignedToMeWithDueDate: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.assignedTo.includes(psonId) &&
      t.dateType !== 'none')
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取所有指派给我的带有日期的任务所在的清单 */
  taskListsOfAssignedToMeOverDue: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.assignedTo.includes(psonId) &&
      t.dateType !== 'none')
    let rootIds = []
    // 已过期的任务
    let overdueList = tasks.filter(item => item.endTime < formatDate(new Date(), 'YYYY-MM-DD') && item.endTime !== '1000-01-01 00:00:00')
    rootIds = overdueList.map(t => t.rootId)
    state.listAssignedToMe.overdueList = state.tasks.filter(t => rootIds.includes(t.id))
    // 今天过期的任务
    let dueToday = tasks.filter(item => item.endTime === formatDate(new Date(), 'YYYY-MM-DD'))
    rootIds = dueToday.map(t => t.rootId)
    state.listAssignedToMe.dueTodayList = state.tasks.filter(t => rootIds.includes(t.id))
    // 明天过期的任务
    let dueTomorrow = tasks.filter(item => item.endTime === formatDate(new Date().setDate(new Date().getDate() + 1), 'YYYY-MM-DD'))
    rootIds = dueTomorrow.map(t => t.rootId)
    state.listAssignedToMe.dueTomorrowList = state.tasks.filter(t => rootIds.includes(t.id))
    // 本周过期的任务
    let days = new Date().getDay() // 今天本周的第几天
    let number = 7 - days
    let dueWeek = tasks.filter(item => item.endTime > formatDate(new Date().setDate(new Date().getDate() + 1), 'YYYY-MM-DD') && item.endTime < formatDate(new Date().setDate(new Date().getDate() + number), 'YYYY-MM-DD'))
    rootIds = dueWeek.map(t => t.rootId)
    state.listAssignedToMe.dueWeekList = tasks.filter(t => rootIds.includes(t.id))
    // 一周以后过期的任务
    let dueLater = tasks.filter(item => item.endTime > formatDate(new Date().setDate(new Date().getDate() + number), 'YYYY-MM-DD'))
    rootIds = dueLater.map(t => t.rootId)
    state.listAssignedToMe.dueLaterList = tasks.filter(t => rootIds.includes(t.id))
    return state.listAssignedToMe
  },
  /** 获取一个清单中所有指派给我的带有日期的任务(含分组) */
  assignedToMeTasksWithDueDateInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      !t.finished &&
      t.assignedTo.includes(psonId) &&
      t.rootId === id &&
      t.dateType !== 'none')
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有指派给我的已完成任务所在的清单 (已归档) */
  archivedTaskListsOfFinishedAssignedToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && t.archived &&
      t.assignedTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取所有指派给我的已完成任务所在的清单(未归档) */
  unarchivedTaskListsOfFinishedAssignedToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && !t.archived &&
      t.assignedTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有指派给我的已完成任务(含分组) */
  finishedAssignedToMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      t.finished &&
      t.assignedTo.includes(psonId) &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有我指派的任务所在的清单（包括超期的） */
  taskListsOfAssignedByMeOverDue: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.assignedByID === +psonId)
    let rootIds = []
    // 昨天到期的任务
    let overdueYesterdayList = []
    let overdueYesterday = tasks.filter(item => item.endTime === formatDate(new Date().setDate(new Date().getDate() - 1), 'YYYY-MM-DD') && item.endTime !== '1000-01-01 00:00:00')
    rootIds = Array.from(new Set(overdueYesterday.map(t => t.rootId)))
    rootIds.forEach(rootId => {
      let list = state.tasks.find(a => a.id === rootId)
      let tasks = overdueYesterday.filter(a => a.rootId === rootId)
      if (tasks.length > 0) {
        overdueYesterdayList.push(list)
        overdueYesterdayList.push(tasks)
      }
    })
    state.listAssignedByMe.overdueYesterdayList = overdueYesterdayList.flat()
    // 昨天以前到期的任务
    let overdueMoreList = []
    let overdueMore = tasks.filter(item => item.endTime < formatDate(new Date().setDate(new Date().getDate() - 1), 'YYYY-MM-DD') && item.endTime !== '1000-01-01 00:00:00')
    rootIds = Array.from(new Set(overdueMore.map(t => t.rootId)))
    rootIds.forEach(rootId => {
      let list = state.tasks.find(a => a.id === rootId)
      let tasks = overdueMore.filter(a => a.rootId === rootId)
      if (tasks.length > 0) {
        overdueMoreList.push(list)
        overdueMoreList.push(tasks)
      }
    })
    state.listAssignedByMe.overdueMoreList = overdueMoreList.flat()
    // 未到期的任务
    let noOverdueList = []
    let noOverdue = tasks.filter(item => item.endTime > formatDate(new Date().setDate(new Date().getDate() - 1), 'YYYY-MM-DD') || item.endTime === '1000-01-01 00:00:00')
    rootIds = Array.from(new Set(noOverdue.map(t => t.rootId)))
    rootIds.forEach(rootId => {
      let list = state.tasks.find(a => a.id === rootId)
      let tasks = noOverdue.filter(a => a.rootId === rootId)
      if (tasks.length > 0) {
        noOverdueList.push(list)
        noOverdueList.push(tasks)
      }
    })
    state.listAssignedByMe.noOverdueList = noOverdueList.flat()
    return state.listAssignedByMe
  },
  /** 获取所有我指派的任务所在的清单 */
  taskListsOfAssignedByMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.assignedByID === +psonId)
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有指派给我的任务(含分组) */
  assignedByMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      !t.finished &&
      t.assignedByID === +psonId &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有我指派的已完成任务所在的清单（未归档） */
  unarchivedTaskListsOfFinishedAssignedByMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && !t.archived &&
      t.assignedByID === +psonId)
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取所有我指派的已完成任务所在的清单(已归档) */
  archivedTaskListsOfFinishedAssignedByMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && t.archived &&
      t.assignedByID === +psonId)
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有指派给我的已完成任务(含分组) */
  finishedAssignedByMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      t.finished &&
      t.assignedByID === +psonId &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有通知给我的任务所在的清单 */
  taskListsOfNotifyToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      !t.finished &&
      t.notifyTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有通知给我的任务(含分组) */
  notifyToMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      !t.finished &&
      t.notifyTo.includes(psonId) &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取所有通知给我的已完成任务所在的清单 (未归档) */
  unarchivedTaskListsOfFinishedNotifyToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && !t.archived &&
      t.notifyTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取所有通知给我的已完成任务所在的清单（已归档） */
  archivedTaskListsOfFinishedNotifyToMe: (state) => (psonId = LocalStorage.getItem('myself').id) => {
    const tasks = state.tasks.filter(t =>
      t.finished && t.archived &&
      t.notifyTo.includes(psonId))
    let rootIds = Array.from(new Set(tasks.map(t => t.rootId)))
    const taskLists = state.tasks.filter(t => rootIds.includes(t.id))
    return _.orderBy(taskLists, ['objectType', 'objectId', 'orderNumber'], ['asc', 'desc', 'asc'])
  },
  /** 获取一个清单中所有通知给我的已完成任务(含分组) */
  finishedNotifyToMeTasksInList: (state, getters) => ({ psonId = LocalStorage.getItem('myself').id, id }) => {
    const tasksInList = state.tasks.filter(t =>
      t.finished &&
      t.notifyTo.includes(psonId) &&
      t.rootId === id)
    return sortTasksInList([...getters.groupsOfTasks(tasksInList), ...tasksInList], id)
  },
  /** 获取任务集合的分组任务 */
  groupsOfTasks: (state) => (tasks) => {
    let groups = tasks.filter(t => t.parentId !== t.rootId).map(t => t.parentId)
    groups = Array.from(new Set(groups))
    return groups.map(id => state.tasks.find(t => t.id === id))
  },
  /** ---------------我的任务相关接口 end--------------- */

  // 一人一天的任务。仅用于人员工时
  manDayTasks: (state) => (date, objectType, objectID, psonId) => {
    if (['team', 'organize'].includes(objectType)) {
      return state.tasksInCalendar.filter(a =>
        (a.assignedTo.includes(+psonId) &&
          date >= a.startTime.substring(0, 10) &&
          date <= a.endTime.substring(0, 10)) ||
        (+a.finishedBy === +psonId &&
          date === a.finishedTime.substring(0, 10)))
    } else {
      return state.tasksInCalendar.filter(a => a.objectType === objectType &&
        a.objectId === +objectID &&
        ((a.assignedTo.includes(+psonId) &&
          date >= a.startTime.substring(0, 10) &&
          date <= a.endTime.substring(0, 10)) ||
          (+a.finishedBy === +psonId &&
            date === a.finishedTime.substring(0, 10))))
    }
  },
  // 工作台账已完成列表
  workRecordTaskList: (state, _getters, rootState) => (id, tasks = state.tasks) => {
    let orderBylists = [], selectOrganizes = rootState.organize.selectOrganizes
    if (id) {
      orderBylists = _.orderBy(tasks.filter(p =>
        !p.deleted && p.type === 'item' && _.indexOf(p.assignedTo, +id) >= 0 && p.finished && selectOrganizes[+p.organizeID]
      ), ['beginTime'], ['desc'])
    } else {
      orderBylists = _.orderBy(tasks.filter(p =>
        !p.deleted && p.type === 'item' && p.finished && selectOrganizes[+p.organizeID]
      ), ['beginTime'], ['desc'])
    }
    let groupByList = _.groupBy(orderBylists, item => {
      return date.formatDate(item.beginTime.replace(/-/g, '/'), 'YYYY-MM-DD')
    }) || []
    let today = date.formatDate(new Date(), 'YYYY-MM-DD'),
      yesterday = date.formatDate(date.subtractFromDate(new Date(), { days: 1 }), 'YYYY-MM-DD')
    let groupTitle = {}, tasksArr = []
    groupTitle[today] = i18n.t('workRecord.today')
    groupTitle[yesterday] = i18n.t('workRecord.yesterday')
    Object.keys(groupByList).forEach(item => {
      let total = 0, totalWorkHour = 0, totalOnRoadHour = 0
      groupByList[item].forEach(p => {
        total += (p.workHour + p.onRoadHour)
        totalWorkHour += p.workHour
        totalOnRoadHour += p.onRoadHour
      })
      tasksArr.push({
        date: groupTitle[item] || item,
        tasklist: groupByList[item],
        totalHour: Math.abs(total.toFixed(1)),
        totalWorkHour: Math.abs(totalWorkHour.toFixed(1)),
        totalOnRoadHour: Math.abs(totalOnRoadHour.toFixed(1))
      })
    })
    return tasksArr
  },
  // 台账日历列表
  workRecordCalendarPageList: (state) => (calendarTasks = state.calendarTasks) => {
    let res = []
    _.forEach(calendarTasks, task => {
      let groupByList = _.groupBy(task.tasks, item => {
        return item.createByID
      }) || []
      let taskArr = []
      Object.keys(groupByList).forEach(item => {
        groupByList[item].sort((a, b) => {
          return String(a.createBy).localeCompare(String(b.createBy))
        })
        groupByList[item].forEach(p => {
          p.date = date.formatDate(p.beginTime.replace(/-/g, '/'), 'YYYY-MM-DD')
        })
        let personOneDayRecords = [], personOneDayWorkHoursArr = []
        // 一人一天的台账记录
        personOneDayRecords = _.groupBy(groupByList[item], p => { return p.date })
        _.forEach(_.keys(personOneDayRecords), r => {
          let hoursObj = {}
          hoursObj.date = r
          let oneDayTotalHour = 0, oneDayWorkHour = 0, oneDayOnRoadHour = 0
          _.forEach(personOneDayRecords[r], item => {
            oneDayTotalHour += (item.workHour + item.onRoadHour)
            oneDayWorkHour += item.workHour
            oneDayOnRoadHour += item.onRoadHour
          })
          hoursObj.oneDayTotalHour = Math.abs(oneDayTotalHour.toFixed(1))
          hoursObj.oneDayWorkHour = Math.abs(oneDayWorkHour.toFixed(1))
          hoursObj.oneDayOnRoadHour = Math.abs(oneDayOnRoadHour.toFixed(1))
          personOneDayWorkHoursArr.push(hoursObj)
        })
        // 一人一天的工时
        let personOneDayWorkHours = _.groupBy(personOneDayWorkHoursArr, item => { return item.date })
        taskArr.push({
          psonId: +item,
          psonName: groupByList[item][0].createBy,
          tasklist: groupByList[item],
          personOneDayRecords: personOneDayRecords,
          personOneDayWorkHours: personOneDayWorkHours
        })
      })
      res.push({
        queryTimeRange: task.queryTimeRange,
        curCalendarList: taskArr
      })
    })
    return res
  },
  // ctrl选择结果
  ctrlModel: (state) => id => {
    return state.ctrlList.find(t => t.id === id) ||
    {
      id: 0,
      showMenu: false,
      bgColor: ''
    }
  },
  // 我的废纸篓
  TasksInMyTrash: (state) => {
    let list = state.tasksInTrash.filter(item => item.createBy === LocalStorage.getItem('myself').name || item.deleteBy === LocalStorage.getItem('myself').name)
    list = listToTree(list, 'id', 'parentId')
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 资源废纸篓
  TasksInTrash: (state) => (objectType, objectID) => {
    let list = state.tasksInTrash.filter(item => item.objectType === objectType && item.objectId === +objectID)
    list = listToTree(list, 'id', 'parentId')
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 任务自定义
  taskSetting: () => (categoryModel = {}) => {
    if (categoryModel.widgets && categoryModel.widgets.task.taskForm) {
      let taskForm = categoryModel.widgets.task.taskForm, set = {}
      if (taskForm.indexOf('predictHour') >= 0) set.predictHour = true
      if (taskForm.indexOf('actualHour') >= 0) set.actualHour = true
      return set
    } else {
      return {}
    }
  }
}
/**
 * 排序清单里面的任务
 *
 * @param {*} tasksInList
 * @param {*} id
 * @returns
 */
function sortTasksInList (tasksInList, id) {
  const list = tasksInList.sort((a, b) => {
    return String(a.orderNumber).localeCompare(String(b.orderNumber))
  })
  const childsOfList = list.filter(task => task.parentId === id)
  const tasks = childsOfList.map(t => {
    if (t.type === 'group') {
      let group = [t]
      group.push(...list.filter(task => task.parentId === t.id))
      return group
    } else {
      return t
    }
  })
  let sortTasks = tasks.flat()
  const tasksinNoFindGroup = _.differenceBy(tasksInList, sortTasks, 'id')
  sortTasks.push(...tasksinNoFindGroup)
  return sortTasks
}
