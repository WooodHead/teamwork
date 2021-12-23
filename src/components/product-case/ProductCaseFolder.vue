<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 头部区域 -->
    <tw-header-card
      :title="$t('productCase.title')"
      :add="addAction"
      :actions="['add','select']"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    >
    </tw-header-card>
    <!-- 初始化未更新，正在加载中 -->
    <div
      class="row justify-center q-py-md"
      v-if="id===0"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <folder-content
      :class="{'q-px-xxl':!$q.platform.is.mobile}"
      :id="id"
      ref="folderContent"
      v-if="id>0"
      category="productCase"
    />
    <q-dialog v-model="showDialog">
      <product-case-form :id="id" />
    </q-dialog>
  </q-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ProductCaseFolder',
  data () {
    return {
      showDialog: false,
      options: [
        { label: this.$t('document.sortBy.UnSorted'), value: 'IsPublish asc,OrderNumber' },
        { label: this.$t('document.sortBy.Title'), value: 'Title' },
        { label: this.$t('document.sortBy.DueDate'), value: 'ModifyTime' }
      ],
      addAction: {
        label: this.$t('productCase.add'),
        click: () => { this.addEmptyFolder() }
      },
      id: 0
    }
  },
  mounted () {
    // 获取成熟案例库的文档ID
    let query = [
      { Key: 'ObjectType', Value: 'productCase', Oper: 'eq' },
      'and',
      { Key: 'Level', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'ParentID', Value: 0, Oper: 'eq' }]
    this.loadDocumentByQuery(
      {
        endQuery: query,
        fields: 'DocID',
        onlyGetData: true
      })
      .then(res => {
        this.id = res ? res.id : 0
      })
    this.setListType('card')
  },
  computed: {
    ...mapState('document', ['page', 'search', 'sort']),
    model () {
      if (this.category && this.objectID && this.id === 0) {
        return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    }
  },
  methods: {
    ...mapMutations('document', ['setSortAndOrder', 'setListType']),
    ...mapActions('document', ['addEmptyFolder', 'loadDocumentByQuery']),
    // 有问题
    sortUpdate (value) {
      this.setSortAndOrder(value)
      this.$refs.folderContent.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
      this.$refs.folderContent.$refs.qInfiniteScroll.resume() // 重新开启加载
      this.$refs.folderContent.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FolderContent: () => import('components/document/folder/FolderContent'),
    ProductCaseForm: () => import('components/product-case/ProductCaseForm')
  }
}
</script>

<style lang="scss" scoped>
  .card-grow-in-page {
    max-width: 90vw;
  }
  @media (max-width: $breakpoint-xs-max) {
    .card-grow-in-page {
      min-width: 100%;
    }
  }
</style>
