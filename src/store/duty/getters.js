export default {
  // 提供外部调用的转换器
  dutys: (_state, getters) => {
    return getters.dutysFiltered
  },
  // 选择组件数据
  selectDutys: state => {
    let arry = _.values(state.selectDutys)
    return _.orderBy(arry, ['level'], ['desc'])
  },
  /**
   * 前端筛选
   */
  dutysFiltered: state => {
    let search = state.search
    if (_.isObject(search)) {
      const dutyIds = search.dutyIds
      search = search.search
      return _.filter(_.values(state.dutys), duty =>
        duty.name.toLowerCase().includes(search.toLowerCase()) ||
        dutyIds.includes(duty.id)
      )
    } else {
      if (search) {
        return _.filter(_.values(state.dutys), duty =>
          duty.name.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return _.values(state.dutys)
      }
    }
  }
}
