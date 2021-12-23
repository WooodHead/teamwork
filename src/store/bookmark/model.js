/**
 @Name：我的收藏转换器
 @Author：郭小乔
 @date：2020/10/20
 @Copyright：西安精雕软件科技有限公司
 */
const init = {
  id: 0,
  module: {
    id: 0,
    title: '',
    type: ''
  },
  route: {
    name: '',
    params: '',
    path: ''
  },
  objectID: '',
  objectType: '',
  objectTitle: '',
  owner: 0
}
function fromOne (end) {
  const Module = _.has(end, 'Module')
      ? (_.isObject(end.Module) ? end.Module : JSON.parse(end.Module)) : {},
    Route = _.has(end, 'Route')
      ? (_.isObject(end.Route) ? end.Route : JSON.parse(end.Route)) : {},
    Params = _.has(Route, 'Params') && Route.Params !== ''
      ? (_.isObject(Route.Params) ? Route.Params : JSON.parse(Route.Params)) : {}
  return {
    id: end.Id,
    module: {
      id: Module.Id,
      title: Module.Title || '',
      type: Module.Type || ''
    },
    route: {
      name: Route.Name,
      params: Params,
      path: Route.Path
    },
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    objectTitle: end.ObjectTitle,
    owner: end.Owner
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
    Route: _.has(front, 'route')
      ? {
        Name: front.route.name,
        Params: JSON.stringify(front.route.params),
        Path: front.route.path
      }
      : undefined,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    ObjectTitle: front.objectTitle,
    Owner: front.owner
  }
}

export default class Bookmark {
  constructor (Bookmark) {
    Object.assign(this, init, Bookmark)
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
