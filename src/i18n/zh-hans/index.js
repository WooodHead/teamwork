import app from './app'
import rule from './rule'
import auth from './auth'
import settings from './settings'
import archive from './archive'
import task from './task'
import document from './document'
import wiki from './wiki'
import notice from './notice'
import subscribe from './subscribe'
import contacts from './contacts'
import discuss from './discuss'
import consult from './consult'
import message from './message'
import checkins from './checkins'
import question from './question'
import answer from './answer'
import widget from './widget'
import project from './project'
import team from './team'
import product from './product'
import organize from './organize'
import publicLink from './publicLink'
import schedule from './schedule'
import event from './event'
import dictionary from './dictionary'
import customer from './customer'
import opportunity from './opportunity'
import assess from './assess'
import order from './order'
import followup from './followup'
import error from './error'
import file from './file'
import boost from './boost'
import draft from './draft'
import bookmark from './bookmark'
import trash from './trash'
import twEdit from './tw-edit'
import productDev from './productDev'
import home from './home'
import activity from './activity'
import person from './person'
import history from './history'
import push from './push'
import member from './member'
import tag from './tag'
import editorTemplate from './editorTemplate'
import wexin from './wexin'
import service from './service'
import jd50Alarm from './jd50Alarm'
import search from './search'
import dashboard from './dashboard'
import workHour from './workHour'
import qrcode from './qrcode'
import job from './job'
import resume from './resume'
import guide from './guide'
import feedback from './feedback'
import workRecord from './workRecord'
import interviewer from './interviewer'
import recruitPlan from './recruitPlan'
import excelImport from './excelImport'
import exportFile from './exportFile'
import manufacturer from './manufacturer'
import recommendCode from './recommend-code'
import allocation from './allocation'
import state from './state'
import approval from './approval'
import chat from './chat'
import recruitment from './recruitment'
import salary from './salary'
import position from './position'
import template from './template'
import productCase from './product-case'
import evaluation from './evaluation'
import room from './room'
import equipment from './equipment'
const index = {
  isoName: 'zh-hans',
  nativeName: '中文(简体)',
  // quasar 组件数据，为了不重复定义，在此列出，这部分使用时按照quasar的方式引入，如
  // vue的template中{{$q.lang.label.clear}},
  // vue的script中this.$q.lang.label.clear
  // js中，import {Quasar} from "quasar", Quasar.lang.label.clear
  label: {
    clear: '清空',
    ok: '确定',
    cancel: '取消',
    close: '关闭',
    set: '设置',
    select: '选择',
    reset: '重置',
    remove: '移除',
    update: '更新',
    create: '创建',
    search: '搜索',
    filter: '过滤',
    refresh: '刷新',
    edit: '编辑',
    bookmark: '收藏',
    deleteBookmark: '取消收藏',
    delete: '删除',
    selectAll: '全选',
    back: '返回',
    template: '模板',
    help: '帮助',
    preview: '预览',
    settings: '设置',
    example: '示例'
  },
  // date: {
  //   days: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  //   daysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  //   months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
  //     '_'
  //   ),
  //   monthsShort: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
  //     '_'
  //   ),
  //   headerTitle: function (date) {
  //     return new Intl.DateTimeFormat('zh-hans', {
  //       weekday: 'short',
  //       month: 'short',
  //       day: 'numeric'
  //     }).format(date)
  //   },
  //   firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
  //   format24h: false
  // },
  table: {
    noData: '没有可用数据',
    noResults: '找不到匹配的数据',
    loading: '正在加载...',
    selectedRecords: function (rows) {
      return '已选择' + rows + '行'
    },
    recordsPerPage: '每页的行数:',
    allRows: '全部',
    pagination: function (start, end, total) {
      return start + '-' + end + ' / ' + total
    },
    columns: '列'
  },
  editorTable: {
    insert: '插入表格',
    remove: '删除表格',
    insertColumnLeft: '左边插入列',
    insertColumnRight: '右边插入列',
    removeColumns: '删除选中列',
    insertRowUp: '上方插入行',
    insertRowDown: '下方插入行',
    removeRows: '删除选中行',
    merge: '合并/拆分 单元格'
  },
  editor: {
    url: 'URL',
    bold: '粗体',
    italic: '斜体',
    strikethrough: '删除线',
    underline: '下划线',
    unorderedList: '无序列表',
    orderedList: '有序列表',
    todoList: '任务列表',
    subscript: '下标',
    superscript: '上标',
    hyperlink: '超链接',
    toggleFullscreen: '全屏切换',
    quote: '引号',
    left: '左对齐',
    center: '居中对齐',
    right: '右对齐',
    justify: '两端对齐',
    print: '打印',
    outdent: '减少缩进',
    indent: '增加缩进',
    removeFormat: '清除样式',
    formatting: '格式化',
    fontSize: '字体大小',
    align: '对齐方式',
    hr: '插入水平线',
    undo: '撤消',
    fontFamily: '字体',
    redo: '恢复',
    heading: '标题',
    heading1: '标题一',
    heading2: '标题二',
    heading3: '标题三',
    heading4: '标题四',
    heading5: '标题五',
    heading6: '标题六',
    paragraph: '正文',
    code: '代码',
    size1: '非常小',
    size2: '比较小',
    size3: '正常',
    size4: '中等偏大',
    size5: '大',
    size6: '非常大',
    size7: '超级大',
    defaultFont: '默认字体',
    viewSource: '查看资料',
    bullet_list: '无序列表',
    ordered_list: '有序列表',
    image: '图片',
    fileNote: '附件',
    blockquote: '插入引用',
    createTable: '创建表格',
    deleteTable: '删除表格',
    addColumnBefore: '插入列（左侧）',
    addColumnAfter: '插入列（右侧）',
    deleteColumn: '删除列',
    addRowBefore: '插入行（上方）',
    addRowAfter: '插入行（下方）',
    deleteRow: '删除行',
    toggleCellMerge: '单元格合并/取消',
    mark: '颜色',
    textColor: '文字颜色',
    highlightColor: '背景颜色',
    addMore: '添加更多',
    codeBlock: '代码块',
    table: '表格',
    thirdPartyService: '第三方服务',
    default: '默认',
    headings: '标题',
    indentDropdown: '缩进',
    lineHeight: '行高',
    list: '列表',
    textFormat: '更多格式',
    linkAddress: '链接地址',
    blockFormula: '块级公式',
    inlineFormula: '行内公式',
    insertTemplate: '插入模板'
  },
  image: {
    preferences: '图片设置',
    size: '尺寸',
    width: '宽度',
    height: '高度',
    src: '图片地址',
    caption: '图片说明',
    link: '链接',
    lockAspectRatio: '锁定长宽比',
    unlockAspectRatio: '解锁长宽比'
  },
  embed: {
    video: '视频',
    map: '地图',
    design: '设计',
    develop: '开发',
    data: '数据',
    others: '其它',
    youtube: 'Youtube',
    vimeo: 'Vimeo',
    netflix: 'Netflix',
    youku: '优酷',
    iqiyi: '爱奇艺',
    bilibili: 'Bilibili',
    qqvideo: '腾讯视频',
    google_map: '谷歌地图',
    amap: '高德地图',
    baidu_map: '百度',
    modao: '墨刀',
    lanhu: '蓝湖',
    figma: 'Figma',
    canva: 'Canva',
    processon: 'ProcessOn',
    codepen: 'CodePen',
    google_forms: 'Google Forms',
    jinshuju: '金数据',
    iframe: 'IFrame',
    linkTips: '链接或代码',
    linkWarning: '无效的链接'
  },
  diagram: {
    name: '文本绘图',
    flow: '流程图',
    sequence: '时序图',
    class: '类图',
    state: '状态图',
    gantt: '甘特图',
    tips: '使用Markdown风格文本生成流程图、顺序图、类图、状态图和甘特图'
  },
  link: {
    back: '返回主菜单',
    edit: '编辑链接',
    off: '取消链接',
    open: '打开链接',
    open_in_new_tab: '在新标签页打开'
  },
  tree: {
    noNodes: '没有可用节点',
    noResults: '找不到匹配的节点'
  },
  stepper: {
    doing: '进行中',
    done: '已完成'
  },

  // 通用的自定义数据，按照vue-i18n方式引入，
  // vue的template中{{$t("title.confirm")}},
  // vue的script中this.$t("title.confirm")
  // js中，import i18n from "../boot/i18n", i18n.t("title.confirm")
  months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_9月_11月_12月'.split(
    '_'
  ),
  date: {
    MMDD: 'MM月DD日',
    YYYYMMDD: 'YYYY年MM月DD日',
    day: '天',
    hour: '小时',
    minite: '分钟',
    totalDays: '{totalDays}天'
  },
  or: '或者',
  title: {
    confirm: '确认',
    error: '错误'
  },
  toolbar: {
    search: '搜索',
    sortBy: '排序',
    noSearchResults: '没有匹配的搜索结果。'
  },
  action: {
    save: '保存',
    saveDraft: '保存草稿',
    submitEdit: '确认编辑',
    uploading: '上传中...',
    submit: '提交',
    continue: '继续',
    cancel: '取消',
    confirm: '确定',
    addition: '添加',
    add: '新建',
    edit: '编辑',
    update: '更新',
    move: '移动',
    copy: '复制',
    archive: '归档',
    moveThem: '移动它们',
    copyThem: '复制它们',
    deleteThem: '删除它们',
    assignedTasks: '将这些任务指派给：',
    assignedThem: '指派给',
    groupThem: '分组',
    bookmark: '收藏',
    deleteBookmark: '取消收藏',
    delete: '删除',
    publicLink: '共享链接',
    apply: '申请',
    secrecy: '保密',
    actionThis: '{action}此{resource}',
    chooseWhereTo: '选择将其{action}到的位置：',
    chooseAssignedPerson: '选择需要指派的人员',
    ChooseResourceItem: '选择具体{resource}',
    toThisNewLocation: '{action}到新位置',
    putInTheTrash: '直接删除',
    reallyDelete: '确定要删除吗？',
    reallyRemove: '确定要移除吗？',
    pleaseGiveDeletionNotes: '请填写删除说明',
    setWidgets: '设置工具包',
    approval: '立项',
    finish: '结项',
    suspended: '挂起',
    activate: '激活',
    rename: '重命名',
    insert: '插入任务',
    addGroup: '新建分组',
    releaseGroup: '释放分组',
    convertToList: '转为清单',
    showcards: '卡片视图',
    showlist: '列表视图',
    showtable: '表格视图',
    upload: '上传',
    reUpload: '重新上传',
    download: '下载',
    preview: '预览',
    selection: '选型',
    history: '历史记录',
    export: '导出{type}',
    exportHour: '工时结算',
    exportProjectHour: '导出工时',
    send: '发送消息',
    serviceChart: '服务统计',
    serviceDone: '完成服务',
    jobStart: '正常招聘',
    jobDone: '招满停招',
    batchImport: '导入Excel',
    recruitPlanStart: '开始',
    recruitPlanDone: '结束',
    recruitListStorageAll: '全部淘汰入库',
    recruitListExport: '导出信息',
    recruitListImportTestResult: '导入测评结果',
    recruitListStartInvite: '发起邀约',
    recruitListSendOffer: '发放offer',
    showAllFiles: '所有文件',
    trash: '废纸篓',
    recallAll: '全部重发',
    recall: '重新发送',
    statistics: '统计',
    rankingList: '排行榜',
    html2Img: '截屏',
    exportReport: '导出报表',
    workRecordList: '台账列表',
    workRecordCalendar: '台账日历',
    personalWorkRecordCalendar: '个人台账日历',
    workRecordDashboard: '台账仪表盘',
    setWorkRecord: '配置仪表盘',
    canNotFindTransactor: '找不到办理人',
    canNotFindItem: '找不到咨询项',
    editType: '编辑{type}',
    seeSomeoneAnswers: '查看某人回答',
    sendToSomeone: '发送给某人',
    publish: '发布',
    dropPublish: '撤销发布',
    changeCover: '上传封面',
    viewGroupMembers: '查看群组成员',
    viewVisitRecord: '访问记录',
    viewDownloadRecord: '下载记录'
  },
  base: {
    selectPerson: '选择人员',
    personnelMatchingPattern: '搜索模式：zs，张三，三',
    noResults: '找不到匹配的数据',
    selectPersonByGroup: '从我的通讯录群组中选择',
    noGroup: '您还没有群组，现在就新建一个吧。',
    showAllMembers: '显示所有组员',
    selectOrganize: '选择机构',
    addOrRemoveTeamer: '添加/移除',
    editedBy: '{time} 由{person}{action}',
    selectTags: '从标签弹框中选择',
    selectYourTag: '请选择你的标签: ',
    selectEditorTemplate: '请选择模板',
    selectGroup: '我的群组',
    resourceOrganize: '所属机构',
    resourceCerifyOrganize: '请选择所属机构'
  },
  fields: {
    name: '名称',
    you: '你'
  },
  formValidate: {
    notNull: '不能为空'
  }
}
// 合并单独维护的模块数据，按照vue-i18n方式引入，
// vue的template中{{$t("task.added")}},
// vue的script中this.$t("task.added")
// js中，import i18n from "../boot/i18n", i18n.t("task.added")
Object.assign(index, {
  app,
  rule,
  auth,
  settings,
  archive,
  task,
  document,
  wiki,
  notice,
  subscribe,
  contacts,
  discuss,
  consult,
  message,
  checkins,
  question,
  answer,
  widget,
  project,
  team,
  product,
  organize,
  publicLink,
  schedule,
  event,
  dictionary,
  customer,
  opportunity,
  assess,
  order,
  followup,
  error,
  file,
  boost,
  draft,
  bookmark,
  trash,
  twEdit,
  productDev,
  home,
  activity,
  person,
  history,
  push,
  member,
  tag,
  editorTemplate,
  wexin,
  service,
  jd50Alarm,
  search,
  dashboard,
  workHour,
  qrcode,
  job,
  resume,
  guide,
  feedback,
  workRecord,
  interviewer,
  recruitPlan,
  excelImport,
  exportFile,
  manufacturer,
  recommendCode,
  allocation,
  state,
  approval,
  chat,
  recruitment,
  salary,
  position,
  template,
  productCase,
  evaluation,
  room,
  equipment
})
export default index
