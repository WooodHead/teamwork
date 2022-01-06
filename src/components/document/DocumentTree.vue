<!--
@Name：组件
@Author：陆欢
@date：2021/05/24
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-tree
      v-if="nodes.length"
      no-connectors
      :nodes="nodes"
      selected-color="primary"
      node-key="id"
      label-key="title"
      class="q-pt-sm ellipsis document-tree"
      :selected.sync="selected"
      ref="tree"
      @after-show="afterShow"
    >
      <template v-slot:default-header="prop">
        <div class="fit row items-center tree-parent">
          <div class="col cursor-pointer" @click.stop="selectEvent(prop)">
            <q-icon :name="prop.node.icon" />
            {{ prop.node.title }}
          </div>
          <div v-if="wikiAuth" class="row items-center tree-menu">
            <folder-add-menu
              v-if="prop.node.classify === 'folder'"
              label=""
              dense
              flat
              textColor="grey-7"
              :category="category"
              :objectID="objectID"
              :id="prop.node.id"
            />
            <div @click.stop="clickMenuEvent(prop)">
              <folder-menu
                v-if="prop.node.classify === 'folder'"
                flat
                bgColor="bg-white"
                anchor="top left"
                self="bottom left"
                :model="model"
                :category="category"
                :objectID="objectID"
                :excludeButton="['deleteBookmark','bookmark']"
              />
              <file-menu
                v-else
                flat
                bgColor="bg-white"
                anchor="top left"
                self="bottom left"
                :detailModel="model"
                :category="category"
                :objectID="objectID"
                :excludeButton="['deleteBookmark','bookmark']"
              />
            </div>
          </div>
        </div>
      </template>
    </q-tree>
    <div v-else>正在获取数据请稍等...</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import mixinsFile from '@/components/document/folder/mixins-file-click.js'
