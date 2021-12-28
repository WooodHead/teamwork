// import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

// 初始模型对象
const init = {
  id: 0,
  objectType: 'document',
  objectId: 0,
  type: '',
  fileId: 0,
  url: '',
  psonId: 0,
  psonName: '',
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
}

function fromOne (end) {
  return {
    id: end.Id,
    url: end.PathName,
    objectType: end.ObjectType,
    objectId: end.ObjectID,
    type: end.Type,
    psonId: end.PsonID,
    psonName: end.PsonName,
    createTime: date.formatDate(end.CreateTime, 'YYYY-MM-DD HH:mm')
  }
}

function toOne (front) {
  return {
    FileID: front.id,
    PathName: front.url,
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    Type: front.type,
    PsonID: front.psonID,
    PsonName: front.psonName
  }
}

export default class File {
  constructor (file) {
    Object.assign(this, init, file)
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
