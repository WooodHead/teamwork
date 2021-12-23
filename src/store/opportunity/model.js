/**
 @Name：商机转换器
 @Author：李建国
 @date：2021/01/01
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  title: '',
  source: 'back',
  classification: '1:生产服务',
  customerID: undefined,
  customerName: '',
  customerType: 0,
  customerGrade: '',
  customerContactID: undefined,
  status: 'waitClaim',
  isLost: 0,
  statusFlow: '[100, 200, 300, 600]',
  processType: '五轴加工',
  transactionPrice: 0,
  expectedDeliveryDate: formatDate(new Date().setMonth(new Date().getMonth() + 1), format), // 默认为下个月
  requirement: '',
  leaderID: undefined,
  leaderName: '',
  organizeID: 0,
  organizeName: '',
  orgShortName: '',
  acl: 2,
  whiteList: [],
  widgets: {},
  notes: ''
}
function fromOne (end) {
  let membersAll =
  _.has(end, 'Members')
    ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  return {
    id: end.Id,
    opportunityNo: end.OpportunityNo,
    title: end.Title,
    requestFrom: end.RequestFrom,
    classification: end.Classification,
    customerID: end.CustomerID,
    customerName: end.CustomerName,
    customerType: end.CustomerType,
    customerGrade: end.CustomerGrade,
    customerContactID: end.CustomerContactID,
    leaderID: end.LeaderID,
    organizeID: end.OrganizeID,
    organizeName: end.OrganizeName,
    orgShortName: end.OrgShortName,
    status: end.Status,
    isLost: end.IsLost,
    statusFlow: end.StatusFlow || '[100, 200, 300, 600]',
    processType: end.ProcessType,
    transactionPrice: end.TransactionPrice,
    expectedDeliveryDate: end.ExpectedDeliveryDate,
    requirement: end.Requirement,
    acl: end.Acl,
    whiteList: end.WhiteList ? _.map(end.WhiteList.split(','), id => +id) : [],
    membersObject: _.has(end, 'Members') ? (_.isObject(end.Members) ? end.Members : JSON.parse(end.Members)) : {},
    members: membersAll || [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    notes: end.Requirement,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    OpportunityNo: front.opportunityNo,
    Title: front.title,
    Source: 'back',
    Classification: front.classification,
    CustomerID: front.customerID,
    CustomerName: front.customerName,
    CustomerType: front.customerType,
    CustomerGrade: front.customerGrade,
    LeaderID: front.leaderID,
    Status: front.status,
    IsLost: front.isLost,
    StatusFlow: front.statusFlow || '[100, 200, 300, 600]',
    ProcessType: front.processType,
    TransactionPrice: front.transactionPrice,
    ExpectedDeliveryDate: front.expectedDeliveryDate,
    Requirement: front.requirement,
    OrganizeID: front.organizeID,
    Members: front.membersObject,
    Acl: front.acl,
    WhiteList: front.whiteList ? _.join(front.whiteList) : '',
    Widgets: front.widgets && JSON.stringify(front.widgets),
    ...(commomFields.to(front))
  }
}
export default class Opportunity {
  constructor (opportunity) {
    init.leaderID = LocalStorage.getItem('myself').id
    init.organizeID = LocalStorage.getItem('myself').organizeId
    Object.assign(this, init, opportunity)
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
