import { LocalStorage } from 'quasar'
const config = require('app/app.config.js')
export default {
  methods: {
    // 选择文件后的回调
    _added (files) {
      var _this = this
      // 添加文件后回调
      _this.addedCallback && _this.addedCallback(files)
      // 判断是否外网上传
      if (config.extranet && config.oss && config.oss.enable) {
        this.start && this.start()
        // 上传到阿里云OSS
        _this.$oss.put(_this.folder, files, file => {
          // 更新文件上传进度信息
          _this.$refs.qUploader.__updateFile(file, file.__status, file.__uploaded)
        }).then(result => {
          // 返回上传后的结果
          this.uploaded(result)
        })
      } else {
        // 上传到应用服务器
        _this.$refs.qUploader.upload()
      }
    },
    // 采用原生的q-uploader工厂模式上传文件（内网使用此上传方式）
    _factory (files) {
      var _this = this
      return new Promise((resolve) => {
        resolve({
          url: `/api/files/upload?folder=${_this.folder}`,
          method: 'POST',
          headers: [
            // 授权访问内网上传接口
            { name: 'Authorization', value: `Bearer ${LocalStorage.getItem('token')}` }
          ]
        })
      })
    },
    // 内网上传后的回调
    _uploaded (info) {
      let res = info.xhr.status === 200 && JSON.parse(info.xhr.response)
      if (res && res.data) {
        this.uploaded(res.data)
      } else {
        this.$q.notify({ message: '上传异常', icon: 'warning', color: 'purple' })
      }
    },
    // 内网接口异常回调
    _factoryFailed () {
      this.$q.notify({ message: '文件上传接口异常！', icon: 'warning', color: 'purple' })
    },
    // 上传失败回调
    _failed (file) {
      this.$q.notify({ message: '文件服务器异常！', icon: 'warning', color: 'purple' })
    }
  }
}
