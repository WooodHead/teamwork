/**
 @Name：文档转换器
 @Author：陆欢
 @date：2020/06/24
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'

// const { formatDate } = date
function fromOne (end) {
  return {
    id: end.DocID,
    title: end.Title,
    parentId: end.ParentID,
    filePath: end.FilePath,
    snapshotPath: end.SnapshotPath,
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
    acl: end.Acl,
    color: end.Color,
    whiteList: end.WhiteList ? _.map(end.WhiteList.split(','), id => +id) : [],
    subscribers: end.Subscribers,
    children: end.Children ? Document.from(end.Children) : [],
    // 仅自己可编辑
    onlyICanEdit: end.OnlyICanEdit,
    onlyICanDownload: end.OnlyICanDownload,
    tags: end.Tags ? JSON.parse(end.Tags) : [],
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    DocID: front.id,
    Title: front.title,
    ParentID: front.parentId,
    FilePath: front.filePath,
    SnapshotPath: front.snapshotPath,
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
    Tag: front.tag,
    Acl: front.acl,
    WhiteList: front.whiteList ? front.whiteList.join(',') : '',
    Subscribers: front.subscribers,
    // 仅自己可编辑
    OnlyICanEdit: front.onlyICanEdit,
    OnlyICanDownload: front.onlyICanDownload ? 1 : 0,
    Tags: front.tags ? JSON.stringify(front.tags) : [],
    ...(commomFields.to(front))
  }
}
export default class Document {
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
      authorName: my.name,
      acl: 0,
      whiteList: '',
      // 仅自己可编辑
      onlyICanEdit: 0,
      onlyICanDownload: 0,
      tags: []
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
