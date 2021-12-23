import commomFields from '@/utils/model-common-fields'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  title: '',
  orderNo: '',
  opportunityID: undefined,
  opportunityName: '',
  customerID: undefined,
  customerName: '',
  customerType: 0,
  customerGrade: '',
  leaderID: undefined,
  leaderName: '',
  organizeID: undefined,
  classification: '生产服务',
  amount: 0,
  status: 100,
  expectedDeliveryDate: formatDate(new Date().setMonth(new Date().getMonth() + 1), format),
  notes: '',
  history: [],
  acl: 2,
  whiteList: [],
  members: [],
  widgets: {}
}
function fromOne (end) {
  let membersAll =
  _.has(end, 'Members')
    ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  return {
    id: end.Id,
    classification: end.Classification,
    orderNo: end.OrderNo,
    status: end.Status,
    statusFlow: end.StatusFlow ? JSON.parse(end.StatusFlow) : [],
    opportunityID: end.OpportunityID,
    opportunityName: end.OpportunityName,
    title: end.OrderNo,
    customerID: end.CustomerID,
    customerName: end.CustomerName,
    customerType: end.CustomerType,
    customerGrade: end.CustomerGrade,
    organizeID: end.OrganizeID,
    leaderID: end.LeaderID,
    amount: end.Amount,
    expectedDeliveryDate: end.ExpectedDeliveryDate && formatDate(end.ExpectedDeliveryDate.replace(/-/g, '/'), format),
    notes: end.Notes,
    membersObject: _.has(end, 'Members') ? (_.isObject(end.Members) ? end.Members : JSON.parse(end.Members)) : {},
    members: membersAll || [],
    acl: end.Acl,
    whiteList: end.WhiteList ? _.map(end.WhiteList.split(','), id => +id) : [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    ...commomFields.from(end)
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Classification: front.classification,
    OrderNo: front.orderNo,
    Status: front.status,
    StatusFlow: front.StatusFlow && JSON.stringify(front.StatusFlow),
    OpportunityID: front.opportunityID,
    CustomerID: front.customerID,
    OrganizeID: front.organizeID,
    LeaderID: front.leaderID,
    Amount: front.amount,
    ExpectedDeliveryDate: front.expectedDeliveryDate ? formatDate(front.expectedDeliveryDate.replace(/-/g, '/'), format) : formatDate(new Date(), format),
    Notes: front.notes && front.notes.trim(),
    Members: front.membersObject,
    Acl: front.acl,
    WhiteList: front.whiteList ? _.join(front.whiteList) : '',
    Widgets: front.widgets && JSON.stringify(front.widgets),
    ...commomFields.to(front)
  }
}

export default class Order {
  constructor (order) {
    let myinfo = LocalStorage.getItem('myself')
    init.leaderID = myinfo.id
    init.leaderName = myinfo.name
    init.organizeID = LocalStorage.getItem('myself').organizeId
    Object.assign(this, init, order)
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
