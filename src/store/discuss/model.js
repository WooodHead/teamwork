/**
 @Name：讨论转换器
 @Author：曾盼盼
 @date：2020/06/05
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
const init = {
  id: 0,
  module: {
    id: 0,
    title: '',
    type: ''
  },
  content: '',
  objectID: 0,
  objectType: '',
  type: '',
  createByID: 0
}
function fromOne (end) {
  const Module = _.has(end, 'Module') && end.Module != null
    ? (_.isObject(end.Module) ? end.Module : JSON.parse(end.Module)) : {}
  return {
    id: end.Id,
    module: {
      id: Module.Id || 0,
      title: Module.Title || '',
      type: Module.Type || ''
    },
    content: end.Content,
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    type: end.Type,
    createByID: end.CreateByID,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    Module: _.has(front, 'module')
      ? {
        Id: front.module.id,
        Title: front.module.title,
        Type: front.module.type
      }
      : undefined,
    Content: front.content,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    ObjectTitle: front.objectTitle,
    Type: front.type,
    CMessage: '',
    ...(commomFields.to(front))
  }
}
export default class Discuss {
  // eslint-disable-next-line space-before-function-paren
  constructor(discuss) {
    Object.assign(this, init, discuss)
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
