/**
 @Name：创建项目引导转换器
 @Author：郭小乔
 @date：2020/10/20
 @Copyright：西安精雕软件科技有限公司
 */
const init = {
  id: 0,
  objectID: 0,
  objectType: '',
  owner: 0,
  needed: 1,
  step: 0,
  finished: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    owner: end.Owner,
    needed: end.Needed,
    step: end.Step,
    finished: end.Finished
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    Owner: front.owner,
    Needed: front.needed,
    Step: front.step,
    Finished: front.finished
  }
}

export default class Guide {
  constructor (Guide) {
    Object.assign(this, init, Guide)
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
