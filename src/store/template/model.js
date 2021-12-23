/**
 @Name：模板转换器
 @Author：陆欢
 @date：2021/06/08
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
function fromOne (end) {
  let from = {
    id: end.ProjectID,
    title: end.Title,
    notes: end.Description,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    createByID: end.CreateByID,
    organizeID: end.OrganizeID,
    categoryModel: end.CategoryModel ? JSON.parse(end.CategoryModel) : {},
    acl: end.Acl,
    whiteList: end.WhiteList,
    ...commomFields.from(end)
  }
  let categoryModel = from.categoryModel
  Object.assign(from, categoryModel)
  return from
}

function toOne (front) {
  _.remove(front.categoryModel.widgets, f => { return f === 'schedule' })
  return {
    Id: front.id,
    Title: front.title && front.title.trim(),
    Description: front.notes && front.notes.trim(),
    ObjectType: front.objectType,
    CreateByID: front.createByID,
    CategoryModel: JSON.stringify(front.categoryModel),
    Acl: front.acl,
    WhiteList: front.whiteList ? front.whiteList.join(',') : '',
    OrganizeID: front.organizeID,
    ...commomFields.to(front)
  }
}

export default class Template {
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    let init = {
      id: 0,
      title: '',
      notes: '',
      acl: 0,
      widgets: '',
      leaderID: LocalStorage.getItem('myself').id,
      organizeID: LocalStorage.getItem('myself').organizeId,
      isTemplate: true
    }
    Object.assign(this, init)
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
