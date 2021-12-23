export default {
  // 通过招聘计划id获取招聘计划需求信息
  byPlanIDRecruitPlanNeed: state => (planID) => {
    let tmpRecruitPlanNeeds = state.recruitPlanNeeds.filter(item => {
      return +item.planID === +planID
    })
    return tmpRecruitPlanNeeds
  }
}
