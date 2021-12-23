import request from '@/boot/axios'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import { upload } from '@/boot/file'

const url = {
  isRepeat: 'MatImportMain/IsFileRepeat',
  addExcel: 'MatImportMain/AddExcel',
  isMaterial: 'Material/IsMaterial',
  add: 'Material/Add',
  getData: 'Material/GetAnalyzeData',
  addBatchMat: 'Material/AddBatch',
  addBatchlessMat: 'Material/AddLessBatch',
  importMatData: 'Material/ImportExcel',
  getPageList: 'MatImportMain/GetPageList',
  getList: 'MatImportMain/getList',
  getCompareData: 'MatImportMain/MaterialCompare',
  getBomList: 'MatImportMain/GetBomList',
  deleteBomData: 'MatImportMain/Delete'
}
export default {
  // 判断文件名称是否重复
  IsRepeat ({ commit }, fileName) {
    return request.get(url.isRepeat, { FileName: fileName }).then(res => {
      return res.data
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return true
    })
  },
  // 判断物料是否存在
  IsMaterial ({ commit }, Mat) {
    let info = { Name: Mat.Name, Code: Mat.Code, DeployCode: Mat.DeployCode }
    return request.put(url.isMaterial, info).then(res => {
      return res.data
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  // 添加物料
  addMaterial ({ commit }, model) {
    return request.post(url.add, model).then(res => {
      // 这里维护物料库表中的对应的state值，现阶段未有相关维护，后期扩展
      return res.data
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  // 获取解析后的导入数据
  getAnalyzeImportData ({ commit }, modelList) {
    return request.put(url.getData, modelList).then(res => {
      if (res.data !== null) {
        commit('updateImportData', res.data)
      }
      return true
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  // 批量插入基本物料数据
  addBatchMat ({ commit }, modelList) {
    return request.post(url.addBatchMat, modelList).then(res => {
      // 更新导入数据
      return res.data
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  // 批量插入物料库数据
  // addBatchMat ({ commit }, { modelList, type }) {
  //   // 高版本，系统版本递增1
  //   if (type === 'high') {
  //     modelList.forEach(item => {
  //       item.SysVersion = item.MaxSysVersion + 1
  //     })
  //   }
  //   return request.post(url.addBatchMat, modelList).then(res => {
  //     if (res.data > 0) {
  //       if (type === 'new') {
  //       } else if (type === 'high') {
  //       }
  //       return true
  //     }
  //   }).catch(error => {
  //     error.userMessage && showWarningMessage(error.userMessage)
  //     return false
  //   })
  // },
  addBatchlessMat ({ commit }, modelList) {
    return request.post(url.addBatchlessMat, modelList).then(res => {
      if (res.data) {
        // 低版本插入成功
        return true
      }
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  // 上传文件
  uploadFile ({ state, commit, dispatch }) {
    commit('updateIsImport', false)
    upload('material', [state.excelFile], process => { }, result => {
      // result： 上传文件后的结果
      if (result.length) {
        commit('updateFileInfo', result[0])
        dispatch('importExcelData')
      } else {
        commit('updateIsImport', false)
        showWarningMessage('文件上传失败')
      }
    })
  },

  // 导入数据(主表与子表及文件信息)
  importExcelData ({ state, commit }) {
    const info = { model: state.file, modelList: state.importData }
    return request.post(url.addExcel, info).then(res => {
      if (res) {
        commit('updateIsImport', true)
        commit('addMatMainModel', { data: state.file, type: 'data' })
        showSuccessMessage('导入并上传成功')
      } else {
        commit('updateIsImport', false)
      }
    }).catch(error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  /**
   * 加载导入主表data,包含文件信息
   * @param {Object} param0 --
   */
  loadMatMainData ({ state, commit },
    {
      loderType,
      query,
      fields = 'List',
      sort,
      order,
      search,
      limit = 0,
      offset = 20,
      byPage = true,
      needTotal = false
    }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: limit,
      offset: offset,
      sort: sort,
      order: order,
      fields: fields,
      search: search,
      needTotal: needTotal
    }).then(res => {
      // 更新本地缓存数据
      if (byPage) {
        commit('addMatMain', { data: res.data, type: loderType })
        commit('updatePage', { data: res.data, nextPage: res.nextPageToken, type: loderType })
      }
      return res.data
    }, error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  /**
   * 获取对比后的数据
   * @param {Object} param0 --
   */
  getCompareData ({ state, commit }, bomList) {
    return request.post(url.getCompareData, bomList).then(res => {
      return res.data
    }, error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  loadSearchBomData ({ state, commit }, search) {
    return request.get(url.getBomList, { strWhere: search }).then(res => {
      return res.data
    }, error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  },
  deleteBomData ({ state, commit }, BomID) {
    return request.delete(url.deleteBomData, { BomID }).then(res => {
      return res.data
    }, error => {
      error.userMessage && showWarningMessage(error.userMessage)
      return false
    })
  }
}
