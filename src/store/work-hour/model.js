/**
 @Name：工时转换器
 @Author：曾盼盼
 @date：2020/10/28
 @Copyright：西安精雕软件科技有限公司
 */
import { date } from 'quasar'
const { formatDate } = date
const init = {
  id: 0,
  objectType: '',
  objectID: 0,
  date: formatDate(new Date(), 'YYYY-MM-DD'),
  ownerType: '',
  ownerID: 0,
  hours: 0.0,
  onRoadHours: 0.0,
  leaveHours: 0.0,
  sumWorkHours: 0,
  sumOnRoadHours: 0,
  sumLeaveHours: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    objectType: end.ObjectType,
    objectID: end.ObjectID,
    date: formatDate(end.Date, 'YYYY-MM-DD'),
    ownerType: end.OwnerType,
    ownerID: end.OwnerID,
    hours: end.Hours,
    onRoadHours: end.OnRoadHours,
    sumWorkHours: end.SumWorkHours,
    sumOnRoadHours: end.SumOnRoadHours
  }
}
function toOne (front) {
  return {
    Id: front.id,
    ObjectType: front.objectType,
    ObjectID: front.objectID,
    Date: formatDate(front.date, 'YYYY-MM-DD'),
    OwnerType: front.ownerType,
    OwnerID: front.ownerID,
    Hours: front.hours,
    OnRoadHours: front.onRoadHours
  }
}

export default class WorkHour {
  // eslint-disable-next-line space-before-function-paren
  constructor(WorkHour) {
    Object.assign(this, init, WorkHour)
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
