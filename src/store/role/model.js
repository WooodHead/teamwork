
const init = {
  id: 0,
  code: '',
  name: '',
  notes: ''
}
function fromOne (end) {
  return {
    id: end.RoleID,
    code: end.RoleCode,
    name: end.RoleName,
    notes: end.Description
  }
}
function toOne (front) {
  return {
    RoleID: front.id,
    RoleCode: front.code,
    RoleName: front.name,
    Description: front.notes
  }
}
/**
 * 角色对象
 *
 * @export
 * @class Role
 */
export default class Role {
  constructor (role) {
    Object.assign(this, init, role)
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
