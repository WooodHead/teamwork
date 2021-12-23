export default {
  results: (state, getters) => {
    let list = _.orderBy(state.results, ['createTime'], ['desc'])
    return list
  },
  // 搜索结果
  result: state => id => {
    return _.find(state.messages, { id })
  },
  resultsSorted: (state, getters) => {
    return getters.results.sort((a, b) => {
      return String(a.modifyTime).localeCompare(String(b.modifyTime))
    })
  }
}
