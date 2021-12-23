export default {
  // 项目/团队/产品详情页等人员判断是否在职
  membersFilterInService: (_state, _getters, rootState) => (members) => {
    let allPersons = rootState.person.selectPersons
    return _.filter(members.map(r => _.toNumber(r)), f => allPersons[f] && allPersons[f].isInService)
  },
  members: state => {
    return state.members
  }
}
