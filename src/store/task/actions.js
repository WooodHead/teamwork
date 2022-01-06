import Task from './model'
import Discuss from '@/store/discuss/model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { LocalStorage, date, format } from 'quasar'
const { formatDate } = date
import { showWarningMessage } from '@/utils/show-message'
const my = LocalStorage.getItem('myself') || {}
const { capitalize } = format
import htmlToText from '@/utils/html-to-text'

const url = {
  GetList: 'tasks/GetList',
  GetListOfMembers: 'tasks/GetListOfMembers',
  GetPageList: 'tasks/GetPageList',
  GetMyTaskList: 'tasks/GetMyTaskList',
  GetModel: 'tasks/GetModel',
  GetTreeTasks: 'tasks/GetTreeTasks',
  GetTasksInWidget: 'tasks/GetTasksInWidget',
  GetTasksInHome: 'tasks/GetTasksInHome',
  GetOverallProgress: 'tasks/GetOverallProgress',
  GetCount: 'tasks/GetCount',
  GetArchivedTasks: 'tasks/GetArchivedTasks',
  GetArchivedCount: 'tasks/GetArchivedCount',
  Add: 'tasks/Add',
  Update: 'tasks/Update',
  UpdateCommentCount: 'tasks/UpdateCommentCount',
  Delete: 'tasks/Delete',
  Undelete: 'tasks/Undelete',
  Archive: 'tasks/Archive',
  Unarchive: 'tasks/Unarchive',
  Secrecy: 'tasks/Secrecy',
  Unsecrecy: 'tasks/Unsecrecy',
  Move: 'tasks/Move',
  Copy: 'tasks/Copy',
  Finish: 'tasks/Finish',
  Activate: 'tasks/Activate',
  Sort: 'tasks/Sort',
  Insert: 'tasks/Insert',
  ReleaseGroup: 'tasks/ReleaseGroup',
  ConvertToList: 'tasks/ConvertToList',
  GetTaskHistory: 'tasks/GetHistory',
  GetTaskTags: 'tasks/GetTaskTags',
  BatchDelete: 'tasks/BatchDelete',
  BatchArchive: 'tasks/BatchArchive',
  BatchMove: 'tasks/BatchMove',
  BatchCopy: 'tasks/BatchCopy',
  BatchAssign: 'tasks/BatchAssign',
  GetDeletedList: 'tasks/GetDeletedList',
  GetWorkRecordTaskPageList: 'tasks/getworkrecordtaskpagelist',
  PersonSumWorkHoursByMonth: 'tasks/personsumworkhoursbymonth',
  SumWorkHoursByMonth: 'tasks/sumworkhoursbymonth',
  GetWorkRecordTaskList: 'tasks/getworkrecordtasklist',
  AddHistoryBySendMessage: 'tasks/addhistorybysendmessage'
}
/**
 * 
 * 关于操作后对overview的处理，
 * 有的操作会涉及到页面的转移，更新后完整数据的返回，如（批量）复制，移动，
 * 因页面会变化，变化后会重新获取新数据，所以就不用前端再处理老数据的归档数量和overview了
 */
