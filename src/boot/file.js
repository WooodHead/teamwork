/**
 @Name：文件上传、下载、获取文件url、预览文件
 @Author：陈冬
 @date：2020/7/1
 @Copyright：西安精雕软件科技有限公司
 */
const config = require('app/app.config.js')
import request from '@/boot/axios'
import { setAddress } from '@/utils/get-ip'
import { Platform, Dialog } from 'quasar'
import fileState from '@/store/file/state'
import oss from '@/boot/oss'
/**
 * 上传文件
 *
 * @export
 * @param {*} folder 业务文件夹，例：project、product、chat
 * @param {*} files 上传文件数组
 * @param {*} processCallback 进度条回调
 * @param {*} resultCallback  结果回调
 */
const upload = function (folder, files, processCallback, resultCallback) {
  if (config.oss && config.oss.enable) {
    // 上传到阿里云OSS
    oss.put(folder, files, file => {
      processCallback(file.__uploaded / file.size)
    }).then(result => {
      resultCallback(result)
    })
  } else {
    // 上传到应用服务器
    request.upload(folder, files, process => {
      processCallback(process)
    }).then(result => {
      resultCallback(result.data)
    })
  }
}
export { upload }
/**
 * 预览文件
 *
 * @export
 * @param {*} filaPath 文件相对路径
 * @returns
 */
const getUrl = function (filePath, process) {
  var URI = 'icons/default-image.webp'
  if (filePath && filePath.trim() !== '') {
    if (config.oss && config.oss.enable) {
      URI = filePath && filePath !== '' && oss.getUrl(filePath, process)
    } else {
      var extension = filePath.substring(filePath.lastIndexOf('.'))
      if (fileState.videoExts.includes(extension.toLowerCase())) {
        URI = filePath && filePath !== '' && '/api/files/previewvideo?filePath=' + encodeURIComponent(filePath)
      } else {
        URI = filePath && filePath !== '' && '/api/files/preview?filePath=' + encodeURIComponent(filePath)
      }
    }
  }
  return URI
}
window.getUrl = getUrl
export { getUrl }
/**
 * 下载文件
 *
 * @export
 * @param {*} filePath 文件相对路径
 */
const download = function (filePath) {
  let address = { ip: '', city: '' }
  // try catch处理部分移动端浏览器get-ip失败问题
  try {
    setAddress(address)
  } catch (error) {
    console.log(error)
  }
  // 判断是否外网上传
  if (config.oss && config.oss.enable) {
    // 下载阿里云OSS上的文件
    oss.download(filePath)
  } else {
    // 下载应用服务器上的文件
    request.download(filePath)
  }
  recodeDownMark(filePath, address)
}
window.download = download
export { download }
/**
 * 非图片文件预览
 * @param {*} path 文件相对路径
 * @param {*} name 文件名称，没有后缀。例如：文档
 * @param {*} extension 后缀名扩展。例如：.doc
 * @param {*} fileState file的state
 */
const previewFile = function (path, name, extension, root = {}, fileId = 0, isShowDownloadBtn = false) {
  let noIntranetOfficeCanPreviewExts = [...fileState.imgExts, ...fileState.pdfExts, ...fileState.threeDExts, ...fileState.videoExts, ...fileState.audioExts, ...fileState.officePreviewExts]
  let intranetOfficeCanPreviewExts = [...fileState.officePreviewExts]

  if ((!config.extranet || (config.extranet && (!config.oss || !config.oss.enable))) && intranetOfficeCanPreviewExts.includes(extension.toLowerCase())) {
    window.open(`${config.file.previewUrl}/onlinePreview?url=` + encodeURIComponent(Base64.encode(config.appUrl.server + path)))
  } else if (noIntranetOfficeCanPreviewExts.includes(extension.toLowerCase())) {
    let dialogObject = {
      component: () => import('components/attach/AttachViewer'),
      showDownloadBtn: isShowDownloadBtn,
      id: fileId,
      title: name + extension,
      url: path,
      extension: extension
    }
    if (_.keys(root).length) {
      Object.assign(dialogObject, { root })
    }
    Dialog.create(dialogObject)
  }
}
window.previewFile = previewFile
export { previewFile }

const imgSrcs = function (content) {
  let imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
  // eslint-disable-next-line no-useless-escape
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
  let arr = content.match(imgReg) // 筛选出所有的img
  let srcArr = []
  for (let i = 0; i < arr.length; i++) {
    let src = arr[i].match(srcReg)
    // 获取图片地址
    srcArr.push(src[1])
  }
  return srcArr
}
window.imgSrcs = imgSrcs

/**
   * 记录下载痕迹
   * @param {*} filePath
   * @param {*} address
   */
function recodeDownMark (filePath, address) {
  const platform = {
    'terminal': Platform.is.desktop ? 'desktop' : (Platform.is.iphone ? 'iphone' : (Platform.is.ipad ? 'ipad' : (Platform.is.mobile ? 'mobile' : ''))),
    'os': Platform.is.platform,
    'browser': Platform.is.name
  }
  request.get('files/recodedownmark', { filePath: filePath, platform: JSON.stringify(platform), address: JSON.stringify(address) })
}
const recodeVisitMark = function (objectType, objectId) {
  let address = { ip: '', city: '' }
  // try catch处理部分移动端浏览器get-ip失败问题
  try {
    setAddress(address)
  } catch (error) {
    console.log(error)
  }
  const platform = {
    'terminal': Platform.is.desktop ? 'desktop' : (Platform.is.iphone ? 'iphone' : (Platform.is.ipad ? 'ipad' : (Platform.is.mobile ? 'mobile' : ''))),
    'os': Platform.is.platform,
    'browser': Platform.is.name
  }
  request.get('files/recodevisitmark', { objectType, objectId, platform: JSON.stringify(platform), address: JSON.stringify(address) })
}
window.recodeVisitMark = recodeVisitMark
