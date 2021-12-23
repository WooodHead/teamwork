import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  endFormat = 'YYYY-MM-DD HH:mm:ss',
  frontFormat = 'YYYY-MM-DD HH:mm:ss',
  groupFormat = 'MM月DD日,dddd'
  // oldGroupFormat = 'YYYY MM月DD日,dddd'
const init = {
  id: 0,
  type: 'person',
  sent: true,
  fromId: 0,
  fromName: '',
  fromAvatar: '',
  toId: 0,
  text: [],
  group: formatDate(new Date(), groupFormat),
  stamp: formatDate(new Date(), frontFormat),
  textColor: 'black',
  bgColor: 'green-2'
}
function fromOne (end) {
  var isCurrentUser = end.MsgFromID === LocalStorage.getItem('myself').id
  var text = JSON.parse(end.MsgText)
  var ms = []
  if (_.isArray(text)) {
    _.forEach(text, t => {
      ms.push({
        title: t.Title,
        path: t.Path,
        extension: t.Extension,
        size: t.Size + ''
      })
    })
  } else {
    ms = [text]
  }

  return {
    id: end.MsgID,
    type: end.RoomType === 'friend' ? 'person' : end.RoomType,
    sent: isCurrentUser,
    fromId: end.MsgFromID,
    fromName: end.FromName,
    fromAvatar: end.FromAvatar,
    toId: end.MsgToID,
    text: ms,
    group: end.MsgSendTime && formatDate(end.MsgSendTime.replace(/-/g, '/'), groupFormat),
    stamp: end.MsgSendTime && formatDate(end.MsgSendTime.replace(/-/g, '/'), frontFormat),
    textColor: 'black',
    bgColor: _.isObject(ms[0]) ? 'white' : (isCurrentUser ? 'cyan-1' : 'grey-1')
  }
}
function toOne (from) {
  // 当前登录用户
  const my = LocalStorage.getItem('myself')
  var ms = []
  if (_.isArray(from.text)) {
    _.forEach(from.text, async t => {
      ms.push({
        Title: t.title,
        Path: t.path,
        Extension: t.extension,
        Size: t.size + ''
      })
    })
  } else {
    ms = from.text
  }
  return {
    RoomID: from.toId,
    RoomType: from.type === 'person' ? 'friend' : from.type,
    MsgID: new Date().getTime(),
    MsgToID: from.toId,
    MsgFromID: my.id,
    FromName: my.name,
    FromAvatar: my.img,
    MsgText: JSON.stringify(ms),
    MsgSendTime: formatDate(new Date(), endFormat)
  }
}
/**
 * chat对象
 *
 * @export
 * @class Chat
 */
export default class Chat {
  constructor (chat) {
    Object.assign(this, init, chat)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else if (end) {
      return fromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else if (front) {
      return toOne(front)
    }
  }
}
