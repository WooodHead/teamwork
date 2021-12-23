
/**
 @Name：基于OSS Browser.js SDK 实现文件上传阿里云对象存储、预览和下载
 @Author：陈冬
 @date：2020/6/30
 @Copyright：西安精雕软件科技有限公司
 */
import { SessionStorage } from 'quasar'
import Vue from 'vue'
const OSS = require('ali-oss')
const cf = require('app/app.config.js')
const config = cf.oss
const client = (cf.extranet && config && config.enable) ? new OSS({
  accessKeyId: config.options.accesskeyId,
  accessKeySecret: config.options.accesskeySecret,
  secure: config.options.secure,
  cname: config.options.cname,
  region: config.options.region,
  endpoint: config.options.endpoint,
  bucket: config.options.bucket
}) : {}
// 封装OSS对外暴露的对象
var oss = (cf.extranet && config && config.enable) ? {
  /**
   * 普通上传
   * 一般小于100M的文件
   * @param {*} filePath 上传到阿里云OSS上的文件路径，格式aaa/ccc/d.jpg
   * @param {*} file 文件对象
   */
  putObject (filePath, file) {
    try {
      // filePath可以自定义为文件名（
      // 例如file.txt）或目录（例如abc/test/file.txt）的形式，
      // 实现将文件上传至当前Bucket或Bucket下的指定目录。
      let objectName = (config.baseDir + '/' + filePath).replace('//', '/')
      return client.put(objectName, file)
    } catch (e) {
      console.log(e)
    }
  },
  /**
   *分片上传
   *一般大于100 MB的文件，建议采用分片上传的方法
   *
   * @param {*} filePath 上传到阿里云OSS上的文件路径，格式aaa/ccc/d.jpg
   * @param {*} file 文件对象
   */
  multipartUpload (filePath, file, asyncProgress) {
    try {
      // object-key可以自定义为文件名（
      // 例如file.txt）或目录（例如abc/test/file.txt）的形式，
      // 实现将文件上传至当前Bucket或Bucket下的指定目录。
      let objectName = (config.baseDir + '/' + filePath).replace('//', '/')
      return client.multipartUpload(objectName, file, {
        checkpoint: '/temp',
        parallel: 4,
        partSize: 1024 * 1024, // 设置分片大小
        timeout: 120000, // 设置超时时间
        progress: asyncProgress
      }).catch(function (err) {
        console.log(err)
      })
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 文件上传（分片上传）
   *
   * @param {*} folder 业务文件夹
   * @param {*} files 文件数组
   */
  async put (folder, files, asyncProgress) {
    var resultFiles = []
    // 循环批量上传文件
    for (let i = 0; i < files.length; i++) {
      var file = files[i]
      // 采用分片上传
      await this.multipartUpload(folder + '/' + file.name, file, process => {
        file.__status = process === 0 ? 'idle' : (process < 1 ? 'uploading' : 'uploaded')
        file.__uploaded = file.size * process
        asyncProgress(file)
      })
      // 添加上传后的文件数据
      resultFiles.push({
        Title: file.name.substring(0, file.name.lastIndexOf('.')),
        PathName: folder + '/' + file.name,
        Extension: file.name.substring(file.name.lastIndexOf('.')),
        Size: (file.size / 1024).toFixed(2) // KB
      })
    }
    // 上传完后，返回上传的结果
    return resultFiles
  },
  /**
   * 获取URL
   *
   * @param {*} filePath
   * @param {*} process 图片处理设定，参考阿里云官网（https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.2.13.6ffa7866TcsZZQ#concept-hxj-c4n-vdb）
   * @returns
   */
  getUrl (filePath, process) {
    try {
      let objectName = (config.baseDir + '/' + filePath).replace('//', '/')
      let url = ''
      // 先从缓存获取
      let imgUrlCache = SessionStorage.getItem('imgUrlCache') || []
      let urlObj = _.find(imgUrlCache, { 'key': objectName })
      if (urlObj && urlObj.value) {
        url = urlObj.value
      } else {
        // 此处以设置URL的有效时长为3600s为例，若不设置有效时长，则默认为1800s。 31536000（365天）
        url = client.signatureUrl(objectName, { expires: 31536000, process: process })
        imgUrlCache.push({
          'key': objectName,
          'value': url
        })
        SessionStorage.set('imgUrlCache', imgUrlCache)
      }
      return url
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 通过URL下载文件
   *
   * @param {*} filePath
   * @param {*} fileName
   * @returns
   */
  download (filePath) {
    // 配置响应头实现通过URL访问时自动下载文件，并设置下载后的文件名。
    var array = filePath.split('/')
    var fileName = array[array.length - 1]
    const response = {
      'content-disposition': `attachment; filename=${encodeURIComponent(fileName)}`
    }
    try {
      // filePath表示从OSS下载文件时需要指定包含文件后缀在内的完整路径，例如abc/efg/123.jpg。
      let objectName = (config.baseDir + '/' + filePath).replace('//', '/')
      var url = client.signatureUrl(objectName, { response })
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', decodeURIComponent(fileName))
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
      return true
    } catch (e) {
      console.log(e)
    }
  }
} : {}

// 全局调用
Vue.prototype.$oss = oss // 组件中使用this.$oss
export default oss // js中引用 import oss from '@/boot/oss'
