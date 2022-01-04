import { mapState, mapMutations } from 'vuex'
export default {
  watch: {
    listType (newVal, oldVal) {
      // 清空数据，重新加载
      this.$store.state.followup.followups = []
      this.$store.state.followup.page = { offset: 0, limit: 10, nextPageToken: 0 }
      if (['table', 'card'].includes(newVal)) {
        this.resetInfiniteScroll()
      }
    }
  },
  methods: {
    ...mapMutations('followup', ['setSearch', 'setListType']),
    // 有问题
    sortUpdate (value) {
      this.resetInfiniteScroll()
    },
    // 有问题
    searchUpdate (value) {
      this.resetInfiniteScroll()
    },
    resetInfiniteScroll () {
      this.$nextTick(() => {
        this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
        this.$refs.qInfiniteScroll.resume() // 重新开启加载
        this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      })
    }
  },
  computed: {
    ...mapState('followup', ['page', 'search', 'sort', 'listType']),
    options () {
      let o = [
        {
          label: this.$t('document.sortBy.Title'),
          value: 'title'
        },
        {
          label: this.$t('document.sortBy.DueDate'),
          value: 'modifyTime'
        }
      ]
      return o
    },
    viewTypes () {
      const views = []
      this.$q.platform.is.desktop && this.$route.name !== 'wikiHome' &&
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
