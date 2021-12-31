import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
const init = {
  id: 0,
  type: '',
  parentId: 0,
  path: '',
  childPath: '',
  level: 0,
  title: '',
  notes: '',
  name: '',
  leaderID: 0,
  shortName: '',
  organizeCode: '',
  organizeAddress: { type: 'none', value: '' },
  acl: 1, // 0：公开；1：限制；2、保密
  classify: 'internal',
  widgets: {},
  members: []
}
function fromOne (end) {
  return {
    id: end.OrganizeID,
    type: end.OrganizeType,
    parentId: end.ParentId,
    path: end.Path,
    childPath: end.ChildPath,
    level: end.Level,
    title: end.OrganizeName,
    notes: end.Description,
    name: end.OrganizeName,
    leaderID: end.LeaderID,
    shortName: end.OrgShortName,
    organizeCode: end.OrganizeCode,
    organizeAddress: end.OrganizeAddress,
    acl: end.Acl,
    classify: end.Classify,
    members: end.Members ? end.Members.split(',') : [],
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    OrganizeID: front.id,
    OrganizeType: front.type,
    ParentId: front.parentId,
    Path: front.path,
    ChildPath: front.childPath,
    Level: front.level,
    OrganizeName: front.name,
    LeaderID: front.leaderID,
    OrgShortName: front.shortName,
    OrganizeCode: front.organizeCode,
    OrganizeAddress: front.organizeAddress,
    Acl: front.acl,
    Classify: front.classify,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    ...(commomFields.to(front))
  }
}
/**
 * 机构对象
 *
 * @export
 * @class Organize
 */
export default class Organize {
  constructor (organize) {
    let myinfo = LocalStorage.getItem('myself')
    init.leaderID = myinfo.id
    init.parentId = LocalStorage.getItem('myself').organizeId
    Object.assign(this, init, organize)
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
