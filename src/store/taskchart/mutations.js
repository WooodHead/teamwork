export default {
  // 新建多个任务
  addTaskcharts (state, taskcharts) {
    const inter = _.intersectionBy(taskcharts, state.taskcharts, 'id')
    _(inter).each(function (taskchart) {
      let index = state.taskcharts.findIndex(t => t.id === taskchart.id)
      state.taskcharts[index] = taskchart
    })
    const diff = _.differenceBy(taskcharts, state.taskcharts, 'id')
    state.taskcharts.push(...diff)
  },
  setRefresh (state) {
    state.refresh = !state.refresh
  },
  /** -------台账管理start------- */
  // 设置【工作台账】仪表盘查询条件
  setWorkRecordDashQueryCon (state, condition) {
    state.workRecordDashQueryCon = condition
  },
  setOrganizeTaskCharts (state, organizeTaskCharts) {
    state.organizeTaskCharts.push(..._.differenceBy(organizeTaskCharts, state.organizeTaskCharts, 'id'))
  },
  setOrganizeTopTaskCharts (state, organizeTopTaskCharts) {
    state.organizeTopTaskCharts.push(..._.differenceBy(organizeTopTaskCharts, state.organizeTopTaskCharts, 'id'))
  },
  setEmptyOrganizeTopTaskCharts (state) {
    state.organizeTopTaskCharts = []
  },
  setPersonTopTaskCharts (state, personTopTaskCharts) {
    state.personTopTaskCharts.push(..._.differenceBy(personTopTaskCharts, state.personTopTaskCharts, 'id'))
  },
  setEmptyPersonTopTaskCharts (state) {
    state.personTopTaskCharts = []
  }
  /** -------台账管理end------- */
}
