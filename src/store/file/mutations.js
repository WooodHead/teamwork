import Vue from 'vue'
export default {
  /**
   * 更新列表
   * @param {*} state
   * @param {*} teams
   */
  setFiles (state, files) {
    state.files = files
  },
  /**
   * 尾部追加列表
   * @param {*} state
   * @param {*} files
   */
  pushFiles (state, files) {
    let newFiles = _.differenceBy(files, state.files, 'id')
    state.files.push(...newFiles)
  },
  /**
   * 更新文件（一般用于列表页的更新）
   * @param {*} state
   * @param {*} file 文件Model
   */
  updateFile (state, file) {
    let index = state.files.findIndex(item => item.id === file.id)
    Vue.set(state.files, index, file)
  },
  /**
   * 删除文件
   * @param {*} state
   * @param {*} ID 类别ID
   */
  deleteFile (state, id) {
    let index = state.files.findIndex(item => item.id === id)
    Vue.delete(state.files, index)
  },
  /**
   * 设置检索关键词
   * @param {*} state
   * @param {*} value
   */
  setSearch (state, value) {
    state.search = value
  },
  /**
   * 设置排序
   * @param {*} state
   * @param {*} value lodash sortBy接受的参数
   */
  setSort (state, value) {
    state.sort = value
  },
  /**
   * 设置是否分页
   * @param {*} state
   * @param {*} value
   */
  setByPage (state, value) {
    state.byPage = value
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  visitUpdatePage (state, page) {
    Object.assign(state.visitRecordPage, page)
  },
  downloadUpdatePage (state, page) {
    Object.assign(state.downloadRecordPage, page)
  },
  visitPushFiles (state, files) {
    let newFiles = _.differenceBy(files, state.visitRecords, 'id')
    state.visitRecords.push(...newFiles)
  },
  downloadPushFiles (state, files) {
    let newFiles = _.differenceBy(files, state.downloadRecords, 'id')
    state.downloadRecords.push(...newFiles)
  }

}
