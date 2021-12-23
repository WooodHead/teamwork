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
    <!-- 订单列表，key用来刷新order-grid -->
    <order-grid
      class="q-px-xxl"
      :selectKey="listPageType.key"
      :condition="selectCondition"
    />
  </q-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'OrderArchived',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('order', ['sort', 'search', 'sortOptions', 'listStyle', 'listPageType']),
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
        { Key: 'Archived', Value: 1, Oper: 'eq' }
      ]
      if (this.listPageType === 'myList') {
        _query.push(...['and', { 'Key': 'Members', 'Value': this.$myinfo.id, 'Oper': 'inset' }])
      }
      return { query: _query, sort: this.sort, search: this.search }
    }
  },
  methods: {
    ...mapMutations('order', ['setSort'])
  },
  components: {
    OrderGrid: () => import('components/order/OrderGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
</style>
