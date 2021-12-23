import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

const init = {
  id: 0,
  category: '',
  param: {},
  code: '',
  isPublic: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: '',
  publicContent: ''
}
function fromOne (end) {
  return {
    id: end.ID,
    category: end.Category,
    param: JSON.parse(end.Param),
    code: end.Code,
    isPublic: end.IsPublic,
    publicContent: end.PublicContent,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    ID: front.id,
    Category: front.category,
    Param: JSON.stringify(front.param),
    Code: front.code,
    IsPublic: front.isPublic,
    PublicContent: front.publicContent,
    ...(commomFields.to(front))
  }
}
/**
 * 共享链接对象
 *
 * @export
 * @class PublicLink
 */
export default class PublicLink {
  constructor (publicLink) {
    Object.assign(this, init, publicLink)
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
