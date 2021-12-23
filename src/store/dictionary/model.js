import commomFields from '@/utils/model-common-fields'

const init = {
  id: 0,
  module: '',
  field: '',
  dictKey: '',
  dictValue: '',
  icon: '😊',
  orderNumber: '999999',
  notes: '',
  color: ''
}
function fromOne (end) {
  return {
    id: end.ID,
    module: end.Module,
    field: end.Field,
    dictKey: end.DictKey,
    dictValue: end.DictValue,
    icon: end.Icon,
    orderNumber: +end.OrderNumber,
    notes: end.Notes,
    color: end.Color,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    ID: front.id,
    Module: front.module,
    Field: front.field,
    DictKey: front.dictKey,
    DictValue: front.dictValue,
    Icon: front.icon,
    OrderNumber: front.orderNumber,
    Notes: front.notes,
    Color: front.color,
    ...(commomFields.to(front))
  }
}
/**
 * 字典对象
 *
 * @export
 * @class Dictionary
 */
export default class Dictionary {
  constructor (dictionary) {
    Object.assign(this, init, dictionary)
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
