export default {
  // 获取一个招聘计划,要确保已经加载过该招聘计划
  recruitPlan: (state) => (id) => {
    id = Number(id)
    return _.find(state.recruitPlans, { id }) || {}
  },
  recruitPlans: state => {
    // 模糊匹配
    let tmpRecruitPlans = state.recruitPlans.sort((a, b) => {
      return a.closed - b.closed
    })
    if (state.search) {
      tmpRecruitPlans = tmpRecruitPlans.filter(item => {
        let str = item.title
        return str.indexOf(state.search) !== -1
      })
    }
    return tmpRecruitPlans
  },
  
  search: state => {
    return state.search
  }
}
