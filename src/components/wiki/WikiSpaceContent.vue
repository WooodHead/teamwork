<!--
@Name：知识空间内容区
@Author：陆欢
@date：2021/12/07
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-card-section v-if="documents.length === 0&&!search&&!showLoading">
      <!-- 未检索没有数据 -->
      <folder-no content="知识库暂无内容"></folder-no>
    </q-card-section>

    <!-- 文件夹内容展示区 -->
    <q-card-section>
      <!-- 检索时没有数据 -->
      <div v-if="documents.length === 0&&search">
        {{ $t("toolbar.noSearchResults") }}
      </div>
      <!-- 滚动加载文件区域 -->
      <q-infinite-scroll
        ref="qInfiniteScroll"
        @load="onLoad"
        :offset="250"
      >
        <draggable
          v-model="draggableDocuments"
          :disabled="draggableDisabled"
          @start="onDragStart"
          class="fit row q-gutter-md justify-evenly list-group"
          v-bind="dragOptions"
          handle=".handle"
        >
          <template v-if="listType==='card'">
            <div
              v-for="item in documents"
              :key="item.id"
              class="span-stype handle"
            >
              <wiki-space-card :model="item"></wiki-space-card>
            </div>
          </template>
          <folder-table
            v-else-if="documents.length&&listType==='table'"
            :list="documents"
            @restart="restart"
            category="wiki"
            :objectID="model.objectID"
            :id="id"
          ></folder-table>

          <folder-list
            v-else-if="documents.length&&listType==='list'"
            :list="documents"
            @restart="restart"
            category="wiki"
            :objectID="model.objectID"
            :id="id"
          ></folder-list>
        </draggable>

        <template
          v-slot:loading
          v-if="showLoading"
        >
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card-section>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
export default {
  name: 'WikiSpaceContent',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      draftTotals: 0,
      isPartOfArchived: false,
      dragDocument: {}, // 拖拽的文档
      dragOptions: {
        animation: 300,
        delay: 200,
        scroll: true,
        scrollSensitivity: '500',
        // 输入组件不可拖拽
        // filter: '.undraggable,input',
        // 样式
        ghostClass: 'ghost',
        chosenClass: 'chosen'
      }
    }
  },
  computed: {
    ...mapState('document', ['page', 'search', 'sort', 'emptyFolder', 'archivedCount', 'listType']),
    draggableDisabled () {
      return true
    },
    model () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    documents () {
      const data = this.$store.getters['document/documents'](+this.id, false)
      return data
    },
    draggableDocuments: {
      get () {
        let list = this.$store.getters['document/documents'](+this.id, false)
        return list
      },
      set (newValue) {
        const id = this.dragDocument.id

        let index = _.findIndex(newValue, { 'id': id })
        let next = newValue[index + 1]
        let prev = newValue[index - 1]
        let prevOrder = 0
        let nextOrder = 0
        if (prev && next) {
          prevOrder = prev.orderNumber
          nextOrder = next.orderNumber
        } else if (!prev && next) {
          prevOrder = next.orderNumber
          nextOrder = next.orderNumber.toString() + '1'
        } else if (prev && !next) {
          prevOrder = 0
          nextOrder = prev.orderNumber
        }
        let orderNumber = computedOrder(nextOrder, prevOrder)
        this.updateDocumentField({ DocID: id, OrderNumber: orderNumber })
        newValue[index].orderNumber = orderNumber
      }
    },
    showLoading () {
      return !(this.page.nextPageToken === -1)
    }
  },
  watch: {
    id (val) {
      this.restart()
    }
  },
  methods: {
    ...mapActions('document', ['updateDocumentField', 'loadWikiSpace']),
    ...mapMutations('document', ['initPage']),
    restart () {
      this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
      this.$refs.qInfiniteScroll.resume() // 重新开启加载
      this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    },
    onLoad (index, done) {
      if (index === 1) {
        // 重置分页参数
        this.initPage()
      }
      if (+this.id > 0) {
        this.loadWikiSpace({ parentId: +this.id, sort: this.sort === 'IsPublish asc,OrderNumber' ? 'DocID' : this.sort }).then(res => {
          if (this.page.nextPageToken === -1) {
            done(true)
          } else {
            done()
          }
        })
      } else {
        done(true)
      }
    },
    onDragStart (event) {
      this.dragDocument = this.documents[event.oldIndex]
    }
  },
  components: {
    draggable,
    FolderNo: () => import('components/document/folder/FolderNo'),
    FolderList: () => import('components/document/folder/FolderList'),
    FolderTable: () => import('components/document/folder/FolderTable'),
    WikiSpaceCard: () => import('components/wiki/WikiSpaceCard')
  }
}
</script>

<style lang="scss">
@media (max-width: $breakpoint-xs-max) {
  .span-stype {
    width: 43%;
  }
}
.ghost {
  border-radius: 0.6rem;
  // background-color: #9dc1e3;
  border: 0.15rem dashed $grey-5;
}
.chosen {
  border-radius: 0.6rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
.ghost .widget-card {
  background: #f6f2ef7a !important;
  border-radius: 0.6rem;
}
</style>
