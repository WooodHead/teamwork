import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

const init = {
  id: 0,
  objectType: '',
  objectID: 0,
  subscribers: [],
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: ''
}
function fromOne (end) {
  return {
    id: end.ID,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    subscribers: end.Subscribers,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    ID: front.id,
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    Subscribers: front.subscribers,
    ...(commomFields.to(front))
  }
}
/**
 * 订阅对象
 *
 * @export
 * @class Notice
 */
export default class Subscriber {
  constructor (subscriber) {
    Object.assign(this, init, subscriber)
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
