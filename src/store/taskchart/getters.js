
export default {
  // 获取一个任务
  taskchart: (state) => (objectType, objectID, type, statustype) => {
    return _.find(state.taskcharts, p => {
      return p.objectType === objectType &&
      p.objectId === +objectID &&
      p.type === type &&
      p.statustype === statustype
    })
  },
  // 获取所有任务
  taskcharts: (state, getters) => {
    return state.taskcharts
  },
  /** -------台账管理start------- */
  // 工作台账按照来源或类别过滤
  taskchartFilterBySourceOrWorkType: (state, getters) => (chart, querys) => {
    if (querys.source && querys.source.length) {
      if (querys.workType && querys.workType.length) {
        // 来源+类别
        chart = getters.taskchartFilterBySourceAndWorkType(chart, querys.source, querys.workType)
      } else {
        // 只来源
        chart = getters.taskchartFilterBySource(chart, querys.source)
      }
    } else {
      // 只类别
      chart = getters.taskchartFilterByWorkType(chart, querys.workType)
    }
    return chart
  },
  // 工作台账类别过滤
  taskchartFilterByWorkType: (state) => (chart, worktype) => {
    let businessList = []
    _.forEach(chart, r => {
      businessList = _.pick(r.status.BusinessTypeHours, worktype)
      if (businessList && Object.keys(businessList).length) {
        r.filterWorkHours = Math.abs(_.sumBy(_.values(businessList), m => { return m[0] }).toFixed(1))
        r.filterRoadHours = Math.abs(_.sumBy(_.values(businessList), m => { return m[1] }).toFixed(1))
        r.filterAllHours = Math.abs((r.filterWorkHours + r.filterRoadHours).toFixed(1))
      } else {
        r.filterWorkHours = 0
        r.filterRoadHours = 0
        r.filterAllHours = 0
      }
    })
    return chart
  },
  // 工作台账来源过滤
  taskchartFilterBySource: (state) => (chart, source) => {
    let sourceList = []
    _.forEach(chart, r => {
      sourceList = _.pick(r.status.SourceHours, source)
      if (sourceList && Object.keys(sourceList).length) {
        r.filterWorkHours = Math.abs(_.sumBy(_.values(sourceList), m => { return m.Hours[0] }).toFixed(1))
        r.filterRoadHours = Math.abs(_.sumBy(_.values(sourceList), m => { return m.Hours[1] }).toFixed(1))
        r.filterAllHours = Math.abs((r.filterWorkHours + r.filterRoadHours).toFixed(1))
      } else {
        r.filterWorkHours = 0
        r.filterRoadHours = 0
        r.filterAllHours = 0
      }
    })
    return chart
  },
  // 工作台账来源和类别共同过滤
  taskchartFilterBySourceAndWorkType: (state) => (chart, source, worktype) => {
    let sourceList = [], businessList = []
    _.forEach(chart, r => {
      sourceList = _.pick(r.status.SourceHours, source)
      if (sourceList && Object.keys(sourceList).length) {
        let work = 0, road = 0
        _.forEach(_.values(sourceList).map(item => { return item.BusinessTypeHours }), m => {
          businessList = _.pick(m, worktype)
          if (businessList && Object.keys(businessList).length) {
            work += _.sumBy(_.values(businessList), m => { return m[0] })
            road += _.sumBy(_.values(businessList), m => { return m[1] })
          }
        })
        r.filterWorkHours = Math.abs(work.toFixed(1))
        r.filterRoadHours = Math.abs(road.toFixed(1))
        r.filterAllHours = Math.abs((work + road).toFixed(1))
      } else {
        r.filterWorkHours = 0
        r.filterRoadHours = 0
        r.filterAllHours = 0
      }
    })
    return chart
  },
  // 工作台账日期过滤
  taskchartFilterByDate: (state) => (chart, date) => {
    return _.filter(chart, r => r.statustype === date)
  },
  // 工作台账机构过滤
  taskchartFilterByOrganize: (state) => (chart, organize) => {
    return _.filter(chart, r => _.indexOf(organize, r.objectId) > -1)
  }
  /** -------台账管理end------- */
}
