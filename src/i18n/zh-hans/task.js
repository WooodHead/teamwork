export default {
  module: '待办任务',
  title: '任务',
  notes: '列出需要完成的工作（备忘），分配任务，设置到期日并进行讨论。',
  mystuff: {
    home: '主页',
    title: '我的任务面板',
    myTasks: '指派我的任务',
    myTasksWithDate: '带有日期的任务',
    assignedByme: '我指派的任务',
    notifyTome: '通知我的任务',
    overdueMore: '超期一天以上的任务',
    overdueYesterday: '昨天到期的任务',
    noOverdue: '未超期的任务',
    showCompletedTask: {
      all: '查看我完成的任务...',
      dates: '查看我完成的任务...',
      assigned: '查看我指派的已完成的任务...',
      notify: '查看已完成的通知我的任务...',
      archived: '查看已归档的任务'
    },
    CompletedTask: {
      all: '我完成的任务',
      dates: '我完成的任务',
      assigned: '我指派的已完成的任务',
      notify: '已完成的通知我的任务',
      archived: '已归档的任务'
    },
    overdue: '超期的任务',
    dueToday: '今天到期的任务',
    dueTomorrow: '明天到期的任务',
    dueThisWeek: '本周到期的任务',
    dueLater: '未超期的任务'
  },
  addLabel: '清单',
  fields: {
    name: '任务名称',
    dueDate: '到期日',
    dueTime: '到期时间'
  },
  sortBy: {
    name: '名称',
    date: '日期'
  },
  view: {
    list: '列表视图',
    card: '卡片视图'
  },
  detailView: {
    separate: '分离视图',
    mixture: '混合视图'
  },
  list: {
    title: '清单',
    name: '清单名称',
    description: '添加描述信息...',
    placeholder: '新建一个待办清单'
  },
  group: {
    title: '分组',
    name: '分组名',
    description: '添加描述信息...',
    placeholder: '新建一个分组'
  },
  item: {
    title: '任务',
    tagmark: '【{tag}】',
    name: '任务名称',
    description: '添加更多信息或上传文件...',
    placeholder: '任务名称',
    assignedTo: '指派给',
    notify: '完成时通知',
    isnotify: '通知指派人',
    isSplitSingleTask: '拆分为单人任务',
    tag: '输入标签(自定义标签输入后按Enter确认)',
    dueOn: '指定日期',
    date: {
      none: '无',
      day: '截止日期',
      range: '起止日期',
      start: '起始日期',
      end: '截止日期'
    },
    beginTime: '实际开始时间',
    finishTime: '实际结束时间',
    workHour: '实际工时',
    predictHour: '预计工时',
    predictHourDiff: '预计工时大于结束时间与开始时间之差，请重新填写预计工时'
  },
  todo: '待办',
  completed: '已完成',
  add: '新建任务',
  edit: '编辑任务',
  added: '任务已新建。',
  updated: '任务已更新。',
  deleted: '任务已删除。',
  noToday: '今天没有任务！',
  startTime: '开始时间',
  endTime: '结束时间',
  detail: {
    addedBy: '{createBy} 添加于',
    assignedTo: '指派给：',
    notifyTo: '完成时通知：',
    dueOn: '指定日期：',
    notes: '备注：',
    tag: '选标签：',
    extraNotes: '添加备注信息...',
    assignHint: '输入想指派的人员',
    notifyHint: '输入想通知的人员',
    tagHint: '输入标签(自定义标签输入后按Enter确认)',
    assign: '指派给',
    dueDate: '指定日期',
    reassign: '重新指派',
    renotify: '重新选择',
    redueDate: '重新选择',
    notifyAssignedTo: '通知他们这项任务',
    markdone: '标记完成！',
    selectDate: '选择日期',
    saveChanges: '保存更改',
    discardChanges: '撤销更改',
    saveSuccess: '任务已保存',
    source: '来源：',
    sourceHint: '选择来源',
    businessType: '类型：',
    businessTypeHint: '选择类型',
    predictHour: '预计工时：',
    predictHourHint: '输入预计工时',
    workHour: '实际工时：',
    workHourHint: '输入实际工时'
  },
  saved: '任务已保存。',
  addgroup: '添加分组',
  insert: '插入任务',
  tasklist: '任务清单',
  publicFrom: '来自于：',
  publicTitle: '任务清单',
  publicDateRange: '起止时间',
  publicDateDay: '截止时间',
  moveCopy: {
    choose: '请选择具体的',
    moveTo: '移动到这里',
    copyTo: '复制到这里',
    nowhereMove: '该{type}没有任何待办事项清单可以移动。请先添加一个待办事项清单，或者选择其他{type}。',
    nowhereCopy: '该{type}没有任何待办事项清单可以复制。请先添加一个待办事项清单，或者选择其他{type}。'
  },
  AndMoreCompletedTodo: '还有{number}个已完成的任务...',
  archivedList: '归档的清单',
  archived: '归档的任务',
  dashboard: {
    date: '日期',
    createChart: '新建任务趋势图',
    createNumber: '新建任务数',
    taskNumber: '任务数',
    finishedChart: '完成任务趋势图',
    finishedNumber: '完成任务数',
    personChart: '项目成员任务图',
    memberName: '成员名称',
    totalNumber: '任务总数',
    unfinishedNumber: '未完成任务数',
    delayChart: '成员任务延期图',
    delayNumber: '延期任务数',
    delayDays: '总延期时间(天)',
    workHourChart: '成员工时统计图',
    predictHour: '预计工时',
    actualWorkHour: '实际工时',
    workHours: '工时数'
  },
  TaskTagCount: '标签',
  // jd_resume 的字段及翻译
  model: {
    TaskID: '任务ID',
    TaskName: '名称',
    Progress: '当前进展/规划',
    ObjectId: '资源ID',
    ObjectType: '资源类型', // 资源类型
    Type: '任务类型',
    Color: '',
    Archived: '是否归档', // 是否归档
    Finished: '是否完成', // 是否完成
    FinishedTime: '实际完成时间', // 完成时间
    BeginTime: '实际开始时间', // 实际开始时间
    finishedBy: '完成人', // 完成人
    AssignedTo: '负责人', // 指派人
    StartTime: '预计开始时间', // 开始时间
    EndTime: '预计结束时间', // 结束时间
    Description: '工作说明',
    BusinessType: '工作项目',
    WorkHour: '工作用时',
    OnRoadHour: '路途用时',
    Address: '工作地点',
    Source: '来源',
    PredictHour: '预计工时'
  },
  error: {
    tooMuchData: '导出数据超过10000行，请您缩小查询范围，以减少数据量。'
  },
  onlyExportFinishedTask: '仅导出已完成的任务',
  selectTaskFinishDate: '请选择任务完成起止日期',
  selectTaskFinishBy: '请选择任务完成人'
}
