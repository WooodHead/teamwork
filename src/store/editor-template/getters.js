export default {
  // 获取一个富文本框模板
  editorTemplate: state => id => {
    let editorTemplate = _.find(state.editorTemplates, p => { return p.id === id })
    return editorTemplate
  },
  // 获取所有富文本框模板
  editorTemplates: (state, _getters) => {
    return state.editorTemplates
  }

}
