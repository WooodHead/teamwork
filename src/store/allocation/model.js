/**
 @Name：订单分配任务转换器
 @Cd
 @date：2021/02/03
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  title: '',
  notes: '',
  orderID: 0,
  leaderID: undefined,
  manufacturerID: undefined,
  ManufacturerName: '',
  workpieceList: [],
  amount: 0,
  expectedDeliveryDate: formatDate(new Date().setMonth(new Date().getMonth() + 1), format),
  status: '待生产',
  acl: 0,
  whiteList: [],
  widgets: {},
  members: []
}
function fromOne (end) {
  return {
    id: end.Id,
    title: end.Title,
    notes: end.Notes,
    orderID: end.OrderID,
    orderNo: end.OrderNo,
    leaderID: end.LeaderID,
    manufacturerID: end.ManufacturerID,
    manufacturerName: end.ManufacturerName,
    workpieceList: end.WorkpieceList ? JSON.parse(end.WorkpieceList) : [],
    amount: end.Amount,
    expectedDeliveryDate: end.ExpectedDeliveryDate && formatDate(end.ExpectedDeliveryDate.replace(/-/g, '/'), format),
    status: end.Status,
    acl: end.Acl,
    whiteList: end.WhiteList ? JSON.parse(end.WhiteList) : [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    members: end.Members ? end.Members.split(',') : [],
    subscribers: end.Subscribers,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Title: front.title,
    Notes: front.notes,
    OrderID: front.orderID,
    OrderNo: front.orderNo,
    LeaderID: front.leaderID,
    ManufacturerID: front.manufacturerID,
    WorkpieceList: front.workpieceList ? JSON.stringify(front.workpieceList) : undefined,
    Amount: front.amount,
    ExpectedDeliveryDate: front.expectedDeliveryDate,
    Status: front.status,
    Acl: front.acl,
    WhiteList: front.whiteList ? JSON.stringify(front.whiteList) : undefined,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    Members: front.members ? _.join(front.members) : '',
    Subscribers: front.subscribers,
    ...(commomFields.to(front))
  }
}
export default class Allocation {
  constructor (Allocation) {
    let myinfo = LocalStorage.getItem('myself')
    init.leaderID = myinfo.id
    Object.assign(this, init, Allocation)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else if (end) {
      return fromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else if (front) {
      return toOne(front)
    }
  }
}
