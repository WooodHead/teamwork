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
  thirdNo: '',
  openSpName: '',
  openTemplateId: '',
  openSpStatus: '',
  applyTime: '',
  applyUserName: '',
  applyUserId: '',
  applyUserParty: '',
  applyUserImage: '',
  approvalNodes: '',
  notifyNodes: '',
  approverStep: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    thirdNo: end.ThirdNo,
    openSpName: end.OpenSpName,
    openTemplateId: end.OpenTemplateId,
    openSpStatus: end.OpenSpStatus,
    applyTime: end.ApplyTime && formatDate(new Date(parseInt(end.ApplyTime) * 1000), format),
    applyUserName: end.ApplyUserName,
    applyUserId: end.ApplyUserId,
    applyUserParty: end.ApplyUserParty,
    applyUserImage: end.ApplyUserImage,
    approvalNodes: end.ApprovalNodes && JSON.parse(end.ApprovalNodes),
    notifyNodes: end.NotifyNodes && JSON.parse(end.NotifyNodes),
    approverStep: end.ApproverStep
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ThirdNo: front.thirdNo,
    OpenSpName: front.openSpName,
    OpenTemplateId: front.openTemplateId,
    OpenSpStatus: front.openSpStatus,
    ApplyTime: front.applyTime,
    ApplyUserName: front.applyUserName,
    ApplyUserId: front.applyUserId,
    ApplyUserParty: front.applyUserParty,
    ApplyUserImage: front.applyUserImage,
    ApprovalNodes: front.approvalNodes && JSON.stringify(front.approvalNodes),
    notifyNodes: front.notifyNodes && JSON.stringify(front.notifyNodes),
    ApproverStep: front.approverStep
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
