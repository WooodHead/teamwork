import { LocalStorage, date } from 'quasar'
import commomFields from '@/utils/model-common-fields'
const { formatDate } = date,
  endFormat = 'YYYY-MM-DD HH:mm:ss',
  frontFormat = 'YYYY-MM-DD HH:mm'

const init = {
  resourceCategory: 'person',
  resourceId: 0,
  id: 0,
  title: '',
  allDay: false,
  startTime: formatDate(new Date(), frontFormat),
  startDay: 0,
  endTime: formatDate(new Date(), frontFormat),
  endDay: 0,
  withs: [],
  editor: 0,
  notes: '',
  subscribers: [],
  repeat: {
    id: 0,
    type: 'dontRepeat',
    until: formatDate(new Date(), frontFormat),
    index: 0
  },
  modifyTime: formatDate(new Date(), frontFormat),
  modifyBy: '',
  archived: false,
  archiveTime: formatDate(new Date(), frontFormat),
  archiveBy: ''
}
function fromOne (end) {
  const Repeatable = _.has(end, 'Repeatable')
    ? (_.isObject(end.Repeatable) ? end.Repeatable : JSON.parse(end.Repeatable)) : {}
  return {
    resourceCategory: end.ObjectType,
    resourceId: end.ObjectID,
    id: end.Id,
    title: end.Title,
    allDay: !!end.AllDay,
    startTime: formatDate(end.StartTime.replace(/-/g, '/'), frontFormat),
    startDay: end.StartDay,
    endTime: formatDate(end.EndTime.replace(/-/g, '/'), frontFormat) || '',
    endDay: end.EndDay,
    withs: _.has(end, 'Withs') ? _.map(end.Withs.split(','), w => +w) : [],
    editor: end.Editor,
    notes: end.Notes,
    subscribers: end.Subscribers,
    repeat: {
      id: Repeatable.Id,
      type: Repeatable.Type,
      until: Repeatable.Until ? formatDate(Repeatable.Until.replace(/-/g, '/'), 'YYYY-MM-DD') : '', // until为undefined会导致页面组件初始化不上，所以改为''
      index: Repeatable.Index
    },
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ObjectType: front.resourceCategory,
    ObjectID: front.resourceId,
    Title: front.title,
    Notes: front.notes,
    Subscribers: front.subscribers,
    AllDay: front.allDay ? 1 : 0,
    StartTime: formatDate(front.startTime.replace(/-/g, '/'), endFormat),
    EndTime: formatDate(front.endTime.replace(/-/g, '/'), endFormat),
    Repeatable: _.has(front, 'repeat')
      ? {
        Id: front.repeat.id,
        Type: front.repeat.type,
        Until: front.repeat.until && formatDate(front.repeat.until.replace(/-/g, '/'), endFormat),
        Index: front.repeat.index
      }
      : undefined,
    Withs: (_.has(front, 'withs') && front.withs) ? front.withs.join(',') : '',
    Editor: front.editor,
    ObjectTitle: front.objectTitle,
    ...(commomFields.to(front))
  }
}
export default class Event {
  // eslint-disable-next-line space-before-function-paren
  constructor(event) {
    const my = LocalStorage.getItem('myself') || {}
    init.resourceId = my.id
    init.withs = [my.id]
    init.editor = my.id
    init.repeat = {
      id: 0,
      type: 'dontRepeat',
      until: '',
      index: 0
    }
    Object.assign(this, init, event)
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
  static repeatTo (repeat) {
    return {
      Id: repeat.id,
      Type: repeat.type,
      Until: formatDate(repeat.until, endFormat),
      Index: repeat.index
    }
  }
}
