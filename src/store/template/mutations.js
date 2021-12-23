import Vue from 'vue'
export default {
  // 增删改时要同时更新list,select,view的数据
  addTemplate (state, project) {
    // 使用unshift把新数据放在头部
    let index = _.findIndex(state.templates, r => r.id === project.id)
    index < 0 && state.templates.unshift(project)
  },
  updateTemplate (state, template) {
    let old = _.find(state.templates, s => { return s.id === template.id && s.objectType === template.objectType })
    old ? Object.assign(old, template) : state.templates.push(template)
  },
  deleteTemplate (state, payload) {
    let index = _.findIndex(state.templates, s => { return s.id === payload.id && s.objectType === payload.objectType })
    Vue.delete(state.templates, index)
  },
  updatePage (state, page) {
    let o = {}
    o[`${page.category}`] = { offset: page.offset, limit: 20, nextPageToken: page.nextPageToken }
    Object.assign(state.page, o)
  },
  initCategoryPage (state, category) {
    let o = {}
    o[category] = { offset: 0, limit: 20, nextPageToken: 0 }
    Object.assign(state.page, o)
  },
  setTemplates (state, list) {
    const ids = _.map(list, 'id')
    state.templates = state.templates.filter(a => !ids.includes(a.id))
    state.templates.push(...list)
  },
  emptyCategoryTemplates (state, category) {
    state.templates = state.templates.filter(a => a.objectType !== category)
  },
  setSearch (state, value) {
    state.search = value
  },
  setArchivedCount (state, countAndCategory) {
    let o = {}
    state.archivedCount[`${countAndCategory.category}`] = {}
    o['count'] = +countAndCategory.count
    // Object.assign(state.archivedCount[`${countAndCategory.category}`], o)

    Vue.set(state.archivedCount[`${countAndCategory.category}`], 'count', +countAndCategory.count)
  }
}
