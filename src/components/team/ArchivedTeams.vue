<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="$t('archive.area')"
      :actions="['select']"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    >
    </tw-header-card>
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='team'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
  </q-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ArchivedTeams',
  data () {
    return {
      options: [
        {
          label: this.$t('team.sortBy.type'),
          value: 'CONVERT(Type USING gbk)'
        },
        {
          label: this.$t('team.sortBy.title'),
          value: 'CONVERT(Title USING gbk)'
        },
        {
          label: this.$t('team.sortBy.organizeName'),
          value: 'CONVERT(OrgShortName USING gbk)'
        }
      ]
    }
  },
  computed: {
    ...mapState('team', ['sort', 'search', 'listStyle']),
    selectCondition () {
      const _query = [{ Key: 'Archived', Value: 1, Oper: 'eq' }]
      return { query: _query, sort: this.sort, search: this.search }
    }
  },
  created () {
    this.resetState()
  },
  methods: {
    ...mapMutations('team', ['setSort', 'setSearch', 'setPage', 'emptyTeams']),
    sortUpdate (value) {
      this.resetState()
      this.setSort(value)
    },
    searchUpdate (value) {
      this.resetState()
      this.setSearch(value)
    },
    resetState () {
      this.emptyTeams()
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
