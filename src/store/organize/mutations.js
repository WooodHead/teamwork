// import Vue from 'vue'
export default {
  /**
   * 检索条件设置
   * @param {*} state
   * @param {*} payload
   */
  setSearch (state, payload) {
    state.search = payload
  },
  /**
   * 是否已经加载所有数据
   * @param {*} state
   * @param {*} payload
   */
  setLoadedAll (state, payload) {
    state.loadedAll = payload
  },
  /**
   *机构选择组件判断是否已经加载过
   *
   * @param {*} state
   * @param {*} loaded
   */
  setLoadedSelect (state, loaded) {
    state.loadedSelect = loaded
  },
  /**
   * 维护机构数据
   * @param {Object} state 上下文Model
   * @param {Object} organizes 机构数组对象
   */
  updateOrganizes (state, organizes) {
    state.organizes = { ...state.organizes, ...organizes }
    state.selectOrganizes = { ...state.selectOrganizes, ...organizes }
  },
  /**
   * 删除机构
   * @param {Object} state 上下文Model
   * @param {Object} id 机构id
   */
  deleteOrganize (state, ids) {
    state.organizes = _.omit(state.organizes, ids)
    state.selectOrganizes = _.omit(state.selectOrganizes, ids)
  },
  /**
   *下拉数据列表初始化
   *
   * @param {*} state
   * @param {*} organizes
   */
  updateSelectOrganizes (state, organizes) {
    state.selectOrganizes = { ...state.selectOrganizes, ...organizes }
  },
  // 废纸篓（机构）
  addOrganizesTrash (state, organizes) {
    const newOrganizes = _.differenceBy(organizes, state.organizesInTrash, 'id')
    state.organizesInTrash.push(...newOrganizes)
  },
  undeleteOrganizeInTrash (state, id) {
    state.organizesInTrash = state.organizesInTrash.filter(a => a.id !== id)
  }
}
