import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Workflow from './model'
import { i18n } from '@/boot/i18n'
export default {
  // 审批事件
  approval ({ state, commit }, payload) {
    let model = Workflow.WFApprovalInfo.to(payload)
    return request
      .post('workflows/approval', model)
      .then(res => {
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取资源与单据的关联关系
  loadCategoryWorkFlow ({ state, commit }, { category, id, type }) {
    const query = [
      { Key: 'ObjectType', Value: category, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: id, Oper: 'eq' },
      'and',
      { Key: 'Type', Value: type, Oper: 'eq' }
    ]
    return request
      .get('workflows/getlist', { query: JSON.stringify(query) })
      .then(res => {
        const model = Workflow.WorkFlow.from(res.data)
        commit('loadWorkflow', { type: category + id, payload: model })
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 立项/结项申请
  addWorkFlow ({ state, commit }, fields) {
    return request
      .post('workflows/addWorkflow', fields)
      .then(res => {
        const model = Workflow.WorkFlow.from(res.data)
        commit('loadWorkflow', { type: fields.objectType + fields.objectID, payload: [model] })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  }
}
