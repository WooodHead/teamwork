import { i18n } from '../../boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import File from '@/store/file/model'

const url = {
  getList: 'files/getlist',
  getPageList: 'files/getpagelist',
  getModel: 'files/getmodel',
  add: 'files/add',
  batchAdd: 'files/batchadd',
  update: 'files/update',
  delete: 'files/delete'
}

export default {
  /**
   * load files
   * @param {Object} param0 --
   */
  loadFiles ({ state, commit }, { query, byPage = false }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      sort: ''
    }).then(res => {
      let files = File.from(res.data)
      commit('pushFiles', files)
      commit('updatePage',
        {
          offset: state.page.offset + files.length,
          limit: state.page.limit
        })
      return files
    }, error => {
      showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
      return true
    })
  },
  /**
   * 获取文件对象
   * @param {Object} param0 --
   * @param {Number} id 文件id
   */
  loadFile ({ state, commit }, id) {
    // 先从前台列表缓存获取
    let file = _.find(state.files, { id })
    if (file) {
      return file
    } else {
      // 否则从后台数据库获取,并放入列表缓存
      return request.get(url.getModel, { id }).then(res => {
        let frontFile = File.from(res.data)
        commit('pushFiles', [frontFile])
        return frontFile
      }, error => {
        showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
        return {}
      })
    }
  },
  /**
   * 新建文件
   * @param {Object} param0 --
   * @param {Object} file 新建的文件对象
   */
  addFile ({ state, commit }, file) {
    let endFile = File.to(new File(file))
    return request.post(url.add, endFile).then(res => {
      let frontFile = File.from(res.data)
      // 更新缓存列表
      commit('pushFiles', [frontFile])
      return frontFile
    }, error => {
      showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
      return {}
    })
  },
  batchAddFiles ({ state, commit }, files) {
    let endFiles = File.to(files)
    return request.post(url.batchAdd, endFiles).then(res => {
      let frontFiles = File.from(res.data)
      // 更新缓存列表
      commit('pushFiles', frontFiles)
      return frontFiles
    }, error => {
      showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 编辑文件
   * @param {Object} param0 --
   * @param {Object} file 编辑后的文件对象
   */
  updateFile ({ state, commit }, file) {
    let endFile = File.to(file)
    return request.put(url.update, endFile).then(res => {
      let frontFile = File.from(res.data)
      commit('updateFile', frontFile)
      return frontFile
    }, error => {
      showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
      return {}
    })
  },
  /**
   * 删除一个文件
   * @param {Object} param0 --
   * @param {Number} id 文件id
   */
  deleteFile ({ state, commit }, id) {
    return request.delete(url.delete, { id }).then(res => {
      commit('deleteFile', id)
      return true
    }, error => {
      showWarningMessage(i18n.t(`file.error.${error.userMessage}`))
      return false
    })
  }
}
