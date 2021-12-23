/**
 @Name：团队转换器
 @Author：曾盼盼
 @date：2020/07/07
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
const init = {
  id: 0,
  title: '',
  code: '',
  organizeID: 0,
  leaderID: 0,
  members: '',
  membersObject: {},
  type: '',
  acl: 1, // 0：公开；1：限制；2、保密
  widgets: {},
  notes: '',
  whiteList: [0],
  isTemplate: false
}
function fromOne (end) {
  const membersAll =
    _.has(end, 'Members')
      ? (_.isObject(end.Members) ? (end.Members && end.Members.all) || [] : (JSON.parse(end.Members) && JSON.parse(end.Members).all) || []) : []
  return {
    id: end.Id,
    title: end.Title,
    code: end.Code,
    organizeID: end.OrganizeID,
    leaderID: end.LeaderID,
    membersObject: _.has(end, 'Members') ? (_.isObject(end.Members) ? end.Members : JSON.parse(end.Members)) : {},
    members: membersAll || [],
    type: end.Type,
    acl: end.Acl,
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    notes: end.Notes,
    isTemplate: !!end.IsTemplate,
    whiteList: formatEndArray(end.WhiteList),
    createByID: end.CreateByID,
    ...commomFields.from(end)
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Title: front.title && front.title.trim(),
    Code: front.code,
    OrganizeID: front.organizeID,
    LeaderID: front.leaderID,
    Members: front.membersObject,
    Type: front.type,
    Acl: front.acl,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    Notes: front.notes && front.notes.trim(),
    IsTemplate: front.isTemplate ? 1 : 0,
    WhiteList: front.whiteList ? front.whiteList.join(',') : '',
    TemplateID: front.templateID,
    ...commomFields.to(front)
  }
}

export default class Team {
  // eslint-disable-next-line space-before-function-paren
  constructor(Team) {
    init.organizeID = LocalStorage.getItem('myself').organizeId
    init.leaderID = LocalStorage.getItem('myself').id
    init.whiteList = [LocalStorage.getItem('myself').id]
    Object.assign(this, init, Team)
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
function formatEndArray (array) {
  if (array) {
    let newArray = array.split(',').map(e => +e)
    return Array.from(new Set(newArray))
  } else {
    return []
  }
}
