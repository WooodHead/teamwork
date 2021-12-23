export default {
  // 仪表盘
  privateBoard: (state) => (psonID, category) => {
    return state.dashboards.find(d => d.category === category && d.psonID === psonID)
  },
  // 默认仪表盘
  defaultBoard: (state) => category => {
    return state.dashboards.find(d => d.category === category && d.psonID === 0)
  },
  // 图形
  privateCharts: (state) => (psonID, category) => {
    let dashboard = state.dashboards.find(d => d.category === category && d.psonID === psonID)
    return dashboard && dashboard.charts
  },
  // 默认图形
  defaultCharts: (state) => category => {
    let dashboard = state.dashboards.find(d => d.category === category && d.psonID === 0)
    return dashboard && dashboard.charts
  },
  maxOrderNumber: (state, getters) => (isDefault, psonID, category) => {
    let charts = {}
    if (isDefault) {
      charts = getters.defaultCharts(category)
    } else {
      charts = getters.privateCharts(psonID, category)
      if (_.isEmpty(charts)) {
        charts = getters.defaultCharts(category)
      }
    }
    return _.last(_.orderBy(_.values(charts), 'orderNumber')).orderNumber
  }
}
