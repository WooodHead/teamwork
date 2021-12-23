import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { date, LocalStorage } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
import RecruitPlan from '@/store/recruit-plan/model'
const url = {
  getModel: 'recruitPlans/getmodel',
  add: 'recruitPlans/add',
  update: 'recruitPlans/update',
  updatefields: 'recruitPlans/updatefields',
  delete: 'recruitPlans/delete',
  getList: 'recruitPlans/getlist',
  getPageList: 'recruitPlans/getpagelist',
  getCount: 'recruitPlans/getcount',
  close: 'recruitPlans/close',
  start: 'recruitPlans/start',
  addRecruitPlanJobAction: 'recruitPlans/addRecruitPlanJobAction'
}
export default {
  // 获取招聘计划列表信息
  loadRecruitPlans ({ commit, state }, { byPage = false, query, sort = '', orderby = '' }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      sort: sort,
      orderby: orderby
    }).then(res => {
      let recruitPlans = RecruitPlan.from(res.data)
      commit('pushRecruitPlans', recruitPlans)
      commit('updatePage',
        {
          offset: state.page.offset + recruitPlans.length,
          limit: state.page.limit
        })
      return recruitPlans
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *获取指定招聘计划信息
   * @param {*} param0
   * @param {*} id
   */
  loadRecruitPlan ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let recruitPlan = _.find(state.recruitPlans, { 'id': +id })
    if (recruitPlan) {
      return recruitPlan
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let recruitPlan = RecruitPlan.from(res.data)
        commit('pushRecruitPlans', [recruitPlan])
        return recruitPlan
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
        return new Interviewer()
      })
    }
  },
  /**
   *新增一个招聘计划
   * @param {*} param0
   * @param {*} payload
   */
  addRecruitPlan ({ commit, dispatch }, payload) {
    let recruitPlan = RecruitPlan.to(payload)
    return request.post(url.add, recruitPlan).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      // 更新缓存列表
      commit('pushRecruitPlans', [recruitPlan])
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *更新招聘计划
   * @param {*} param0
   * @param {*} payload
   */
  updateRecruitPlan ({ commit, dispatch }, payload) {
    let recruitPlan = RecruitPlan.to(payload)
    return request.put(url.update, recruitPlan).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      commit('updateRecruitPlan', recruitPlan)
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *删除指定招聘计划
   * @param {*} param0
   * @param {*} id
   */
  deleteRecruitPlan ({ state, commit, dispatch }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      commit('deleteRecruitPlan', id)
      this.$router.push({
        name: 'recruitPlan'
      })
      return true
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  // 开始招聘计划
  startRecruitPlan ({ state, commit }, id) {
    return request.get(url.start, { id: id }).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      commit('updateRecruitPlan', recruitPlan)
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  // 关闭招聘计划
  closeRecruitPlan ({ state, commit }, id) {
    return request.get(url.close, { id }).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      commit('updateRecruitPlan', recruitPlan)
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  // 更新招聘计划岗位动态
  addRecruitPlanJobAction ({ state, commit }, payload) {
    return request.put(url.addRecruitPlanJobAction, payload)
  },
  // 更新招聘计划人数
  updateNumbers ({ state, commit }, payload) {
    let param = {
      id: Number(payload.id),
      detail: payload.detail
    }
    let params = RecruitPlan.to(param)
    return request.put(url.updatefields, params).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      commit('updateRecruitPlan', recruitPlan)
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
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
   *归档一个招聘计划
   * @param {*} param0
   * @param {*} ID
   * @returns
   */
  archiveRecruitPlan ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      Id: ID,
      Archived: 1,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      ArchiveBy: LocalStorage.getItem('myself').name
    }).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      // 更新缓存列表
      commit('updateRecruitPlan', recruitPlan)
      // 更新归档数量
      dispatch('loadArchivedCount')
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *解档一个招聘计划
   * @param {*} param0
   * @param {*} ID
   * @returns
   */
  unarchiveRecruitPlan ({ commit, dispatch }, ID) {
    return request.put(url.updatefields, {
      Id: ID,
      Archived: 0,
      ArchiveTime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      ArchiveBy: LocalStorage.getItem('myself').name
    }).then(res => {
      let recruitPlan = RecruitPlan.from(res.data)
      // 更新缓存列表
      commit('updateRecruitPlan', recruitPlan)
      // 更新归档数量
      dispatch('loadArchivedCount')
      return recruitPlan
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return {}
    })
  }
}
