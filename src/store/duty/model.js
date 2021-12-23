const init = {
  id: 0,
  code: '',
  name: '',
  level: 0,
  des: ''
}
function fromOne (end) {
  return {
    id: end.DutyID,
    code: end.DutyCode,
    name: end.DutyName,
    level: end.DutyLevel,
    des: end.Description
  }
}
function toOne (front) {
  return {
    DutyID: front.id,
    DutyCode: front.code,
    DutyName: front.name,
    DutyLevel: front.level,
    Description: front.des
  }
}
/**
 * 职位对象
 * @export
 * @class Duty
 */
export default class Duty {
  constructor (duty) {
    Object.assign(this, init, duty)
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
