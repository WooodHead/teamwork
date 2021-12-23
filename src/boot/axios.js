import Vue from 'vue'
import axios from 'axios'
import { i18n } from '@/boot/i18n'
import { SessionStorage, LocalStorage, Dialog, LoadingBar, Platform } from 'quasar'
import { showWarningMessage, showErrorMessage } from '@/utils/show-message'
import { wechatAuthUrl } from '@/utils/wechat.js'
const { extranet } = require('app/app.config.js')
let dialogSignIn = null
// 请求数据拦截器
axios.interceptors.request.use(
  config => {
    config.headers['content-Type'] = 'application/json;charset=utf-8'
    config.headers['Authorization'] = `Bearer ${LocalStorage.getItem('token')}`
    // 启动loadingBar加载，排除心跳的请求
    if (config.url.indexOf('heartbeatonline') === -1) {
      LoadingBar.start()
    }
    return config
  },
  err => {
    LoadingBar.stop()
    return Promise.reject(err)
  })

// 返回数据拦截器
axios.interceptors.response.use(
  response => {
    LoadingBar.stop()
    return response
  },
  error => {
    LoadingBar.stop()
    // 错误码判断
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = i18n.t('error.400')
          break
        case 401:
          error.code = error.response.data.error.code
          error.message = i18n.t('error.401')
          break
        case 403:
          error.message = i18n.t('error.403')
          break
        case 404:
          error.message = i18n.t('error.404') + `:${error.response.config.url}`
          break
        case 408:
          error.message = i18n.t('error.408')
          break
        case 500:
          error.message = i18n.t('error.500')
          break
        case 501:
          error.message = i18n.t('error.501')
          break
        case 502:
          error.message = i18n.t('error.502')
          break
        case 503:
          error.message = i18n.t('error.503')
          break
        case 504:
          error.message = i18n.t('error.504')
          break
        case 505:
          error.message = i18n.t('error.505')
          break
        default:
      }
    }
    console.log(error)
    return Promise.reject(error)
  })

// 封装请求方法
function formatReq ({ method, url, params, data }) {
  return new Promise((resolve, reject) => {
    axios({
      method: method === 'upload' ? 'post' : method,
      url: `/api/${url}`,
      params, // get delete 专用
      data
    })
      .then(response => {
        const error = response.data.error
        if (error) {
          if (error.code < 2000) {
            // 统一处理通用错误
            process.env.DEV
              ? showErrorMessage(error.developerMessage + '<br>' + url)
              : showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
          }
          reject(error)
        } else {
          resolve(response.data)
        }
      })
      .catch(e => {
        if (e.code === 1005) {
          // 表示用户票据已过期
          if (!dialogSignIn) {
            dialogSignIn = Dialog.create({
              title: i18n.t('title.confirm'),
              message: i18n.t('auth.error.TokenHasExpired'),
              ok: { label: i18n.t('auth.signInAgain'), flat: true },
              cancel: { label: i18n.t('auth.dontSignInYet'), flat: true },
              persistent: true
            }).onOk(() => {
              dialogSignIn = null
              SessionStorage.clear()
              LocalStorage.clear()
              // 内网或非微信浏览器打开，采用普通登录
              if (!extranet || Platform.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
                window.location = window.location.origin + '/login'
              } else { // 外网且微信浏览器打开，采用微信认证登录
                window.location.href = wechatAuthUrl()
              }
            })
          }
        } else {
          showWarningMessage(e.message)
        }
        reject(e)
      })
  })
}
// 封装请求方法
function formatExtReq ({ method, url, params, data }) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `/dncapi/${url}`,
      params, // get delete 专用
      data
    })
      .then(response => {
        const error = response.data.error
        if (error) {
          if (error.code < 2000) {
            // 统一处理通用错误
            process.env.DEV
              ? showErrorMessage(error.developerMessage)
              : showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
          } else {
            reject(error)
          }
        } else {
          resolve(response.data)
        }
      })
      .catch(e => {
        showWarningMessage(e.message)
        reject(e)
      })
  })
}
/**
 *上传文件专用
 *
 * @param {*} buccess 业务名称，例：project、product、chat
 * @param {*} files 文件数组
 * @returns
 */
function formatUpload (folder, files, callback) {
  return new Promise((resolve, reject) => {
    let formData = new FormData()
    // 多文件循环添加到formData中
    _.forEach(files, file => {
      formData.append(file.name, file)
    })
    // 设置请求头
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    axios({
      method: 'post',
      url: `/api/files/upload?folder=${folder}`,
      data: formData,
      onUploadProgress: function (progressEvent) { // 原生获取上传进度的事件
        let process = progressEvent.loaded / progressEvent.total
        callback(process)
      }
    })
      .then(response => {
        const error = response.data.error
        if (error) {
          if (error.code < 2000) {
            // 统一处理通用错误
            process.env.DEV
              ? showErrorMessage(error.developerMessage)
              : showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
          } else {
            reject(error)
          }
        } else {
          resolve(response.data)
        }
      })
      .catch(e => {
        showWarningMessage(e.message)
        reject(e)
      })
  })
}
/**
 * 下载文件专用
 *
 * @param {*} filePath 文件相对路径
 * @returns
 */
function formatDownload (filePath, callback) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      responseType: 'blob' || 'arraybuffer',
      url: `/api/files/down`,
      params: {
        filePath: encodeURIComponent(filePath) // 转码下载
      }
    })
      .then(response => {
        const error = response.data.error
        if (error) {
          if (error.code < 2000) {
            // 统一处理通用错误
            process.env.DEV
              ? showErrorMessage(error.developerMessage)
              : showWarningMessage(i18n.t(`app.error.${error.userMessage}`))
            resolve(false)
          } else {
            reject(error)
          }
        } else {
          // 执行成功！
          if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }))
            const link = document.createElement('a')
            link.href = url
            let fileName = response.headers['content-disposition'].split('filename=')
            link.setAttribute('download', decodeURIComponent(fileName[1]))
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
            resolve(true)
          } else if (response.status === 204) {
            showWarningMessage('未找到要下载的文件！')
            resolve(false)
          } else {
            showErrorMessage('服务器异常！')
            resolve(false)
          }
        }
      })
      .catch(e => {
        showWarningMessage(e.message)
        reject(e)
      })
  })
}
// 封装Http
const request = {
  get: (url, params) => formatReq({ method: 'get', url, params }),
  get_ext: (url, params) => formatExtReq({ method: 'get', url, params }),
  post: (url, data) => formatReq({ method: 'post', url, data }),
  put: (url, data) => formatReq({ method: 'put', url, data }),
  patch: (url, data) => formatReq({ method: 'patch', url, data }),
  delete: (url, params) => formatReq({ method: 'delete', url, params }),
  download: (filePath) => formatDownload(filePath),
  upload: (folder, files, callback) => formatUpload(folder, files, callback),
  all: axios.all,
  spread: axios.spread
}

Vue.prototype.$axios = request
export default request
