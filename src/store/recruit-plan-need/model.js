import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const init = {
  id: 0,
  planID: '', // 计划id
  jobID: '', // 岗位id
  jobName: '', // 岗位名称
  organizeID: '', // 需求部门id
  organizeName: '', // 需求部门名称
  city: '', // 招聘地点
  num: '', // 需求人数
  status: 1, // 需求状态
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD'),
  createBy: '',
  createByID: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD'),
  modifyBy: '',
  deleteTime: date.formatDate(new Date(), 'YYYY-MM-DD'),
  deleteBy: '',
  deleted: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    planID: end.PlanID,
    jobID: end.JobID,
    jobName: end.JobName,
    organizeID: end.OrganizeID,
    organizeName: end.OrganizeName,
    city: end.City,
    num: end.Num,
    status: end.Status,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    Id: front.id,
    PlanID: front.planID,
    JobID: front.jobID,
    JobName: front.jobName,
    OrganizeID: front.organizeID,
    OrganizeName: front.organizeName,
    City: front.city,
    Num: front.num,
    Status: front.status,
    ...(commomFields.to(front))
  }
}
/**
 * 招聘计划需求对象
 *
 * @export
 * @class RecruitPlanNeed
 */
export default class RecruitPlanNeed {
  constructor (recruitPlanNeed) {
    Object.assign(this, init, recruitPlanNeed)
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
