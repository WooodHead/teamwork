/**
 * 客户管理
 * @export
 * @class Customer
 */
import { LocalStorage } from 'quasar'
import commomFields from '@/utils/model-common-fields'
const init = {
  id: 0,
  title: '',
  notes: '',
  customerType: 5,
  isOutCustomer: 1,
  selfOrganizeID: 0,
  organizeID: 0,
  leaderID: 0,
  path: '',
  province: '',
  city: '',
  district: '',
  address: '',
  acl: 2,
  grade: '一般',
  creditName: '',
  infoSource: '',
  applyIndustry: '',
  companySize: '',
  licenceNo: '',
  chieftain: '',
  bankRoll: '',
  turnOver: '',
  bank: '',
  bankAccount: '',
  localTaxNo: '',
  nationalTaxNo: '',
  status: 0,
  foundDate: '',
  remark: '',
  extra: {},
  members: [],
  widgets: {},
  lastFollowupTime: '',
  lastFollowupContent: ''
}
function fromOne (end) {
  let membersAll =
  _.has(end, 'Members')
    ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  return {
    id: end.CustomerID,
    title: end.CustomerName,
    customerType: end.CustomerType,
    isOutCustomer: end.Classify === 'customer' ? 1 : 0,
    selfOrganizeID: end.SelfOrganizeID,
    organizeID: end.OrganizeID,
    leaderID: end.LeaderID,
    path: end.Path,
    province: end.Province,
    city: end.City,
    district: end.District,
    address: end.Address,
    acl: end.Acl,
    grade: end.Grade,
    creditName: end.CreditName,
    infoSource: end.InfoSource,
    applyIndustry: end.ApplyIndustry,
    companySize: end.CompanySize,
    licenceNo: end.LicenceNo,
    chieftain: end.Chieftain,
    bankRoll: end.BankRoll,
    turnOver: end.TurnOver,
    bank: end.Bank,
    bankAccount: end.BankAccount,
    localTaxNo: end.LocalTaxNo,
    nationalTaxNo: end.NationalTaxNo,
    status: end.Status,
    foundDate: end.FoundDate === '1000-01-01' ? '' : end.FoundDate,
    notes: end.Remark,
    extra: end.Extra ? JSON.parse(end.Extra) : {},
    lastFollowupTime: end.LastFollowupTime,
    lastFollowupContent: end.LastFollowupContent,
    membersObject: _.has(end, 'Members') ? (_.isObject(end.Members) ? end.Members : JSON.parse(end.Members)) : {},
    members: membersAll || [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    CustomerID: front.id,
    CustomerName: front.title,
    CustomerType: front.customerType,
    Classify: +front.isOutCustomer ? 'customer' : 'internal', // 要么是客户，要么是内部机构
    SelfOrganizeID: front.selfOrganizeID,
    OrganizeID: front.organizeID,
    LeaderID: front.leaderID,
    Province: front.province,
    City: front.city,
    District: front.district,
    Address: front.address,
    Acl: front.acl,
    Path: front.path,
    Grade: front.grade,
    CreditName: front.creditName,
    InfoSource: front.infoSource,
    ApplyIndustry: front.applyIndustry,
    CompanySize: front.companySize,
    LicenceNo: front.licenceNo,
    Chieftain: front.chieftain,
    BankRoll: front.bankRoll,
    TurnOver: front.turnOver,
    Bank: front.bank,
    BankAccount: front.bankAccount,
    LocalTaxNo: front.localTaxNo,
    NationalTaxNo: front.nationalTaxNo,
    Status: front.status,
    FoundDate: front.foundDate || '1000-01-01',
    Remark: front.notes,
    Extra: front.extra && JSON.stringify(front.extra),
    Members: front.membersObject,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    ...(commomFields.to(front))
  }
}
export default class Customer {
  constructor (customer) {
    let myinfo = LocalStorage.getItem('myself')
    init.leaderID = myinfo.id
    init.organizeID = LocalStorage.getItem('myself').organizeId
    Object.assign(this, init, customer)
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
