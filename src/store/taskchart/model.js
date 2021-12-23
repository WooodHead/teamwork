/**
 * 任务仪表盘
 * @export
 * @class TaskChart
 */
const init = {
  id: 0,
  type: 'list',
  objectId: 0,
  objectType: '', // 资源类型
  statustype: 'list',
  status: [],
  latestUpdateTime: '', // 最新更新时间
  /** -------台账管理start------- */
  filterWorkHours: 0,
  filterRoadHours: 0
  /** -------台账管理end------- */
}

function fromOne (end) {
  let aa = {
    id: end.Id,
    type: end.Type,
    objectId: end.ObjectID,
    objectType: end.ObjectType,
    statustype: end.StatusType,
    status: JSON.parse(end.Status),
    latestUpdateTime: end.LatestUpdateTime,
    /** -------台账管理start------- */
    filterWorkHours: end.FilterWorkHours ? Math.abs(parseFloat(end.FilterWorkHours).toFixed(1)) : 0,
    filterRoadHours: end.FilterRoadHours ? Math.abs(parseFloat(end.FilterRoadHours).toFixed(1)) : 0
  /** -------台账管理end------- */
  }
  return aa
}

function toOne (front) {
  let model = {
    Id: front.id,
    Type: front.type,
    ObjectID: front.objectID,
    ObjectType: front.objectType,
    StatusType: front.statusType,
    Status: JSON.stringify(front.status),
    LatestUpdateTime: front.latestUpdateTime
  }
  return model
}
export default class TaskChart {
  // eslint-disable-next-line space-before-function-paren
  constructor(taskchart) {
    Object.assign(this, init, taskchart)
  }
  static from (end) {
    if (_.isArray(end)) {
      let aa = _.map(end, e => fromOne(e))
      return aa
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
