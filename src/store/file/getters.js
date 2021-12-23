export default {
  /**
   * 文件列表（
   */
  files: (state, getters) => {
    return getters.filesSorted
  },

  /** 列表排序 */
  filesSorted: state => {
    return _.sortBy(state.files, state.sort)
  },

  /** 文件格式对应文件图标 */
  fileFormatToIcon: state => ext => {
    let iconName = ''
    if (state.imgExts.includes(ext)) {
      iconName = 'image'
    } else if (state.pdfExts.includes(ext)) {
      iconName = 'picture_as_pdf'
    } else if (state.threeDExts.includes(ext)) {
      iconName = 'developer_board'
    } else if (state.videoExts.includes(ext)) {
      iconName = 'videocam'
    } else if (state.audioExts.includes(ext)) {
      iconName = 'mic'
    } else {
      iconName = 'insert_drive_file'
    }
    return iconName
  },

  // 系统支持的预览格式
  canPreviewExts: state => {
    let canPreviewExts = [
      ...state.imgExts,
      ...state.pdfExts,
      ...state.threeDExts,
      ...state.videoExts,
      ...state.audioExts,
      ...state.officePreviewExts
    ]
    return canPreviewExts
  }
}
