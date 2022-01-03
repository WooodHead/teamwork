<!--
@Name：文档中心文件夹卡片内容展示区域
@Author：陆欢
@date：2021/02/25
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <!-- 文件夹归档说明区 -->
    <q-card-section v-if="isPartOfArchived||model.archived">
      <div class="items-start q-px-xxl">
        <tw-archive-part-notes
          v-if="isPartOfArchived"
          :category="category"
          :objectID="+objectID"
          :parentID="model.parentId"
          :parentLabel="$t('document.folder')"
          type="document"
        />
        <tw-archive-notes
          v-else
          :id="model.id"
          type="document"
          :label="$t('document.folder')"
          :archiveTime="model.archiveTime"
          :archiveBy="model.archiveBy"
        />
      </div>
    </q-card-section>
    <q-card-section v-if="documents.length === 0&&!search&&!showLoading">
      <!-- 未检索没有数据 -->
      <folder-no></folder-no>
    </q-card-section>

    <!-- 文件夹内容展示区 -->
    <q-card-section>
      <!-- 检索时没有数据 -->
      <div v-if="documents.length === 0&&search">
        {{ $t("toolbar.noSearchResults") }}
      </div>
      <!-- 文件夹列表区域 -->
      <!-- 草稿内容区 -->
      <draft-header
        v-if="draftTotals>0&&!search"
        class="q-pt-sm q-mb-lg"
        :id="+model.id"
        :category="category"
        :objectID="objectID"
        :draftTotals='draftTotals'
      />
      <!-- 滚动加载文件区域 -->
      <q-infinite-scroll
      v-if="(editWikiAuth(objectID)&&model.acl===1)||[0,2].includes(model.acl)"
      ref="qInfiniteScroll"
      @load="onLoad"
      :offset="250"
      >
        <!-- <div class="fit row q-gutter-md justify-evenly"> -->
        <draggable
          v-model="draggableDocuments"
          :disabled="draggableDisabled"
          @start="onDragStart"
          class="fit row q-gutter-md justify-evenly list-group"
          v-bind="dragOptions"
          handle=".handle"
        >
          <template v-if="listType==='card'">
            <folder-add
              v-if="Object.keys(emptyFolder).length"
              :category="category"
              :objectID="objectID"
              :id="id"
              class="q-mr-md span-stype handle"
            ></folder-add>
            <div
              v-for="item in documents"
              :key="item.id"
              class="span-stype handle"
            >
              <template v-if="item.classify==='folder'">
                <product-case-card
                  :folder="item"
                  v-if="item.objectType==='productCase'&&$route.name!=='documentCenter'"
                />
                <!-- 文件夹卡片、列表、思维导图切换 -->
                <folder-card
                  v-else
                  :folder="item"
                ></folder-card>
              </template>

              <file-card
                v-else
                :file="item"
              >
              </file-card>
            </div>
          </template>
          <folder-table
            v-else-if="documents.length&&listType==='table'"
            :list="documents"
            @restart="restart"
            :category="category"
            :objectID="objectID"
            :id="id"
          ></folder-table>

          <folder-list
            v-else-if="documents.length&&listType==='list'"
            :list="documents"
            @restart="restart"
            :category="category"
            :objectID="objectID"
            :id="id"
          ></folder-list>

        </draggable>
        <!-- </div> -->
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

      <tw-banner-no-result
      v-if="!editWikiAuth(objectID)&&model.acl===1"
      info="没有查看权限"
    />
      <!-- 归档文档数量显示区域 -->
      <tw-archived-count
        v-if="archiveNum&&!search"
        :label="$t('archive.someArchived',{count:archiveNum,something:$t('document.title')})"
        @click="achiveCount"
      />
    </q-card-section>
    <!-- 文件夹保密区 -->
    <q-card-section v-if="model.acl===2">
      <tw-secrecy-area
        :currentModel="model"
        :parentModel="modelParent"
      />
    </q-card-section>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import { computedOrder } from '@/utils/computed-order'
