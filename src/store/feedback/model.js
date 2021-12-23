import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date,
  feedbackFormat = 'YYYY-MM-DD HH:mm'
function fromOne (end) {
  let content = JSON.parse(end.Content)
  if (content && _.isArray(content)) {
    _.map(content, item => {
      // item.sendTime = date.formatDate(item.sendTime, 'YYYY-MM-DD HH:mm')
      item.sendTime = formatDate(item.sendTime.replace(/-/g, '/'), feedbackFormat)
      if (_.isArray(item.content)) {
        item.text = item.content
      } else {
        item.text = [item.content]
      }
    })
  }
  return {
    id: end.Id,
    provider: end.Provider,
    email: end.Email,
    assigner: end.Assigner,
    assignedTo: end.AssignedTo,
    content: content,
    state: end.State,
    isDelete: end.IsDelete,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Provider: front.provider,
    Email: front.email,
    Assigner: front.assigner,
    AssignedTo: front.assignedTo,
    Content: front.content,
    State: front.state,
    ...(commomFields.to(front))
  }
}
export default class Feedback {
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    const model =
    {
      id: 0,
      provider: 0,
      email: '634095346@qq.com',
      assigner: 308,
      assignedTo: 308,
      content: [],
      state: 0
    }
    Object.assign(this, model)
  }
  static from (end) {
    if (_.isArray(end)) {
      return end.length ? _.map(end, e => fromOne(e)) : end
    } else {
      return end ? fromOne(end) : end
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
