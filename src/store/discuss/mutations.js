import Vue from 'vue'
export default {
  // 添加一条讨论
  addComment (state, comment) {
    let commentModel = state.comments && _.find(state.comments, item => item.id === comment.id)
    if (commentModel) {
      Object.assign(commentModel, comment)
    } else {
      state.comments.push(comment)
    }
  },
  // 添加多条讨论
  addComments (state, comments) {
    const newComments = _.differenceBy(comments, state.comments, 'id')
    state.comments.push(...newComments)
  },
  // 更新一条讨论
  updateComment (state, comment) {
    Object.assign(_.find(state.comments, item => item.id === comment.id), comment)
  },
  // 删除一条讨论
  deleteComment (state, id) {
    Vue.delete(state.comments, state.comments.findIndex(item => item.id === id))
  },
  // 设置业务对象ID
  setObjectID (state, objectID) {
    state.objectID = objectID
  },
  // 设置业务对象类型
  setObjectType (state, objectType) {
    state.objectType = objectType
  },
  // 记录哪些资源的数据已经被加载
  updateLoaded (state, loaded) {
    state.loaded[loaded] = true
  },
  updatePage (state, page) {
    Object.assign(state.page, page)
  }
}
