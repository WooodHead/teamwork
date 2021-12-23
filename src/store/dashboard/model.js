import commomFields from '@/utils/model-common-fields'
const init = {
  id: 0,
  psonID: 0,
  category: '',
  charts: {},
  createBy: '',
  createTime: '',
  modifyBy: '',
  modifyTime: ''
}
function fromOne (end) {
  let charts = _.isObject(end.Charts) ? end.Charts : JSON.parse(end.Charts)
  return {
    id: end.Id,
    psonID: end.PsonID,
    category: end.Category,
    charts: charts,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  let model = {
    Id: front.id,
    PsonID: front.psonID,
    Category: front.category,
    Charts: JSON.stringify(charts),
    ...(commomFields.to(front))
  }
  return model
}
export default class Dashboard {
  constructor (dashboard) {
    Object.assign(this, init, dashboard)
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
