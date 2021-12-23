export default {
  workHours: [],
  sumHoursByOwnerList: [],
  sumHourList: {
    sumWorkHours: 0,
    sumOnRoadHours: 0
  },
  resource: {
    objectType: '',
    objectID: 0
  },
  // 所有查过的时间范围。若查过，则从state中获取数据
  queryTime: {
    startTime: [],
    endTime: []
  }
}
