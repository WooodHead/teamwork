import Vue from 'vue'
// 封装workflow对外暴露对象
const { workflow } = require('app/app.config.js')
const wf = {
  open: function (wfGuid) {
    let path = `${workflow.clientUrl}bpms_work_flow/html/wf_flow_chart.html?APP_MARK=${workflow.appMark}&SHOW_TITLE=0&WF_GUID=${wfGuid}`
    window.open(path)
  }
}

// 全局调用
Vue.prototype.$workflow = wf // 组件中使用this.$workflow
export default wf // js中引用 import workflow from '@/boot/workflow'
