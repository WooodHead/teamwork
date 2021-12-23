import Vue from 'vue'
export default {
  // 尾部追加列表
  pushResumes (state, resumes) {
    let newResumes = _.differenceBy(resumes, state.resumes, 'id')
    let updateResumes = _.differenceBy(resumes, newResumes, 'id')
    state.resumes.push(...newResumes)
    updateResumes.map(view => {
      let index = _.findIndex(state.resumes, item => item.resumeDeliveryID === view.resumeDeliveryID)
      Vue.set(state.resumes, index, view)
    })
  },
  pushResumeViews (state, resumes) {
    let newResumeViews = _.differenceBy(resumes, state.resumeViews, 'resumeDeliveryID')
    let updateResumeViews = _.differenceBy(resumes, newResumeViews, 'resumeDeliveryID')
    state.resumeViews.push(...newResumeViews)
    updateResumeViews.map(view => {
      let index = _.findIndex(state.resumeViews, item => item.resumeDeliveryID === view.resumeDeliveryID)
      Vue.set(state.resumeViews, index, view)
    })
  },
  updateResumeView (state, data) {
    let index = _.findIndex(state.resumeViews, item => item.resumeDeliveryID === data.resumeDeliveryID)
    Vue.set(state.resumeViews, index, data)
  },
  updateResumeViewHistory (state, { resumeID, history }) {
    _.each(state.resumeViews, function (resumeView) {
      if (+resumeID === +resumeView.resumeID) {
        resumeView.history = history
      }
    })
  },
  updateResumeViewFields (state, { resumeDeliveryID, fields }) {
    let view = _.find(state.resumeViews, { 'resumeDeliveryID': +resumeDeliveryID })
    view && Object.assign(view, fields)
  },
  setResumeInterviewerID (state, { resumeDeliveryID, interviewerID }) {
    let view = _.find(state.resumeViews, { 'resumeDeliveryID': +resumeDeliveryID })
    view.interviewerID = interviewerID
  },
  updateResumePush (state, resumeDeliveryID) {
    Vue.delete(state.resumeViews, state.resumeViews.findIndex(a => a.resumeDeliveryID === resumeDeliveryID))
  },
  updateResumeResult (state, { resumeDeliveryID, result }) {
    let view = _.find(state.resumeViews, { 'resumeDeliveryID': +resumeDeliveryID })
    view.retult = result
  },
  // 发起邀约后更新简历状态
  updateResumeAfterInvite (state, { ResumeDeliveryIDs }) {
    let views = ResumeDeliveryIDs.map(id => state.resumeViews.find(view => +view.resumeDeliveryID === +id))
    views.map(view => {
      view.status = state.endStatus.waitFirstInterview
      view.interviewTime = '2000-01-01 00:00:00'
      view.interviewPlace = ''
      view.interviewType = ''
    })
  },
  StorageResumes (state, ids) {
    let views = ids.map(id => state.resumeViews.find(view => view.resumeDeliveryID === +id))
    views.map(view => (view.inStorage = 1))
  },
  // 设置分页信息
  setStatePage (state, page) {
    Object.assign(state.page, page)
  },
  // 设置当前选择查看的应聘状态（待邀约、待面试等）
  setSelectedStatus (state, status) {
    state.selectedStatus = status
  },
  setStatusCount (state, count) {
    state.statusCount = count
  },
  setRecruitingPlans (state, plans) {
    state.recruitingPlans = plans
    let citys = state.recruitingPlans.map(plan => plan.city.split('、'))
    state.queryList.map(query => {
      if (query.label === '应聘地点') {
        let cityValues = []
        _.union(_.flatten(citys)).map(city => {
          cityValues.push({
            label: city, value: city, name: 'City'
          })
        })
        query.value = cityValues
      }
    })
  },
  // 仪表盘--漏斗分析
  setDashProcessData (state, model) {
    Vue.set(state.dashProcessData, model.uid, model.data)
  },
  // 仪表盘--应聘者来源分析
  setDashSourceData (state, model) {
    Vue.set(state.dashSourceData, model.uid, model.data)
  },
  // 仪表盘--每日投递量统计
  setDashDayData (state, model) {
    Vue.set(state.dashDayData, model.uid, model.data)
  },
  // 仪表盘--院校流向
  setDashFlowData (state, model) {
    Vue.set(state.dashFlowData, model.uid, model.data)
  },
  // 设置分页信息
  setDashboardStatePage (state, page) {
    Object.assign(state.dashboardPage, page)
  },
  resetDashboardStatePage (state) {
    Object.assign(state.dashboardPage, {
      offset: 0,
      limit: 12,
      total: 0,
      nextPageToken: -1
    })
  },
  setDashboardData (state, data) {
    state.boardData = data
  },
  setSearch (state, payload) {
    state.search = payload
  },
  setQuery (state, payload) {
    state.query = payload
  },
  // 简历筛选列表应聘地点
  setResumeFilterCitys (state, citys) {
    // 转数组
    state.commonCitys = (citys.commonCitys && citys.commonCitys !== '') ? citys.commonCitys.split(',') : []
    state.inServiceCitys = (citys.inServiceCitys && citys.inServiceCitys !== '') ? citys.inServiceCitys.split(',') : []
    state.inStorageCitys = (citys.inStorageCitys && citys.inStorageCitys !== '') ? citys.inStorageCitys.split(',') : []
    // 转对象
    state.commonCitys = _.map(state.commonCitys, city => {
      return {
        label: city, value: city, name: 'City'
      }
    })
    state.inServiceCitys = _.map(state.inServiceCitys, city => {
      return {
        label: city, value: city, name: 'City'
      }
    })
    state.inStorageCitys = _.map(state.inStorageCitys, city => {
      return {
        label: city, value: city, name: 'City'
      }
    })
  },
  pushDashboardResumeViews (state, resumes) {
    let newResumeViews = _.differenceBy(resumes, state.dashboardResumeViews, 'resumeDeliveryID')
    let updateResumeViews = _.differenceBy(resumes, newResumeViews, 'resumeDeliveryID')
    state.dashboardResumeViews.push(...newResumeViews)
    updateResumeViews.map(view => {
      let index = _.findIndex(state.dashboardResumeViews, item => item.resumeDeliveryID === view.resumeDeliveryID)
      Vue.set(state.dashboardResumeViews, index, view)
    })
  },
  initDashboardViews (state) {
    state.dashboardProcessViews = []
    state.dashboardSourceViews = []
    state.dashboardFlowViews = []
  },
  pushDashboardProcessViews (state, views) {
    const newViews = _.differenceBy(views, state.dashboardProcessViews, 'resumeDeliveryID')
    state.dashboardProcessViews.push(...newViews)
  },
  pushDashboardSourceViews (state, views) {
    const newViews = _.differenceBy(views, state.dashboardSourceViews, 'resumeDeliveryID')
    state.dashboardSourceViews.push(...newViews)
  },
  pushDashboardFlowViews (state, views) {
    const newViews = _.differenceBy(views, state.dashboardFlowViews, 'resumeDeliveryID')
    state.dashboardFlowViews.push(...newViews)
  },
  setListStyle (state, value) {
    state.dashboardDetailListStyle = value
  },
  setDashboardDetailSort (state, value) {
    state.dashboardDetailSort = value
  },
  setDashboardDetailOrder (state, value) {
    state.dashboardDetailOrder = value
  }
}
