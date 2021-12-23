/**
 * 富文本框模板
 * @export
 * @class EditorTemplate
 */
const init = {
  id: 0,
  title: '',
  description: '',
  type: '',
  content: ''
}
function fromOne (end) {
  return {
    id: end.Id,
    title: end.Title,
    description: end.Description,
    type: end.Type,
    content: end.Content
  }
}

function toOne (front) {
  let model = {
    Id: front.id,
    Title: front.title,
    Description: front.description,
    Type: front.type,
    Content: front.content
  }
  return model
}
export default class EditorTemplate {
  constructor (editorTemplate) {
    Object.assign(this, init, editorTemplate)
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
