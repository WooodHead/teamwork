import { mapState, mapMutations } from 'vuex'
export default {
  watch: {
    listType (newVal, oldVal) {
      if (['table', 'card'].includes(newVal) && oldVal === 'mindMap') {
        this.resetInfiniteScroll()
      }
    }
  },
  methods: {
    ...mapMutations('document', ['setSortAndOrder', 'setSearch', 'setListType']),
    // 有问题
    sortUpdate (value) {
      this.setSortAndOrder(value)
      this.resetInfiniteScroll()
    },
    // 有问题
    searchUpdate (value) {
      this.setSearch({ id: +this.model.id || +this.id, value: value })
      this.resetInfiniteScroll()
    },
    resetInfiniteScroll () {
      this.$nextTick(() => {
        this.$refs.folderContent.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
        this.$refs.folderContent.$refs.qInfiniteScroll.resume() // 重新开启加载
        this.$refs.folderContent.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      })
    }
  },
  computed: {
    ...mapState('document', ['page', 'search', 'sort', 'listType']),
    options () {
      let o = [
        {
          label: this.$t('document.sortBy.UnSorted'),
          value: 'IsPublish asc,OrderNumber'
        },
        {
          label: this.$t('document.sortBy.Title'),
          value: 'Title'
        },
        {
          label: this.$t('document.sortBy.DueDate'),
          value: 'ModifyTime'
        }
      ]
      if (this.listType === 'table') {
        o.push(...[
          {
            label: this.$t('document.sortBy.AuthorName'),
            value: 'AuthorName'
          },
          {
            label: this.$t('document.sortBy.Size'),
            value: 'Size'
          }
        ])
      }
      return o
    },
    viewType () {
      const views = []
      this.$q.platform.is.desktop && !['productCaseHome', 'productCaseDetail', 'wikiHome'].includes(this.$route.name) &&
        views.push({
          icon: 'app:tw-icon-view-mindmap',
          selectIcon: 'img:icons/view/视图-思维导图-1.svg',
          value: 'mindMap',
          title: '思维导图视图'
        })
      views.push({
        icon: 'app:tw-icon-view-card',
        selectIcon: 'img:icons/view/视图-卡片-1.svg',
        value: 'card',
        title: '卡片视图'
      })
      this.$q.platform.is.desktop && views.push({
        icon: 'app:tw-icon-view-table',
        selectIcon: 'img:icons/view/视图-表格-1.svg',
        value: 'table',
        title: '表格视图'
      })
      // this.$q.platform.is.mobile
      this.$q.platform.is.mobile && views.push({
        icon: 'app:tw-icon-view-list',
        selectIcon: 'img:icons/view/视图-列表-1.svg',
        value: 'list',
        title: '列表视图'
      })
      return views
    }
  }
}
