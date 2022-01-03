import { listToTree } from '@/utils/list-to-tree'
import { LocalStorage, date } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import Document from './model'
const { formatDate } = date
export default {
  // -----------加载资源相关方法 start
  /**
   * load Documents
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   */
  loadDocuments (
    { state, commit },
    { query, filter, sort = '', search, fields = 'List' } = {}
  ) {
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort,
      search,
      fields
    }
    let Documents = []
    return request
      .get('documents/getlist', condition)
      .then(res => {
        Documents = Document.from(res.data)
        commit('setDocumentList', Documents)
        return Documents
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  loadTreeDocuments (
    { state, commit },
    { query, filter, sort = state.sort, search = state.search, limit, offset, fields = 'Tree' } = {}
  ) {
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort,
      search,
      fields,
      limit,
      offset
    }
    let Documents = []
    return request
      .get('documents/getpagelist', condition)
      .then(res => {
        Documents = Document.from(res.data)
        res.data = Documents
        commit('setTreeList', Documents)
        return res
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   *获取文件夹的子级或者当前文档
   */
  loadDocument ({ state, commit, dispatch }, id) {
    let model = _.find(state.documentList, { id: +id })
    if (!model) {
      return request
        .get('documents/getmodel', { id, fields: 'List' })
        .then(res => {
          return dispatch('loadDocumentCall', res.data)
        })
    } else if (+id < 0) {
      // 加载虚拟文件夹下的文档——通过标签,层级加载
      var treeLevel = model.level + 1
      var tag = model.tag
      return dispatch('loadTagDocumentInFolder', { model, tag, treeLevel })
    } else {
      return dispatch('loadDocumentsInFolder', { model, id })
    }
  },
  loadModel ({ state, commit, dispatch }, { id, fields = 'List' }) {
    let model = _.find(state.documentList, { id: +id })
    if (!model) {
      return request
        .get('documents/getmodel', { id, fields })
        .then(res => {
          let model = Document.from(res.data)
          return model
        })
    } else {
      return model
    }
  },
  /**
   *获取文件夹的子级或者当前文档
   * @param {*} { query }拼接条件
   */
  loadDocumentByQuery (
    { state, commit, dispatch },
    { frontQuery, endQuery, fields = 'View', onlyGetData = false }
  ) {
    let model =
      frontQuery &&
      _.find(state.documentList, l => {
        return frontQuery(l)
      })
    if (!model) {
      return request
        .get('documents/getmodel', {
          query: JSON.stringify(endQuery),
          fields
        })
        .then(res => {
          if (onlyGetData) {
            let data = Document.from(res.data)
            commit('setDocumentList', [data])
            return data
          } else {
            return dispatch('loadDocumentCall', res.data)
          }
        })
    } else if (+model.id < 0) {
      // 加载虚拟文件夹下的文档——通过标签,层级加载
      var treeLevel = model.level + 1
      var tag = model.tag
      return dispatch('loadTagDocumentInFolder', { model, tag, treeLevel })
    } else {
      if (onlyGetData) {
        return Document.from(res.data)
      } else {
        return dispatch('loadDocumentsInFolder', { model, id: model.id })
      }
    }
  },
  loadWikiSpace ({ state, commit, rootState },
    {
      parentId,
      archived = 0,
      search = state.search,
      sort = state.sort,
      order = state.order }) {
    let params = {}, page = state.page
    params = {
      limit: state.page.limit,
      offset: state.page.offset,
      search,
      sort,
      archived,
      parentId,
      order
    }

    return request.get('wikis/getwikispacebyauth', params)
      .then(res => {
        let wikis = Document.from(res.data)
        commit('updatePage', {
          offset: page.offset + wikis.length, nextPageToken: res.nextPageToken
        })
        commit('setDocumentList', wikis)
        return wikis
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 获取文档后处理事件
   * @param {*} data
   */
  loadDocumentCall ({ state, commit, dispatch }, data) {
    if (data) {
      let model = Document.from(data)
      const classify = model.classify
      if (classify === 'folder') {
        return dispatch('loadDocumentsInFolder', { model, id: model.id })
      } else if (['doc', 'file', 'link'].includes(classify)) {
        commit('setDocumentList', [model])
        return model
      }
    } else {
      return null
    }
  },
  loadDocumentWithoutChildren ({ state, commit }, id) {
    let model = _.find(state.documentList, { id: +id })
    if (!model) {
      return request
        .get('documents/getmodel', { id, fields: 'List' })
        .then(res => {
          model = Document.from(res.data)
          commit('setDocumentList', [model])
          return model
        })
    } else {
      return model
    }
  },
  /**
   *获取各级父文件夹
   *
   * @param {*} { state }
   * @param {*} ids
   * @returns
   */
  loadFolders ({ state, commit }, ids) {
    const _query = [{ Key: 'DocID', Value: ids, Oper: 'in' }]
    return request
      .get('documents/getlist', { query: JSON.stringify(_query) })
      .then(res => {
        const documents = Document.from(res.data)
        documents.length > 0 && commit('setDocumentList', documents)
        return documents
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 加载文件夹资源
   * @param {*} condition 获取资源的条件
   * @param {*} id 获取资源的ID
   */
  loadDocumentsInFolder ({ state, commit }, { model, id }) {
    const page = state.page
    const search = state.search
    id = id || 0
    let _query = [
      { Key: 'ParentID', Value: id, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' }

    ]
    _query.push('and')
    let _query1 = [
      { Key: 'IsPublish', Value: 1, Oper: 'eq' }
    ]
    _query1.push('or')
    let _query2 = [
      { Key: 'IsPublish', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'AuthorID', Value: +LocalStorage.getItem('myself').id, Oper: 'eq' },
      'and',
      { Key: 'Classify', Value: 'folder', Oper: 'eq' }
    ]
    _query1.push(_query2)
    _query.push(_query1)
    const condition = {
      query: JSON.stringify(_query),
      sort: state.sort,
      limit: page.limit,
      offset: page.offset,
      order: state.order
    }
    search && (condition.search = search)
    let url = this.$router.currentRoute.name === 'productCaseDetail' ? 'getlist' : 'getpagelist'
    return request.get(`documents/${url}`, condition).then(res => {
      let children = Document.from(res.data)
      commit('updatePage', {
        offset: page.offset + children.length,
        nextPageToken: res.nextPageToken
      })
      const interseChildren = _.differenceBy(children, model.children, 'id')
      model.children && model.children.push(...interseChildren)
      commit('setDocumentList', [...children, model])
      return model
    })
  },
  /**
   * 加载标签文件夹资源
   * @param {*} condition 获取资源的条件
   * @param {*} id 获取资源的ID
   */
  loadTagDocumentInFolder ({ state, commit }, { model, tag, treeLevel }) {
    const page = state.page
    const search = state.search
    let _query = [
      { Key: 'Tag', Value: tag, Oper: 'eq' },
      'and',
      { Key: 'Level', Value: treeLevel, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'IsPublish', Value: 1, Oper: 'eq' }
    ]
    const condition = {
      query: JSON.stringify(_query),
      sort: state.sort,
      limit: page.limit,
      offset: page.offset
    }
    search && (condition.search = search)
    return request.get('documents/getpagelist', condition).then(res => {
      let children = Document.from(res.data)
      commit('updatePage', {
        offset: page.offset + children.length,
        nextPageToken: res.nextPageToken
      })
      // 加上虚拟子文件夹
      children.push(..._.filter(state.documentList, { parentId: model.id }))
      const interseChildren = _.differenceBy(children, model.children, 'id')
      model.children.push(...interseChildren)
      commit('setDocumentList', [...children, model])
      return model
    })
  },
  /**
   *获取资源文档
   *
   * @param {*} { state, commit }
   * @param {*} { objectType, objectID }
   * @returns
   */
  loadResourceDocument ({ state, commit }, { objectType, objectID }) {
    // 获取当前的model
    let model = _.find(state.documentList, {
      objectType: objectType,
      objectID: +objectID,
      level: 2
    })
    if (!model && +objectID !== 0) {
      return request
        .get('documents/getresourcemodel', { objectType, objectID, level: 2 })
        .then(res => {
          model = Document.from(res.data)
          model.children = model.children.filter(child =>
            child.whiteList.includes(LocalStorage.getItem('myself').id)
          )
          commit('setDocumentList', [...model.children, model])
          return model
        })
    } else {
      return model
    }
  },
  loadFileByObjectTypeAndObjectId ({ state, commit }, { objectType, objectID }) { 
    // 获取当前的model
    let model = _.find(state.documentList, {
      objectType: objectType,
      objectID: +objectID,
      level: 2
    })
    if (!model && +objectID !== 0) {
      return request
        .get('documents/getresourcemodel', { objectType, objectID, level: 2 })
        .then(res => {
          model = Document.from(res.data)
          return model
        })
    } else {
      return model
    }
  },
  /**
   *通过标签获取文档
   *
   * @param {*} { state, commit }
   * @param {*} {tag,  category, objectID, treeLevel}
   * @returns
   */
  loadTagDocument (
    { state, commit },
    { tag, category = '', objectID = 0, treeLevel = 1 }
  ) {
    return request
      .get('documents/loadtagdocument', {
        tag,
        category,
        objectID,
        level: treeLevel
      })
      .then(res => {
        return Document.from(res.data)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   * 添加标签文档
   * @param {*} payload:{category,objectID,tag,files}
   */
  uploadTagDocument ({ commit }, payload) {
    let newListModel = _.map(payload.files, item => {
      const filePayload = item.xhr
        ? JSON.parse(item.xhr.responseText).data[0]
        : item
      const title =
        filePayload.Title ||
        filePayload.newName ||
        filePayload.name ||
        filePayload.title
      const file = {
        DocID: filePayload.id || 0,
        Size: filePayload.Size || filePayload.size,
        FilePath:
          filePayload.PathName || filePayload.pathName || filePayload.filePath,
        Title:
          filePayload.newName || filePayload.name
            ? title.slice(0, title.lastIndexOf('.'))
            : title,
        Extension: filePayload.Extension || filePayload.extension,
        Classify: 'file', // 文件分类：folder,doc，file，link
        AuthorID: LocalStorage.getItem('myself').id,
        AuthorName: LocalStorage.getItem('myself').name,
        ObjectType: payload.category,
        ObjectID: +payload.objectID,
        Tag: payload.tag,
        ArchiveTime: '1000-01-01 00:00:00'
      }
      return file
    })
    const params = {
      listModel: newListModel,
      ObjectType: payload.category,
      ObjectID: payload.objectID,
      Tag: payload.tag
    }
    return request
      .put('documents/uploadtagdocument', params)
      .then(res => {
        if (res && res.data && res.data.DeleteIds > 0) {
          let deleteIds = _.cloneDeep(res.data.DeleteIds).split(',')
          _.forEach(deleteIds, id => {
            commit('deleteDocument', +id)
          })
          return deleteIds
        }
        // 需要更新的
        if (res && res.data && res.data.updateDocs.length) {
          const modelList = Document.from(res.data.updateDocs)
          _(modelList).forEach(model => {
            commit('updateDocument', model)
          })
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },

  /**
   * 获取某个父级元素下面的草稿列表数量
   */
  loadDraftCount ({ state, commit }, id) {
    const _query = [
      { Key: 'ParentID', Value: id, Oper: 'eq' },
      'and',
      { Key: 'IsPublish', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'AuthorID', Value: LocalStorage.getItem('myself').id, Oper: 'eq' }
    ]

    const condition = {
      query: JSON.stringify(_query),
      orderby: state.sort + ' DESC'
    }
    state.search && (condition.search = state.search)
    return request.get('documents/getlist', condition).then(res => {
      let data = Document.from(res.data)
      data.length > 0 && commit('setDocumentList', data)
      return data.length
    })
  },
  /**
   * 获取某个父级元素下面的草稿列表
   */
  loadDraftList ({ state, commit }, id) {
    let draftList = _.filter(state.documentList, {
      parentId: +id,
      isPublish: 0
    })
    if (draftList.length === 0) {
      const _query = [
        { Key: 'ParentID', Value: id, Oper: 'eq' },
        'and',
        { Key: 'IsPublish', Value: 0, Oper: 'eq' },
        'and',
        {
          Key: 'AuthorID',
          Value: LocalStorage.getItem('myself').id,
          Oper: 'eq'
        }
      ]

      const condition = {
        query: JSON.stringify(_query),
        orderby: state.sort + ' DESC'
      }
      state.search && (condition.search = state.search)
      return request.get('documents/getlist', condition).then(res => {
        let data = Document.from(res.data)
        data.length > 0 && commit('setDocumentList', data)
      })
    }
  },
  /**
   * 获取所有元素下面的草稿列表
   */
  loadMyDraftList ({ state, commit }, { query = '' }) {
    return request
      .get('documents/getlist', {
        query: JSON.stringify(query)
      })
      .then(res => {
        let data = Document.from(res.data)
        commit('setDocumentList', data)
        return data
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 获取某个父级元素下面的归档列表数量
   */
  loadArchivedCount ({ state, commit }, id) {
    const archiveCountPayload = state.archivedCount[+id]
    if (!archiveCountPayload) {
      const _query = [
        { Key: 'ParentID', Value: id, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 1, Oper: 'eq' }
      ]

      const condition = {
        query: JSON.stringify(_query)
      }
      state.search && (condition.search = state.search)
      request.get('documents/getcount', condition).then(res => {
        commit('setArchivedCount', { id, count: res.data })
      })
    }
  },
  /**
   * 加载归档列表
   * @param {*} id
   */
  loadArchiveList ({ state, commit, dispatch }, id) {
    const page = state.page
    const search = state.search
    id = id || 0
    const _query = [
      { Key: 'ParentID', Value: +id, Oper: 'eq' },
      'and',
      { Key: 'Archived', Value: 1, Oper: 'eq' }
    ]
    const condition = {
      query: JSON.stringify(_query),
      sort: state.sort,
      limit: page.limit,
      offset: page.offset,
      orderby: 'ArchiveTime DESC'
    }
    search && (condition.search = search)
    return request.get('documents/getpagelist', condition).then(res => {
      let data = Document.from(res.data)
      commit('updatePage', {
        offset: page.offset + data.length,
        nextPageToken: res.nextPageToken
      })
      data.length > 0 && commit('setDocumentList', data)
    })
  },
  // -----------加载资源相关方法 end

  // 移动/复制时获取所有文件夹
  getFolderOfDiffType ({ state, commit }, { category, objectID }) {
    let _query = [
      { Key: 'Classify', Value: 'folder', Oper: 'eq' },
      'and',
      { Key: 'IsPublish', Value: 1, Oper: 'eq' }
    ]
    if (category && category !== 'document') {
      _query.push(
        ...[
          ',',
          'and',
          { Key: 'ObjectType', Value: category, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
        ]
      )
    }
    const condition = {
      query: JSON.stringify(_query),
      fields: 'DocID,Title,Level,Path,ParentID'
    }
    return request.get('documents/getlist', condition).then(res => {
      // res.data.push({
      //   DocID: 0,
      //   Classify: 'folder',
      //   Title: '文档中心',
      //   Path: '0',
      //   IsPublish: 1,
      //   Children: []
      // })
      let list = Document.from(res.data)
      return listToTree(list, 'id', 'parentId', 'folder', 'info')
    })
  },
  /**
   * 更新指定的属性
   * @param {object} payload 对象，包含的字段属性和值
   */
  updateDocumentField ({ state, commit }, payload) {
    return request
      .put('documents/updatefields', payload)
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return {}
      })
  },
  // -----------接口相关方法 end

  // -----------文件夹集合start
  addEmptyFolder ({ commit }) {
    let emptyFolderModel = {
      classify: 'folder',
      title: '',
      children: []
    }
    commit('addEmptyFolder', emptyFolderModel)
  },
  submitFolder ({ commit, dispatch }, folder) {
    dispatch('addDocument', folder).then(res => {
      commit('cancleEmptyFolder')
    })
  },
  showArchiveList ({ state, commit, dispatch }, id) {
    let params = {}
    let { category, objectID } = this.$router.currentRoute.params
    if (category && category !== 'document') {
      Object.assign(params, { category: category, objectID: objectID })
    }
    if (id !== 0) {
      Object.assign(params, { id: +id })
    }

    this.$router.push({
      name: 'archivedDocuments',
      params: params
    })
  },
  // -----------文件夹集合end

  // -----------文档集合start
  addDocument ({ state, commit, dispatch }, payload) {
    let parentDoc =
      _.find(state.documentList, { id: +payload.parentId || 0 }) || {}
    payload.level = parentDoc.level + 1
    parentDoc.path !== '0' && (payload.path = parentDoc.path)
    const model = Document.to(payload)
    return request
      .post('documents/add', model)
      .then(res => {
        const model = Document.from(res.data)
        commit('addDocument', model)
        commit('setDocumentList', [model])
        commit('setTreeList', [model])
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  batchAddDocument ({ state, commit, dispatch }, payload) {
    const model = Document.to(payload)
    return request
      .post('documents/batchadd', model)
      .then(res => {
        const modelList = Document.from(res.data)
        _(modelList).forEach(model => {
          commit('addDocument', model)
        })
        commit('setDocumentList', modelList)
        commit('setTreeList', modelList)
        return modelList
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  updateDocument ({ state, commit, dispatch }, payload) {
    const model = Document.to(payload)
    return request
      .put('documents/update', model)
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 重新上传
  reUploadDocument ({ state, commit, dispatch }, payload) {
    const model = Document.to(payload)
    return request
      .put('documents/reupload', model)
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // -----------文档集合end

  // -----------文件夹、文档公共方法start
  deleteDocument ({ state, commit, dispatch, rootState }, id) {
    return request
      .delete('documents/delete', { id })
      .then(res => {
        const model = _.find(state.documentList, { id: +id }) || {}
        commit('deleteDocument', id)
        // 非草稿删除时
        if (model.objectType === 'productCase' && model.classify === 'folder') {
          this.$router.push({ name: 'productCaseHome' })
          return false
        }
        if (model.objectType === 'wiki' && model.level === 2) {
          this.$router.push({ name: 'wikiHome' })
          return false
        }
        if (model.objectType === 'productCase' && model.classify !== 'folder') {
          const pModel = _.find(state.documentList, { id: +model.parentId }) || {}
          this.$router.push({ name: 'productCaseDetail', params: { id: +pModel.id } })
          return
        }
        if (model.isPublish !== 0) {
          // 如果是归档区则需要跳转到归档列表
          if (model.archived) {
            let archiveCount =
              (state.archivedCount[+model.parentId] &&
                state.archivedCount[+model.parentId].count) ||
              1
            commit('setArchivedCount', {
              id: model.parentId,
              count: archiveCount - 1
            })
            dispatch('showArchiveList', +model.parentId)
          } else {
            const parentModel = _.find(state.documentList, {
              id: +model.parentId
            }) || {
              id: 0,
              classify: 'folder',
              title: '文档中心',
              path: '0',
              isPublish: 1,
              children: []
            }
            if (
              parentModel.title === '工程自助服务文档' &&
              parentModel.parentId === 0 &&
              parentModel.objectType === 'selfService'
            ) {
              this.$router.push({ name: `serviceHome` })
            } else {
              const inDocumentCenter = this.$router.currentRoute.path.split('/')[1] === 'document'
              let params = inDocumentCenter
                ? { id: parentModel.id }
                : { category: parentModel.objectType, objectID: parentModel.objectID, id: parentModel.id }

              this.$router.push({
                name: `folder`,
                params
              })
            }
          }
        } else {
          const parentModel = _.find(state.documentList, {
            id: +model.parentId
          }) || {
            id: 0,
            classify: 'folder',
            title: '文档中心',
            path: '0',
            isPublish: 1,
            children: []
          }
          let params = {
            category: parentModel.objectType,
            objectID: parentModel.objectID,
            id: parentModel.id
          }
          this.$router.push({
            name: `draftDocuments`,
            params
          })
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
 * 归档文档
 * @param {*} id
 */
  archiveDocument ({ state, commit, dispatch, rootState }, id) {
    return request
      .get(`documents/archive`, { id })
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        let archiveCount =
          (state.archivedCount[+model.parentId] &&
            state.archivedCount[+model.parentId].count) ||
          0
        commit('setArchivedCount', {
          id: model.parentId,
          count: archiveCount + 1
        })  
        // 添加归档区面包屑
        if (model.classify !== 'folder' && rootState.breadcrumbs && rootState.breadcrumbs.widgetBreadcrumbs && 
        !rootState.breadcrumbs.widgetBreadcrumbs.some(b => b.id === 'archivedDocuments')) {
          rootState.breadcrumbs.widgetBreadcrumbs.push({
            id: 'archivedDocuments',
            title: '归档箱',
            to: {
              name: 'archivedDocuments',
              params: { category: model.objectType, objectID: +model.objectID, id: model.parentId }
            }
          })
        }
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  unarchiveDocument ({ state, commit, dispatch, rootState }, id) {
    return request
      .get(`documents/unarchive`, { id })
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        let archiveCount =
          (state.archivedCount[+model.parentId] &&
            state.archivedCount[+model.parentId].count) ||
          1
        commit('setArchivedCount', {
          id: model.parentId,
          count: archiveCount - 1
        })
        rootState.breadcrumbs.widgetBreadcrumbs = _.filter(rootState.breadcrumbs.widgetBreadcrumbs, w => { return w.id !== 'archivedDocuments' })
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  isHaveParentArchive ({ state, commit, dispatch }, id) {
    const model = _.find(state.documentList, { id: +id }) || {}
    const parentIDs = (model.path && model.path.split(',').slice(0, -1)) || ''
    let parents = _.filter(state.documentList, item => {
      return parentIDs.includes(item.id.toString())
    })
    if (
      (parents.length === parentIDs.length || id === 0) &&
      state.documentList.length !== 1
    ) {
      const model = _.find(parents, { archived: true })
      if (model) {
        return true
      } else {
        return false
      }
    } else {
      let _query = [
        { Key: 'DocID', Value: model.path, Oper: 'inset' },
        'and',
        { Key: 'DocID', Value: id, Oper: 'ne' }
      ]
      const condition = {
        query: JSON.stringify(_query)
      }
      return request.get(`documents/getlist`, condition).then(res => {
        const list = Document.from(res.data)
        commit('setDocumentList', list)
        const model = _.find(list, { archived: true })
        if (model) {
          return true
        } else {
          return false
        }
      })
    }
  },
  /**
 * 复制文档
 * @param {*} payload
 */
  copyDocument ({ state, commit, dispatch }, payload) {
    return request
      .put(`documents/copy`, { ID: payload.ID, TargetID: payload.To.TargetID })
      .then(res => {
        const model = Document.from(res.data)
        commit('setDocumentList', model)
        commit('setTreeList', model)
        return model
      })
  },
  /**
 * 移动文档
 * @param {*} payload
 */
  moveDocument ({ state, commit, dispatch }, payload) {
    return request
      .put(`documents/move`, { ID: payload.ID, TargetID: payload.To.TargetID })
      .then(res => {
        const list = Document.from(res.data)
        let moveModel = _.find(list, { id: payload.ID })
        commit('deleteDocument', moveModel.id)
        _(list).forEach(item => {
          commit('updateDocument', item)
        })
        return moveModel
      })
  },
  // -----------文件夹、文档公共方法end

  // 发送文档添加历史记录
  addHistoryBySendMessage ({ state, commit }, payload) {
    return request
      .put(`documents/addhistorybysendmessage`, payload)
      .then(res => {
        const model = Document.from(res.data)
        commit('updateDocument', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },

  // 获取历史记录
  loadDocumentHistory ({ state, commit }, docID) {
    return request
      .get(`documents/GetHistory`, { id: docID })
      .then(res => {
        // return JSON.parse(res.data.History)
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          history.push(JSON.parse(list[i]))
        }
        return history
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  //* ************************删除相关方法 start */
  // 还原
  undeleteDocument ({ state, commit }, id) {
    return request
      .get('documents/undelete', { id })
      .then(res => {
        let list = Document.from(res.data)
        commit('setDocumentList', list)
        commit('setTreeList', list)
        commit('undeleteTaskInTrash', _.map(list, 'id'))
        return list
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取与我相关的已删除的
  loadDocumentsInMyTrash ({ state, commit }) {
    const time = formatDate(
      new Date() - 3600 * 1000 * 24 * 90,
      'YYYY-MM-DD HH:mm:ss'
    )
    const my = LocalStorage.getItem('myself') || {}
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'AuthorID', Value: my.id, Oper: 'eq' }
      ],
      'And',
      [{ Key: 'DeleteTime', Value: time, Oper: 'ge' }]
    ]
    return request
      .get('documents/getdeletedlist', { query: JSON.stringify(query) })
      .then(res => {
        let list = Document.from(res.data)
        commit('addDocumentsInTrash', list)
        return list
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除
  loadDocumentsInTrash ({ state, commit }, { objectType, objectID } = {}) {
    const time = formatDate(
      new Date() - 3600 * 1000 * 24 * 90,
      'YYYY-MM-DD HH:mm:ss'
    )
    const query = [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ],
      'And',
      [{ Key: 'DeleteTime', Value: time, Oper: 'ge' }]
    ]
    return request
      .get('documents/getdeletedlist', { query: JSON.stringify(query) })
      .then(res => {
        let list = Document.from(res.data)
        commit('addDocumentsInTrash', list)
        return list
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取知识库的已删除
  loadDocumentsInWikiTrash ({ state, commit }, { objectType, objectID } = {}) {
    const query = [
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
    ]
    return request
      .get('documents/getdeletedlist', { query: JSON.stringify(query) })
      .then(res => {
        let list = Document.from(res.data)
        commit('addDocumentsInTrash', list)
        return list
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  //* ************************删除相关方法 end */
  // 产品选型=========================================
  /**
 *获取产品选型文档
 *
 * @param {*} { state, commit }
 * @param {*} { objectID }
 * @returns
 */
  loadProductDocument ({ state, commit }, { objectID }) {
    // 获取当前的model
    let model = _.find(state.documentList, {
      objectType: 'product',
      objectID: +objectID,
      tag: 'SYSTEM_CREATE'
    })
    if (!model && +objectID !== 0) {
      return request
        .get('documents/getproductmodel', { objectID })
        .then(res => {
          model = Document.from(res.data)
          // model.children = model.children.filter(child => child.whiteList.includes(LocalStorage.getItem('myself').id))
          commit('setDocumentList', [...model.children, model])
          commit('setTreeList', [...model.children, model])
          commit('updatePage', {
            offset: state.page.offset + 1,
            nextPageToken: -1
          })
          return model
        })
    } else {
      return model
    }
  }
}
