<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="$t('archive.area')"
      :actions="headerActions"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    >
    </tw-header-card>
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='productDev'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
  </q-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ArchivedProductDevs',
  data () {
    return {
      options: [
        {
          label: this.$t('productDev.sortBy.myFocus'),
          value: 'myFocus'
        },
        {
          label: this.$t('productDev.sortBy.type'),
          value: 'CONVERT(Type USING gbk)'
        },
        {
          label: this.$t('productDev.sortBy.title'),
          value: 'CONVERT(Title USING gbk)'
        },
        {
          label: this.$t('productDev.sortBy.organizeName'),
          value: 'CONVERT(OrgShortName USING gbk)'
        }
      ]
    }
  },
  watch: {
    // refresh PageProject componet
    sort () {
      this.resetState()
    },
    order () {
      this.resetState()
    }
  },
  computed: {
    ...mapState('productDev', ['sort', 'order', 'search', 'listStyle']),
    selectCondition () {
      const query = [{ Key: 'Archived', Value: 1, Oper: 'eq' }]
      return { filter: { Archived: 1 }, query: query, sort: this.sort, order: this.order, search: this.search }
    },
    headerActions () {
      // 表格视图时，移除下拉排序（由点击表头进行排序替代）
      return this.listStyle === 'showtable' ? ['menu'] : ['menu', 'select']
    }
  },
  created () {
    this.resetState()
  },
  methods: {
    ...mapMutations('productDev', ['setSort', 'setSearch', 'setPage', 'emptyProductDevs']),
    sortUpdate (value) {
      this.resetState()
      this.setSort(value)
    },
    resetState () {
      this.emptyProductDevs()
      this.setPage({
        offset: 0,
        limit: 20,
        total: 0
      })
    }
  },
  components: {
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
</style>
