/* eslint-disable space-before-function-paren */
import { date } from 'quasar'
import commomFields from '@/utils/model-common-fields'
const { formatDate } = date,
  frontFormat = 'YYYY-MM-DD HH:mm'

/**
 * 资源类型转换器-start
 */
const categoryInit = {
  id: 0,
  code: '',
  label: '',
  notes: '',
  custom: false,
  icon: '',
  color: '',
  orderNumber: 0,
  widgets: '',
  customParams: '',
  parentID: 0,
  level: 1,
  path: '',
  createBy: '',
  createTime: formatDate(new Date(), frontFormat),
  modifyBy: '',
  modifyTime: formatDate(new Date(), frontFormat),
  isDelete: false,
  deleteBy: '',
  deleteTime: formatDate(new Date(), frontFormat)
}
function categoryFromOne (end) {
  return {
    id: end.Id,
    name: end.Code,
    label: end.Title,
    notes: end.Notes,
    custom: end.Custom === 1,
    icon: end.Icon,
    color: end.Color,
    orderNumber: end.OrderNumber,
    widgets: end.Widgets && !_.isObject(end.Widgets) ? JSON.parse(end.Widgets) : end.Widgets,
    customParams: end.CustomParams,
    parentID: end.ParentID,
    level: end.Level,
    path: end.Path,
    ...(commomFields.from(end))
  }
}
function categoryToOne (front) {
  return {
    Id: front.id,
    Code: front.name,
    Title: front.label,
    Notes: front.notes,
    Custom: front.custom ? 1 : 0,
    Icon: front.icon,
    Color: front.color,
    OrderNumber: front.orderNumber,
    Widgets: front.widgets,
    CustomParams: front.customParams,
    ParentID: front.parentID,
    Level: front.level,
    Path: front.path,
    ...(commomFields.to(front))
  }
}
class Category {
  constructor(category) {
    Object.assign(this, categoryInit, category)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => categoryFromOne(e))
    } else {
      return categoryFromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => categoryToOne(f))
    } else {
      return categoryToOne(front)
    }
  }
}

const resourceInit = {
  id: 0,
  category: '',
  title: '',
  notes: '',
  owner: 0,
  members: [],
  orderNumber: 0,
  widgets: 0,
  archived: false, // 是否归档
  archiveTime: '', // 归档时间
  archiveBy: 0 // 归档人
}
function resourceFromOne (end) {
  return {
    id: end.Id,
    category: end.Category,
    title: end.Title,
    notes: end.Notes,
    owner: end.Owner,
    orderNumber: end.OrderNumber,
    members: end.Members ? end.Members.split(',') : [],
    archived: end.Archived,
    archiveTime: end.ArchiveTime,
    archiveBy: end.ArchiveBy,
    isTemplate: end.IsTemplate === 1
  }
}
function resourceToOne (front) {
  return {
    Id: end.id,
    Category: end.category,
    Title: end.title,
    Notes: end.notes,
    Owner: end.owner,
    OrderNumber: end.orderNumber,
    Members: front.members.join(','),
    Archived: end.archived,
    ArchiveTime: end.archiveTime,
    ArchiveBy: end.archiveBy
  }
}

class Resource {
  constructor(Resource) {
    Object.assign(this, resourceInit, Resource)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => resourceFromOne(e))
    } else {
      return resourceFromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => resourceToOne(f))
    } else {
      return resourceToOne(front)
    }
  }
}

/**
 @Name：资源关联关系转换器
 @Author：曾盼盼
 @date：2020/07/14
 @Copyright：西安精雕软件科技有限公司
 */
const relationInit = {
  id: 0,
  category1: '',
  id1: 0,
  category2: '',
  id2: 0,
  type: '',
  path: '',
  extra: {},
  selectId: 0
}
function relationFromOne (end) {
  return {
    id: end.Id,
    category1: end.Category1,
    id1: end.Id1,
    category2: end.Category2,
    id2: end.Id2,
    type: end.Type,
    path: end.Path,
    extra: JSON.parse(end.Extra || '{}'),
    selectId: end.SelectId,
    ...commomFields.from(end)
  }
}
function relationToOne (front) {
  return {
    Id: front.id,
    Category1: front.category1,
    Id1: front.id1,
    Category2: front.category2,
    Id2: front.id2,
    Type: front.type,
    Path: front.path,
    Extra: JSON.stringify(front.extra)
  }
}

class ResourceRelation {
  constructor(ResourceRelation) {
    Object.assign(this, relationInit, ResourceRelation)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => relationFromOne(e))
    } else {
      return relationFromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => relationToOne(f))
    } else {
      return relationToOne(front)
    }
  }
}

export default { Category, Resource, ResourceRelation }
