import Vue from 'vue'
export default {
  /**
  * 是否已经加载所有数据
  * @param {*} state
  * @param {*} payload
  */
  setLoadedAll (state, payload) {
    state.loadedAll = payload
  },
  // 新建多个富文本框模板
  addEditorTemplates (state, editorTemplates) {
    const newEditorTemplates = _.differenceBy(editorTemplates, state.editorTemplates, 'id')
    state.editorTemplates.push(...newEditorTemplates)
  },
  // 更新一条富文本框模板
  updateEditorTemplate (state, editorTemplate) {
    const index = state.editorTemplates.findIndex(t => t.id === editorTemplate.id)
    state.editorTemplates.splice(index, 1, editorTemplate)
  },
  deleteEditorTemplate (state, id) {
    Vue.delete(state.editorTemplates, state.editorTemplates.findIndex(a => a.id === id))
  }
}