import { listToTree } from '@/utils/list-to-tree'
export default {
  name: 'DocumentTree',
  mixins: [mixinsFile],
  props: {
    category: {
      type: String,
      default: undefined,
      required: false,
      description: '模块类型：project、team、product'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    },
    rootId: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '根组件的ID'
    },
    wikiAuth: {
      type: Boolean,
      required: false,
      default: false,
      description: '知识空间是否有操作权限'
    }
  },
  data () {
    return {
      selected: +this.rootId,
      page: {
        offset: 0,
        limit: 20,
        nextPageToken: 0
      },
      moreLabel: '查看更多...',
      model: {}
    }
  },
  watch: {
    rootId (newVal, old) {
      if (+newVal !== +old) {
        this.init()
      }
    },
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.selected = newVal.params.id || null
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('document', ['treeList', 'sort', 'search']),
    ...mapGetters('document', ['currentModel']),
    nodes () {
      let list = _.cloneDeep(this.treeList)
      if (+this.rootId) {
        list = _.filter(this.treeList, l => {
          return l.path && l.path.split(',').includes(this.rootId.toString())
        })
        list = _.cloneDeep(list)
      }

      // 如果是成熟案例库，重新处理数据
      if (this.category === 'select-product-case' && list.length) {
        let parent = _.find(list, ['classify', 'folder'])
        let dictType = _.uniq(_.compact(_.map(list, 'tag')))
        parent.children = []
        _(dictType).forEach(function (value, index) {
          let nowDictList = _.filter(list, { 'tag': value })
          nowDictList = _.map(nowDictList, n => { 
            n.parentId = Number(`-${index + 1}`)
            n.level = parent.level + 2
            return n
          })
          let ids = _.map(nowDictList, 'id')
          list = _.filter(list, l => { return !ids.includes(l.id) })
          list.push(...nowDictList)
          list.push({
            id: Number(`-${index + 1}`),
            parentId: parent.id,
            level: parent.level + 1,
            title: value
          })
        })
      }
      let tree = listToTree(list, 'id', 'parentId', '', '', true, (e) => { return e.classify === 'folder' })
      // 此时有可能从其他地方新增的数据，但是其父节点有可能还没获取成功
      if (tree.length > 1) {
        let rootTree = _.find(tree, ['id', +this.rootId])
        tree = [rootTree]
      }
      return tree
    }
  },
  methods: {
    ...mapMutations('document', ['setTreeList']),
    ...mapActions('document', ['loadProductDocument', 'loadDocuments', 'loadModel', 'loadTreeDocuments']),
    init () {
      // 获取文件夹树结构
      const isDocumentCenter = this.$route.path.split('/')[1] === 'document'
      if (!(!isDocumentCenter && +this.rootId === 0) || isDocumentCenter) {
        this.loadModel({ id: +this.rootId, fields: 'MindMap' })
          .then(res => {
            let have = _.find(this.treeList, ['id', +res.id])
            if (!have) {
              this.setTreeList([res])
            }
            // 获取数据
            this.loadAllByPage(res.id)
          })
      }
    },
    loadAllByPage (id, offset, nextPageToken) {
      let query = [
        { Key: 'Archived', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'IsDelete', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ParentID', Value: +id, Oper: 'eq' }
      ]
      this.loadTreeDocuments(
        {
          query,
          sort: this.sort,
          search: this.search,
          limit: 20,
          offset: offset || 0
        })
        .then(res => {
          this.loadModel({ id: +id, fields: 'MindMap' })
            .then(r => {
              // 删掉该父节点下面的查看更多
              let loadMoreIndex = _.findIndex(this.treeList, ['id', `-${+id}`])
              if (loadMoreIndex >= 0) {
                this.treeList.splice(loadMoreIndex, 1)
              }

              if (res.nextPageToken >= 0) {
                this.setTreeList([
                  {
                    id: `-${+id}`,
                    title: this.moreLabel,
                    icon: 'more',
                    parentId: +id,
                    level: r.level + 1,
                    path: r.path,
                    nextPageToken: res.nextPageToken
                  }
                ])
              }
              this.$nextTick(() => {
                let routeId = +this.$route.params.id || +id
                this.selected = routeId

                this.loadModel({ id: routeId, fields: 'MindMap' })
                  .then(res => {
                    if (res) {
                      this.$refs.tree && this.$refs.tree.setExpanded(+id, true)
                    }
                  })
              })
            })
        })
    },
    afterShow () {
      let show = _.last(this.$refs.tree.getExpandedNodes())

      if (show.children.length >= 10) {
        let s = _.find(show.children, ['title', this.moreLabel])
        if (s) {
          let obj = JSON.parse(s.id)
          this.loadAllByPage(+show.id, show.children.length, obj.nextPageToken)
        } else {
          this.loadAllByPage(+show.id, show.children.length, 0)
        }
      }
      // this.$nextTick(() => {
      //   let arrExpands = this.$refs.tree.getExpandedNodes()
      //   _(arrExpands).forEach(a => {
      //     a.classify === 'folder' && (a.icon = 'img:icons/view/小图标-文件夹打开.svg')
      //   })
      // })
    },
    nodeSelected (target) {
      if (!target) {
        return false
      }
      if (_.isNumber(target)) {
        this.selected = +target
        this.loadModel({ id: +target, fields: 'MindMap' })
          .then(res => {
            if (res) {
              if (res.classify === 'folder') {
                this.showFolderDetail(res.objectType, res.objectID, res.id)
              } else {
                this.fileDetail(res.objectType, res.objectID, res.id, res.classify)
              }
            }
          })
      } else {
        let node = this.$refs.tree.getNodeByKey(target)
        let parent = this.$refs.tree.getNodeByKey(+node.parentId)
        this.loadAllByPage(+node.parentId, parent ? parent.children.length : 0, node.nextPageToken)
      }
    },
    selectEvent (prop) {
      if (prop.key > 0) {
        this.model = prop.node
        this.nodeSelected(+prop.node.id)
      }
    },
    clickMenuEvent (prop) {
      this.model = prop.node
    }
  },
  components: {
    FolderMenu: () => import('components/document/folder/FolderMenu'),
    FileMenu: () => import('components/document/file/FileMenu'),
    FolderAddMenu: () => import('components/document/folder/FolderAddMenu')
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-tree__icon,
.q-tree__node-header-content .q-icon,
.q-tree__spinner {
  font-size: 14px;
}
.tree-menu {
  opacity: 0;
  transform: translateY(100%);
}
.tree-parent:hover .tree-menu {
  opacity: 1;
  transform: translateY(0);
}
.document-tree .tree-parent >div{
text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
