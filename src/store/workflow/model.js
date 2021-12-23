import { date } from 'quasar'
const { formatDate } = date
/**
 * 审批事件需要传递的数据
 */
const wFApprovalInfoInit = {
  objectType: '',
  objectID: 0,
  event_guid: '',
  wf_guid: '',
  approverID: 0,
  comment: '',
  result: '',
  type: ''// 立项审批或结项审批
}

function wFApprovalInfoToOne (front) {
  return {
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    Event_Guid: front.event_guid,
    WF_Guid: front.wf_guid,
    ApproverID: front.approverID,
    Comment: front.comment,
    Result: front.result,
    Type: front.type
  }
}

class WFApprovalInfo {
  constructor (WFApprovalInfo) {
    Object.assign(this, wFApprovalInfoInit, WFApprovalInfo)
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => wFApprovalInfoToOne(f))
    } else {
      return wFApprovalInfoToOne(front)
    }
  }
}
/**
 * 工作流与单据关联关系
 */
const workflowInit = {
  id: 0,
  objectType: '',
  objectID: 0,
  wf_guid: '',
  type: '',
  result: '',
  createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
}

function workflowFromOne (end) {
  return {
    id: end.Id,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    wf_guid: end.WF_GUID,
    result: end.Result,
    type: end.Type,
    createTime: formatDate(end.CreateTime, 'YYYY-MM-DD HH:mm')
  }
}

class WorkFlow {
  constructor (workflow) {
    Object.assign(this, workflowInit, workflow)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => workflowFromOne(e))
    } else {
      return workflowFromOne(end)
    }
  }
}

export default { WFApprovalInfo, WorkFlow }
