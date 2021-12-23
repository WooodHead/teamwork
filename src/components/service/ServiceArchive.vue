<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('service.cardTitle.archive')">
    </tw-header-card>

    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='service'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState } from 'vuex'
export default {
  name: 'ServiceArchive',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceGrid: () => import('components/resource/ResourceGrid')
  },
  props: {},
  data () {
    return {}
  },
  computed: {
    ...mapState('service', ['sort', 'search', 'listPageType']),
    selectCondition () {
      const query = [{ Key: 'Archived', Value: 1, Oper: 'eq' }, 'and', { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]
      if (this.listPageType === 'myList') {
        query.push(...['and', { 'Key': 'Members', 'Value': LocalStorage.getItem('myself').id, 'Oper': 'inset' }])
      }
      return { query, sort: this.sort, search: this.search }
    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
