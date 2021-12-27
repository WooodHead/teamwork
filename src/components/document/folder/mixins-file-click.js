// 文件点击事件
export default {
  methods: {
    showFolderDetail (objectType, objectID, id) {
      // 是否是文档中心
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      const isProductCaseHome = this.$route.name === 'productCaseHome'
      // 是否是案例库详情页
      let params = { category: objectType, objectID: objectID, id: id }
      let name = 'folder'
      if (inDocumentCenter) {
        params = { id: id }
      } else if (isProductCaseHome) {
        name = 'productCaseDetail'
        params = { id: id }
      }
      this.$router.push({ name, params })
    },
    fileDetail (objectType, objectID, id, classify) {
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id }
        : { category: objectType === 'productCase' ? 'select-product-case' : objectType, objectID, id }
      objectID === 0 && (params = _.omit(params, ['objectID']))
      this.$router.push({
        name: `${classify}Detail`,
        params
      })
    },
    loadAllChildrenDocuments (model, levelLimit, category) {
      let id = model.id

      let _query = []

      if (this.$route.name === 'documentCenter' || +model.id === 0) {
        _query = [
          { Key: 'Archived', Value: 0, Oper: 'eq' },
          'and',
          { Key: 'IsDelete', Value: 0, Oper: 'eq' }
        ]
      } else {
        _query = [
          { Key: 'Archived', Value: 0, Oper: 'eq' },
          'and',
          { Key: 'Path', Value: id, Oper: 'inset' }]
      }
      if (levelLimit) {
        _query.push('and')
        _query.push({ Key: 'Level', Value: +(model.level + levelLimit), Oper: 'lt' })
      }
      if (category) {
        _query.push('and')
        _query.push({ Key: 'ObjectType', Value: category, Oper: 'eq' })
      }

      _query.push('and')
      let _query1 = [
        { Key: 'IsPublish', Value: 1, Oper: 'eq' }
      ]
      if (model.objectType === 'productCase') {
        _query1.push('or')
        let _query2 = [
          { Key: 'IsPublish', Value: 0, Oper: 'eq' },
          'and',
          { Key: 'AuthorID', Value: +this.$myinfo.id, Oper: 'eq' }
        ]
        _query1.push(_query2)
      }
      _query.push(_query1)
      this.loadDocuments({ query: _query, fields: 'MindMap' })
    }
  }

}
