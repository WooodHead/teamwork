import Task from '../../store/task/model'
/**
 * 动态
 * @export
 * @class activity
 */
const init = {
  id: 0,
  objectId: 0,
  objectType: '', // 资源类型
  objectTitle: '',
  actor: '',
  actorId: 0,
  actTime: '', //
  action: '', //
  widget: {
    id: 0,
    type: '',
    title: '',
    on: {
      id: 0,
      type: '',
      title: ''
    },
    from: '',
    detail: ''
  },
  description: '' //
}

function fromOne (end) {
  const Widget = _.has(end, 'Widget')
    ? (_.isObject(end.Widget) ? end.Widget : JSON.parse(end.Widget)) : {}
  if (Widget.Type === 'task') {
    Widget.Detail = Task.from(Widget.Detail)
  }
  return {
    id: end.Id,
    objectId: end.ObjectID,
    objectType: end.ObjectType, // 资源类型
    objectTitle: end.ObjectTitle,
    actor: end.Actor, // 分组的背景颜色
    actorId: end.ActorID, // 分组的背景颜色
    actTime: end.ActTime, // 是否完成
    action: end.Action, // 完成时间
    widget: {
      id: Widget.Id,
      type: Widget.Type,
      title: Widget.Title,
      on: {
        id: Widget.On ? Widget.On.Id : 0,
        type: Widget.On ? Widget.On.Type : '',
        title: Widget.On ? Widget.On.Title : ''
      },
      from: Widget.From ? Widget.From : '',
      detail: Widget.Detail ? Widget.Detail : ''
    },
    description: end.Description
  }
}

function toOne (front) {
  let model = {
    Id: front.id,
    ObjectID: front.objectId,
    ObjectType: front.objectType, // 资源类型
    ObjectTitle: front.objectTitle,
    Actor: front.actor, // 分组的背景颜色
    ActorID: front.actorId, // 分组的背景颜色
    ActTime: front.actTime, // 是否完成
    Action: front.action, // 完成时间
    Widget: _.has(front, 'widget') ? JSON.stringify({
      Id: front.widget.id,
      Type: front.widget.type,
      Title: front.widget.title,
      On: _.has(front, 'widget') ? {
        Id: front.widget.on ? front.widget.on.id : 0,
        Type: front.widget.on ? front.widget.on.type : '',
        Title: front.widget.on ? front.widget.on.title : ''
      } : '',
      From: front.widget.from ? front.widget.from : '',
      Detail: front.widget.detail ? front.widget.detail : ''
    }) : '',
    Description: front.description
  }
  return model
}
export default class Activity {
  // eslint-disable-next-line space-before-function-paren
  constructor(activity) {
    Object.assign(this, init, activity)
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
