<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card
      :class="{'row items-center justify-between': $q.screen.lt.sm}"
      :title="$t('archive.area')"
      :actions="headerActions"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    />
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='project'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ArchivedProjects',
  data () {
    return {
      options: [
        {
          label: this.$t('project.sortBy.myFocus'),
          value: 'myFocus'
        },
        {
          label: this.$t('project.sortBy.level'),
          value: 'ProjLevel'
        },
        {
          label: this.$t('project.sortBy.projNum'),
          value: 'ProjNum'
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
    ...mapState('project', ['sort', 'order', 'listStyle', 'search']),
    ...mapGetters('project', ['currentListPageParams']),
    selectCondition () {
      let query = _.cloneDeep(this.currentListPageParams.selectCondition.query)
      let archivedKey = _.find(query, l => l.Key === 'Archived')
      archivedKey && (archivedKey.Value = 1)
      return { filter: { Archived: 1 }, query: query, sort: this.sort, order: this.order, search: this.search }
    },
    headerActions () {
      // 表格视图时，移除下拉排序（由点击表头进行排序替代）
      return this.listStyle === 'showtable' ? ['menu'] : ['select', 'menu']
    }
  },
  methods: {
    ...mapMutations('project', ['setSort', 'updatePage', 'emptyProjects']),
    sortUpdate (value) {
      this.setSort(value)
    },
    resetState () {
      this.emptyProjects()
      this.updatePage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
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
