import fileState from '@/store/file/state.js'
import { getUrl } from '@/boot/file'
export function defaultImg (extension, filePath = '') {
  if (extension) {
    if (filePath) {
      return getUrl(filePath)
    } else if (fileState.pdfExts.includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-PDF.png'
    } else if (['pptx', 'ppt', 'pptx', 'ppt', '.pptx', '.ppt', '.pptx', '.ppt'].includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-PPT.png'
    } else if (['xls', 'xlt', 'xlsx', 'xltx', 'csv', '.xls', '.xlt', '.xlsx', '.xltx', '.csv'].includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-EXCEL.png'
    } else if (['doc', 'wps', 'docx', 'txt', '.doc', '.wps', '.docx', '.txt'].includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-WORD.png'
    } else if (fileState.threeDExts.includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-三维.png'
    } else if (fileState.audioExts.includes(extension.toLowerCase()) || fileState.videoExts.includes(extension.toLowerCase())) {
      return '/icons/file/文件样式-视频.png'
    } else {
      return '/icons/file/file.png'
    }
  } else {
    return '/icons/file/file.png'
  }
}
