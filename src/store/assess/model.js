/**
 @Name：商机评估转换器
 @Author：李建国
 @date：2021/01/01
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  opportunityID: 0,
  opportunityNo: '',
  manufacturerID: undefined,
  manufacturerLeaderID: 0,
  endDate: formatDate(new Date(), format),
  assessRequire: '',
  status: 'waitAssess',
  result: 0,
  cost: 0,
  subscribers: [],
  expectedDeliveryDate: formatDate(new Date(), format),
  customerManagerName: '',
  manufacturerName: '',
  assessCounts: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    title: end.Title,
    opportunityID: end.OpportunityID,
    opportunityNo: end.OpportunityNo,
    manufacturerID: end.ManufacturerID,
    manufacturerLeaderID: end.ManufacturerLeaderID,
    endDate: end.EndDate,
    assessRequire: end.AssessRequire,
    result: end.Result,
    notes: end.Notes,
    cost: end.Cost,
    subscribers: end.Subscribers,
    expectedDeliveryDate: end.ExpectedDeliveryDate,
    customerManagerName: end.CustomerManagerName,
    manufacturerName: end.ManufacturerName,
    assessCounts: end.AssessCounts,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    OpportunityID: front.opportunityID,
    OpportunityNo: front.opportunityNo,
    ManufacturerID: front.manufacturerID,
    ManufacturerLeaderID: front.manufacturerLeaderID,
    EndDate: front.endDate,
    AssessRequire: front.assessRequire,
    Result: front.result,
    Notes: front.notes,
    Cost: front.cost,
    Subscribers: front.subscribers,
    ExpectedDeliveryDate: front.expectedDeliveryDate,
    CustomerManagerName: front.customerManagerName,
    ManufacturerName: front.manufacturerName,
    ...(commomFields.to(front))
  }
}
export default class OpportunityAssess {
  constructor (OpportunityAssess) {
    Object.assign(this, init, OpportunityAssess)
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
