<!--
@Name：组件
@Author：陆欢
@date：2021/11/22
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <mind-map
    :code="markDownContent"
    :title="model.title"
    :btns="['download', 'fit', 'full']"
    style="height: 650px;"
    @click.native="itemClick"
    class="cursor-pointer"
  />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
export default {
  name: 'FolderMindMap',
  mixins: [showCardDetail],
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    }
  },
  data () {
    return {
    }
  },
  watch: {
    id (val) {
      this.loadList()
    }
  },
  mounted () {
    this.loadList()
  },
  computed: {
    ...mapState('document', ['arrMarkDown']),
    ...mapGetters('document', ['markDownTree']),
    model () {
      if (this.category && this.objectID && this.id === 0) {
        return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    },
    markDownContent () {
      let that = this
      let content = []
      if (this.model && this.model.id && that.arrMarkDown.length) {
        let arrPath = this.model.path.split(',')
        let f = _.filter(that.arrMarkDown, a => { return arrPath.includes(a.id.toString()) })
        if (f.length === arrPath.length) {
          content = f
        }
      } else {
        content = this.markDownTree(this.id || this.model.id)
        let diff = _.differenceBy(that.arrMarkDown, content, 'id')
        that.arrMarkDown.push(...diff)
      }
      content = _.join(_.map(content, 'label'), ' ')
      return content
    }
  },
  methods: {
    ...mapActions('document', ['loadProductDocument', 'loadDocuments', 'loadModel']),
    itemClick (event) {
      const id = event.target.id
      const classify = event.target.getAttribute('classify')

      if (id && classify) {
        if (classify === 'folder') {
          this.showFolderDetail(this.category, this.objectID, +id)
        } else {
          this.fileDetail(this.category, this.objectID, +id, classify)
        }
      }
    },
    loadList () {
      if (this.category === 'selfService' && Number(this.id) === 0) {
        // 获取工程服务级文件夹当成当前文件夹的父级
        let query = [
          { Key: 'ObjectType', Value: 'selfService', Oper: 'eq' },
          'and',
          { Key: 'Level', Value: 1, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: 0, Oper: 'eq' }]

        this.loadDocumentByQuery(
          {
            frontQuery: (m) => {
              return m.objectType === 'selfService' && m.level === 1 && m.objectID === 0
            },
            endQuery: query,
            onlyGetData: true
          })
          .then(res => {
            this.loadAllChildrenDocuments(res, 6)
          })
      } else if (this.category === 'product' && +this.objectID > 0) {
        this.loadProductDocument({ objectID: +this.objectID })
          .then(res => {
            this.loadAllChildrenDocuments(res, 6)
          })
      } else if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
        this.$store.dispatch(`document/loadResourceDocument`, { objectType: this.category, objectID: +this.objectID })
          .then(res => {
            this.loadAllChildrenDocuments(res, 6)
          })
      } else {
        this.loadModel({ id: +this.id, fields: 'MindMap' })
          .then(res => {
            this.loadAllChildrenDocuments(res, 6)
          })
      }
    }
  },
  components: {
    MindMap: () => import('components/document/markmap/MindMap')
  }
}
</script>

<style scoped>
</style>
