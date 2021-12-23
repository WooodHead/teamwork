/**
 @Name：阿里云智能媒体管理(Intelligent Media Management，简称 IMM)。基于IMM Service 的 NodeJS SDK。实现文档的转换（支持xls、ppt、doc、wps、pdf等48种格式）和在线预览。
 @Author：李建国
 @date：2020/10/27
 @Copyright：西安精雕软件科技有限公司
 */
import Vue from 'vue'
import request from '@/boot/axios'
// 封装IMM对外暴露的对象
var imm = {
  /**
   * 获取文档预览地址
   *
   * @param {*} filePath
   * @returns
   */
  getOfficePrviewURL (filePath) {
    return request.get('/files/previewurl', { filePath: filePath }).then(res => {
      return res.data
    })
  }
}

// 全局调用
Vue.prototype.$imm = imm // 组件中使用this.$imm
export default imm // js中引用 import imm from '@/boot/imm'