export default {
  name: 'FolderContent',
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
  watch: {
    category (val) {
      this.restart()
    },
    id (val) {
      this.restart()
    }
  },
  computed: {
    ...mapState('document', ['page', 'search', 'sort', 'emptyFolder', 'archivedCount', 'listType']),
    ...mapGetters('wiki', ['editWikiAuth']),
    draggableDisabled () {
      const haveEdit =
        (this.model.onlyICanEdit && (this.model.authorID === this.$myinfo.id || this.$myinfo.auth.role.isSystemAdministrator)) ||
        !this.model.onlyICanEdit
      return ['Title', 'ModifyTime'].includes(this.sort) || !haveEdit
    },
    model () {
      if (this.category && this.objectID && this.id === 0) {
        return this.category === 'product'
          ? this.$store.getters['document/productDocument'](+this.objectID)
          : this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    },
    modelParent () {
      return this.model ? _.find(this.$store.state.document.documentList, d => d.id === this.model.parentId) : {}
    },
    archiveNum () {
      return (this.archivedCount[+this.model.id] && this.archivedCount[+this.model.id].count) || 0
    },
    draggableDocuments: {
      get () {
        let list = null
        if (this.category === 'product') {
          list = this.$store.getters['document/productDocuments'](+this.objectID)
        } else {
          list = this.$store.getters['document/documents'](+this.model.id || +this.id, this.category === 'productCase')
          // list = _.orderBy(list, ['isPublish', 'orderNumber'], ['asc', 'desc'])
        }
        list.unshift({ 'fixed': true, orderNumber: 0 })
        return list
      },
      set (newValue) {
        const id = this.dragDocument.id
        newValue.shift()

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
    documents () {
      if (this.category === 'product') {
        const data = this.$store.getters['document/productDocuments'](+this.objectID)
        return data
      } else {
        const data = this.$store.getters['document/documents'](+this.model.id || +this.id, this.$route.name === 'productCaseHome')
        return data
      }
    },
    showLoading () {
      return !(this.page.nextPageToken === -1)
    }
  },
  methods: {
    ...mapActions('document', [
      'loadDocument',
      'showArchiveList',
      'loadDraftCount',
      'loadArchivedCount',
      'isHaveParentArchive',
      'loadDocumentByQuery',
      'loadProductDocument',
      'updateDocumentField']),
    ...mapMutations('document', ['initPage']),
    initLoadCallback () {
      var _this = this
      if (!(_this.category && _this.objectID && _this.model.id === 0)) {
        _this.loadDraftCount(_this.model.id).then(draftTotals => {
          _this.draftTotals = draftTotals
        })
        _this.loadArchivedCount(_this.model.id || +_this.id)
        if (+_this.model.id !== 0) {
          _this.isHaveParentArchive(_this.model.id).then(res => {
            _this.isPartOfArchived = res
          })
        }
      } else if (_this.model.id < 1) {
        // 虚拟文件夹下的
      }
    },
    updateMembers (ids) {
      this.model.whiteList = ids
      this.$store.dispatch(`document/updateDocument`, this.model)
        .then(res => {
          this.$q.notify({ message: '设置成功！', icon: 'check', color: 'positive' })
        })
    },
    cancelSecrecy () {
      if (this.modelParent.acl === 2) {
        this.$q.notify({ message: '无法解除保密，请先设置父级文件夹为公开状态！', icon: 'check', color: 'purple' })
        return
      }
      this.$q.dialog({
        title: '温馨提示',
        message: '是否要公开其下所有子文档？',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.model.acl = 0
        this.$store.dispatch(`document/updateDocument`, this.model)
          .then(res => {
            this.$q.notify({ message: '解除成功！', icon: 'check', color: 'positive' })
          })
      }).onCancel(() => { })
    },
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
            endQuery: query
          })
          .then(res => {
            this.$emit('update:id', res.id)
            this.loadDocument(res.id).then(res => {
              this.doneCall(index, done)
            })
          })
      } else if (this.category === 'product' && +this.objectID > 0) {
        this.loadProductDocument({ objectID: +this.objectID })
          .then(res => {
            this.doneCall(index, done)
          })
      } else if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
        this.$store.dispatch(`document/loadResourceDocument`, { objectType: this.category, objectID: +this.objectID })
          .then(res => {
            this.loadDocument(res.id).then(res => {
              this.doneCall(index, done)
            })
          })
      } else {
        this.loadDocument(+this.id).then(res => {
          this.doneCall(index, done)
        })
      }
    },
    doneCall (index, done) {
      if (index === 1 && this.$route.name !== 'productCaseHome') {
        this.initLoadCallback()
      }
      if (this.page.nextPageToken === -1) {
        done(true)
      } else {
        done()
      }
    },
    achiveCount () {
      this.showArchiveList(this.model.id || +this.id)
    },
    onDragStart (event) {
      this.dragDocument = this.documents[event.oldIndex]
    }
  },
  components: {
    draggable,
    FolderNo: () => import('components/document/folder/FolderNo'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    FolderList: () => import('components/document/folder/FolderList'),
    FolderTable: () => import('components/document/folder/FolderTable'),
    FolderAdd: () => import('components/document/folder/FolderAdd'),
    FileCard: () => import('components/document/DocumentCard'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwArchivePartNotes: () => import('components/base/TwArchivePartNotes'),
    DraftHeader: () => import('components/document/draft/DraftHeader'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea'),
    ProductCaseCard: () => import('components/product-case/ProductCaseCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
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
