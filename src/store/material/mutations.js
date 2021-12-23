export default {
  /**
   * 更新选择类型
   */
  setListType (state, obj) {
    state.listType = obj
  },
  /**
   * 更新导入数据(解析后的数据)
   */
  updateImportData (state, obj) {
    state.importData = obj
  },
  /**
   * 更新文件信息(导入主表信息)
   */
  updateFile (state, obj) {
    state.file = obj
  },
  // 更新文件上传信息
  updateFileInfo (state, obj) {
    state.file.FileInfo = obj
  },
  /**
   * 更新文件信息(导入主表信息)
   */
  updateExcelFile (state, obj) {
    state.excelFile = obj
  },
  /**
   * 更新文件导入成功与否
   */
  updateIsImport (state, obj) {
    state.isImport = obj
  },
  /**
   * 添加导入主表modelList(集合添加)
   */
  addMatMain (state, { data, type }) {
    data.forEach(item => {
      item.BomTypeName = state.bomNameType[item.BomType]
      item.MatTypeName = state.matType[item.MaterialType]
    })
    if (type === 'data') {
      state.MatMainList.push(...data)
    } else if (type === 'file') {
      state.Files.push(...data)
    }
  },
  /**
   * 添加导入主表modelList(集合添加)
   */
  addMatMainModel (state, { data, type }) {
    data.BomTypeName = state.bomNameType[data.BomType]
    data.MatTypeName = state.matType[data.MaterialType]
    if (type === 'data') {
      state.MatMainList.unshift(data)
    } else if (type === 'file') {
      state.Files.unshift(data)
    }
  },
  /**
   * 更新分页数据
   * @param {*} state
   * @param {*} page
   */
  updatePage (state, { data, nextPage, type }) {
    if (type === 'data') {
      state.mainPage.offset = state.mainPage.offset + data.length
      state.mainPage.nextPageToken = nextPage
    } else if (type === 'file') {
      state.filesPage.offset = state.filesPage.offset + data.length
      state.filesPage.nextPageToken = nextPage
    }
  },
  updateImportType (state, type) {
    state.importType = type
  },
  // 重置列表属性
  resetPageList (state, type) {
    if (type === 'data') {
      state.MatMainList = []
      state.mainPage = { offset: 0, limit: 20, nextPageToken: 0 }
    } else if (type === 'file') {
      state.Files = []
      state.filesPage = { offset: 0, limit: 20, nextPageToken: 0 }
    }
  }
}
