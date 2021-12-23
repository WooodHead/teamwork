export default {
  // 获取一个任务
  tag: state => id => {
    let tag = _.find(state.tags, p => { return p.id === id })
    return tag
  }

}
