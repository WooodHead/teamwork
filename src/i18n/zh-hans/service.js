export default {
  module: '工程服务',
  title: '工程服务',
  tab: {
    selfService: '自助服务',
    serviceList: '工程服务',
    serviceContact: '联系我们'
  },

  cardTitle: {
    myList: '我的需求',
    allList: '所有需求',
    archive: '归档区',
    assign: '指派'
  },

  search: '搜索',
  noServices: '没有任何内容可展示',
  more: '展示更多需求',

  status: {
    wait: '待指派',
    start: '待对接',
    doing: '对接中',
    done: '待确认',
    confirmed: '已结束'
  },

  action: {
    chat: '联系我们',
    chart: '服务统计',
    add: '新建需求',
    assignTo: '指派',
    changeConnector: '变更对接人',
    reAssignTo: '重新指派',
    startDoing: '开始对接',
    serviceDone: '完成服务',
    serviceConfirm: '确认结束',
    alarmQuery: '报警查询',
    maintenanceQuery: '维保查询'

  },

  fields: {
    id: '服务编号',
    title: '服务名称',
    notes: '服务说明'
  },

  reason: '申请变更',
  required: '输入不能为空',

  note: {
    repeatAssign: '重新指派的对接人就是当前对接人'
  },

  description: '需求描述',
  changeStatusConfirm: '确定要更改该需求状态吗？',

  messageTitle: {
    add: '提交了工程服务需求，请指派对接人',
    connectChange: '申请变更对接人，请重新指派',
    assignTo: '指派了工程服务需求，请尽快对接',
    // wait: '初始化了需求状态',
    // start: '',
    doing: '已开始对接需求',
    done: '已完成需求对接，请确认服务结束',
    confirmed: '已确认服务结束'
  },

  evaluation: {
    noRating: '请给本次服务进行打分，谢谢',
    submitSuccess: '评价成功',
    submitFaild: '评价失败'
  },

  noConnector: '没找到对接人',
  selectConnector: '请选择对接人',
  assigntoConfirm: '确认指派{name}作为对接人吗',
  assignedNotes: '该需求已被指派',
  addFolder: '新建文件夹',
  noFile: '没有符合条件的文件',
  fileName: '文件名'
}
