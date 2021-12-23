import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

// 初始模型对象
const init = {
  id: 0,
  url: '',
  title: '',
  ext: '',
  size: '',
  objectType: 'document',
  objectId: 0,
  orderNumber: 0,
  usedBy: '',
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: '',
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: '',
  deleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  deleteBy: '',
  isDelete: 0
}

function fromOne (end) {
  return {
    id: end.FileID,
    url: end.PathName,
    title: end.Title,
    ext: end.Extension,
    size: end.Size,
    objectType: end.ObjectType,
    objectId: end.ObjectID,
    orderNumber: end.OrderNumber,
    usedBy: end.UsedBy,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    FileID: front.id,
    PathName: front.url,
    Title: front.title,
    Extension: front.ext,
    Size: front.size,
    ObjectType: front.objectType,
    ObjectID: front.objectId,
    OrderNumber: front.orderNumber,
    UsedBy: front.usedBy,
    ...(commomFields.to(front))
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
