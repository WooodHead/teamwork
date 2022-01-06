export default {
  comments: [],
  tasksInWidget: {},
  // 废纸篓中的任务
  tasksInTrash: [],
  // 日历中显示的任务
  tasksInCalendar: [],
  tasks: [],
  // {project10:10,project10task20:10,...}
  archivedCount: {},
  addingEvent: false,
  filterType: '',
  // 查询条件
  type: 'list', // 任务类型，item，group，list
  objectID: 1,
  objectType: 'project',
  sort: 'orderNumber',
  order: 'desc',
  search: '',
  searchDate: '',
  // 列表/卡片视图
  view: 'list',
  // 任务详情页分离视图/混合视图
  detailView: 'separate', // or mixture 
  // 拖动组件配置
  dragOptions: {
    direction: 'vertical',
    animation: 300,
    delay: 100,
    scroll: true,
    scrollSensitivity: '500',
    // 输入组件不可拖拽
    filter: 'input, textarea',
    // 不禁止原生事件
    preventOnFilter: false,
    // 样式
    ghostClass: 'ghost',
    chosenClass: 'chosen'
  },
  // 共享链接时使用的指派人员信息数组
  publicPersons: [],
  // 仪表盘数据
  dashboardtProjectSeriousTasks: [],
  loadedDashboardTasks: false,
  // 分页
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 指派给我的带日期的任务
  listAssignedToMe: {
    overdueList: [],
    dueTodayList: [],
    dueTomorrowList: [],
    dueWeekList: [],
    dueLaterList: []
  },
  // 我指派的任务
  listAssignedByMe: {
    overdueYesterdayList: [],
    overdueMoreList: [],
    noOverdueList: []
  },
  ctrlList: [],
  exportExcelFields: ['TaskName', 'Progress', 'StartTime', 'EndTime', 'AssignedTo', 'Finished', 'FinishedBy', 'FinishedTime'],
  exportFinished: false, // 仅导出已完成的任务
  exportArchived: false, // 是否导出已归档的任务，默认不导已归档的。
  /** -----台账管理start----- */

  /** -----台账列表start----- */
  fromToDate: null,
  person: {
    id: null,
    name: '',
    type: 'all'
  },
  organizeId: 0,
  /** -----台账列表end----- */

  /** -----台账日历start----- */
  // 所有查过的时间范围。若查过，则从state中获取数据
  queryTime: {
    startTime: [],
    endTime: []
  },
  calendarTasks: [],
  querySumMonthTime: {
    startTime: [],
    endTime: []
  },
  sumHoursOnePersonByMonth: [],
  sumHoursByMonth: [],
  calendarPson: {
    id: null,
    name: '',
    type: 'all'
  },
  calendarOrg: 0,
  calendarPage: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  /** -----台账日历end----- */
  /** -----个人台账日历start----- */
  selectDate: []
  /** -----个人台账日历end----- */
  /** -----台账管理end----- */
}
