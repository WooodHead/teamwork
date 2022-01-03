import Vue from 'vue'
export default {
  addTasksInWidget (state, { objectType, objectID, tasks }) {
    if (tasks && tasks.length) {
      Vue.set(state.tasksInWidget, objectType + objectID, tasks)
    }
  },
  // 新建(或编辑)多个任务
  addTasksInTrash (state, tasksInTrash) {
    let list = _.unionBy(tasksInTrash, 'id')
    const ids = []
    _(list).each(function (task) {
      ids.push(task.id)
    })
    state.tasksInTrash = state.tasksInTrash.filter(a => !ids.includes(a.id))
    state.tasksInTrash.push(...list)
  },
  undeleteTaskInTrash (state, id) {
    let model = state.tasksInTrash.find(a => a.id === id)
    if (model.type === 'list') {
      state.tasksInTrash = state.tasksInTrash.filter(a => a.rootId !== id)
    } else if (model.type === 'group') {
      state.tasksInTrash = state.tasksInTrash.filter(a => a.parentId !== id && a.id !== id)
    } else {
      state.tasksInTrash = state.tasksInTrash.filter(a => a.id !== id)
    }
  },
  // 新建(或编辑)多个任务
  addTasks (state, tasks) {
    let list = _.unionBy(tasks, 'id')
    const ids = []
    _(list).each(function (task) {
      ids.push(task.id)
    })
    state.tasks = state.tasks.filter(a => !ids.includes(a.id))
    state.tasks.push(...list)
  },
  // 新建多个任务
  addTasksInCalendar (state, tasksInCalendar) {
    const newTasksInCalendar = _.differenceBy(tasksInCalendar, state.tasksInCalendar, 'id')
    state.tasksInCalendar.push(...newTasksInCalendar)
  },
  addComments (state, comments) {
    const newComments = _.differenceBy(comments, state.comments, 'id')
    state.comments.push(...newComments)
  },
  // 更新一条任务
  updateTask (state, task) {
    const index = state.tasks.findIndex(t => t.id === task.id)
    state.tasks.splice(index, 1, task)
  },
  deleteTask (state, id) {
    let model = state.tasks.find(a => a.id === id)
    if (model.type === 'list') {
      state.tasks = state.tasks.filter(a => a.rootId !== id)
    } else if (model.type === 'group') {
      state.tasks = state.tasks.filter(a => a.parentId !== id && a.id !== id)
    } else {
      state.tasks = state.tasks.filter(a => a.id !== id)
    }
  },
  deleteTasks (state, ids) {
    state.tasks = state.tasks.filter(a => !ids.includes(a.id))
  },
  setAddingEvent (state, adding) {
    state.addingEvent = adding
  },
  setObjectID (state, objectID) {
    state.objectID = objectID
  },
  setObjectType (state, objectType) {
    state.objectType = objectType
  },
  setEmptyTasks (state) {
    state.tasks = []
  },
  // 设置卡片列表
  setView (state, value) {
    state.view = value
  },
  // 设置任务详情页分离视图
  setDetailView (state, value) {
    state.detailView = value
  },
  initPage (state) {
    state.page = {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    }
  },
  setPage (state, page) {
    Object.assign(state.page, page)
  },
  // 设置搜索条件
  setSearch (state, value) {
    state.search = value
  },
  // 设置搜索日期
  setSearchDate (state, value) {
    state.searchDate = value
  },
  // 设置共享人员
  setPublicPersons (state, value) {
    state.publicPersons = value
  },
  // 设置归档数量
  setArchivedCount (state, value) {
    let index = Object.keys(value)[0]
    Vue.set(state.archivedCount, index, value[index])
  },
  increaseArchivedCount (state, { which, type }) {
    if (state.archivedCount[which]) {
      if (type === 'group') {
        state.archivedCount[which].groupCount++
      } else {
        state.archivedCount[which].itemCount++
      }
    } else {
      if (type === 'group') {
        var obj = {
          itemCount: 0,
          groupCount: 1
        }
        state.archivedCount[which] = obj
      } else {
        var obj = {
          itemCount: 1,
          groupCount: 0
        }
        state.archivedCount[which] = obj
      }
    }
  },
  decreaseArchivedCount (state, { which, type }) {
    if (state.archivedCount[which]) {
      if (type === 'group') {
        state.archivedCount[which].groupCount--
      } else {
        state.archivedCount[which].itemCount--
      }
    } else {
      var obj = {
        itemCount: 0,
        groupCount: 0
      }
      state.archivedCount[which] = obj
    }
  },
  // 设置仪表盘（项目任务）数据
  updateDashboardtProjectSeriousTasks (state, value) {
    state.dashboardtProjectSeriousTasks = value
  },
  // 更新ctrllist
  updateCtrlList (state, id) {
    // 清除showMenu
    let index0 = state.ctrlList.findIndex(t => t.showMenu)
    if (index0 !== -1) {
      state.ctrlList[index0].showMenu = false
    }
    // 是否删除
    let index = state.ctrlList.findIndex(t => t.id === id)
    if (index !== -1) {
      // 移除
      Vue.delete(state.ctrlList, index)
    } else {
      // 添加
      state.ctrlList.push({
        id: id,
        showMenu: false,
        bgColor: 'bg-light-blue-1'
      })
    }
    // 设置showmenu
    if (state.ctrlList.length) {
      let len = state.ctrlList.length
      state.ctrlList[len - 1].showMenu = true
    }
  },
  // 清空ctrllist
  cleanCtrlList (state) {
    state.ctrlList = []
  },
  // 设置仪表盘（项目任务）数据加载状态
  setLoadedDashboardTasks (state, loaded) {
    state.loadedDashboardTasks = loaded
  },
  // 设置筛选条件（标签，里程碑，缺陷）
  setFilterType (state, value) {
    state.filterType = value
  },
  // 设置excel导出已完成的任务
  setExportFinished (state, value) {
    state.exportFinished = value
  },
  // 设置excel导出已归档的任务
  setExportArchived (state, value) {
    state.exportArchived = value
  },
  /** ----------------------start update overview---------------------- */
  setOverviewIncrease (state, task) {
    if (task.type === 'list') return
    let group = _.find(state.tasks, t => t.id === +task.parentId)
    let list = _.find(state.tasks, t => t.id === +task.rootId)
    list.overview.allCount += task.overview.allCount
    list.overview.finishedAllCount += task.overview.finishedAllCount
    list.overview.seriousCount += task.overview.seriousCount
    list.overview.finishedSeriousCount += task.overview.finishedSeriousCount
    list.overview.difficultCount += task.overview.difficultCount
    list.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    if (list.id !== group.id) {
      group.overview.allCount += task.overview.allCount
      group.overview.finishedAllCount += task.overview.finishedAllCount
      group.overview.seriousCount += task.overview.seriousCount
      group.overview.finishedSeriousCount += task.overview.finishedSeriousCount
      group.overview.difficultCount += task.overview.difficultCount
      group.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    }
  },
  setOverviewIncreaseOfGiven (state, { id, overview }) {
    let task = _.find(state.tasks, t => t.id === +id)
    task.overview.allCount += overview.allCount
    task.overview.finishedAllCount += overview.finishedAllCount
    task.overview.seriousCount += overview.seriousCount
    task.overview.finishedSeriousCount += overview.finishedSeriousCount
    task.overview.difficultCount += overview.difficultCount
    task.overview.finishedDifficultCount += overview.finishedDifficultCount
  },
  setOverviewAfterFinished (state, task) {
    if (task.type === 'list') return
    let group = _.find(state.tasks, t => t.id === +task.parentId)
    let list = _.find(state.tasks, t => t.id === +task.rootId)
    list.overview.finishedAllCount += task.overview.finishedAllCount
    list.overview.finishedSeriousCount += task.overview.finishedSeriousCount
    list.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    if (list.id !== group.id) {
      group.overview.finishedAllCount += task.overview.finishedAllCount
      group.overview.finishedSeriousCount += task.overview.finishedSeriousCount
      group.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    }
  },
  /**
   * 
   * @param {*} state 
   * @param {*} task 
   * @returns 
   */
  setOverviewDecrease (state, task) {
    if (task.type === 'list') return
    let group = _.find(state.tasks, t => t.id === +task.parentId)
    let list = _.find(state.tasks, t => t.id === +task.rootId)
    list.overview.allCount -= task.overview.allCount
    list.overview.finishedAllCount -= task.overview.finishedAllCount
    list.overview.seriousCount -= task.overview.seriousCount
    list.overview.finishedSeriousCount -= task.overview.finishedSeriousCount
    list.overview.difficultCount -= task.overview.difficultCount
    list.overview.finishedDifficultCount -= task.overview.finishedDifficultCount
    if (list.id !== group.id) {
      group.overview.allCount -= task.overview.allCount
      group.overview.finishedAllCount -= task.overview.finishedAllCount
      group.overview.seriousCount -= task.overview.seriousCount
      group.overview.finishedSeriousCount -= task.overview.finishedSeriousCount
      group.overview.difficultCount -= task.overview.difficultCount
      group.overview.finishedDifficultCount -= task.overview.finishedDifficultCount
    }
  },
  setOverviewDecreaseOfGiven (state, { id, overview }) {
    let task = _.find(state.tasks, t => t.id === +id)
    task.overview.allCount -= overview.allCount
    task.overview.finishedAllCount -= overview.finishedAllCount
    task.overview.seriousCount -= overview.seriousCount
    task.overview.finishedSeriousCount -= overview.finishedSeriousCount
    task.overview.difficultCount -= overview.difficultCount
    task.overview.finishedDifficultCount -= overview.finishedDifficultCount
  },
  setOverviewAfterActivated (state, task) {
    if (task.type === 'list') return
    let group = _.find(state.tasks, t => t.id === +task.parentId)
    let list = _.find(state.tasks, t => t.id === +task.rootId)
    list.overview.finishedAllCount -= task.overview.allCount
    list.overview.finishedSeriousCount -= task.overview.seriousCount
    list.overview.finishedDifficultCount -= task.overview.difficultCount
    if (list.id !== group.id) {
      group.overview.finishedAllCount -= task.overview.allCount
      group.overview.finishedSeriousCount -= task.overview.seriousCount
      group.overview.finishedDifficultCount -= task.overview.difficultCount
    }
  },
  /**
   * 重置overview，先减后加
   * @param {*} state 
   * @param {*} param1 
   * @returns 
   */
  resetOverview (state, { oldOverview, task }) {
    if (task.type === 'list') return
    let group = _.find(state.tasks, t => t.id === +task.parentId)
    let list = _.find(state.tasks, t => t.id === +task.rootId)
    list.overview.allCount -= oldOverview.allCount
    list.overview.finishedAllCount -= oldOverview.finishedAllCount
    list.overview.seriousCount -= oldOverview.seriousCount
    list.overview.finishedSeriousCount -= oldOverview.finishedSeriousCount
    list.overview.difficultCount -= oldOverview.difficultCount
    list.overview.finishedDifficultCount -= oldOverview.finishedDifficultCount

    list.overview.allCount += task.overview.allCount
    list.overview.finishedAllCount += task.overview.finishedAllCount
    list.overview.seriousCount += task.overview.seriousCount
    list.overview.finishedSeriousCount += task.overview.finishedSeriousCount
    list.overview.difficultCount += task.overview.difficultCount
    list.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    if (list.id !== group.id) {
      group.overview.allCount -= oldOverview.allCount
      group.overview.finishedAllCount -= oldOverview.finishedAllCount
      group.overview.seriousCount -= oldOverview.seriousCount
      group.overview.finishedSeriousCount -= oldOverview.finishedSeriousCount
      group.overview.difficultCount -= oldOverview.difficultCount
      group.overview.finishedDifficultCount -= oldOverview.finishedDifficultCount

      group.overview.allCount += task.overview.allCount
      group.overview.finishedAllCount += task.overview.finishedAllCount
      group.overview.seriousCount += task.overview.seriousCount
      group.overview.finishedSeriousCount += task.overview.finishedSeriousCount
      group.overview.difficultCount += task.overview.difficultCount
      group.overview.finishedDifficultCount += task.overview.finishedDifficultCount
    }
  },
  /** ----------------------end update overview---------------------- */

  commentCountIncrease (state, id) {
    const task = state.tasks.find(t => t.id === +id)
    task.commentCount += 1
  },
  commentCountdecrease (state, id) {
    const task = state.tasks.find(t => t.id === +id)
    task.commentCount -= 1
  },
  /** -----台账管理start----- */
  // 设置搜索人员
  setPerson (state, value) {
    state.person = value
  },
  // 设置搜索机构
  setOrganize (state, value) {
    state.organizeId = value
  },
  // 设置查询日期
  setFromToDate (state, value) {
    state.fromToDate = value
  },

  /** -----台账日历start----- */
  setEmptyQueryTime (state) {
    state.queryTime = { startTime: [], endTime: [] }
  },
  setQueryTime (state, value) {
    state.queryTime.startTime.push(..._.difference([value.startTime], state.queryTime.startTime))
    state.queryTime.endTime.push(..._.difference([value.endTime], state.queryTime.endTime))
  },
  // 新建(或编辑)多个任务
  addCalendarTasks (state, obj) {
    if (state.calendarTasks.length <= 0) {
      state.calendarTasks.push({
        queryTimeRange: obj.queryTimeRange,
        tasks: obj.tasks
      })
    } else {
      let curTasks = _.cloneDeep(state.calendarTasks)
      state.calendarTasks = state.calendarTasks.filter(a => !a.queryTimeRange.includes(obj.queryTimeRange))
      let aa = curTasks.filter(a => a.queryTimeRange.includes(obj.queryTimeRange))
      if (aa.length > 0) {
        _.forEach(obj.tasks, p => { aa[0].tasks.push(..._.differenceBy([p], aa[0].tasks, 'id')) })
        state.calendarTasks.push(..._.difference([{
          queryTimeRange: obj.queryTimeRange,
          tasks: aa[0].tasks
        }], state.calendarTasks))
      } else {
        state.calendarTasks.push(..._.difference([{
          queryTimeRange: obj.queryTimeRange,
          tasks: obj.tasks
        }], state.calendarTasks))
      }
    }
  },
  setEmptyCalendarTasks (state) {
    state.calendarTasks = []
  },
  setQuerySumMonthTime (state, value) {
    state.querySumMonthTime.startTime.push(..._.difference([value.startTime], state.querySumMonthTime.startTime))
    state.querySumMonthTime.endTime.push(..._.difference([value.endTime], state.querySumMonthTime.endTime))
  },
  setEmptyQuerySumMonthTime (state) {
    state.querySumMonthTime = { startTime: [], endTime: [] }
  },
  setSumHoursOnePersonByMonth (state, value) {
    state.sumHoursOnePersonByMonth.push(..._.differenceBy(value, state.sumHoursOnePersonByMonth))
  },
  setEmptySumHoursOnePersonByMonth (state) {
    state.sumHoursOnePersonByMonth = []
  },
  setSumHoursByMonth (state, value) {
    state.sumHoursByMonth.push(..._.differenceBy(value, state.sumHoursByMonth))
  },
  setEmptySumHoursByMonth (state, value) {
    state.sumHoursByMonth = []
  },
  initCalendarPage (state) {
    state.calendarPage = {
      offset: 0,
      limit: 20,
      nextPageToken: 0
    }
  },
  setCalendarPage (state, page) {
    Object.assign(state.calendarPage, page)
  },
  // 设置搜索人员
  setCalendarPson (state, value) {
    state.calendarPson = value
  },
  // 设置搜索机构
  setCalendarOrg (state, value) {
    state.calendarOrg = value
  },
  /** -----台账管理end----- */
  /** -----个人台账日历start----- */
  setSelectDate (state, value) {
    state.selectDate.push(value)
  }
  /** -----个人台账日历end----- */
}
