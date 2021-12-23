
// 初始模型对象
const init = {
  alarmId: 0,
  alarmLevelName: '',
  cncSysVersion: '',
  alarmTypeName: '',
  alarmDesc: '',
  alarmCode: '',
  alarmKindId: 0,
  flag: 1,
  note: '',
  cncSystemId: 0,
  solutionName: '',
  solutionDetail: ''
}

function fromOne (end) {
  return {
    alarmId: end.ALARM_ID,
    alarmLevelName: end.ALARM_LEVEL_NAME,
    cncSysVersion: end.CNC_SYS_VERSION,
    alarmTypeName: end.ALARM_TYPE_NAME,
    alarmDesc: end.ALARM_DESC,
    alarmCode: end.ALARM_CODE,
    alarmKindId: end.ALARM_KIND_ID,
    flag: end.FLAG,
    note: end.NOTE,
    cncSystemId: end.CNC_SYSTEM_ID,
    solutionName: end.SOLUTION_NAME,
    solutionDetail: end.SOLUTION_DETAIL
  }
}

function toOne (front) {
  return {
    ALARM_ID: front.alarmId,
    ALARM_LEVEL_NAME: front.alarmLevelName,
    CNC_SYS_VERSION: front.cncSysVersion,
    ALARM_TYPE_NAME: front.alarmTypeName,
    ALARM_DESC: front.alarmDesc,
    ALARM_CODE: front.alarmCode,
    ALARM_KIND_ID: front.alarmKindId,
    FLAG: front.flag,
    NOTE: front.note,
    CNC_SYSTEM_ID: front.cncSystemId,
    SOLUTION_NAME: front.solutionName,
    SOLUTION_DETAIL: front.solutionDetail
  }
}

export default class jd50Alarm {
  // eslint-disable-next-line space-before-function-paren
  constructor(jd50Alarm) {
    Object.assign(this, init, jd50Alarm)
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
