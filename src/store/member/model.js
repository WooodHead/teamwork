/**
 @Name：成员转换器
 @Author：陆欢
 @date：2020/07/30
 @Copyright：西安精雕软件科技有限公司
 */
function fromOne (end) {
  return {
    id: end.Id,
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    psonID: end.PsonID,
    duty: end.Duty,
    notes: end.Notes ? end.Notes : '',
    extra: end.Extra
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    PsonID: front.psonID,
    Duty: front.duty,
    Notes: front.notes,
    Extra: front.extra
  }
}
export default class Member {
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
