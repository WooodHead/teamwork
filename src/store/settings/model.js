// 初始模型对象
const init = {
  id: 0,
  content: '',
  cron: {
    time: '9:30',
    days: '',
    type: 'day',
    monthtype: ''
  },
  cronName: '',
  type: '',
  settings: {}
}

function fromOne (end) {
  return {
    id: end.Id,
    type: end.Type,
    settings: JSON.parse(end.Settings || '{}')
  }
}

function toOne (front) {
  return {
    Id: front.id,
    Type: front.type,
    Settings: JSON.stringify(front.settings)
  }
}

export default class Setting {
  // eslint-disable-next-line space-before-function-paren
  constructor(Setting) {
    Object.assign(this, init, Setting)
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
