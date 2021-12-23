import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Model from '@/store/resume/model'
import { i18n } from '../../boot/i18n'
const url = {
  resumes: {
    // jd_resume
    GetModel: 'resumes/GetModel',
    GetList: 'resumes/GetList',
    // vi_resume
    GetViModel: 'resumes/GetViModel',
    GetViList: 'resumes/GetViList',
    GetViPageList: 'resumes/GetViPageList',
    GetDashboardProcess: 'resumes/GetDashboardProcess',
    GetDashboardDeliveryTrend: 'resumes/GetDashboardDeliveryTrend',
    GetDashboardEduDistribution: 'resumes/GetDashboardEduDistribution',
    GetDashboardFlow: 'resumes/GetDashboardFlow',
    GetDashboardResumeList: 'resumes/GetDashboardResumeList',
    GetResumeHistory: 'resumes/GetHistory',
    // 编辑面试记录
    EditHistory: 'resumes/EditHistory',
    // 删除面试记录
    DeleteHistory: 'resumes/DeleteHistory',
    // 获取简历密码
    GetResumePW: 'resumes/GetResumePW'
  },
  deliverys: {
    // jd_delivery
    add: 'deliverys/add',
    GetStatusCount: 'deliverys/GetStatusCount',
    UpdateResumeStatus: 'deliverys/UpdateResumeStatus',
    UpdateInterviewStatus: 'deliverys/UpdateInterviewStatus',
    StorageResumes: 'deliverys/StorageResumes',
    UpdateFields: 'deliverys/UpdateFields',
    updateResumePush: 'deliverys/UpdateResumePush',
    // 测评通过
    PassTestExam: 'deliverys/PassTestExam',
    // 导入测评结果
    ImportTestResult: 'deliverys/ImportTestResult',
    // 发起邀约
    StartInvite: 'deliverys/StartInvite',
    // 改约
    UpdateInvite: 'deliverys/UpdateInvite',
    // 获取入职人数
    getCount: 'deliverys/GetCount',
    // 下一轮面试
    nextInterview: 'deliverys/nextInterview',
    // 获取简历筛选列表应聘地点
    getResumeFilterCitys: 'deliverys/GetResumeFilterCitys',
    // 是否跳过测评
    skipTestExam: 'deliverys/SkipTestExam'
  },
  invites: {
    GetList: 'invites/GetList'
  }
}

