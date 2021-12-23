<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="$t('archive.area')"
      :actions="['select']"
      :select.sync="newSort"
      :selectOptions="sortOptions"
    />
    <!-- 商机列表，key用来刷新opportunity-grid -->
    <opportunity-grid
      class="q-px-xxl"
      :key="$route.name"
      :condition="selectCondition"
    />
  </q-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'opportunityArchived',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('opportunity', ['sort', 'search', 'sortOptions', 'listStyle', 'listPageType']),
    newSort: {
      get () {
        return this.sort
      },
      set (newVal) {
        this.setSort(newVal)
      }
    },
    selectCondition () {
      const _query = [
        { Key: 'Archived', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'IsDelete', Value: 0, 'Oper': 'eq' }
      ]
      if (this.listPageType === 'myList') {
        _query.push(...['and', { 'Key': 'Members', 'Value': LocalStorage.getItem('myself').id, 'Oper': 'inset' }])
      }
      return { query: _query, sort: this.sort, search: this.search }
    }
  },
  methods: {
    ...mapMutations('opportunity', ['setSort'])
  },
  components: {
    OpportunityGrid: () => import('components/opportunity/OpportunityGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
</style>
