import TaskChart from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  GetList: 'taskcharts/GetList',
  GetModel: 'taskcharts/GetModel',
  GetPersonChart: 'taskcharts/GetPersonChart',
  GetDelayChart: 'taskcharts/GetDelayChart',
  GetWorkHourChart: 'taskcharts/GetWorkHourChart',
  GetPersonRelatedCharts: 'taskcharts/GetPersonRelatedCharts',
  UpdateObjectChart: 'taskcharts/UpdateObjectChart',
  AddObjectChart: 'taskcharts/AddObjectChart',
  GetWorkRecordOrganizeChart: 'taskcharts/getworkrecordorganizechartlist',
  WorkRecordExportReport: 'taskcharts/workrecordexportreport',
  GetWorkRecordOrganizeTopChart: 'taskcharts/getworkrecordorganizetopchartlist',
  GetWorkRecordPersonChart: 'taskcharts/getworkrecordpersonchartlist',
  GetWorkRecordPersonTopChart: 'taskcharts/getworkrecordpersontopchartlist',
  Exists: 'taskcharts/exists'
}
// 获取任务列表
export default {
  loadTaskCharts ({ state, commit }, { query } = {}) {
    return request.get(url.GetList, {
      query: JSON.stringify(query)
    }).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadTaskChart ({ state, commit }, { objectID, objectType, type, statusType }) {
    return request.get(url.GetModel, {
      objectID: objectID,
      objectType: objectType,
      type: type,
      statusType: statusType
    }).then(res => {
      let taskchart = TaskChart.from(res.data)
      commit('addTaskcharts', [taskchart])
      return taskchart
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  // 获取
  loadDelayChart  ({ state, commit }, { objectID, objectType, type, statusType, begindate, enddate }) {
    return request.get(url.GetDelayChart, {
      objectID: objectID,
      objectType: objectType,
      type: type,
      statusType: statusType,
      begindate: begindate,
      enddate: enddate
    }).then(res => {
      let taskchart = TaskChart.from(res.data)
      return taskchart
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadPersonChart  ({ state, commit }, { objectID, objectType, type, statusType, begindate, enddate }) {
    return request.get(url.GetPersonChart, {
      objectID: objectID,
      objectType: objectType,
      type: type,
      statusType: statusType,
      begindate: begindate,
      enddate: enddate
    }).then(res => {
      let taskchart = TaskChart.from(res.data)
      return taskchart
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadWorkHourChart ({ state, commit }, { objectID, objectType, type, statusType, beginDate, endDate }) {
    return request.get(url.GetWorkHourChart, {
      objectID: objectID,
      objectType: objectType,
      type: type,
      statusType: statusType,
      begindate: beginDate,
      enddate: endDate
    }).then(res => {
      let taskChart = TaskChart.from(res.data)
      return taskChart
    }).catch(err => {
      err.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadPersonRelatedCharts ({ state, commit }, { objectID, objectType, statusType, beginDate, endDate }) { 
    return request.get(url.GetPersonRelatedCharts, { 
      objectID: objectID, 
      objectType: objectType, 
      statusType: statusType, 
      begindate: beginDate, 
      enddate: endDate
    }).then(res => { 
      let taskcharts = TaskChart.from(res.data)
      return taskcharts
    }).catch(error => { 
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  UpdateObjectChart ({ state, commit }, { ObjectID, ObjectType }) {
    return request.get(url.UpdateObjectChart, {
      ObjectID: ObjectID,
      ObjectType: ObjectType
    }).then(res => {
      return res
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  AddObjectChart ({ state, commit }, { ObjectID, ObjectType }) {
    return request.get(url.AddObjectChart, {
      ObjectID: ObjectID,
      ObjectType: ObjectType
    }).then(res => {
      return res
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  /** ------------------------------工作台账仪表盘start------------------ */
  // 获取机构parentId下子公司的台账数据
  loadWorkRecordOrganizeTaskCharts ({ state, commit }, { query, filter, search, fields = 'List', orderby, parentId = 0, psonId = 0 } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby,
      parentId: parentId,
      psonId: psonId
    }
    return request.get(url.GetWorkRecordOrganizeChart, params).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      commit('setOrganizeTaskCharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  // 获取机构子公司前limit(后台默认10)名
  loadWorkRecordOrganizeTopTaskCharts ({ state, commit }, { query, filter, search, fields = 'List', orderby, limit, otherQuery } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby,
      limit: limit,
      otherQuery: JSON.stringify(otherQuery)
    }
    return request.get(url.GetWorkRecordOrganizeTopChart, params).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      commit('setOrganizeTopTaskCharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadWorkRecordPersonTaskCharts ({ state, commit }, { query, filter, search, fields = 'List', orderby, parentId } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby,
      parentId: parentId
    }
    return request.get(url.GetWorkRecordPersonChart, params).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  loadWorkRecordPersonTopTaskCharts ({ state, commit }, { query, filter, search, fields = 'List', orderby = 'Status->\'$.SumHours\' desc', limit, psonId, otherQuery } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby,
      limit: limit,
      psonId: psonId,
      otherQuery: JSON.stringify(otherQuery)
    }
    return request.get(url.GetWorkRecordPersonTopChart, params).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      commit('setPersonTopTaskCharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  // 报表导出
  loadWorkRecordExportTaskCharts ({ state, commit }, { query, filter, search, fields = 'List', orderby, parentId = 0, psonId = 0, dimension } = {}) {
    let params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: orderby,
      parentId: parentId,
      psonId: psonId,
      dimension: dimension
    }
    return request.get(url.WorkRecordExportReport, params).then(res => {
      let taskcharts = TaskChart.from(res.data)
      commit('addTaskcharts', taskcharts)
      commit('setOrganizeTaskCharts', taskcharts)
      return taskcharts
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  // 判断是否存在上月结算数据（防止结算月份顺序调整，所以不能直接获取最近一次的model）
  exists ({ state, commit }, date) {
    if (!_.isEmpty(state.taskcharts)) {
      let taskchart = state.taskcharts.filter(a => a.type === 'workRecord' && a.statustype === date)
      if (taskchart && taskchart.length) return true
    }
    let query = [
      { Key: 'Type', Value: 'workRecord', Oper: 'eq' },
      'and',
      { Key: 'ObjectType', Value: 'organize', Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'StatusType', Value: date, Oper: 'eq' }
    ]
    return request.get(url.Exists, { query: JSON.stringify(query) })
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
  /** ------------------------------工作台账仪表盘end------------------ */
}
