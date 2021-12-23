import { date } from 'quasar'
import commomFields from '@/utils/model-common-fields'
const { formatDate } = date,
  frontFormat = 'YYYY-MM-DD HH:mm'

const init = {
    id: 0,
    title: '',
    receiveBy: [],
    senderID: 0,
    senderName: '',
    senderImg: '',
    objectID: 0,
    objectType: '',
    createBy: '',
    createTime: formatDate(new Date(), frontFormat),
    modifyBy: '',
    modifyTime: formatDate(new Date(), frontFormat),
    isDelete: false,
    deleteBy: '',
    deleteTime: formatDate(new Date(), frontFormat)
  }, initBoostPlate = {
    objectID: 0,
    objectType: '',
    route: {
      name: '',
      params: '',
      path: ''
    },
    senderID: 0,
    senderName: '',
    senderImg: '',
    type: '',
    tag: '',
    title: '',
    subTitle: '',
    receiveBy: [],
    createBy: '',
    createTime: formatDate(new Date(), frontFormat),
    modifyBy: '',
    modifyTime: formatDate(new Date(), frontFormat),
    isDelete: false,
    deleteBy: '',
    deleteTime: formatDate(new Date(), frontFormat)
  }

function fromBoost (end) {
  let model = {
    id: end.Id,
    title: end.Title,
    receiveBy: end.ReceiveBy,
    senderID: end.SenderID,
    senderName: end.SenderName,
    senderImg: end.SenderImg,
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    ...(commomFields.from(end))
  }
  return model
}

function toBoost (front) {
  let Boost = {
    Id: front.id,
    Title: front.title,
    ReceiveBy: [front.receiveBy.toString()],
    SenderID: front.senderID,
    SenderName: front.senderName,
    SenderImg: front.senderImg,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    BoostPlate: BoostPlate.to(front.boostPlate),
    ...(commomFields.to(front))
  }
  return Boost
}

function fromBoostPlate (end) {
  const Route = (_.isObject(end.Route) ? end.Route : JSON.parse(end.Route)),
    Params = (_.isObject(Route.Params) ? Route.Params : JSON.parse(Route.Params))
  return {
    id: end.Id,
    objectID: end.ObjectID,
    objectType: end.ObjectType,
    route: {
      name: Route.Name,
      params: Params,
      path: Route.Path
    },
    senderID: end.SenderID,
    senderName: end.SenderName,
    senderImg: end.SenderImg,
    type: end.Type,
    tag: end.Tag,
    title: end.Title,
    subTitle: end.SubTitle,
    receiveBy: end.ReceiveBy,
    ...(commomFields.from(end))
  }
}

function toBoostPlate (front) {
  return {
    Id: front.id,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    Route: {
      Name: front.route.name,
      Params: JSON.stringify(front.route.params),
      Path: front.route.path
    },
    SenderID: front.senderID,
    SenderName: front.senderName,
    SenderImg: front.senderImg,
    Type: front.type,
    Tag: front.tag,
    Title: front.title,
    SubTitle: front.subTitle,
    ReceiveBy: [front.receiveBy.toString()],
    ...(commomFields.to(front))
  }
}

class Boost {
  // eslint-disable-next-line space-before-function-paren
  constructor(boost) {
    Object.assign(this, init, boost)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromBoost(e))
    } else {
      return fromBoost(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toBoost(f))
    } else {
      return toBoost(front)
    }
  }
}

class BoostPlate {
  constructor (boostPlate) {
    Object.assign(this, initBoostPlate, boostPlate)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromBoostPlate(e))
    } else {
      return fromBoostPlate(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toBoostPlate(f))
    } else {
      return toBoostPlate(front)
    }
  }
}

export default { Boost, BoostPlate }
