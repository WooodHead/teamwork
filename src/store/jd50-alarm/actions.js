const allAlarmList = require('app/public/allAlarmSolution.json')
import jd50Alarm from './model'
const actions = {
  /**
   * 获取刀具信息
   * @param {*} search
   */
  loadAlarms ({ commit, state }, search) {
    let allAlarms = jd50Alarm.from(allAlarmList)
    return new Promise((resolve, reject) => {
      commit('setAlarms', allAlarms)
      let allAlarmType = _.sortBy(_.uniq(_.map(allAlarms, 'alarmTypeName')))
      commit('setAllAlarmType', allAlarmType)
      resolve({ success: true })
    })
  },
  /**
   * 通过报警编码获取报警详情
   * @param {*} search
   */
  loadAlarmByCode ({ commit, state }, code) {
    let allAlarms = jd50Alarm.from(allAlarmList)
    return new Promise((resolve, reject) => {
      let alarm = _.filter(allAlarms, item => { return item.alarmCode === code })
      commit('setAlarm', alarm[0])
      resolve({ success: true })
    })
  }
}
export default actions
