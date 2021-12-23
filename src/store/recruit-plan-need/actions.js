import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import RecruitPlanNeed from '@/store/recruit-plan-need/model'
const url = {
  getModel: 'recruitPlanNeeds/getmodel',
  add: 'recruitPlanNeeds/add',
  update: 'recruitPlanNeeds/update',
  updatefields: 'recruitPlanNeeds/updatefields',
  delete: 'recruitPlanNeeds/delete',
  getList: 'recruitPlanNeeds/getlist',
  getPageList: 'recruitPlanNeeds/getpagelist',
  getCount: 'recruitPlanNeeds/getcount',
  getUsableList: 'recruitPlanNeeds/getusablelist'
}
export default {
  /**
   *获取招聘计划需求列表信息
   * @param {*} param0
   * @param {*} param1
   */
  loadRecruitPlanNeeds ({ commit, state }, { byPage = false, query, sort = '', orderby = '' }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      sort: sort,
      orderby: orderby
    }).then(res => {
      let recruitPlanNeeds = RecruitPlanNeed.from(res.data)
      commit('pushRecruitPlanNeeds', recruitPlanNeeds)
      return recruitPlanNeeds
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *获取指定招聘计划需求信息
   * @param {*} param0
   * @param {*} id
   */
  loadRecruitPlanNeed ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let recruitPlanNeed = _.find(state.recruitPlanNeeds, { 'id': +id })
    if (recruitPlanNeed) {
      return recruitPlanNeed
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let recruitPlanNeed = RecruitPlanNeed.from(res.data)
        commit('pushRecruitPlanNeeds', [recruitPlanNeed])
        return recruitPlanNeed
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
        return false
      })
    }
  },
  /**
   *获取进行中的招聘计划需求列表信息
   * @param {*} param0
   * @param {*} param1
   */
  loadUsableRecruitPlanNeeds ({ commit, state }) {
    return request.get(url.getUsableList).then(res => {
      let recruitPlanNeeds = RecruitPlanNeed.from(res.data)
      return recruitPlanNeeds
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return []
    })
  },
  /**
   *新增一个招聘计划需求信息
   * @param {*} param0
   * @param {*} payload
   */
  addRecruitPlanNeed ({ commit, dispatch }, payload) {
    let recruitPlanNeed = RecruitPlanNeed.to(payload)
    return request.post(url.add, recruitPlanNeed).then(res => {
      let recruitPlanNeed = RecruitPlanNeed.from(res.data)
      // 更新缓存列表
      commit('pushRecruitPlanNeeds', [recruitPlanNeed])
      return recruitPlanNeed
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.needExist`))
      return false
    })
  },
  /**
   *更新一个招聘计划需求信息
   * @param {*} param0
   * @param {*} payload
   */
  updateRecruitPlanNeed ({ commit, dispatch }, payload) {
    let recruitPlanNeed = RecruitPlanNeed.to(payload)
    return request.put(url.update, recruitPlanNeed).then(res => {
      if (res.data) {
        let recruitPlanNeed = RecruitPlanNeed.from(res.data)
        commit('updateRecruitPlanNeed', recruitPlanNeed)
        return recruitPlanNeed
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.needExist`))
      return false
    })
  },
  /**
   * 更新招聘计划指定字段
   * @param {*} param0
   * @param {*} payload
   */
  updateRecruitPlanNeedFild ({ commit, dispatch }, payload) {
    let recruitPlanNeed = RecruitPlanNeed.to(payload)
    return request.put(url.updatefields, recruitPlanNeed).then(res => {
      if (res.data) {
        let recruitPlanNeed = RecruitPlanNeed.from(res.data)
        commit('updateRecruitPlanNeed', recruitPlanNeed)
        return recruitPlanNeed
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.needExist`))
      return false
    })
  },
  /**
   *删除指定招聘
   * @param {*} param0
   * @param {*} id
   */
  deleteRecruitPlanNeed ({ state, commit, dispatch }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      commit('deleteRecruitPlanNeed', id)
      return true
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`recruitPlan.error.${error.userMessage}`))
      return false
    })
  }

}
