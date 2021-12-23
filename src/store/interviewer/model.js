import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const init = {
  id: 0,
  psonID: '', // 面试官id
  psonName: '', // 面试官姓名
  jobID: '', // 岗位ID
  jobName: '', // 岗位名称
  organizeID: '', // 部门ID
  organizeName: '', // 部门名称
  city: '', // 面试地点
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: '',
  createByID: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: '',
  deleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  deleteBy: '',
  deleted: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    psonID: end.PsonID,
    psonName: end.PsonName,
    jobID: end.JobID,
    jobName: end.JobName,
    organizeID: end.OrganizeID,
    organizeName: end.OrganizeName,
    city: end.City,
    createByID: end.CreateByID,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    Id: front.id,
    PsonID: front.psonID,
    PsonName: front.psonName,
    JobID: front.jobID,
    JobName: front.jobName,
    OrganizeID: front.organizeID,
    OrganizeName: front.organizeName,
    City: front.city,
    CreateByID: front.createByID,
    ...(commomFields.to(front))
  }
}
/**
 * 面试官对象
 *
 * @export
 * @class Notice
 */
export default class Interviewer {
  constructor (interviewer) {
    Object.assign(this, init, interviewer)
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
