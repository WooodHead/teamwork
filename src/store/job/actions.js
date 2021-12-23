import { date, LocalStorage } from 'quasar'
import { i18n } from '../../boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Job from '@/store/job/model'

const url = {
  getModel: 'jobs/getmodel',
  add: 'jobs/add',
  update: 'jobs/update',
  updatefields: 'jobs/updatefields',
  delete: 'jobs/delete',
  getList: 'jobs/getlist',
  getPageList: 'jobs/getpagelist',
  getCount: 'jobs/getcount',
  getHistory: 'jobs/getHistory',
  // cgx新增
  getJobs: 'jobs/getJobs'
}

export default {
  /**
   * 获取指定岗位
   * @param {*} param0
   * @param {*} ID
   */
  loadJob ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let job = _.find(state.jobs, { 'id': +id })
    if (job) {
      return job
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let job = Job.from(res.data)
        commit('pushJobs', [job])
        return job
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
        return new Job()
      })
    }
  },
  /**
   * 获取岗位列表（发布、草稿、归档）
   * @param {*} param0
   * @param {*} param1
   */
  loadJobs ({ commit, state }, { byPage = false, query = [], returnData = true }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      sort: ''
    }).then(res => {
      let jobs = Job.from(res.data)
      if (returnData) {
        return jobs
      } else {
        commit('pushJobs', jobs)
        commit('updatePage',
          {
            offset: state.page.offset + jobs.length,
            limit: state.page.limit
          })
        return !byPage || res.nextPageToken === -1
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return true
    })
  },
  /**
   * 重置列表
   * @param {*} param0
   */
  resetJobs ({ commit, state }) {
    commit('updatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /**
   * 新建岗位
   * @param {*} param0
   * @param {*} payload
   */
  addJob ({ commit, dispatch }, payload) {
    let job = Job.to(payload)
    return request.post(url.add, job).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('pushJobs', [job])
      if (job.isPublish === 0) {
        // 更新草稿数量
        dispatch('loadDraftCount')
      }
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 修改岗位
   * @param {*} param0
   * @param {*} payload
   */
  updateJob ({ commit, dispatch }, payload) {
    let job = Job.to(payload)
    return request.put(url.update, job).then(res => {
      let job = Job.from(res.data)
      commit('updateJob', job)
      if (job.isPublish === 1) {
        // 更新草稿数量
        dispatch('loadDraftCount')
      }
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 删除岗位
   * @param {*} param0
   * @param {*} id
   */
  deleteJob ({ state, commit, dispatch }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      let job = _.find(state.jobs, { id: id })
      commit('deleteJob', id)
      if (job && job.isPublish === 0) {
        // 更新草稿数量
        dispatch('loadDraftCount')
        // 跳转至归档页面
        this.$router.push({
          name: 'draftJobs'
        })
      } else if (job && job.archived) {
        // 更新归档数量
        dispatch('loadArchivedCount')
        // 跳转至归档页面
        this.$router.push({
          name: 'archivedJobs'
        })
      } else {
        // 跳转至列表页面
        this.$router.push({
          name: 'job'
        })
      }
      return true
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 归档岗位
   * @param {*} param0
   * @param {*} ID
   */
  archiveJob ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      Archived: 1,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('updateJob', job)
      // 更新归档数量
      dispatch('loadArchivedCount')
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 解档岗位
   * @param {*} param0
   * @param {*} ID
   */
  unarchiveJob ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      Archived: 0,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('updateJob', job)
      // 更新归档数量
      dispatch('loadArchivedCount')
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 正常招聘
   * @param {*} param0
   * @param {*} ID
   */
  startJob ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      HiringStatus: 0
    }).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('updateJob', job)
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 招满停招
   * @param {*} param0
   * @param {*} ID
   */
  doneJob ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      ID: ID,
      HiringStatus: 1
    }).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('updateJob', job)
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 删除归档岗位
   * @param {*} param0
   * @param {*} ID
   */
  deleteArchiveItems ({ dispatch }, ID) {
    dispatch('deleteJob', ID)
  },
  /**
   * 获取归档数量
   * @param {*} param0
   * @param {*} param1
   */
  loadArchivedCount ({ state, commit }) {
    let queryParams = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    // 类别过滤
    if (state.category) {
      queryParams = [
        { Key: 'Category', Value: state.category, Oper: 'eq' },
        'and'
      ].concat(queryParams)
    }
    return request.get(url.getCount, {
      query: JSON.stringify(queryParams)
    }).then(res => {
      commit('loadArchivedCount', res.data)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return 0
    })
  },
  /**
   * 获取草稿数量
   * @param {*} param0
   * @param {*} param1
   */
  loadDraftCount ({ state, commit }) {
    if (!LocalStorage.getItem('myself')) return 0
    let queryParams = [
      { Key: 'IsPublish', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'CreateByID', Value: LocalStorage.getItem('myself').id, Oper: 'eq' }
    ]
    // 类别过滤
    if (state.category) {
      queryParams = [
        { Key: 'Category', Value: state.category, Oper: 'eq' },
        'and'
      ].concat(queryParams)
    }
    return request.get(url.getCount, {
      query: JSON.stringify(queryParams)
    }).then(res => {
      commit('loadDraftCount', res.data)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return 0
    })
  },
  // 加载历史记录
  loadJobHistory ({ state, commit }, jobID) {
    return request.get(url.getHistory, { id: jobID })
      .then(res => {
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          history.push(JSON.parse(list[i]))
        }
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * cgx新增
   * @param {*} param0
   * @param {*} param
   */
  loadMyJobs ({ state, commit }, param) {
    let upper = {
      PlanID: param.planID,
      City: param.city
    }
    return request.get(url.getJobs, {
      param: JSON.stringify(upper)
    }).then(res => {
      let jobs = Job.from(res.data)
      return jobs
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *招聘计划同步更新岗位表中地点、人数
   * @param {*} param0
   * @param {*} ID
   */
  updateNumAddress ({ state, commit }, param) {
    return request.put(url.updatefields, {
      ID: param.id,
      HiringNumber: param.hiringNumber,
      Address: param.address
    }).then(res => {
      let job = Job.from(res.data)
      // 更新缓存列表
      commit('updateJob', job)
      return job
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  }
}
