/**
 @Name：消息转换器
 @Author：曾盼盼
 @date：2020/06/12
 @Copyright：西安精雕软件科技有限公司
 */
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
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
  senderID: 0,
  senderName: '',
  senderImg: '',
  sendTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  type: '',
  tag: '',
  title: '',
  receiveBy: [],
  readed: false,
  readBy: [],
  done: false,
  extra: {},
  deleted: false
}
function fromOne (end) {
  try {
    const Module =
      _.has(end, 'Module')
        ? (_.isObject(end.Module) ? end.Module : JSON.parse(end.Module)) : {},
      Route = _.has(end, 'Route')
        ? (_.isObject(end.Route) ? end.Route : JSON.parse(end.Route)) : {},
      ReadBy = _.has(end, 'ReadBy')
        ? (end.ReadBy !== null && _.isObject(end.ReadBy) ? end.ReadBy : JSON.parse(end.ReadBy)) : {},
      Readed = !!(_.has(end, 'ReadBy') && end.ReadBy !== null && end.ReadBy !== 'null' && end.ReadBy.length > 0 &&
        ReadBy.find(a => a === _.toString(LocalStorage.getItem('myself').id))),
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
      senderID: end.SenderID,
      senderName: end.SenderName,
      senderImg: end.SenderImg,
      sendTime: formatDate(end.SendTime, 'YYYY-MM-DD HH:mm'),
      type: end.Type.trim(),
      tag: end.Tag.trim(),
      title: end.Title,
      receiveBy: end.ReceiveBy,
      readed: Readed,
      readBy: end.ReadBy,
      done: end.Done === 1,
      extra: end.Extra,
      deleted: end.IsDelete === 1
    }
  } catch (error) {
    return undefined
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
    SenderID: front.senderID,
    SenderName: front.senderName,
    SenderImg: front.senderImg,
    SendTime: formatDate(front.sendTime, 'YYYY-MM-DD HH:mm:ss'),
    Type: front.type,
    Tag: front.tag,
    Title: front.title,
    ReceiveBy: front.receiveBy,
    ReadBy: front.readBy,
    Done: front.done === true ? 1 : 0,
    Extra: front.extra
  }
}
export default class Message {
  // eslint-disable-next-line space-before-function-paren
  constructor(Message) {
    Object.assign(this, init, Message)
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
