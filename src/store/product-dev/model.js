/**
 @Name：产品管理转换器
 @Author：曾盼盼
 @date：2020/07/20
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  dateFormat = 'YYYY-MM-DD',
  nullDate = '1000-01-01'
const init = {
  id: 0,
  title: '',
  type: '',
  acl: 1, // 0：公开；1：限制；2、保密
  organizeID: 0,
  leaderID: 0,
  membersObject: {},
  members: '',
  status: 'wait',
  beginDate: '',
  endDate: '',
  predictEndDate: '',
  orderNo: 0,
  widgets: {},
  notes: '',
  forManagement: true,
  forDeclaration: false,
  approvalNotes: {
    startNotes: '',
    finishNotes: ''
  },
  whiteList: [0],
  isTemplate: false
}
function fromOne (end) {
  const ApprovalNotes =
    _.has(end, 'ApprovalNotes') && end.ApprovalNotes != null
      ? (_.isObject(end.ApprovalNotes) ? end.ApprovalNotes : JSON.parse(end.ApprovalNotes)) : {}
  const membersAll =
    _.has(end, 'Members')
      ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  const front = {
    id: end.Id,
    title: end.Title,
    organizeID: end.OrganizeID,
    leaderID: end.LeaderID,
    leaderName: end.LeaderName,
    membersObject: _.has(end, 'Members') ? (_.isObject(end.Members) ? end.Members : JSON.parse(end.Members)) : {},
    members: membersAll || [],
    type: end.Type,
    productDevNum: end.ProductDevNum,
    acl: end.Acl,
    status: end.Status,
    beginDate: formatDate(end.BeginDate, dateFormat),
    endDate: formatDate(end.EndDate, dateFormat),
    predictEndDate: formatDate(end.PredictEndDate, dateFormat),
    orderNo: end.OrderNo,
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    notes: end.Notes,
    forManagement: end.ForManagement === 1,
    forDeclaration: end.ForDeclaration === 1,
    approvalNotes: {
      startNotes: ApprovalNotes ? ApprovalNotes.StartNotes || '' : '',
      finishNotes: ApprovalNotes ? ApprovalNotes.FinishNotes || '' : ''
    },
    isTemplate: !!end.IsTemplate,
    whiteList: formatEndArray(end.WhiteList),
    createByID: end.CreateByID,
    ...(commomFields.from(end))
  }
  front.predictEndDate === nullDate && (front.predictEndDate = '')
  front.beginDate === nullDate && (front.beginDate = '')
  front.endDate === nullDate && (front.endDate = '')
  return front
}
function toOne (front) {
  return {
    Id: front.id,
    Title: front.title && front.title.trim(),
    OrganizeID: front.organizeID,
    LeaderID: front.leaderID,
    Members: front.membersObject,
    Type: front.type,
    ProductDevNum: front.productDevNum,
    Acl: front.acl,
    Status: front.status,
    BeginDate: formatDate(front.beginDate, dateFormat) || nullDate,
    EndDate: formatDate(front.endDate, dateFormat) || nullDate,
    PredictEndDate: formatDate(front.predictEndDate, dateFormat) || nullDate,
    OrderNo: front.orderNo,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    Notes: front.notes && front.notes.trim(),
    ForManagement: front.forManagement ? 1 : 0,
    ForDeclaration: front.forDeclaration ? 1 : 0,
    ApprovalNotes: _.has(front, 'approvalNotes')
      ? {
        StartNotes: front.approvalNotes.startNotes,
        FinishNotes: front.approvalNotes.finishNotes
      }
      : undefined,
    IsTemplate: front.isTemplate ? 1 : 0,
    WhiteList: front.whiteList ? front.whiteList.join(',') : '',
    TemplateID: front.templateID,
    ...(commomFields.to(front))
  }
}

export default class ProductDev {
  // eslint-disable-next-line space-before-function-paren
  constructor(ProductDev) {
    init.organizeID = LocalStorage.getItem('myself').organizeId
    init.leaderID = LocalStorage.getItem('myself').id
    init.whiteList = [LocalStorage.getItem('myself').id]
    Object.assign(this, init, ProductDev)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
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
}
function formatEndArray (array) {
  if (array) {
    let newArray = array.split(',').map(e => +e)
    return Array.from(new Set(newArray))
  } else {
    return []
  }
}
