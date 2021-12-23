/**
 * 生产单位
 * @export
 * @class Manufacturer
 */
import commomFields from '@/utils/model-common-fields'
import Person from '@/store/person/model'
const init = {
  id: 0,
  title: '',
  organizeId: 0,
  organizeName: '',
  organizeType: 0,
  classify: 'internal',
  leader: {},
  leaderId: 0,
  leaderName: '',
  tel: '',
  // email: '',
  classification: 'internal',
  canControl: 0,
  level: '',
  grade: '',
  notes: '',
  province: '',
  city: '',
  district: '',
  address: '',
  cityFullName: '',
  members: [],
  widgets: {}
}
function fromOne (end) {
  return {
    id: end.ID,
    title: end.OrganizeName,
    organizeId: end.OrganizeID,
    organizeName: end.OrganizeName,
    leader: end.Leader && Person.from(end.Leader),
    leaderId: end.LeaderID,
    leaderName: end.LeaderName,
    tel: end.Tel,
    organizeType: end.OrganizeType,
    // email: end.Email,
    classification: end.Classification,
    canControl: end.CanControl,
    grade: end.Level,
    notes: end.Notes,
    address: end.Address,
    cityFullName: (end.Province || '') + ' ' + (end.City || '') + ' ' + (end.District || ''),
    members: end.LeaderID ? [end.LeaderID] : [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    createByID: end.CreateByID,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  const arrRegion = front.cityFullName && front.cityFullName.split(' ')
  let endModel = {
    ID: front.id,
    OrganizeName: front.title,
    OrganizeID: front.organizeId,
    LeaderID: front.leaderId,
    LeaderName: front.leaderName,
    Tel: front.tel,
    OrganizeType: front.organizeType,
    // Email: front.email,
    Classification: front.classification,
    CanControl: front.canControl,
    // Level: front.grade,
    Notes: front.notes,
    Province: arrRegion && arrRegion[0],
    City: arrRegion && arrRegion[1],
    District: arrRegion && arrRegion[2],
    Address: front.address,
    Members: front.leaderId > 0 ? (front.leaderId + '') : '',
    Widgets: front.widgets && JSON.stringify(front.widgets),
    ...(commomFields.to(front))
  }
  // 公共level影响赋值，在此处纠正
  endModel.Level = front.grade
  return endModel
}
export default class Manufacturer {
  constructor (manufacturer) {
    Object.assign(this, init, manufacturer)
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
