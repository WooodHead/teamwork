import { listToTree } from '@/utils/list-to-tree'
import { LocalStorage } from 'quasar'
const my = LocalStorage.getItem('myself') || {}
export default {
  resourceDocument: (state, getters) => (objectType, objectID) => {
    let rootDoc = _.find(state.documentList,
      function (item) {
        return item.objectType === objectType &&
          item.objectID === +objectID &&
          item.level === 2
      }) ||
      {}

    // 机构下的精益改善报告单独处理
    if (objectType === 'organize' && rootDoc.level === 2) {
      const sortDocument = getters.documentListSorted
      let leanQualityDoc = _.find(sortDocument, { parentId: rootDoc.id })
      leanQualityDoc &&
        !_.some(rootDoc.children, { id: leanQualityDoc.id }) &&
        rootDoc.children.unshift(leanQualityDoc)
    }

    return rootDoc
  },
  currentModel: (state, getters) => (id) => {
    return _.find(state.documentList, { id: +id }) || {}
  },
  resourceDocuments: (_state, getters) => (objectType, objectID) => {
    const sortDocument = getters.documentListSorted
    return _.filter(sortDocument, function (item) { return item.objectType === objectType && item.objectID === +objectID && item.level === 2 })
  },
  // 1.2、文件夹与文档卡片获取数据方法
  documents: (_state, getters) => (id, havePublishCon = false) => {
    const sortDocument = getters.documentListSorted
    if (+id < 0) {
      // 虚拟文件夹通过标签获取
      const model = _.find(sortDocument, { 'id': +id })
      return _.filter(sortDocument, function (item) {
        return item.tag === model.tag && item.level === model.level + 1 && !item.archived && item.isPublish
      })
    } else {
      return _.filter(sortDocument, function (item) {
        return item.parentId === +id && !item.archived && (item.isPublish || havePublishCon)
      })
    }
  },
  // 1.3、归档文档相关方法
  IsHaveParentArchive: (_state, getters) => (id) => {
    const sortDocument = getters.documentListSorted
    let archiveDocument = _.filter(sortDocument,
      function (item) { return item.parentId === +id && item.archived && item.isPublish })
    return archiveDocument.length
  },
  // 模糊搜索
  documentListFiltered: state => {
    let search = state.search
    if (search) {
      return _.filter(state.documentList, doc =>
        doc.title && doc.title.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return state.documentList
    }
  },
  // 字段排序
  documentListSorted: (state, getters) => {
    const filterDocument = getters.documentListFiltered
    const sortFields = _.camelCase(state.sort)
    if (state.sort.includes('OrderNumber')) {
      const sortDocument = _.orderBy(filterDocument, ['isPublish', 'orderNumber'], ['asc', 'desc'])
      return sortDocument
    } else {
      const sortDocument = _.orderBy(filterDocument, [sortFields], state.order)
      return sortDocument
    }
  },
  // 我的废纸篓
  DocumentsInMyTrash: (state) => {
    let list = state.documentsInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    list = listToTree(list, 'id', 'parentId')
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 资源废纸篓
  DocumentsInTrash: (state) => (objectType, objectID) => {
    let list = state.documentsInTrash.filter(item => item.objectType === objectType && item.objectID === +objectID)
    list = listToTree(list, 'id', 'parentId')
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  markDownTree: (state, getters) => (folderId) => {
    let arrTree = []
    const parent = _.find(state.documentList, { 'id': +folderId })
    if (parent) {
      // 拼接点击路径
      arrTree.push({ id: +folderId, level: parent.level, path: parent.path, label: `# <span id="${parent.id}" classify="${parent.classify}">${parent.title}</span></span> \n` })
      getters.getMarkDownStruct(+folderId, arrTree, parent.level)
      return arrTree
    } else {
      return []
    }
  },
  // [主页](http://172.18.20.2:8086/productDev/)
  getMarkDownStruct: (state, getters) => (folderId, arrTree = [], baseLevel) => {
    // const parent = _.find(state.documentList, { 'id': +folderId })
    let listChildren = _.filter(state.documentList, { 'parentId': +folderId })

    if (listChildren.length) {
      let c = []
      let foldersC = _.filter(listChildren, ['classify', 'folder'])
      c.push(...foldersC)
      let filesC = _.differenceBy(listChildren, foldersC, 'classify')
      c.push(...filesC)
      listChildren = c

      let arrIndex = _.findIndex(arrTree, ['id', folderId])
      _.forEach(listChildren, function (value, key) {
        let index = (value.level - baseLevel) + 1
        let s = ''
        for (let num = 0; num < index; num++) {
          s += '#'
        }
        if (value.classify === 'folder') {
          arrTree.splice(arrIndex + 1, 0, { id: value.id, level: value.level, path: value.path, label: `${s} <span id="${value.id}" classify="${value.classify}">${value.title}</span> \n` })
          getters.getMarkDownStruct(value.id, arrTree, baseLevel)
        } else {
          arrTree.splice(arrIndex + 1, 0, { id: value.id, level: value.level, path: value.path, label: `- <span id="${value.id}" classify="${value.classify}">${value.title}</span> \n` })
        }
      })
    }
  },
  // ======================================================================
  // 产品选型文档
  productDocument: (_state, getters) => objectID => {
    let rootDoc = _.find(_state.documentList, { objectType: 'product', objectID, tag: 'SYSTEM_CREATE' })
    return rootDoc || {}
  },
  productDocuments: (_state, getters) => objectID => {
    const curFolder = getters.productDocument(objectID)
    if (curFolder.children && curFolder.children.length > 0) {
      const sortDocument = getters.documentListSorted
      return sortDocument.filter(item =>
        curFolder.path.split(',').map(Number).includes(item.parentId) &&
        item.objectType === 'product' &&
        item.classify !== 'folder' &&
        !item.archived &&
        item.isPublish)
    } else {
      return []
    }
  }
}
