/**
 @Name：审批
 @Cd
 @date：2021/02/03
 @Copyright：西安精雕软件科技有限公司
 */
import { date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  spNo: '',
  spName: '',
  spStatus: 0,
  spStatusName: '',
  templateId: '',
  applyTime: '',
  applyer: '',
  spRecord: '',
  notifyer: '',
  comments: '',
  statuChangeEvent: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    spNo: end.SpNo,
    spName: end.SpName,
    spStatus: end.SpStatus,
    spStatusName: end.SpStatus === '1' ? '审批中' : end.SpStatus === '2' ? '已同意' : end.SpStatus === '3' ? '已驳回' : end.SpStatus === '4' ? '已转审' : '',
    templateId: end.TemplateId,
    applyTime: end.ApplyTime && formatDate(new Date(parseInt(end.ApplyTime) * 1000), format),
    applyer: end.Applyer && JSON.parse(end.Applyer),
    spRecord: end.SpRecord && JSON.parse(end.SpRecord),
    notifyer: end.Notifyer && JSON.parse(end.Notifyer),
    comments: end.Comments && JSON.parse(end.Comments),
    statuChangeEvent: end.StatuChangeEvent
  }
}
function toOne (front) {
  return {
    Id: front.id,
    SpNo: front.spNo,
    SpName: front.spName,
    SpStatus: front.spStatus,
    TemplateId: front.templateId,
    ApplyTime: front.applyTime,
    Applyer: front.applyer && JSON.stringify(front.applyer),
    SpRecord: front.spRecord && JSON.stringify(front.spRecord),
    Notifyer: front.notifyer && JSON.stringify(front.notifyer),
    Comments: front.comments && JSON.stringify(front.comments),
    StatuChangeEvent: front.statuChangeEvent
  }
}
export default class Approval {
  constructor (Approval) {
    Object.assign(this, init, Approval)
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
