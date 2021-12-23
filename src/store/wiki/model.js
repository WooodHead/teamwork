/**
 @Name：知识空间转换器
 @Author：曾盼盼
 @date：2021/12/07
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
const init = {
  id: 0,
  title: '',
  leaderID: LocalStorage.getItem('myself') ? LocalStorage.getItem('myself').id : 0,
  members: '',
  membersObject: {},
  acl: 2, // 默认为2：保密
  widgets: {},
  notes: '',
  snapshotPath: ''
}
function fromOne (end) {
  const membersAll =
    _.has(end, 'Members')
      ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  return {
    id: end.Id,
    title: end.Title,
    leaderID: end.LeaderID,
    membersObject: _.has(end, 'Members')
      ? _.isObject(end.Members)
        ? end.Members
        : JSON.parse(end.Members)
      : {},
    members: membersAll || [],
    acl: end.Acl,
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    notes: end.Notes,
    snapshotPath: end.CoverPicture,
    createByID: end.CreateByID,
    ...commomFields.from(end)
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Title: front.title && front.title.trim(),
    LeaderID: front.leaderID,
    Members: front.membersObject,
    Acl: front.acl,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    Notes: front.notes && front.notes.trim(),
    CoverPicture: front.snapshotPath,
    ...commomFields.to(front)
  }
}

export default class Wiki {
  // eslint-disable-next-line space-before-function-paren
  constructor(Wiki) {
    init.leaderID = LocalStorage.getItem('myself').id
    Object.assign(this, init, Wiki)
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
