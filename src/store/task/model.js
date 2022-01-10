/**
 * 任务
 * @export
 * @class Task
 */
import { date } from 'quasar'
import commomFields from '@/utils/model-common-fields'
const { formatDate } = date,
  dateFormat = 'YYYY-MM-DD',
  nullDate = '1000-01-01',
  nullTime = '1000-01-01 00:00:00'

const init = {
  id: 0,
  name: '',
  objectId: 0,
  objectType: '', // 资源类型
  type: 'item',
  color: '',
  archived: false, // 是否归档
  archiveTime: '', // 归档时间
  archiveBy: 0, // 归档人
  finished: false, // 是否完成
  finishedTime: '', // 完成时间
  beginTime: '', // 实际开始时间
  finishedBy: 0, // 完成人
  activated: false,
  activatedTime: '',
  activatedBy: 0,
  notifyAssignedTo: true, // 是否通知指派人
  assignedByID: 0, // 指派者ID
  assignedTo: [], // 指派人
  assignedTime: '',
  notifyTo: [], // 负责人
  dateType: 'none', // 日期类型：none，day, range
  startTime: formatDate(new Date(), dateFormat), // 开始时间
  endTime: formatDate(new Date().setDate(new Date().getDate() + 1), dateFormat), // 结束时间
  description: '', // 任务描述
  orderNumber: 1, // 任务顺序
  parent: {},
  children: [], // 子节点
  pathIds: [],
  commentCount: 0, // 讨论数量
  tags: [],
  parentId: 0,
  rootId: 0,
  overview: {
    allCount: 0,
    finishedAllCount: 0,
    seriousCount: 0,
    finishedSeriousCount: 0,
    difficultCount: 0,
    finishedDifficultCount: 0
  },
  predictHour: 0,
  workHour: 0,
  onRoadHour: 0,
  address: {
    type: 'none', // 三个值可选，none、cityname、poi
    value: ''
  },
  businessType: '',
  source: '',
  acl: 0,
  whiteList: [],
  organizeID: 0,
  isSplitSingleTask: false // 是否拆分为单人任务
}
function fromOne (end) {
  const Overview =
    _.has(end, 'Overview') && end.Overview && end.Overview !== 'null'
      ? (_.isObject(end.Overview) ? end.Overview : JSON.parse(end.Overview))
      : {
        AllCount: 0,
        FinishedAllCount: 0,
        SeriousCount: 0,
        FinishedSeriousCount: 0,
        DifficultCount: 0,
        FinishedDifficultCount: 0
      },
    Address = _.has(end, 'Address') && end.Address
      ? (_.isObject(end.Address) ? end.Address : JSON.parse(end.Address)) : {}
  const model = {
    id: end.TaskID,
    name: end.TaskName,
    objectId: end.ObjectID,
    objectType: end.ObjectType, // 资源类型
    type: end.Type,
    color: end.Color, // 分组的背景颜色
    finished: end.Finished !== 0, // 是否完成
    finishedTime:
      end.FinishedTime &&
      formatDate(end.FinishedTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'), // 完成时间
    beginTime:
      end.BeginTime &&
      formatDate(end.BeginTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'), // 实际开始时间
    finishedBy: end.FinishedBy, // 完成人
    activated: end.Activated !== 0,
    activatedTime:
      end.ActivatedTime &&
      formatDate(end.ActivatedTime.replace(/-/g, '/'), dateFormat),
    activatedBy: +end.ActivatedBy,
    notifyAssignedTo: end.NotifyAssignedTo !== 0, // 是否通知指派人
    assignedByID: end.AssignedByID,
    assignedTo: formatEndArray(end.AssignedTo), // 指派人
    assignedTime:
      end.AssignedTime &&
      formatDate(end.AssignedTime.replace(/-/g, '/'), dateFormat),
    notifyTo: formatEndArray(end.NotifyTo), // 完成后通知人员
    dateType: end.DateType, // 日期类型：none，day, range
    startTime:
      end.StartTime && formatDate(end.StartTime.replace(/-/g, '/'), dateFormat), // 开始时间
    endTime:
      end.EndTime && formatDate(end.EndTime.replace(/-/g, '/'), dateFormat), // 结束时间
    description: end.Description, // 任务描述
    orderNumber: end.OrderNumber, // 任务顺序
    pathIds: formatEndArray(end.Path),
    createByID: end.CreateByID,
    commentCount: end.CommentCount,
    tags: end.Tags ? JSON.parse(end.Tags) : [],
    parentId: end.ParentID,
    rootId: end.RootID,
    overview: {
      allCount: Overview.AllCount,
      finishedAllCount: Overview.FinishedAllCount,
      seriousCount: Overview.SeriousCount,
      finishedSeriousCount: Overview.FinishedSeriousCount,
      difficultCount: Overview.DifficultCount,
      finishedDifficultCount: Overview.FinishedDifficultCount
    },
    predictHour: end.PredictHour,
    workHour: end.WorkHour,
    onRoadHour: end.OnRoadHour,
    address: Address,
    businessType: end.BusinessType,
    source: end.Source,
    acl: end.Acl,
    whiteList: end.WhiteList ? JSON.parse(end.WhiteList) : [],
    organizeID: end.OrganizeID,
    progress: end.Progress, // 任务进展，导出时用到,
    isSplitSingleTask: false, // 是否拆分为单人任务
    ...commomFields.from(end)
  }

  if (model.type === 'item') {
    // 单个任务默认日期
    model.startTime === nullDate &&
      (model.startTime = formatDate(new Date(), dateFormat))
    model.endTime === nullDate &&
      (model.endTime = formatDate(new Date().setDate(new Date().getDate() + 1), dateFormat))
  } else {
    model.startTime === nullDate && (model.startTime = '')
    model.endTime === nullDate && (model.endTime = '')
  }
  return model
}

function toOne (front) {
  const dateType = front.dateType
  if (front.type === 'item') {
    // 按照日期类型规整起止日期
    if (dateType === 'none') {
      front.startTime = ''
      front.endTime = ''
    } else if (dateType === 'day') {
      front.startTime = ''
      front.endTime = formatDate(front.endTime.replace(/-/g, '/'), dateFormat)
    } else if (dateType === 'range') {
      front.startTime = formatDate(front.startTime.replace(/-/g, '/'), dateFormat)
      front.endTime = formatDate(front.endTime.replace(/-/g, '/'), dateFormat)
    }
  } else {
    // 处理清单和分组的起止日期
    front.startTime = front.startTime && formatDate(front.startTime.replace(/-/g, '/'), dateFormat)
    front.endTime = front.endTime && formatDate(front.endTime.replace(/-/g, '/'), dateFormat)
  }
  // 设置overview
  front.type === 'item' &&
    (front.overview =
      setOverview({ type: front.type, finished: front.finished, tags: front.tags }))
  let model = {
    TaskID: front.id,
    TaskName: front.name,
    ObjectID: front.objectId,
    ObjectType: front.objectType, // 资源类型
    Type: front.type,
    Color: front.color, // 分组的背景颜色
    Finished: front.finished ? 1 : 0, // 是否完成
    FinishedTime: front.finishedTime
      ? front.beginTime !== nullTime
        ? formatDate(front.finishedTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm')
        : formatDate(front.finishedTime.replace(/-/g, '/'), dateFormat)
      : nullTime, // 完成时间
    BeginTime:
      (front.beginTime &&
        formatDate(front.beginTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm')) ||
      nullTime, // 实际开始时间
    FinishedBy: front.finishedBy, // 完成人
    Activated: front.activated ? 1 : 0,
    ActivatedTime: formatDate(front.activatedTime, dateFormat) || nullTime,
    ActivatedBy: front.activatedBy,
    NotifyAssignedTo: front.notifyAssignedTo ? 1 : 0, // 是否通知指派人
    AssignedByID: front.assignedByID,
    AssignedTo: front.assignedTo ? front.assignedTo.join() : [], // 指派人
    AssignedTime:
      (front.assignedTime &&
        formatDate(front.assignedTime.replace(/-/g, '/'), dateFormat)) ||
      nullTime,
    NotifyTo: front.notifyTo ? front.notifyTo.join() : [], // 完成后通知人员
    DateType: front.dateType, // 日期类型：none，day, range
    StartTime: front.startTime || nullTime, // 开始时间
    EndTime: front.endTime || nullTime, // 结束时间
    Description: front.description, // 任务描述
    OrderNumber: front.orderNumber, // 任务顺序
    CommentCount: front.commentCount,
    Tags: front.tags ? JSON.stringify(front.tags) : [],
    ParentID: front.parentID,
    RootID: front.rootId,
    Overview: {
      AllCount: front.overview.allCount,
      FinishedAllCount: front.overview.finishedAllCount,
      SeriousCount: front.overview.seriousCount,
      FinishedSeriousCount: front.overview.finishedSeriousCount,
      DifficultCount: front.overview.difficultCount,
      FinishedDifficultCount: front.overview.finishedDifficultCount
    },
    PredictHour: +front.predictHour,
    WorkHour: +front.workHour,
    OnRoadHour: +front.onRoadHour,
    Address: front.address,
    BusinessType: front.businessType,
    Source: front.source,
    Acl: front.acl,
    WhiteList: front.whiteList ? JSON.stringify(front.whiteList) : '[]',
    OrganizeID: front.organizeID,
    Progress: front.progress, // 任务进展，导出时用到
    ...commomFields.to(front)
  }
  // 覆盖 commonFields 对 Path 的处理
  model.Path = front.pathIds && front.pathIds.join()
  return model
}
function setOverview ({ type, finished, tags }) {
  if (type !== 'item') return
  const count = {
    allCount: 1,
    finishedAllCount: 0,
    seriousCount: 0,
    finishedSeriousCount: 0,
    difficultCount: 0,
    finishedDifficultCount: 0
  }
  const isFinished = finished,
    isDifficult = tags.includes('疑难'),
    isSerious = (tags.includes('严重') || tags.includes('致命'))
  isFinished && (count.finishedAllCount = 1)
  isSerious && (count.seriousCount = 1)
  isFinished && isSerious && (count.finishedSeriousCount = 1)
  isDifficult && (count.difficultCount = 1)
  isFinished && isDifficult && (count.finishedDifficultCount = 1)
  return count
}
export default class Task {
  // eslint-disable-next-line space-before-function-paren
  constructor(task = { type: 'item' }) {
    if (task.type !== 'item') {
      task.startTime = ''
      task.endTime = ''
    }
    Object.assign(this, init, task)
  }
  static from (end) {
    if (_.isArray(end)) {
      console.log(_.map(end, e => fromOne(e)))
      return _.map(end, e => fromOne(e))
    } else {
      _.map(fromOne(end))
      return fromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else {
      return toOne(front)
    }
  }
  static formRequiredFields () {
    return ['parentId', 'name']
  }
}
function formatEndArray (array) {
  if (array) {
    let newArray = array.split(',').map(e => +e)
    return Array.from(new Set(newArray))
  } else {
    return []
  }
}
