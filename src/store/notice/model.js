import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const init = {
  id: 0,
  objectType: undefined,
  objectID: 0,
  noticeType: '',
  title: '',
  content: '',
  isPublish: 1,
  archived: 0,
  subscribers: [],
  archiveTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  archiveBy: '',
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: '',
  createByID: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: '',
  deleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  deleteBy: '',
  deleted: 0,
  orderNumber: 0,
  filePath: '',
  size: 0.0,
  extension: '',
  commentCount: 0
}
function fromOne (end) {
  return {
    id: end.ID,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    noticeType: end.NoticeType,
    title: end.Title,
    content: end.Content,
    isPublish: end.IsPublish,
    createByID: end.CreateByID,
    subscribers: end.Subscribers,
    orderNumber: end.OrderNumber,
    filePath: end.FilePath,
    size: end.Size,
    extension: end.Extension,
    commentCount: end.CommentCount,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    ID: front.id,
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    NoticeType: front.noticeType,
    Title: front.title,
    Content: front.content,
    IsPublish: front.isPublish,
    CreateByID: front.createByID,
    Subscribers: front.subscribers,
    OrderNumber: front.orderNumber,
    FilePath: front.filePath,
    Size: front.size,
    Extension: front.extension,
    CommentCount: front.commentCount,
    ...(commomFields.to(front))
  }
}
/**
 * 公告对象
 *
 * @export
 * @class Notice
 */
export default class Notice {
  constructor (notice) {
    Object.assign(this, init, notice)
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
