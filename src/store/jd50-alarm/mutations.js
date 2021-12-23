const mutations = {
  setAlarms: (state, allAlarms) => {
    state.allAlarms = allAlarms
  },
  setAlarm: (state, alarm) => {
    state.alarm = alarm
  },
  setSearch (state, value) {
    state.search = value
  },
  setIsReload (state, value) {
    state.isReload = value
  },
  setAllAlarmType (state, value) {
    state.setAllAlarmType = value
  },
  setSelectedType (state, value) {
    state.selectedType = value
  }
}
export default mutations
