/**
 @Name：产品用户管理转换器
 @Author：胡妞妞
 @date：2021/12/08
 @Copyright：西安精雕软件科技有限公司
 */
function fromOne (end) {
  return {
    id: end.Id,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    psonID: end.PsonID,
    psonName: end.PsonName,
    notes: end.Notes ? end.Notes : '',
    extra: end.Extra
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ObjectType: front.objectType,
    ObjectID: front.objectID,    
    PsonID: front.psonID,
    PsonName: front.psonName,
    Notes: front.notes,
    Extra: front.extra
  }
}

export default class ProductUser {
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