export default {
  /**
   * 任务工具卡片中加载最新的10条任务
   * @param {*} param0
   * @param {*} param1
   */
  loadTasksInWidget ({ state, getters, commit },
    { objectType = state.objectType, objectID = state.objectID } = {}) {
    const tasksInWidget = getters.tasksInWidget(objectType, objectID)
    if (tasksInWidget.length) {
      return tasksInWidget
    } else {
      return request.get(url.GetTasksInWidget, { objectType, objectID })
        .then(res => {
          let tasks = Task.from(res.data)
          commit('addTasksInWidget', { objectType, objectID, tasks })
          return tasks
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
  },
  /**
   * 获取一个资源下的任务主页的任务
   * @param {*} param0
   * @param {*} param1
   */
  loadTasksInHome ({ state, commit },
    { objectType = state.objectType, objectID = state.objectID } = {}) {
    return request.get(url.GetTasksInHome, { objectType, objectID })
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasks', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 获取一个清单下所有的已完成的任务
   *
   * @param {*} { state, commit }
   * @param {*} id 任务清单id
   */
  loadAllFinishedUnarchivedTasksInList ({ state, commit }, id) {
    const query = [
      { Key: 'RootID', Value: id, Oper: 'eq' },
      'and',
      { Key: 'Type', Value: 'item', Oper: 'eq' },
      'and',
      { Key: 'Finished', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' }
    ]

    return request.get(url.GetList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasks', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 获取一个资源下的所有任务清单
   * @param {*} param0
   * @param {*} param1
   */
  loadTaskLists ({ commit },
    { objectType = state.objectType, objectID = state.objectID } = {}) {
    const query = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' },
      'and',
      { Key: 'Type', Value: 'list', Oper: 'eq' }
    ]
    return request.get(url.GetList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasks', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 获取任务清单(分组),不包含已归档的任务
   * @param {*} param0
   * @param {*} id
   */
  loadTaskList ({ state, getters, commit }, id) {
    const task = _.find(state.tasks, { id })
    const allUnfinishedCount = task.overview.allCount - task.overview.finishedAllCount
    const loadUnfinishedCount = task.type === 'list'
      ? getters.unfinishedCountInList(id)
      : getters.unfinishedCountInGroup(id)

    if (allUnfinishedCount > loadUnfinishedCount) {
      return request.get(url.GetTreeTasks, { id })
        .then(res => {
          const tasks = Task.from(res.data)
          commit('addTasks', tasks)
          return true
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else if (allUnfinishedCount < loadUnfinishedCount) {
      return request.get(url.GetModel, { id })
        .then(res => {
          commit('addTasks', [Task.from(res.data)])
          return true
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return true
    }
  },

  /**
   * 获取任务所在树上的上下相关任务（上：父节点和根节点。下：所有子节点）
   * @param {*} param0
   * @param {*} id
   */
  loadTreeTasks ({ state, commit }, id) {
    let taskItem = _.find(state.tasks, t => t.id === +id)
    if (taskItem && taskItem.type === 'item') {
      let upTasksInTree = _.filter(state.tasks, t => t.id === taskItem.rootId || t.id === taskItem.parentId)
      return [...upTasksInTree, taskItem]
    } else {
      return request.get(url.GetTreeTasks, { id })
        .then(res => {
          const tasks = Task.from(res.data)
          commit('addTasks', tasks)
          return tasks
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
  },

  /**
  * 获取model
  * @param {*} id
  */
  loadTask ({ state, commit }, id) {
    let task = _.find(state.tasks, t => t.id === +id)
    if (!task) {
      return request.get(url.GetModel, { id })
        .then(res => {
          task = Task.from(res.data)
          commit('addTasks', [task])
          return task
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return task
    }
  },
  loadTasks ({ state, commit }, {
    query,
    filter,
    search = state.search,
    fields = 'List',
    sort = state.sort,
    order = state.order,
    byPage = state.byPage,
    limit = state.page.limit } = {}) {
    const page = state.page
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields
    }
    byPage ? Object.assign(condition, {
      limit,
      offset: page.offset,
      order,
      sort
    }) : Object.assign(condition, {
      orderby: ` ${sort} ${order}`
    })
    let toUrl = byPage ? url.GetPageList : url.GetList
    return request.get(toUrl, condition)
      .then(res => {
        let list = Task.from(res.data)
        if (fields === 'Select') {
          commit('addTasksInCalendar', list)
        } else {
          commit('addTasks', list)
        }
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadTaskTags ({ commit }, { objectType, objectID }) {
    return request.get(url.GetTaskTags, {
      objectType: objectType,
      objectID: objectID
    })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return []
      })
  },
  loadArchivedTasks ({ state, commit }, { objectType = state.objectType, objectID = state.objectID, id = 0 } = {}) {
    return request.get(url.GetArchivedTasks, {
      objectType: objectType,
      objectID: objectID,
      id: id
    }).then(res => {
      const tasks = Task.from(res.data)
      commit('addTasks', tasks)
      return tasks
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadArchivedCount ({ commit }, { objectType = state.objectType, objectID = state.objectID, id = 0 }) {
    return request.get(url.GetArchivedCount, {
      objectType: objectType,
      objectID: objectID,
      id: id
    })
      .then(res => {
        commit('setArchivedCount', { [objectType + objectID + 'task' + id]: res.data })
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadTaskHistory ({ state, commit }, id) {
    return request.get(url.GetTaskHistory, { id })
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
  },
  loadMyTaskList ({ commit }, { psonId, type }) {
    return request.get(url.GetMyTaskList, { psonId, type })
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 加载所有成员的所有任务
  loadListOfMembers ({ commit }, { objectID, objectType, query }) {
    return request.get(url.GetListOfMembers, {
      objectType,
      objectID,
      query: JSON.stringify(query)
    })
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasksInCalendar', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建任务
  addTask ({ state, commit }, task) {
    let model = Task.to(task)
    return request.post(url.Add, model)
      .then(res => {
        let task = Task.from(res.data)
        commit('addTasks', [task])
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewIncrease', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新任务
  updateTask ({ commit }, task) {
    const oldOverview = task.overview
    let model = Task.to(task)
    return request.put(url.Update, model)
      .then(res => {
        let task = Task.from(res.data)
        commit('updateTask', task)
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('resetOverview', { oldOverview, task })
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除任务
  deleteTask ({ state, commit }, id) {
    return request.delete(url.Delete, { id })
      .then(res => {
        let task = Task.from(res.data)
        commit('deleteTask', id)
        if (task.archived) {
          let which = task.objectType + task.objectId + 'task' + task.id
          let type = task.type
          commit('decreaseArchivedCount', { which, type })
        }
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewDecrease', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 解删除任务
  undeleteTask ({ state, commit }, id) {
    return request.get(url.Undelete, { id })
      .then(res => {
        const tasks = Task.from(res.data)
        commit('addTasks', tasks)
        commit('undeleteTaskInTrash', +id)
        // if (task.objectType !== 'person') { // 非工作台账的任务
        //   commit('setOverviewIncrease', task)
        // }
        return state.tasks.find(t => t.id === +id)
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 归档任务
  archiveTask ({ state, commit }, id) {
    return request.get(url.Archive, { id })
      .then(res => {
        let task = Task.from(res.data)
        commit('updateTask', task)
        let which = ''
        let type = task.type
        if (task.type === 'list') {
          which = task.objectType + task.objectId + 'task' + 0
          commit('increaseArchivedCount', { which, type })
        } else {
          which = task.objectType + task.objectId + 'task' + task.rootId
          commit('increaseArchivedCount', { which, type })
        }
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewDecrease', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 解档任务
  unarchiveTask ({ state, commit }, id) {
    return request.get(url.Unarchive, { id })
      .then(res => {
        const task = Task.from(res.data)
        commit('updateTask', task)
        let which = ''
        let type = task.type
        if (task.type === 'list') {
          which = task.objectType + task.objectId + 'task' + 0
          commit('decreaseArchivedCount', { which, type })
        } else {
          which = task.objectType + task.objectId + 'task' + task.rootId
          commit('decreaseArchivedCount', { which, type })
        }
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewIncrease', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 移动任务
  moveTask ({ state, commit }, query) {
    // query是dynamic类型参数
    return request.put(url.Move, query)
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return {} // 别改
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 复制任务
  copyTask ({ state, commit }, query) {
    // query是dynamic类型参数
    return request.put(url.Copy, query)
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks.sort((a, b) => {
          if (a.id > b.id) return -1
          return 1
        })[0]
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  finishTask ({ state, commit }, { id, predictHour = -1, workHour = -1 }) {
    let task = _.find(state.tasks, t => t.id === +id)
    if (task.finished) {
      return task
    } else {
      return request.put(url.Finish, { id, predictHour, workHour })
        .then(res => {
          const task = Task.from(res.data)
          commit('updateTask', task)
          if (task.objectType !== 'person') { // 非工作台账的任务
            commit('setOverviewAfterFinished', task)
          }
          return task
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
  },
  activateTask ({ state, commit }, { id, predictHour = -1 }) {
    return request.put(url.Activate, { id, predictHour })
      .then(res => {
        const task = Task.from(res.data)
        commit('updateTask', task)
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewAfterActivated', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  sortTask ({ state, commit }, task) {
    const oldParentId = task.parentId
    let model = Task.to(task)
    return request.post(url.Sort, model)
      .then(res => {
        const task = Task.from(res.data)
        commit('updateTask', task)
        if (task.objectType !== 'person') { // 非工作台账的任务
          if (task.objectType !== 'person') { // 非工作台账的任务
            if (oldParentId !== task.parentId) {
              // 减去分组中的该任务统计数据，因不能跨清单移动，所以清单的不用动
              commit('setGroupOverviewDecrease', { id: oldParentId, overview: task.overivew })
              // 如果移入新的组中，新组加上
              if (task.parentId !== task.rootId) {
                commit('setGroupOverviewIncrease', { id: task.parentId, overview: task.overivew })
              }
            }
          }
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  insertTask ({ state, commit }, { task }) {
    let model = Task.to(task)
    return request.post(url.Insert, model)
      .then(res => {
        const task = Task.from(res.data)
        commit('addTasks', [task])
        if (task.objectType !== 'person') { // 非工作台账的任务
          commit('setOverviewIncrease', task)
        }
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 转为清单
  convertToList ({ state, commit }, groupID) {
    return request.get(url.ConvertToList, { id: groupID })
      .then(res => {
        // todo 转为清单没有处理归档的逻辑
        const oldTask = state.tasks.find(t => t.id === +groupID)
        commit('setOverviewDecrease', oldTask)
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 释放分组
  releaseGroup ({ state, commit }, groupID) {
    return request.get(url.ReleaseGroup, { id: groupID })
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        commit('deleteTask', groupID)
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  GetOverdueList ({ state, commit }, { list, type }) {
    let tasks0 = []
    if (type === 'overdue') {
      tasks0 = list.filter(item => item.endTime < formatDate(new Date(), 'YYYY-MM-DD') && item.type === 'item')
    } else if (type === 'overtoday') {
      tasks0 = list.filter(item => item.endTime === formatDate(new Date(), 'YYYY-MM-DD') && item.type === 'item')
    } else if (type === 'overtomorrow') {
      tasks0 = list.filter(item => item.endTime === formatDate(new Date() + 1, 'YYYY-MM-DD') && item.type === 'item')
    } else if (type === 'overweek') {
    } else if (type === 'overlater') {
      tasks0 = list.filter(item => item.endTime > formatDate(new Date() + 7, 'YYYY-MM-DD') && item.type === 'item')
    }
    let overdue = _.groupBy(tasks0, function (item) {
      return item.endTime
    })
    Object.keys(overdue).forEach(key => {
      overdue[key] = _.groupBy(overdue[key], function (a) {
        return a.parentId
      })
    })
    Object.keys(overdue).forEach(index => {
      Object.keys(overdue[index]).forEach(key => {
        let parent = list.find(a => a.id === +key)
        overdue[index][key].parent = parent
      })
    })
    return overdue
  },
  addTaskCommentCount ({ state, commit }, id) {
    let task = _.find(state.tasks, t => t.id === +id)
    task.commentCount += 1
    let model = Task.to(task)
    return request.put(url.Update, model)
      .then(res => {
        let task = Task.from(res.data)
        commit('updateTask', task)
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  reduceTaskCommentCount ({ state, commit }, id) {
    let task = _.find(state.tasks, t => t.id === +id)
    task.commentCount -= 1
    let model = Task.to(task)
    return request.put(url.Update, model)
      .then(res => {
        let task = Task.from(res.data)
        commit('updateTask', task)
        return task
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
* 更新任务讨论数量
* @param {*} param0 id 任务id
* @param {*} param1 isAdd true：新建讨论；false：删除讨论
*/
  updateTaskCommentCount ({ state, commit }, { id, isAdd }) {
    return request.put(url.UpdateCommentCount, { id, isAdd })
      .then(res => {
        if (res.data) {
          isAdd ? commit('commentCountIncrease', id)
            : commit('commentCountDecrease', id)
        }
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
*
* @param { 获取仪表盘（项目任务）数据} param0
*/
  loadDashboardtProjectSeriousTasks ({ state, commit }, objectID = 0) {
    // 当没有加载过
    // if (_.isEmpty(state.dashboardtProjectSeriousTasks) || !state.loadedDashboardTasks) {
    // commit('setLoadedDashboardTasks', true)
    let queryCondition = [
      { Key: 'ObjectType', Value: 'project', Oper: 'eq' },
      'and',
      { Key: 'Type', Value: 'item', Oper: 'eq' },
      'and',
      { Key: "Overview->'$.SeriousCount'", Value: 0, Oper: 'gt' }
    ]
    if (objectID && +objectID > 0) {
      queryCondition.push('and', { Key: 'ObjectID', Value: +objectID, Oper: 'eq' })
    }
    return request.get(url.GetList, { query: JSON.stringify(queryCondition) })
      .then(res => {
        let projectTasks = Task.from(res.data)
        commit('updateDashboardtProjectSeriousTasks', projectTasks)
        return projectTasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return []
      })
    // } else {
    //   return state.dashboardtProjectSeriousTasks
    // }
  },
  //* ********************************批量导入Excel数据相关方法 start********************************************************** */
  /**
   * 批量新增excel表格数据
   * @param {Array} modelList excel数据列表
   * @param {String} repeatDataWay 重复数据方式
   * @param {String} fieldsInExcel 返回没有添加成功的model的字段
   * @param {String} category 资源类型，例如：‘project’
   * @param {String} objectID 资源ID，例如：ProjectID
   * @param {Object} extraProperty 额外属性
   */
  batchAddExcelData ({ dispatch }, { modelList, fieldsInExcel, category, objectID, extraProperty }) {
    let errorData = []
    // 校验
    let errorList = _.filter(modelList, item => { return !item['parentId(list)'] })
    if (errorList.length) {
      _.remove(modelList, function (item) {
        return !item['parentId(list)']
      })
      errorList = _.map(errorList, e => {
        e['parentId(list)'] = '【请填写清单名称】'
        return e
      })
      errorData.push(...errorList)
    }
    // 将modelList拆解为任务清单、分组、具体任务等，分别批量插入到数据库中
    const checkList = _.uniqBy(_.map(modelList, 'parentId(list)'))
    if (checkList.length === 0) {
      return errorData
    }
    // 1、清单列表
    const listModels = _.map(checkList, item => {
      let newModel = new Task(
        {
          name: item,
          tags: ['清单'],
          objectType: category,
          objectId: objectID,
          type: 'list'
        }
      )
      // 如果是保密清单，则将创建人添加到
      if (extraProperty.isSetSecretList) {
        Object.assign(newModel, { acl: 2, whiteList: [LocalStorage.getItem('myself').id] })
      }
      return newModel
    })
    // 1、批量新增清单数据
    return dispatch('batchAddTasks', { modelList: listModels })
      .then(res => {
        if (res.length > 0) {
          // 2、批量新增分组数据
          return dispatch('batchAddGroup', { modelList, list: res, errorData, fieldsInExcel, category, objectID, extraProperty })
        } else {
          return errorData
        }
      })
  },
  /**
   * 批量新增分组数据
   * @param {Arrey} modelList excel列表数据
   * @param {Arrey} list 返回的清单列表数据
   * @param {Arrey} errorData 错误数据列表
   * @param {String} fieldsInExcel 返回没有添加成功的model的字段
   * @param {String} category 资源类型，例如：‘project’
   * @param {String} objectID 资源ID，例如：ProjectID
   */
  batchAddGroup ({ dispatch, rootState }, { modelList, list, errorData, fieldsInExcel, category, objectID, extraProperty }) {
    // 1、找出清单和分组的数据
    let group = _.map(modelList, item => {
      const oneList = _.find(list, l => { return l.name === item['parentId(list)'] })
      item.parentId = oneList.id
      item.rootId = oneList.id
      return _.pick(item, ['parentId(list)', 'parentId(group)', 'parentId', 'rootId'])
    })
    // 2、排除空项
    group = _.filter(group, item => { return item['parentId(group)'] !== '' && item['parentId(group)'] !== '/' })
    // 3、拼接分组数据
    let groupModelList = []
    if (group.length > 0) {
      const groupLength = group.length
      const len = groupLength.toString().length
      let persons = _.values(rootState.person.selectPersons)
      _(group).forEach(function (item, index) {
        let f = _.filter(groupModelList, g => { return g['name'] === item['parentId(group)'] && g['parentId'] === item['parentId'] })
        if (!f.length) {
          const rootId = _.find(list, l => { return l.name === item['parentId(list)'] }).id
          let model = new Task(
            {
              name: item['parentId(group)'],
              objectType: category,
              objectId: objectID,
              rootId: rootId,
              parentId: rootId,
              level: 1,
              type: 'group',
              color: 'bg-white',
              orderNumber: _.padStart((index === 0 ? index + 1 : index).toString(), len, 0)
            }
          )
          // 如果是保密权限，则设置白名单，分组的白名单为分组负责人+分组下面的任务指派人
          if (extraProperty.isSetSecretList) {
            const tasksOfGroup = _.filter(modelList, e => { return e['parentId(group)'] === model.name })
            // 找到指派着
            let assignTo = _.join(_.map(tasksOfGroup, 'assignedTo'))
            // 找到负责人
            let groupLeader = _.join(_.map(tasksOfGroup, 'groupLeader'))
            let white = assignTo + ',' + groupLeader
            white = _.map(_.filter(persons, function (o) {
              return _.compact(white.replace(/、/g, ',').replace(/，/g, ',').replace(/ /g, ',').split(',')).includes(o.name)
            }), 'id')

            white.push(LocalStorage.getItem('myself').id)
            white = _.uniq(white)
            Object.assign(model, { acl: 2, whiteList: white })
          }
          groupModelList.push(model)
        }
      })
      return dispatch('batchAddTasks', { modelList: groupModelList })
        .then(res => {
          if (res.length > 0) {
            // 2、批量新增分组数据
            let groupList = _.map(res, item => {
              const parent = _.find(list, l => { return l.id === item['parentId'] })
              item.parentName = parent.name
              return item
            })
            return dispatch('batchAddExcelTask', { modelList, list, groupList: groupList, errorData, fieldsInExcel, category, objectID, extraProperty })
          } else {
            return errorData
          }
        })
    } else {
      return dispatch('batchAddExcelTask', { modelList, list, groupList: [], errorData, fieldsInExcel, category, objectID, extraProperty })
    }
  },
  /**
   * 批量新增Excel任务
   * @param {*} modelList excel表格数据
   * @param {*} groupList 分组列表数据
   * @param {Arrey} errorData 错误数据列表
   * @param {String} fieldsInExcel 返回没有添加成功的model的字段
   * @param {*} category 资源，例如：project
   * @param {*} objectID 资源ID，例如：ProjectID
   */
  batchAddExcelTask ({ dispatch, rootState }, { modelList, list, groupList, errorData, fieldsInExcel, category, objectID, extraProperty }) {
    let persons = _.values(rootState.person.selectPersons)
    let taskList = []
    _(modelList).forEach(function (item, index) {
      let parent = {}, level = 3
      if (item['parentId(group)'] !== '/' && item['parentId(group)'] !== '') {
        parent = _.find(groupList, l => { return l['name'] === item['parentId(group)'] && l['parentName'] === item['parentId(list)'] })
      } else {
        parent = _.find(list, l => { return l['name'] === item['parentId(list)'] })
        level = 2
      }
      try {
        // 处理开始时间和结束时间
        let startTime = '', endTime = ''
        if (item.startTime.toString()) {
          let formatDate = date.formatDate(item.startTime.toString().replace(/\./g, '/'), 'YYYY-MM-DD hh:mm:ss')
          formatDate.indexOf('11:59:17') > -1 && (formatDate = date.addToDate(new Date(formatDate), { days: 1 }))
          startTime = date.formatDate(formatDate, 'YYYY-MM-DD')
        }
        if (item.endTime.toString()) {
          let formatDate = date.formatDate(item.endTime.toString().replace(/\./g, '/'), 'YYYY-MM-DD hh:mm:ss')
          formatDate && formatDate.indexOf('11:59:17') > -1 && (formatDate = date.addToDate(new Date(formatDate), { days: 1 }))
          endTime = date.formatDate(formatDate, 'YYYY-MM-DD')
        }
        let dateType = ''
        if (!startTime && endTime) {
          dateType = 'day'
        } else if (!endTime && startTime) {
          endTime = startTime
          dateType = 'range'
        } else if (!endTime && !startTime) {
          dateType = 'none'
        } else if (endTime && startTime) {
          dateType = 'range'
        }
        let model = new Task(
          {
            name: item['name'],
            objectType: category,
            objectId: objectID,
            rootId: parent.rootId,
            parentId: parent.id,
            type: 'item',
            color: 'bg-white',
            assignedTo: _.map(_.filter(persons, function (o) {
              return _.compact(item.assignedTo.replace(/、/g, ',').replace(/，/g, ',').replace(/ /g, ',').split(',')).includes(o.name)
            }), 'id'),
            assignedByID: LocalStorage.getItem('myself').id,
            description: item.description,
            assignedTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            dateType: dateType,
            endTime: endTime,
            startTime: startTime,
            notifyAssignedTo: true,
            level: level
          }
        )
        if (extraProperty.isSetSecretList) {
          let white = []
          white.push(...model.assignedTo, LocalStorage.getItem('myself').id)

          Object.assign(model, { acl: 2, whiteList: _.uniq(white) })
        }
        taskList.push(model)
      } catch (error) {
        item['parentId(list)'] = `${item['parentId(list)']}【${error.message}】} `
        errorData.push(item)
      }
    })
    // 将团队中的人员加入到项目团队成员中
    const members = _.map(taskList, 'assignedTo')
    members.length >= 0 && dispatch('addMembersToCategory', { category, objectID, members })
    // 将数据分组，按照RootID，ParentID，ObjectType，ObjectID
    const listTasks = _.groupBy(taskList, 'rootId')
    const minGroupOrderNumber = _.sortBy(_.map(groupList || [], 'orderNumber'))[0]
    let allList = []
    _(listTasks).forEach(function (list) {
      let sortTasks = _.sortBy(list, function (o) { return o.parentId !== o.rootId })
      let groupTasks = _.groupBy(sortTasks, 'parentId')

      _.forEach(groupTasks, function (items, key, index) {
        items = _.map(items, (i, index) => {
          if (i.parentId === i.rootId) {
            i.orderNumber = _.padStart(index + 1, minGroupOrderNumber ? minGroupOrderNumber.length + 1 : '1', 0)
          } else {
            i.orderNumber = index + 1
          }
          return i
        })
        allList.push(...items)
      })
    })
    // 向后台插入数据
    return dispatch('batchAddTasks', { modelList: allList })
      .then(res => {
        if (!res.length) {
          return errorData
        }
      })
  },
  /**
   * 向后台批量添加数据
   * overview的处理只考虑总数和完成数，不考虑疑难和严重数量的统计
   * @param {*} modelList 需要添加的数据
   */
  batchAddTasks ({ state, commit, dispatch }, { modelList }) {
    try {
      modelList = Task.to(modelList)
      return request.post('tasks/BatchAdd', modelList)
        .then(res => {
          if (res && res.data.length) {
            const tasks = Task.from(res.data)
            commit('addTasks', tasks)
            if (tasks[0].objectType !== 'person') {
              tasks.forEach(task => commit('setOverviewIncrease', task))
            }
            return tasks
          } else { return [] }
        })
        .catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage} `))
          return false
        })
    } catch (error) {
      return []
    }
  },
  /**
   * 添加成员到资源表中，默认成员角色都是member
   * @param {*} category 资源，例如：project
   * @param {*} objectID 资源ID，例如：ProjectID
   * @param {*} members 导入的成员
   */
  addMembersToCategory ({ state, commit, dispatch, rootState }, { category, objectID, members }) {
    // 1、先获取当前资源的成员
    dispatch('member/loadMembers', { category, objectID }, { root: true })
      .then(res => {
        if (res.length) {
          let diff = _.difference(members, res)
          diff = _.union(...diff)
          let oldMembers = _.filter(rootState.member.members[`${category} _${objectID} `], item => { return item.duty === 'member' })
          let oldMemberIDs = _.map(oldMembers, 'psonID')
          diff.push(...oldMemberIDs)
          if (diff.length > 0) {
            dispatch(`${category}/update${capitalize(category)}Members`,
              { id: +objectID, personIDs: _.uniq(diff), identify: 'member' },
              { root: true })
          }
        }
      })
  },
  //* ********批量导入Excel数据相关方法 end**** */

  //* ********导出相关方法 end*************** */
  /**
 * 获取最新讨论内容
 * @param {String} taskID 清单或分组ID
 * @param {String} category 资源类型
 * @param {String} objectID 资源ID
 * @param {String} orderby排序 CreateTime Desc
 */
  getNewCommentOfAssigned ({ state, commit }, { taskID = 0, category = '', objectID = 0 }) {
    return request
      .get('tasks/getlatestcommentofassigned', { taskID, category, objectID })
      .then(res => {
        let discuss = Discuss.from(res.data)
        commit('addComments', discuss)
        return discuss
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
 * 获取开始日期到今天的所有指派人讨论数
 * @param {String} Ids taskID的集合
 * @param {String} createTime 创建日期
 * @param {String} objectID 资源ID
 * @param {String} orderby排序 CreateTime Desc
 */
  getPeriodTimeCommentOfAssigned ({ state, commit }, { Ids, createTime, category = '', objectID = 0 }) {
    return request
      .get('tasks/getperiodtimecommentofassigned', { taskIDs: Ids, createTime, category, objectID })
      .then(res => {
        let discuss = Discuss.from(res.data)
        commit('addComments', discuss)
        return discuss
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /** ------------------------------批量操作(指派，删除，归档，复制，移动)------------------ */
  // 批量删除任务
  deleteTasks ({ state, commit }, ids) {
    return request.delete(url.BatchDelete, { ids })
      .then(res => {
        let tasks = Task.from(res.data)
        tasks.forEach(task => commit('setOverviewDecrease', task))
        commit('deleteTasks', ids)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 批量归档任务
  archiveTasks ({ state, commit }, ids) {
    return request.get(url.BatchArchive, { ids })
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        tasks.forEach(task => {
          let which = task.objectType + task.objectId + 'task' + task.rootId
          let type = task.type
          commit('increaseArchivedCount', { which, type })
          commit('setOverviewDecrease', task)
        })
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 批量移动任务
  moveTasks ({ state, commit }, query) {
    // query是dynamic类型参数
    return request.put(url.BatchMove, query)
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 批量复制任务
  copyTasks ({ state, commit }, query) {
    // query是dynamic类型参数
    return request.put(url.BatchCopy, query)
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 批量指派任务
  assignTasks ({ state, commit }, query) {
    // query是dynamic类型参数
    return request.put(url.BatchAssign, query)
      .then(res => {
        let tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /** ------------------------------获取已删除的任务------------------ */
  // 获取与我相关的已删除的任务
  loadTasksInMyTrash ({ state, commit }) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'AssignedTo', Value: my.name, Oper: 'inset' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.GetDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasksInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除任务
  loadTasksInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' },
      'and',
      { Key: 'DeleteTime', Value: time, Oper: 'ge' }
    ]
    return request.get(url.GetDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasksInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /** --------------------------------加密，解密任务----------- */
  // 加密任务(目前只有清单可加密)
  secrecyTask ({ state, commit }, id) {
    return request.get(url.Secrecy, { id })
      .then(res => {
        const tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 解密任务(目前只有清单可解密)
  unsecrecyTask ({ state, commit }, id) {
    return request.get(url.Unsecrecy, { id })
      .then(res => {
        const tasks = Task.from(res.data)
        commit('addTasks', tasks)
        return tasks
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** --------------------------------工作台账start----------- */
  loadWorkRecordTaskPageList ({ state, commit }, {
    query,
    filter,
    sort,
    search = state.search,
    fields = 'workHourList',
    limit = state.page.limit,
    offset = state.page.offset,
    orgId = 0,
    psonId = 0
  } = {}) {
    let params = {
      limit: limit,
      offset: offset,
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      sort: sort,
      fields: fields,
      orgId: orgId,
      psonId: psonId
    }
    return request.get(url.GetWorkRecordTaskPageList, params)
      .then(res => {
        let list = Task.from(res.data)
        commit('setPage', {
          offset: state.page.offset + list.length, nextPageToken: res.nextPageToken
        })
        commit('addTasks', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadWorkRecordTaskList ({ state, commit }, {
    query,
    filter,
    orderby,
    search = state.search,
    fields = 'workHourList',
    orgId = 0,
    psonId = 0
  } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      orderby: orderby,
      fields: fields,
      orgId: orgId,
      psonId: psonId
    }
    return request.get(url.GetWorkRecordTaskList, params)
      .then(res => {
        let list = Task.from(res.data)
        commit('addTasks', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`task.error.${error.userMessage}`))
        return false
      })
  },
  // 台账日历
  loadWorkRecordCalendarList ({ state, commit }, {
    query,
    filter,
    sort,
    search = state.search,
    fields = 'workHourList',
    orgId = 0,
    psonId = 0
  } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      sort: sort,
      fields: fields,
      orgId: orgId,
      psonId: psonId
    }
    return request.get(url.GetWorkRecordTaskList, params)
      .then(res => {
        let queryStart = _.filter(query, ['Key', 'BeginTime'])
        let queryEnd = _.filter(query, ['Key', 'FinishedTime'])
        commit('setQueryTime', { startTime: queryStart[0].Value, endTime: queryEnd[0].Value })
        let list = Task.from(res.data)
        let queryTimeRange = queryStart[0].Value + '~' + queryEnd[0].Value
        let obj = {
          queryTimeRange: queryTimeRange,
          tasks: list
        }
        commit('addCalendarTasks', obj)
        return obj
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadPersonSumHoursByMonth ({ state, commit }, {
    query,
    filter,
    search = state.search,
    fields = 'workHourList'
  } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    }
    return request.get(url.PersonSumWorkHoursByMonth, params)
      .then(res => {
        let queryStart = _.filter(query, ['Key', 'BeginTime'])
        let queryEnd = _.filter(query, ['Key', 'FinishedTime'])
        commit('setQuerySumMonthTime', { startTime: queryStart[0].Value, endTime: queryEnd[0].Value })
        let year = queryStart[0].Value.split('-')[0], month = queryStart[0].Value.split('-')[1]
        _.forEach(res.data, item => {
          item.yearMonth = year + '-' + month
        })
        commit('setSumHoursOnePersonByMonth', res.data)
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadSumHoursByMonth ({ state, commit }, {
    query,
    filter,
    search = state.search,
    fields = 'workHourList'
  } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    }
    return request.get(url.SumWorkHoursByMonth, params)
      .then(res => {
        let queryStart = _.filter(query, ['Key', 'BeginTime'])
        let queryEnd = _.filter(query, ['Key', 'FinishedTime'])
        commit('setQuerySumMonthTime', { startTime: queryStart[0].Value, endTime: queryEnd[0].Value })
        let year = queryStart[0].Value.split('-')[0]
        let month = queryStart[0].Value.split('-')[1]
        _.forEach(res.data, item => {
          item.yearMonth = year + '-' + month
        })
        commit('setSumHoursByMonth', res.data)
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** --------------------------------工作台账end------------ */

  processDataOfExportExcel ({ state, dispatch, rootState, rootGetters }, { list, fields, extra }) {
    let data = []
    let modellist = _.cloneDeep(list)
    let persons = rootState.person.selectPersons
    if (extra && Object.keys(extra).length && _.has(extra, 'isWorkRecord') && extra.isWorkRecord) {
      let tasks = Task.from(modellist)
      let rootList = tasks.filter(a => a.type === 'list')
      if (rootList && rootList.length) {
        rootList = _.orderBy(rootList, 'orderNumber', 'desc')
        let list = []
        rootList.forEach(item => {
          let tasksInList = tasks.filter(task => task.parentId === +item.id && !task.archived && !task.deleted)
          if (tasksInList && tasksInList.length) {
            list.push(item)
            tasksInList = _.orderBy(tasksInList, ['beginTime'], ['asc'])
            list.push(tasksInList)
          }
        })
        tasks = _.flattenDeep(list)
        modellist = _.cloneDeep(Task.to(tasks))
      }
      modellist.forEach(item => {
        item = processDataByItem(item, fields, persons)
        data.push(item)
      })
      return data
    } else {
      let formatList = _.cloneDeep(modellist)

      if (extra && Object.keys(extra).length && _.has(extra, 'isFormat') && extra.isFormat) {
        const tasks = Task.from(modellist)
        formatList = _.cloneDeep(tasks)
      }
      // 是否需要按照选择的导出条件过滤
      if (extra && Object.keys(extra).length && _.has(extra, 'isExportFilter') && extra.isExportFilter) {
        formatList = rootGetters['task/filterExportExcel'](formatList)
      }
      // 是否需要格式化。使任务按清单、分组、任务格式显示
      if (extra && Object.keys(extra).length && _.has(extra, 'isFormat') && extra.isFormat) {
        let rootList = formatList.filter(a => a.type === 'list')
        rootList = _.orderBy(rootList, 'orderNumber', 'desc')
        let list = []
        rootList.forEach(item => {
          let tasksInList = rootGetters['task/tasksInListContainsArchived'](+item.id, formatList, rootState.task.exportArchived)
          if (tasksInList && tasksInList.length) {
            list.push(item)
            list.push(tasksInList)
          }
        })
        formatList = _.flattenDeep(list)
        formatList = _.cloneDeep(Task.to(formatList))
      }
      let lists = formatList.filter(t => t.Type === 'list')
      let groups = formatList.filter(t => t.Type === 'group')
      let params = {
        taskID: 0,
        category: '',
        objectID: 0
      }
      if (lists.length === 0 && groups.length === 0) {
        // 导出任务
        params.taskID = lists[0].TaskID
      } else if (lists.length === 0 && groups.length === 1) {
        // 导出分组
        params.taskID = groups[0].TaskID
      } else if (lists.length === 1) {
        // 导出清单
        params.taskID = lists[0].TaskID
      } else if (lists.length > 1) {
        // 导出资源下的任务
        params.objectID = formatList[0].ObjectID
        params.category = formatList[0].ObjectType
      }
      return dispatch('getNewCommentOfAssigned', params).then(res => {
        let comments = res
        formatList.forEach(item => {
          item = processDataByItem(item, fields, persons)
          if (item.Type && item.Type === 'item') {
            let comment = comments.find(a => a.objectID === item.TaskID && item.AssignedTo.includes(a.createBy))
            item.Progress = _.isEmpty(comment) ? '暂无' : htmlToText(comment.content)
          }
          data.push(item)
        })
        return data
      })
    }
  },
  // 发送任务添加历史记录
  addHistoryBySendMessage ({ state, commit }, payload) {
    return request
      .put(url.AddHistoryBySendMessage, payload)
      .then(res => {
        let task = Task.from(res.data)
        commit('updateTask', task)
        return task
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  }
}
function processDataByItem (item, fields, persons) {
  if (item.Type === 'list') {
    let name = item.TaskName
    item = {}
    item[fields[0]] = `<td style="font-size:20px;font-weight:bold; height:40px;background-color:#bbdefb"  colspan="${fields.length}" align="center" >${name}</td>`
  } else if (item.Type === 'group') {
    let name = item.TaskName
    item = {}
    item[fields[0]] = `<td style="font-size:16px;height:30px; font-weight:bold;background-color:#c8e6c9" colspan="${fields.length}" align="center" >${name}</td>`
  } else {
    if (item.StartTime === '1000-01-01 00:00:00') {
      item.StartTime = '暂无'
    } else {
      item.StartTime = date.formatDate(item.StartTime, 'YYYY-MM-DD')
    }
    if (item.EndTime === '1000-01-01 00:00:00') {
      item.EndTime = '暂无'
    } else {
      item.EndTime = date.formatDate(item.EndTime, 'YYYY-MM-DD')
    }
    if (item.Finished) {
      item.Finished = '<td style="color:green">已完成</td>'
    } else {
      item.Finished = '<td style="color:red">未完成</td>'
    }
    if (date.formatDate(item.BeginTime, 'YYYY-MM-DD') === '1000-01-01') {
      item.BeginTime = '暂无'
    }
    if (date.formatDate(item.FinishedTime, 'YYYY-MM-DD') === '1000-01-01') {
      item.FinishedTime = '暂无'
    }
    if (item.Address) {
      if (!_.isObject(item.Address)) item.Address = JSON.parse(item.Address)
      if (Object.keys(item.Address).length) {
        if (item.Address.type === 'none') {
          item.Address = ''
        } else if (item.Address.type === 'cityname') {
          item.Address = item.Address.value || ''
        } else {
          item.Address = item.Address.value.name || ''
        }
      }
    }
    if (item.AssignedTo !== '') {
      let names = []
      item.AssignedTo.split(',').forEach(a => {
        let name = persons[a] && persons[a].name
        name && names.push(name)
      })
      item.AssignedTo = names
    }
    if (item.FinishedBy) {
      item.FinishedBy = persons[+item.FinishedBy] && persons[+item.FinishedBy].name
    }
  }
  return item
}
