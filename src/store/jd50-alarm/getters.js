
const getters = {
  /**
   * 报警列表查询（前端筛选模式 ）
   * */
  alarmsFiltered: state => {
    const search = state.search
    const selectedType = state.selectedType
    let allAlarms = []
    let selectedAlarm = []
    let searchAlarm = []
    // 根据常见报警IDs排序
    if (state.commonAlarmsIds) {
      allAlarms = _.sortBy(state.allAlarms, item => {
        if (state.commonAlarmsIds.includes(item.alarmId)) {
          return -1
        }
      })
    } else {
      allAlarms = state.allAlarms
    }

    // 根据报警类型过滤
    if (selectedType) {
      selectedAlarm = _.filter(allAlarms, alarms => {
        return alarms && alarms.alarmTypeName && alarms.alarmTypeName === selectedType
      })
    } else {
      selectedAlarm = allAlarms
    }

    // 根据搜索条件过滤
    if (search) {
      searchAlarm = _.filter(selectedAlarm, alarms => {
        return (alarms && alarms.alarmCode && alarms.alarmCode.toLowerCase().includes(search.toLowerCase())) ||
        (alarms && alarms.alarmDesc && alarms.alarmDesc.toLowerCase().includes(search.toLowerCase())
        )
      })
    } else {
      searchAlarm = selectedAlarm
    }
    return searchAlarm
  }
}
export default getters
