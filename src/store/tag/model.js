/**
 * 标签
 * @export
 * @class Tag
 */
const init = {
  id: 0,
  title: '',
  type: ''
}
function fromOne (end) {
  return {
    id: end.Id,
    title: end.Title,
    type: end.Type,
    selected: false
  }
}

function toOne (front) {
  let model = {
    Id: front.id,
    Title: front.title,
    Type: front.type
  }
  return model
}
export default class Tag {
  constructor (tag) {
    Object.assign(this, init, tag)
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
