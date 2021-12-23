const init = {
  id: 0,
  psonId: 0,
  name: '',
  members: [],
  notes: ''
}
function fromOne (end) {
  return {
    id: end.Id,
    psonId: end.Owner,
    name: end.Title,
    members: end.Members ? end.Members.split(',') : [],
    notes: end.Notes
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Owner: front.psonId,
    Title: front.name,
    Members: front.members.join(','),
    Notes: front.notes
  }
}
/**
 * 群组对象
 *
 * @export
 * @class Group
 */
export default class Group {
  // eslint-disable-next-line space-before-function-paren
  constructor(group) {
    Object.assign(this, init, group)
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

  static FieldsConvert () {
    return {
      Id: 'id',
      Owner: 'psonId',
      Title: 'name',
      Members: 'members',
      Notes: 'notes'
    }
  }
}
