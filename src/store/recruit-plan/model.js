import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY-MM-DD'
const init = {
  id: 0,
  title: '', // 计划名称
  startDate: formatDate(new Date(), format), // 开始时间
  endDate: formatDate((new Date()).setDate((new Date()).getDate() + 10), format), // 结束时间
  notes: '', // 备注
  detail: [], // 计划详情。
  closed: 0, // 是否关闭，0打开，1关闭
  archiveTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  archiveBy: '',
  archived: 0,
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
  // 计划详情对象数组转换
  var listDetail = []
  listDetail = end.Detail && _.map(JSON.parse(end.Detail), lod => {
    return { id: Number(lod.ID), recruitNumbers: Number(lod.RecruitNumbers), title: lod.JobName }
  })
  return {
    id: end.Id,
    title: end.Title,
    startDate: end.StartDate && formatDate(end.StartDate.replace(/-/g, '/').replace(/T/g, ' '), format),
    endDate: end.EndDate && formatDate(end.EndDate.replace(/-/g, '/').replace(/T/g, ' '), format),
    notes: end.Notes,
    detail: listDetail,
    closed: end.Closed,
    createByID: end.CreateByID,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  var detail = []
  detail = front.detail && _.map(front.detail, lod => {
    return { ID: lod.id, RecruitNumbers: lod.recruitNumbers, JobName: lod.title }
  })
  return {
    Id: front.id,
    Title: front.title,
    StartDate: front.startDate && formatDate(front.startDate.replace(/-/g, '/'), 'YYYY-MM-DD'),
    EndDate: front.endDate && formatDate(front.endDate.replace(/-/g, '/'), 'YYYY-MM-DD'),
    Notes: front.notes,
    Detail: JSON.stringify(detail),
    Closed: front.closed,
    CreateByID: front.createByID,
    ...(commomFields.to(front))
  }
}
/**
 * 招聘计划对象
 *
 * @export
 * @class RecruitPlan
 */
export default class RecruitPlan {
  constructor (recruitPlan) {
    Object.assign(this, init, recruitPlan)
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
