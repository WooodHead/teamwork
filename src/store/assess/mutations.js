import Vue from 'vue'
export default {
  /**
   * 将评估数据添加到前端allAssess中
   * @param {Object} state
   * @param {Object} arrayAssess 商机评估数组
   */
  addAssess (state, arrayAssess) {
    const newArrayAssess = _.differenceBy(arrayAssess, state.allAssess, 'id')
    state.allAssess.push(...newArrayAssess)
  },
  /**
   * 下拉数据是否已加载
   *
   * @param {*} state
   * @param {*} payload
   */
  setLoadedSelect (state, payload) {
    state.loadedSelect = payload
  },
  /**
   * 设置评估资源类型
   * @param {*} state
   * @param {*} value
   */
  setCategory (state, value) {
    state.s_category = value
  },
  /**
     * 设置评估资源类型ID
     * @param {*} state
     * @param {*} value
     */
  setObjectID (state, value) {
    state.s_objectID = value
  },
  /**
   * 更新商机评估
   * @param {*} state
   * @param {*} assess
   */
  updateAssess (state, assess) {
    let index = state.allAssess.findIndex(item => item.id === assess.id)
    Vue.set(state.allAssess, index, assess)
  },
  /**
   * 更新商机评估:包括添加和修改的自动判断
   * @param {*} state
   * @param {*} assess
   */
  updateAssessExt (state, assess) {
    // 更新allAssess
    const indexOfItem = _.findIndex(state.allAssess, { id: assess.id })
    indexOfItem >= 0 ? Vue.set(state.allAssess, indexOfItem, assess) : state.allAssess.push(assess)
  },
  /**
   * 删除商机评估
   *
   * @param {*} state
   * @param {*} id
   */
  deleteAssess (state, id) {
    Vue.delete(state.allAssess, _.findIndex(state.allAssess, { id }))
    Vue.delete(state.selectAssess, id)
  },
  /**
   * 排序设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSort (state, payload) {
    state.sort = payload
  },
  /**
   * 检索设定
   *
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 是否分页
   * @param {*} state
   * @param {*} payload
   */
  setByPage (state, payload) {
    state.byPage = payload
  },
  /**
   * 分页对象
   * @param {*} state
   * @param {*} payload
   */
  setPage (state, payload) {
    if (payload.nextPageToken === -1) {
      payload.offset = 0
    }
    Object.assign(state.page, payload)
  },
  /**
   * 首页展示方式
   * @param {*} state
   * @param {*} value
   */
  setListStyle (state, payload) {
    state.listStyle = payload
  },
  /**
   * 设置商机评估列表类型（评估、评估归档）
   * @param {*} state
   * @param {*} value
   */
  setListType (state, value) {
    if (['archivedAssess', 'myArchivedAssess'].includes(value)) {
      state.isArchivedList = true
    } else {
      state.isArchivedList = false
    }
  },
  /**
   * 当前数据页类别
   * @param {*} state
   * @param {*} payload
   */
  setListPageType (state, payload) {
    state.listPageType = payload
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  /**
   * 归档的商机评估数量
   * @param {*} state
   * @param {*} count
   */
  setArchivedCount (state, count) {
    state.archivedCount = count
  }

}
