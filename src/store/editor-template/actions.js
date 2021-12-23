import EditorTemplate from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  GetList: 'editorTemplates/GetList',
  GetModel: 'editorTemplates/GetModel',
  Add: 'editorTemplates/Add',
  Update: 'editorTemplates/Update',
  UpdateFields: 'editorTemplates/UpdateFields',
  Delete: 'editorTemplates/Delete'
}
// 获取富文本框模板列表
export default {
  // 获取所有富文本框模板列表
  loadEditorTemplates ({ state, commit }) {
    if (!state.loadedAll) {
      commit('setLoadedAll', true)
      return request.get(url.GetList)
        .then(res => {
          let editorTemplates = EditorTemplate.from(res.data)
          commit('addEditorTemplates', editorTemplates)
          return editorTemplates
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return state.editorTemplates
    }
  },
  // 获取一个富文本框模板
  loadEditorTemplate ({ state, commit }, id) {
    let editorTemplate = state.editorTemplates[id]
    if (!editorTemplate) {
      return request.get(url.GetModel, { id }).then(res => {
        if (res.data) {
          editorTemplate = EditorTemplate.from(res.data)
          commit('addEditorTemplates', [editorTemplate])
          return editorTemplate
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return null
      })
    } else {
      return editorTemplate
    }
  },
  // 新建富文本框模板
  addEditorTemplate ({ commit }, editorTemplate) {
    let model = EditorTemplate.to(editorTemplate)
    return request.post(url.Add, model)
      .then(res => {
        let editorTemplate = EditorTemplate.from(res.data)
        commit('addEditorTemplates', [editorTemplate])
        return editorTemplate
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新富文本框模板
  updateEditorTemplate ({ commit }, editorTemplate) {
    let model = EditorTemplate.to(editorTemplate)
    return request.put(url.Update, model)
      .then(res => {
        let editorTemplate = EditorTemplate.from(res.data)
        commit('updateEditorTemplate', editorTemplate)
        return editorTemplate
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新富文本框模板部分字段
  updateEditorTemplateFields ({ commit }, payload) {
    return request.put(url.UpdateFields, payload)
      .then(res => {
        let editorTemplate = EditorTemplate.from(res.data)
        commit('updateEditorTemplate', editorTemplate)
        return editorTemplate
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除富文本框模板
  deleteEditorTemplate ({ commit }, id) {
    return request.delete(url.Delete, { id: id })
      .then(res => {
        let editorTemplate = EditorTemplate.from(res.data)
        commit('deleteEditorTemplate', id)
        return editorTemplate
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
