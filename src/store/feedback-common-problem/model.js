import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
function fromOne (end) {
  return {
    id: end.DocID,
    title: end.Title,
    parentId: end.ParentID,
    filePath: end.FilePath,
    size: end.Size,
    extension: end.Extension,
    classify: end.Classify,
    isPublish: end.IsPublish,
    content: end.Content,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    authorID: end.AuthorID,
    authorName: end.AuthorName,
    orderNumber: end.OrderNumber,
    downLoads: end.DownLoads,
    tag: end.Tag,
    level: end.Level,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    DocID: front.id,
    Title: front.title,
    ParentID: front.parentId,
    FilePath: front.filePath,
    Size: front.size,
    Extension: front.extension,
    Classify: front.classify,
    IsPublish: front.isPublish,
    Content: front.content,
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    AuthorID: front.authorID,
    AuthorName: front.authorName,
    OrderNumber: front.orderNumber,
    DownLoads: front.downLoads,
    Tag: front.Tag,
    Level: front.level,
    ...(commomFields.to(front))

  }
}
export default class ServiceDocument {
  // eslint-disable-next-line space-before-function-paren
  constructor(category, objectID, classify = 'doc') {
    const my = LocalStorage.getItem('myself') || {}
    const model =
    {
      id: 0,
      title: '',
      content: '',
      classify: classify,
      objectType: category,
      objectID: +objectID,
      subscribers: [],
      archived: 0,
      authorID: my.id,
      authorName: my.name
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
