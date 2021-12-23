import Vue from 'vue'
export default {
  /**
   *追加招聘计划需求信息
   * @param {*} state
   * @param {*} recruitPlanNeeds
   */
  pushRecruitPlanNeeds (state, recruitPlanNeeds) {
    let newRecruitPlanNeeds = _.differenceBy(recruitPlanNeeds, state.recruitPlanNeeds, 'id')
    state.recruitPlanNeeds.push(...newRecruitPlanNeeds)
  },
  /**
   *更新招聘计划需求信息
   * @param {*} state
   * @param {*} recruitPlanNeed
   */
  updateRecruitPlanNeed (state, recruitPlanNeed) {
    let index = state.recruitPlanNeeds.findIndex(item => +item.id === +recruitPlanNeed.id)
    Vue.set(state.recruitPlanNeeds, index, recruitPlanNeed)
  },
  /**
   *删除指定招聘计划需求信息
   * @param {*} state
   * @param {*} id
   */
  deleteRecruitPlanNeed (state, id) {
    let index = state.recruitPlanNeeds.findIndex(item => item.id === id)
    Vue.delete(state.recruitPlanNeeds, index)
  },
  /**
   *更新招聘计划需求id
   * @param {*} state
   * @param {*} val
   */
  updateNeedID (state, val) {
    state.needID = ''
    state.needID = val
  }
}
