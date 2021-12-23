import Dashboard from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  GetDashboardData: 'dashboards/GetDashboardData',
  AddChart: 'dashboards/AddChart',
  UpdateChart: 'dashboards/UpdateChart',
  ResetCharts: 'dashboards/ResetCharts',
  DeleteChart: 'dashboards/DeleteChart'
}
// 获取业务的仪表盘
export default {
  // 添加图表
  AddChart ({ state, commit }, data) {
    return request.post(url.AddChart, data)
      .then(res => {
        let board = Dashboard.from(res.data)
        commit('addDashboards', [board])
        return board
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新图表
  UpdateChart ({ state, commit }, data) {
    return request.post(url.UpdateChart, data)
      .then(res => {
        let board = Dashboard.from(res.data)
        commit('addDashboards', [board])
        return board
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 重置为默认图表
  ResetCharts ({ state, commit }, data) {
    return request.post(url.ResetCharts, data)
      .then(res => {
        let board = Dashboard.from(res.data)
        commit('addDashboards', [board])
        return board
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除图表
  DeleteChart ({ state, commit }, data) {
    return request.post(url.DeleteChart, data)
      .then(res => {
        if (res.data) {
          commit('deleteChart', data)
          return true
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取图表
  loadDashboardData ({ state, commit }, category) {
    return request.get(url.GetDashboardData, { category })
      .then(res => {
        let boards = Dashboard.from(res.data)
        commit('addDashboards', boards)
        return boards
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
