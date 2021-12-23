import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import WorkHour from './model'
export default {
  // 获取工时列表
  loadWorkHours ({ state, commit }, {
    query,
    filter,
    search,
    fields = 'List'
  } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    }
    return request.get('workhours/getlist', params)
      .then(res => {
        let queryDate = _.filter(query, ['Key', 'Date'])
        if (queryDate && queryDate.length === 2) {
          commit('setQueryTime', { startTime: queryDate[0].Value, endTime: queryDate[1].Value })
        }
        let workHours = WorkHour.from(res.data)
        commit('setWorkHours', workHours)
        return workHours
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`workHour.error.${error.userMessage}`))
        return []
      })
  },
  // 根据人员ID获取累计工时
  loadSumHoursByOwner ({ state, commit }, {
    query,
    filter,
    search,
    fields = 'Sum'
  } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    }
    return request.get('workhours/getsumbyowner', params)
      .then(res => {
        if (res.data) {
          let workHours = WorkHour.from(res.data)
          commit('setResource', { objectType: workHours[0].objectType || '', objectID: +workHours[0].objectID || 0 })
          commit('setSumHoursByOwnerList', workHours)
          return workHours
        } else {
          return []
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`workHour.error.${error.userMessage}`))
        return []
      })
  },
  /**
   * 添加工时
   * @param {*} param0
   */
  addWorkHour ({ state, commit }, workhour) {
    return request.post('workhours/add', WorkHour.to(workhour))
      .then(res => {
        const model = WorkHour.from(res.data)
        commit('addWorkHour', model)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`workHour.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 修改工时
   * @param {*} payload
   */
  updateWorkHour ({ state, commit }, payload) {
    return request.put('workhours/update', WorkHour.to(payload)).then(res => {
      let model = WorkHour.from(res.data)
      commit('updateWorkHour', model)
      return model
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`workHour.error.${error.userMessage}`))
      return false
    })
  },
  loadSumHoursOfProjectByDate ({ state, commit }, {
    query,
    filter,
    search,
    fields = 'Sum',
    psonId
  } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      psonId: psonId
    }
    return request.get('workhours/getsumhoursofproject', params)
      .then(res => {
        if (res.data) {
          return res.data
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`workHour.error.${error.userMessage}`))
        return []
      })
  }
}
