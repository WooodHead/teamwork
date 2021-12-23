export default {
  setWorkHours (state, workhours) {
    const newWorkHour = _.differenceBy(workhours, state.workHours, 'id')
    state.workHours.push(...newWorkHour)
  },
  addWorkHour (state, workhour) {
    const newWorkHour = _.differenceBy([workhour], state.workHours, 'id')
    state.workHours.push(...newWorkHour)
  },
  updateWorkHour (state, workhour) {
    Object.assign(_.find(state.workHours, item => item.id === workhour.id), workhour)
  },
  setEmptyWorkHours (state) {
    state.workHours = []
  },
  setSumHourList (state, value) {
    state.sumHourList = value
  },
  setResource (state, value) {
    state.resource = value
  },
  setEmptyQueryTime (state) {
    state.queryTime = { startTime: [], endTime: [] }
  },
  setQueryTime (state, value) {
    state.queryTime.startTime.push(..._.difference([value.startTime], state.queryTime.startTime))
    state.queryTime.endTime.push(..._.difference([value.endTime], state.queryTime.endTime))
  },
  setSumHoursByOwnerList (state, value) {
    state.sumHoursByOwnerList.push(..._.differenceBy(value, state.sumHoursByOwnerList, 'ownerID'))
  },
  setEmptySumHoursByOwnerList (state) {
    state.sumHoursByOwnerList = []
  },
  updateSumHoursByOwnerList (state, { psonId, objectType, objectID, workHour = [0, 0], onRoadHour = [0, 0] }) {
    let index = state.sumHoursByOwnerList.findIndex(p => p.ownerID === psonId && p.objectType === objectType && p.objectID === +objectID)
    if (index >= 0) {
      state.sumHoursByOwnerList[index].sumWorkHours = state.sumHoursByOwnerList[index].sumWorkHours - (+workHour[0]) + (+workHour[1])// 0为旧值，1为新值
      state.sumHoursByOwnerList[index].sumOnRoadHours = state.sumHoursByOwnerList[index].sumOnRoadHours - (+onRoadHour[0]) + (+onRoadHour[1])// 0为旧值，1为新值
    } else {
      state.sumHoursByOwnerList.push({
        objectType: objectType,
        objectID: +objectID,
        ownerType: 'person',
        ownerID: psonId,
        sumWorkHours: +workHour[1],
        sumOnRoadHours: +onRoadHour[1]
      })
    }
  }
}
