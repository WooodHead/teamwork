import Vue from 'vue'
export default {
  setLoaded (state, loaded) {
    state.loaded = loaded
  },
  // 新建多个任务
  addTags (state, tags) {
    state.tags = tags
  },
  // 新建多个任务
  addTag (state, tag) {
    state.tags.push(tag)
  },
  // 更新一条任务
  updateTag (state, tag) {
    const index = state.tags.findIndex(t => t.id === tag.id)
    state.tags.splice(index, 1, tag)
  },
  deleteTag (state, id) {
    Vue.delete(state.tags, state.tags.findIndex(a => a.id === id))
  }
}
