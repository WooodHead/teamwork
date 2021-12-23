export default {
  // 获取一个讨论对象
  comment: state => id => {
    return _.find(state.comments, p => { return p.id === id })
  },
  // 获取所有讨论数据
  comments: (state, getters) => ({
    objectID = state.objectID,
    objectType = state.objectType
  } = {}) => {
    let comments = _.filter(state.comments, p => { return p.objectID === +objectID && p.objectType === objectType })
    return _.orderBy(comments, ['id'])
  }
}
