export default {
  getCategoryList: (state, getters) => (category, archived = false) => {
    return _.filter(state.templates, s => {
      return s.archived === archived && !s.deleted && s.objectType === category
    })
  },
  // 获取一个model,要确保已经加载过该model
  template: (state) => (id) => {
    id = Number(id)
    return _.find(state.templates, { id }) || {}
  }
}
