import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

const init = {
  id: 0,
  title: '',
  kind: 0,
  hiringNumber: 0,
  workingYears: '',
  educationDegree: '',
  major: '',
  address: '',
  requirements: '',
  detailRequirements: '',
  category: '',
  organizeIDs: [],
  organizeNames: [],
  hiringStatus: 0,
  isPublish: 1,
  archiveTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  archiveBy: '',
  archived: 0,
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
    id: end.ID,
    title: end.Title,
    kind: end.Kind,
    hiringNumber: end.HiringNumber,
    workingYears: end.WorkingYears,
    educationDegree: end.EducationDegree,
    major: end.Major,
    address: end.Address,
    requirements: end.Requirements,
    detailRequirements: end.DetailRequirements,
    category: end.Category,
    organizeIDs: end.OrganizeIDs ? JSON.parse(end.OrganizeIDs) : [],
    organizeNames: end.OrganizeNames ? JSON.parse(end.OrganizeNames) : [],
    hiringStatus: end.HiringStatus,
    isPublish: end.IsPublish,
    createByID: end.CreateByID,
    num: end.Num || 0,
    citys: end.Citys ? _.uniq(end.Citys.split(',')).join(',') : '暂无',
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    ID: front.id,
    Title: front.title,
    Kind: front.kind,
    HiringNumber: front.hiringNumber,
    WorkingYears: front.workingYears,
    EducationDegree: front.educationDegree,
    Major: front.major,
    Address: front.address,
    Requirements: front.requirements,
    DetailRequirements: front.detailRequirements,
    Category: front.category,
    OrganizeIDs: JSON.stringify(front.organizeIDs),
    OrganizeNames: JSON.stringify(front.organizeNames),
    HiringStatus: front.hiringStatus,
    IsPublish: front.isPublish,
    CreateByID: front.createByID,
    ...(commomFields.to(front))
  }
}
/**
 * 职位对象
 *
 * @export
 * @class Notice
 */
export default class Job {
  constructor (job) {
    Object.assign(this, init, job)
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
