import { LocalStorage } from 'quasar'
import Model from '@/store/resume/model'
const ResumeView = Model.ResumeView
export default {
  myinfo: () => {
    return LocalStorage.getItem('myself')
  },
  isSeniorManager: (state, getters) => {
    return getters.myinfo.auth.role.isSeniorManager
  },
  isInterviewer: (state, getters) => {
    return getters.myinfo.auth.role.isInterviewer
  },
  isHrOrAdmin: (state, getters) => {
    return getters.myinfo.auth.role.isHRSpecialist || getters.myinfo.auth.role.isSystemAdministrator
  },
  statusFilterdResumeViews: (state) => {
    if (state.selectedStatus === 'inStorage') {
      return state.resumeViews.filter(r => r.inStorage)
    } else {
      const status = state.frontStatus[state.selectedStatus]
      return state.resumeViews.filter(r => status.includes(r.status) && !r.inStorage)
    }
  },
  filterdResumeViews: (state, getters) => {
    let views = getters.statusFilterdResumeViews
    // 搜索条件
    let search = state.search
    if (!_.isEmpty(search)) {
      views = views.filter(view => {
        return view.interviewee.includes(search) ||
          view.email.includes(search) ||
          view.tel.includes(search) ||
          view.jobTitle.includes(search) ||
          view.pushCode.includes(search) ||
          view.interviewTime.includes(search) ||
          view.interviewType.includes(search) ||
          view.skills.includes(search) ||
          // Educations
          view.educations.map(edu => edu.college + edu.major).join().includes(search) ||
          // Projects
          view.projects.map(proj => proj.name + proj.introduction).join().includes(search) ||
          // WorkExperiences
          view.workExperiences.map(work => work.company + work.position).join().includes(search)
      })
    }
    // 多条件
    let querys = getters.resumeViewQuerys.query
    if (!_.isEmpty(querys)) {
      // City,HighestEducation,ExpectedSalary,Languages,Sex
      views = views.filter(view => {
        let newQuery = querys.filter(q => q !== 'and')
        let includes = newQuery.map(obj => {
          let viewKey = ResumeView.FieldsConvertToFront()[obj['Key']]
          if (viewKey === 'languages') {
            return _.intersection(obj['Value'], view[viewKey].map(lan => lan.level)).length > 0
          } else if (obj['Oper'] === 'in') {
            return obj['Value'] && obj['Value'].split(',').includes(view[viewKey])
          } else {
            return obj['Value'] === view[viewKey]
          }
        })
        return !includes.includes(false)
      })
    }
    return views
  },
  /**
   * 待筛选 - 是否有内推码（降序） + 投递时间（升序）
   * 待面试 - 面试时间（升序）+ 成绩（降序）+ModifyTime（降序）
   * 已入职、已淘汰入库 - ModifyTime（降序）
   * 默认 - 成绩（降序）+ ModifyTime（降序）
   */
  sortedResumeViews: (state, getters) => {
    if (state.selectedStatus === 'waitScreening') {
      return getters.sortedWaitScreeningViews(getters.filterdResumeViews)
    } else if (state.selectedStatus === 'waitInterview') {
      let views1 = []
      if (getters.isInterviewer && !getters.isHrOrAdmin) {
        let myResumeViews = getters.filterdResumeViews.filter(view => view.interviewerID === getters.myinfo.id)
        views1 = getters.sortedWaitInterviewViews(myResumeViews)
      }
      let views2 = _.difference(getters.filterdResumeViews, views1)
      return _.concat(views1, getters.sortedWaitInterviewViews(views2))
    } else if (['inService', 'inStorage'].includes(state.selectedStatus)) {
      return _.orderBy(getters.filterdResumeViews, ['modifyTime'], ['desc'])
    } else {
      return _.orderBy(getters.filterdResumeViews, ['result', 'modifyTime'], ['desc', 'desc'])
    }
  },
  sortedWaitScreeningViews: (state, getters) => (views) => {
    let noPushCodeViews = views.filter(view => _.isEmpty(view.pushCode))
    let orderNoPushCodeViews = _.orderBy(noPushCodeViews, ['modifyTime'], ['asc'])
    let hasPushCodeViews = _.difference(views, noPushCodeViews)
    let orderHasPushCodeViews = _.orderBy(hasPushCodeViews, ['modifyTime'], ['asc'])
    return _.concat(orderHasPushCodeViews, orderNoPushCodeViews)
  },
  sortedWaitInterviewViews: (state, getters) => (views) => {
    let noInterviewTimeViews = views.filter(view => view.interviewTime === '2000-01-01 00:00:00')
    let orderNoInterviewTimeViews = _.orderBy(noInterviewTimeViews, ['result', 'modifyTime'], ['desc', 'desc'])
    let hasInterviewTimeViews = _.difference(views, noInterviewTimeViews)
    let orderHasInterviewTimeViews = _.orderBy(hasInterviewTimeViews, ['interviewTime', 'result', 'modifyTime'], ['desc', 'desc', 'desc'])
    return _.concat(orderHasInterviewTimeViews, orderNoInterviewTimeViews)
  },
  // 简历卡片列表
  resumeViews: (state, getters) => {
    return getters.sortedResumeViews
  },
  // 单个卡片
  resumeView: (state) => (resumeDeliveryID) => {
    return state.resumeViews.find(view => view.resumeDeliveryID === resumeDeliveryID) || {}
  },
  // 单个简历
  resume: (state) => (id) => {
    return _.find(state.resumes, { id }) || {}
  },
  // 获取投递状态名
  getStatusKey: (state) => (resumeDeliveryID) => {
    if (resumeDeliveryID !== 0) {
      let ResumeView = state.resumeViews.find(view => view.resumeDeliveryID === resumeDeliveryID)
      const endStatus = state.endStatus
      return Object.keys(endStatus).find(k => endStatus[k] === ResumeView.status)
    } else {
      return ''
    }
  },
  // 获取前台页面状态
  getFrontStatusKey: (state) => (resumeDeliveryID) => {
    if (resumeDeliveryID !== 0) {
      let ResumeView = state.resumeViews.find(view => view.resumeDeliveryID === resumeDeliveryID)
      if (ResumeView.inStorage) {
        return 'inStorage'
      } else {
        const frontStatus = state.frontStatus
        return Object.keys(frontStatus).find(k => frontStatus[k].includes(ResumeView.status))
      }
    } else {
      return ''
    }
  },
  getNextStatus: () => (status) => {
    return {
      0: 10, // 待筛选 -> 待测评
      10: 15, // 待测评 -> 测评中
      15: 20, // 测评中 -> 待一邀
      20: 30, // 待一邀 -> 待一面
      30: 40, // 待一面 -> 一面中
      40: 60, // 一面中 -> 待二邀
      60: 70, // 待二邀 -> 待二面
      70: 80, // 待二面 -> 二面中
      80: 90, // 二面中 -> 待offer
      90: 100// 待offer -> 待签约
    }[status]
  },
  recruitingPlans: (state) => {
    return state.recruitingPlans
  },
  recruitingCitys: (state) => {
    let cityValues = []
    state.queryList.map(item => {
      if (item.label === '应聘地点') {
        item.value.map(q => {
          cityValues.push(q.value)
        })
      }
    })
    return _.union(cityValues)
  },
  queryList: state => {
    switch (state.selectedStatus) {
      case 'inService':
        state.queryList[0].value = state.inServiceCitys
        break
      case 'inStorage':
        state.queryList[0].value = state.inStorageCitys
        break
      default:
        state.queryList[0].value = state.commonCitys
        break
    }
    return state.queryList
  },
  query: state => {
    return state.query
  },
  search: state => {
    return state.search
  },
  // 组装query和search参数
  resumeViewQuerys: (state) => {
    let params = {}
    // 状态条件
    let statusQuery = []
    if (state.selectedStatus === 'inStorage') {
      statusQuery.push({ Key: 'InStorage', Value: 1, Oper: 'eq' })
    } else {
      const frontStatus = state.frontStatus
      let query1 = []
      frontStatus[state.selectedStatus].map(status => {
        query1.push({ Key: 'Status', Value: status, Oper: 'eq' })
        query1.push('or')
      })
      query1.pop()
      statusQuery.push(query1)
      statusQuery.push('and')
      statusQuery.push({ Key: 'InStorage', Value: 0, Oper: 'eq' })
    }
    // 多选条件
    let multiQuery = []
    if (!_.isEmpty(state.query)) {
      let group = _.groupBy(state.query, 'name')
      Object.keys(group).map(key => {
        let arr = group[key]
        if (arr.length) {
          let values = []
          arr.map(obj => {
            values.push(obj.value)
          })
          multiQuery.push({ Key: key, Value: values.join(), Oper: 'in' })
          multiQuery.push('and')
        }
      })
    }
    multiQuery.pop()
    // 组合
    let query = []
    query.push(...statusQuery)
    if (statusQuery.length && multiQuery.length) {
      query.push('and')
    }
    query.push(...multiQuery)
    params.query = query
    params.search = state.search
    params.onlyInterviewerID = !(state.selectedStatus === 'waitScreening')
    return params
  },
  // 组装简历数量统计query和search参数
  statusCountQuery: (state) => {
    let params = {}
    let query = []
    // 多选条件
    if (!_.isEmpty(state.query)) {
      let group = _.groupBy(state.query, 'name')
      Object.keys(group).map(key => {
        let arr = group[key]
        if (arr.length) {
          let values = []
          arr.map(obj => {
            values.push(obj.value)
          })
          query.push({ Key: key, Value: values.join(), Oper: 'in' })
          query.push('and')
        }
      })
    }
    query.pop()

    params.query = query
    params.search = state.search
    return params
  },
  // 仪表盘相关
  boardData: (state) => (uid) => {
    return state.boardData[uid]
  },
  dashDayData: (state) => (uid) => {
    return state.dashDayData[uid]
  },
  dashProcessData: (state) => (uid) => {
    return state.dashProcessData[uid]
  },
  dashSourceData: (state) => (uid) => {
    return state.dashSourceData[uid]
  },
  dashFlowData: (state) => (uid) => {
    return state.dashFlowData[uid]
  },
  resumeDashboardType: (state) => {
    return [
      {
        key: 'ResumeDashboardProcess',
        label: '招聘流程漏斗图',
        width: 'col-12 col-sm-6'
      },
      {
        key: 'ResumeDashboardDeliveryTrend',
        label: '每日简历投递量趋势图',
        width: 'col-12 col-sm-6'
      },
      {
        key: 'ResumeEduDistribution',
        label: '所有应聘者学历分布图',
        width: 'col-12 col-sm-6'
      },
      {
        key: 'ResumeDashboardFlow',
        label: '院校类型、学历、岗位类别流向图',
        width: 'col-12 col-sm-6'
      }
    ]
  },
  // 可操作的菜单项
  listMenus: (state, getters) => {
    if (getters.isHrOrAdmin) {
      return state.authListMenus['hrOrAdmin'][state.selectedStatus]
    } else if (getters.isInterviewer) {
      return state.authListMenus['interviewer'][state.selectedStatus]
    } else {
      return []
    }
  }
}
