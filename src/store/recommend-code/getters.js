export default {
  // 获取一个资源项
  recommendCode: (state, _getters, _rootState, rootGetters) => (
    category,
    id
  ) => {
    const categorys = _.keyBy(state.categorys, 'name')
    if (categorys[category].custom) {
      return _.find(state.items[category], p => {
        return p.id === id
      })
    } else {
      return rootGetters[`${category}/${category}`](+id)
    }
  },

  /** 前端筛选模式 */
  recommendCodesFiltered: state => {
    const search = state.search
    if (search && search.trim() !== '') {
      return _.filter(
        state.recommendCodes,
        item =>
          item.owner.toLowerCase().includes(search.toLowerCase()) ||
          item.ownerTel.toLowerCase().includes(search.toLowerCase()) ||
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.notes.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return state.recommendCodes
    }
  },

  // 获取一个资源列表
  recommendCodes: (_state, getters) => {
    return getters.recommendCodesFiltered
  },

  /**
   * 检索
   * @param {*} state
   */
  search: state => {
    return state.search
  },

  // 组装排行榜数组
  rankingList: state => (codeType, rankType) => {
    if (_.isEmpty(state.recommendCodes)) {
      return
    }
    let filterC = _.filter(state.recommendCodes, ele => {
      return ele.type === codeType
    })
    let set = new Set()
    let rankingList = []
    _.forEach(filterC, ele => {
      set.add(ele.owner)
    })
    for (let o of set) {
      let sr = _.filter(filterC, ele => {
        return ele.owner === o
      })
      let countTotal = sr.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0
      )
      let jobTotal = sr.reduce(
        (accumulator, currentValue) => accumulator + currentValue.jobNumber,
        0
      )
      rankingList.push({
        name: o,
        deliverNumber: countTotal,
        jobNumber: jobTotal
      })
    }
    rankingList.sort(function (a, b) {
      return a[rankType] - b[rankType]
    })
    let len = rankingList.length
    return rankingList.splice(len - 10, len)
  }
}
