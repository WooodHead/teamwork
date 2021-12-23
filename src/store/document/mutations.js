import Vue from 'vue'
export default {
  // -----------主页面相关按钮事件 start
  setDocumentList (state, payloads) {
    // 更新缓存，解决嵌套children脏数据问题
    const oldDocumentList = _.intersectionBy(payloads, state.documentList, 'id')
    oldDocumentList.forEach(doc => {
      Vue.set(state.documentList, state.documentList.findIndex(sd => sd.id === doc.id), doc)
    })
    const newDocumentList = _.differenceBy(payloads, state.documentList, 'id')
    state.documentList.unshift(...newDocumentList)
  },
  setTreeList (state, payloads) {
    // 更新缓存，解决嵌套children脏数据问题
    const oldDocumentList = _.intersectionBy(payloads, state.treeList, 'id')
    oldDocumentList.forEach(doc => {
      Vue.set(state.treeList, state.treeList.findIndex(sd => sd.id === doc.id), doc)
    })
    const newDocumentList = _.differenceBy(payloads, state.treeList, 'id')
    state.treeList.push(...newDocumentList)
    let arrFlatTree = []
    flatTree(state.treeList, arrFlatTree)

    // let loadMoreIndex = _.findIndex(treeNode, t => { return t.id < 0 })
    let arrLoadMore = _.filter(arrFlatTree, t => { return t.id < 0 })
    arrFlatTree = _.filter(arrFlatTree, t => { return t.id >= 0 })
    arrFlatTree.push(...arrLoadMore)

    state.treeList = _.uniqBy(arrFlatTree, 'id')
  },

  undeleteTaskInTrash (state, ids) {
    _.remove(state.documentsInTrash, function (n) {
      return ids.includes(n.id)
    })
  },
  addDocumentsInTrash (state, documentsInTrash) {
    let list = _.unionBy(documentsInTrash, 'id')
    const ids = []
    _(list).each(function (e) {
      ids.push(e.id)
    })
    // state.documentsInTrash = state.documentsInTrash.filter(a => !ids.includes(a.id))
    // state.documentsInTrash.push(...list)
    state.documentsInTrash = list
  },
  setSortAndOrder (state, value) {
    state.sort = value
    if (value === 'Title') {
      state.order = 'asc'
    } else {
      state.order = 'desc'
    }
  },
  setSearch (state, { id, value }) {
    state.search = value
  },
  setListType (state, value) {
    state.listType = value
  },
  setOrder (state, value) {
    state.order = value
  },
  setSort (state, value) {
    state.sort = value
  },
  emptyDocuments (state, currentDocID) {
    const currentModel = _.find(state.documentList, { id: currentDocID })
    if (+currentModel.id === 0) {
      state.documentList = []
    } else {
      state.documentList = [{ id: 0, classify: 'folder', title: '文档中心', path: '0', isPublish: 1, children: [] }]
    }
    currentModel && state.documentList.push(currentModel)
  },
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  initPage (state) {
    state.page = {
      ...state.page,
      ...{
        offset: 0,
        nextPageToken: 0
      }
    }
  },
  // -----------主页面相关按钮事件 end

  // -----------文件夹相关事件start
  addEmptyFolder (state, payload) {
    state.emptyFolder = payload
  },
  cancleEmptyFolder (state) {
    state.emptyFolder = {}
  },
  setArchivedCount (state, { id, count }) {
    Vue.set(state.archivedCount, +id, { id, count })
  },
  resetArchivedCount (state, { id, count }) {
    state.archivedCount = {}
  },
  // -----------文件夹相关事件 end

  // -----------文档事件start

  // -----------文档事件end

  // -----------文件夹文档公共方法start
  addDocument (state, payload) {
    for (let index = 0; index < state.documentList.length; index++) {
      let model = state.documentList[index]
      const numChildren = _.findIndex(model.children, { id: payload.parentId })
      const children = _.find(model.children, { id: payload.parentId })
      if (numChildren >= 0) {
        const newDocumentList = _.differenceBy([payload], children.children, 'id')
        children.children.unshift(...newDocumentList)
      }
      if (model.id === +payload.parentId) {
        const newDocumentList = _.differenceBy([payload], model.children, 'id')
        model.children.unshift(...newDocumentList)
      }
    }
  },
  updateDocument (state, payload) {
    const index = _.findIndex(state.documentList, { id: payload.id })
    index >= 0 && Vue.set(state.documentList, index, payload)
    for (let index = 0; index < state.documentList.length; index++) {
      let model = state.documentList[index]
      const num = _.findIndex(model.children, { id: payload.id })
      if (num >= 0) {
        Vue.set(model.children, num, payload)
        break
      }
    }
    const indexT = _.findIndex(state.treeList, { id: payload.id })
    indexT >= 0 && Vue.set(state.treeList, indexT, payload)
    for (let index = 0; index < state.treeList.length; index++) {
      let model = state.treeList[index]
      const num = _.findIndex(model.children, { id: payload.id })
      if (num >= 0) {
        Vue.set(model.children, num, payload)
        break
      }
    }
  },
  deleteDocument (state, id) {
    Vue.delete(state.documentList, state.documentList.findIndex(item => item.id === id))
    for (let index = 0; index < state.documentList.length; index++) {
      let model = state.documentList[index]
      const num = _.findIndex(model.children, { id: +id })
      if (num >= 0) {
        Vue.delete(model.children, num)
        break
      }
    }
    Vue.delete(state.treeList, state.treeList.findIndex(item => item.id === id))
    for (let index = 0; index < state.treeList.length; index++) {
      let model = state.treeList[index]
      const num = _.findIndex(model.children, { id: +id })
      if (num >= 0) {
        Vue.delete(model.children, num)
        break
      }
    }
  }
  // -----------文件夹文档公共方法end
}
function flatTree (treeNode, arrFlatTree) {
  arrFlatTree.push(..._.differenceBy(treeNode, arrFlatTree, 'id'))
  _(treeNode).forEach(value => {
    if (value.children) {
      flatTree(value.children, arrFlatTree)
    }
  })
}