export default {
  // 分页信息
  initStatePage ({ commit, state }) {
    commit('setStatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /** **************************************** vi_resume start *************************************************/
  loadResumeViews ({ state, getters, commit }, {
    query,
    search,
    fields = 'List' } = {}) {
    // 角色
    if (getters.isHrOrAdmin || getters.isInterviewer || getters.isSeniorManager) {
      const condition = {
        query: JSON.stringify(query),
        search,
        fields
      }
      return request.get(url.resumes.GetViList, condition)
        .then(res => {
          let list = []
          if (res.data) {
            list = Model.ResumeView.from(res.data)
            commit('pushResumeViews', list)
          }
          return list
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return []
        })
    } else {
      return []
    }
  },
  /**
   * 分页列表
   * @param {*} param0
   * @param {*} param1
   */
  loadResumeViewsByPage ({ state, getters, commit }, {
    query,
    filter,
    search,
    fields = 'List',
    sort = '',
    order = '',
    byPage = state.byPage,
    offset = state.page.offset,
    limit = state.page.limit } = {}) {
    // 角色
    if (getters.isHrOrAdmin || getters.isInterviewer || getters.isSeniorManager) {
      const page = state.page
      const condition = {
        query: JSON.stringify(query),
        filter: JSON.stringify(filter),
        search,
        fields
      }
      byPage ? Object.assign(condition, {
        limit,
        offset,
        order,
        sort
      }) : Object.assign(condition, {
        orderby: ` ${sort} ${order}`
      })
      return request.get(url.resumes.GetViPageList, condition)
        .then(res => {
          let list = []
          if (res.data) {
            list = Model.ResumeView.from(res.data)
            commit('pushResumeViews', list)
          }
          commit('setStatePage',
            {
              offset: Math.min(page.offset + page.limit),
              nextPageToken: res.nextPageToken
            })
          return list
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return []
        })
    } else {
      return []
    }
  },
  // 根据 ids 获取视图列表
  loadResumeViewsByIDs ({ state, commit }, {
    query,
    filter,
    search,
    fields = 'List',
    sort = 'modifyTime',
    order = 'desc',
    byPage = state.byPage,
    offset = state.page.offset,
    limit = state.page.limit } = {}) {
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields
    }
    byPage ? Object.assign(condition, {
      limit,
      offset,
      order,
      sort
    }) : Object.assign(condition, {
      orderby: ` ${sort} ${order}`
    })
    return request.get(url.resumes.GetViPageList, condition)
      .then(res => {
        let list = []
        if (res.data) {
          list = Model.ResumeView.from(res.data)
        }
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 单个卡片信息
   * @param {*} param0
   * @param {*} ID
   */
  loadResumeView ({ state, commit }, resumeDeliveryID) {
    // 先从前台state列表缓存获取
    let view = _.find(state.resumeViews, { 'resumeDeliveryID': +resumeDeliveryID })
    if (view) {
      commit('pushResumeViews', [view])
      return view
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.resumes.GetViModel, {
        ResumeDeliveryID: resumeDeliveryID
      }).then(res => {
        let view = Model.ResumeView.from(res.data)
        commit('pushResumeViews', [view])
        return view
      }).catch((error) => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
    }
  },
  /**
   * 获取仪表盘数据
   * @param {*} param0
   * @param {*} param1
   */
  loadDashProcessData ({ state, commit }, { uid, where }) {
    return request.get(url.resumes.GetDashboardProcess, { where })
      .then(res => {
        let funnelData = JSON.parse(res.data)
        funnelData = funnelData instanceof Array ? funnelData[0] : funnelData
        let data = {
          uid,
          data: funnelData
        }
        commit('setDashProcessData', data)
        return data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadDashDayData ({ state, commit }, { uid, where }) {
    return request.get(url.resumes.GetDashboardDeliveryTrend, { where })
      .then(res => {
        let deliveryDayData = JSON.parse(res.data)
        commit('setDashDayData', {
          uid,
          data: deliveryDayData
        })
        return deliveryDayData.length > 0
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadDashSourceData ({ state, commit }, { uid, where }) {
    return request.get(url.resumes.GetDashboardEduDistribution, { where })
      .then(res => {
        let sourceData = JSON.parse(res.data)
        // 处理数据格式
        sourceData = _.map(sourceData, item => {
          item.CollegeStyle = item.CollegeStyle === 'null' ? '其他院校' : (item.CollegeStyle === '其它' || item.CollegeStyle === '其他') ? '其他院校' : item.CollegeStyle
          item.JobCategory = item.JobCategory.trim() === '' ? '其他岗位' : (item.JobCategory === '其它' || item.JobCategory === '其他') ? '其他岗位' : item.JobCategory
          item.Background = (item.Background === '其它' || item.Background === '其他') ? '其他学历' : item.Background
          return item
        })
        commit('setDashSourceData', {
          uid,
          data: sourceData
        })
        return sourceData
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadDashFlowData ({ state, commit }, { uid, where }) {
    return request.get(url.resumes.GetDashboardFlow, { where })
      .then(res => {
        let sourceData = JSON.parse(res.data)
        // 处理数据格式
        sourceData = _.map(sourceData, item => {
          item.CollegeStyle = item.CollegeStyle === 'null' ? '其他院校' : (item.CollegeStyle === '其它' || item.CollegeStyle === '其他') ? '其他院校' : item.CollegeStyle
          item.JobCategory = item.JobCategory.trim() === '' ? '其他岗位' : (item.JobCategory === '其它' || item.JobCategory === '其他') ? '其他岗位' : item.JobCategory
          item.Background = (item.Background === '其它' || item.Background === '其他') ? '其他学历' : item.Background
          return item
        })
        commit('setDashFlowData', {
          uid,
          data: sourceData
        })
        return sourceData
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadDashboardResumeList ({ state, commit }, model) {
    const page = state.dashboardPage
    model.limit = page.limit
    model.offset = page.offset
    model.filter = ''
    model.search = ''
    model.fields = ''
    model.orderby = state.dashboardDetailSort + ' ' + state.dashboardDetailOrder
    return request.post(url.resumes.GetDashboardResumeList, model)
      .then(res => {
        let list = []
        if (res.data) {
          list = Model.ResumeView.from(res.data)
          commit('pushDashboardResumeViews', list)
          commit('setDashboardStatePage',
            {
              offset: Math.min(page.offset + page.limit),
              nextPageToken: res.nextPageToken,
              total: res.total
            })
        }
        return list
      })
  },
  conditionToEnd ({ state, commit }, model) {
    return {
      planids: _.isEmpty(model.planids) ? '' : model.planids.join(),
      jobids: _.isEmpty(model.jobids) ? '' : model.jobids.join(),
      citys: _.isEmpty(model.citys) ? '' : model.citys.join(),
      startDate: model.startDate || '',
      endDate: model.endDate || '',
      schools: _.isEmpty(model.schools) ? '' : model.schools.join()
    }
  },
  conditionToFront ({ state, commit }, model) {
    return {
      planids: model.planids.length ? model.planids.split(',').map(i => +i) : [],
      jobids: model.jobids.length ? model.jobids.split(',').map(i => +i) : [],
      citys: model.citys.length ? model.citys.split(',') : [],
      startDate: model.startDate,
      endDate: model.endDate,
      schools: model.schools.length ? model.schools.split(',') : []
    }
  },
  // 是否可复活
  canResurrection ({ getters }, resumeID) {
    return request.get(url.resumes.GetViList, {
      query: JSON.stringify([
        { Key: 'ResumeID', Value: resumeID, Oper: 'eq' },
        'and',
        { Key: 'InStorage', Value: 0, Oper: 'eq' }
      ])
    })
      .then(res => {
        let list = []
        if (res.data) {
          list = Model.ResumeView.from(res.data)
          return !list.length
        }
        return false
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** **************************************** jd_deliverys start *************************************************/
  // 复活简历
  addDelivery ({ commit, dispatch }, model) {
    return request.post(url.deliverys.add, model).then(res => {
      return !!res.data
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  // 各状态投递数量
  loadStatusCount ({ state, commit, getters }) {
    return request.get(url.deliverys.GetStatusCount, {
      query: JSON.stringify(getters.statusCountQuery.query),
      search: getters.statusCountQuery.search
    })
      .then(res => {
        let count = {
          0: [],
          10: [],
          15: [],
          20: [],
          30: [],
          40: [],
          50: [],
          60: [],
          70: [],
          80: [],
          90: [],
          100: [],
          110: [],
          read: []
        }
        res.data.map(d => {
          if (!_.isEmpty(d.value)) {
            count[d.Status] = d.value.split(',')
          }
        })
        commit('setStatusCount', count)
        return count
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
        return false
      })
  },
  // 测评通过
  passTestExam ({ state, commit }, {
    query,
    search }) {
    const condition = {
      query: JSON.stringify(query),
      search
    }
    return request.get(url.deliverys.PassTestExam, condition)
      .then(res => {
        if (res.data.length) {
          let ids = res.data.split(',')
          let views = ids.map(id => state.resumeViews.find(view => view.resumeDeliveryID === +id))
          views.map(view => (view.status = state.endStatus.waitInviteFirstInterview))
          return true
        } else {
          return false
        }
      })
  },
  // 导入测评结果
  importTestResult ({ state, commit }, list) {
    return request.post(url.deliverys.ImportTestResult, { listModel: list })
      .then(res => {
        if (res.data.length) {
          let ids = res.data.split(',')
          let views = ids.map(id => state.resumeViews.find(view => view.resumeDeliveryID === +id))
          views.map(view => {
            let model = list.find(l => l.id === view.id)
            if (model.Status === '测评中') {
              view.status = state.endStatus.inTest
            } else if (model.Status === '通过') {
              view.status = state.endStatus.waitInviteFirstInterview
            } else if (model.Status === '未通过') {
              view.inStorage = 1
            }
          })
          return true
        } else {
          return false
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 推荐面试官
  updateResumePush ({ state, commit, getters }, payload) {
    return request.put(url.deliverys.updateResumePush, payload)
      .then(res => {
        if (res.data) {
          getters.isInterviewer && commit('updateResumePush', payload.Id)
          return true
        } else {
          return false
        }
      })
  },
  // 改约（时间，地点，面试方式）
  UpdateInvite ({ state, commit }, payload) {
    return request.put(url.deliverys.UpdateInvite, payload)
      .then(res => {
        if (res.data) {
          commit('updateResumeViewFields', {
            resumeDeliveryID: payload.Id,
            fields: {
              interviewTime: payload.InterviewTime,
              interviewType: payload.InterviewType,
              interviewPlace: payload.InterviewPlace
            }
          })
          return _.find(state.resumeViews, { 'resumeDeliveryID': +payload.Id })
        } else {
          return false
        }
      })
  },
  // 更新interviewerID字段
  updateResumeInterviewerID ({ state, commit }, { resumeDeliveryID, interviewerID }) {
    return request.put(url.deliverys.UpdateFields, {
      Id: resumeDeliveryID,
      InterviewerID: interviewerID
    }).then(res => {
      if (res.data) {
        commit('setResumeInterviewerID', { resumeDeliveryID, interviewerID })
      }
    })
  },
  // 发起邀约
  StartInvite ({ state, commit }, params) {
    return request.put(url.deliverys.StartInvite, params)
      .then(res => {
        if (res.data) {
          commit('updateResumeAfterInvite', { ResumeDeliveryIDs: params.ResumeDeliveryIDs })
        }
        return res.data
      })
  },
  /**
   * 更新简历状态
   * 筛选通过、单个简历测评通过、发放offer、签约
   * @param {*} param0
   * @param {*} param1
   */
  UpdateResumeStatus ({ commit, state }, { ids, status, oldStatus = -20 }) {
    return request.put(url.deliverys.UpdateResumeStatus, {
      Ids: ids.join(),
      Status: status,
      OldStatus: oldStatus
    }).then(res => {
      if (res.data.length) {
        let ids = res.data.split(',')
        let views = ids.map(id => state.resumeViews.find(view => view.resumeDeliveryID === +id))
        views.map(view => (view.status = status))
        return true
      } else {
        return false
      }
    })
  },
  /**
   * 更新面试状态
   * 添加面试记录、面试通过
   * @param {*} param0
   * @param {*} param1
   */
  UpdateInterviewStatus ({ commit, state }, fields) {
    return request.put(url.deliverys.UpdateInterviewStatus, fields)
      .then(res => {
        if (res.data) {
          commit('updateResumeViewFields', {
            resumeDeliveryID: fields.Id,
            fields: _.mapKeys(fields, function (value, key) {
              return _.lowerFirst(key)
            }) })
        }
      })
  },
  // 更新简历分数
  updateResumeScore ({ state, commit }, { id = 0, result = 0 }) {
    return request.put(url.deliverys.UpdateFields, {
      Id: id,
      Result: result
    })
      .then(res => {
        if (res.data) {
          commit('updateResumeResult', {
            resumeDeliveryID: res.data.Id,
            result: res.data.Result
          })
          return true
        } else {
          return false
        }
      })
  },
  /**
   * 淘汰入库
   * @param {*} param0
   * @param {*} param1
   */
  StorageResumes ({ commit, state }, {
    query,
    search
  }) {
    const condition = {
      query: JSON.stringify(query),
      search
    }
    condition.onlyInterviewerID = !(state.selectedStatus === 'waitScreening')
    return request.get(url.deliverys.StorageResumes, condition)
      .then(res => {
        if (res.data.length) {
          let ids = res.data.split(',')
          commit('StorageResumes', ids)
          return true
        } else {
          return false
        }
      })
  },

  /**
   * 下一轮面试
   * @param {*} param0
   * @param {*} param1
   */
  nextInterview ({ commit, state }, fields) {
    return request.post(url.deliverys.nextInterview, fields)
      .then(res => {
        if (res.data) {
          commit('updateResumeViewFields', {
            resumeDeliveryID: fields.Id,
            fields: _.mapKeys(fields, function (value, key) {
              return _.lowerFirst(key)
            }) })
        }
      })
  },
  /**
   * 获取简历筛选列表应聘地点
   * @param {*} param0
   */
  getResumeFilterCitys ({ commit, state }) {
    return request.post(url.deliverys.getResumeFilterCitys)
      .then(res => {
        if (res.data) {
          commit('setResumeFilterCitys', res.data)
        }
      })
  },
  skipTestExam ({ commit, state }, resumeID) {
    return request.get(url.deliverys.skipTestExam, { resumeID })
      .then(res => {
        return res && res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** **************************************** jd_deliverys end *************************************************/
  /**
   * 获取指定简历
   * @param {*} param0
   * @param {*} ID
   */
  loadResume ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let resume = _.find(state.resumes, { 'id': +id })
    if (resume) {
      commit('pushResumes', [resume])
      return resume
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.resumes.GetModel, {
        ID: id
      }).then(res => {
        let resume = Model.Resume.from(res.data)
        commit('pushResumes', [resume])
        return resume
      }).catch((error) => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
    }
  },
  // 加载历史记录
  loadResumeHistory ({ state, commit }, resumeID) {
    return request.get(url.resumes.GetResumeHistory, { id: resumeID })
      .then(res => {
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          if (list[i] instanceof Object) {
            history.push(list[i])
          } else {
            history.push(JSON.parse(list[i]))
          }
        }
        commit('updateResumeViewHistory', { resumeID: resumeID, history: JSON.stringify(history) })
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 编辑历史记录
  editHistory ({ state, commit }, { resumeID, history }) {
    return request.post(url.resumes.EditHistory, { resumeID, history })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return 'none'
      })
  },
  // 删除历史记录
  DeleteHistory ({ state, commit }, { resumeID, history }) {
    return request.post(url.resumes.DeleteHistory, { resumeID, history })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return 'none'
      })
  }, // 获取简历密码
  getResumePW ({ commit, state }, id) {
    return request.get(url.resumes.GetResumePW, { id })
      .then(res => {
        return res && res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** **************************************** jd_resume_invite start *************************************************/
  loadResumeInvites ({ state, commit }, {
    filter,
    query,
    search,
    orderby = 'createTime' } = {}) {
    const condition = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search,
      orderby
    }
    return request.get(url.invites.GetList, condition)
      .then(res => {
        let list = []
        if (res.data) {
          list = Model.ResumeInvite.from(res.data)
        }
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** **************************************** jd_resume_invite end *************************************************/
  /**
 *获取入职人数
 * @param {*} param0
 * @param {*} payload
 */
  getJobNumber ({ state, commit }, payload) {
    let { pushCode, status } = payload
    const _query = [
      { Key: 'PushCode', Value: pushCode, Oper: 'eq' },
      'and',
      { Key: 'Status', Value: status, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    return request.get(url.deliverys.getCount, condition).then(res => {
      return res.data
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },
  /** **************************************** excel 导出数据处理 *************************************************/
  processDataOfExportExcel ({ state, rootState }, { list }) {
    let data = []
    const modellist = _.cloneDeep(list)
    modellist.forEach(item => {
      let newItem = item
      // 处理测评状态
      if (+item.Status < 10) {
        newItem.Status = ''
      } else if (+item.Status === 10) {
        newItem.Status = '待测评'
      } else if (+item.Status === 15) {
        newItem.Status = '测评中'
      } else {
        newItem.Status = '通过'
      }
      // 处理面试时间
      if (item.InterviewTime === '2000-01-01 00:00:00') {
        newItem.InterviewTime = ''
      }
      data.push(newItem)
    })
    return data
  }

}
