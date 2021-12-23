<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <tw-header-card :title="$t('product.selection.archive')">
    </tw-header-card>
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='productSelection'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
  </q-card>
</template>

<script>
export default {
  name: 'SelectionArchived',
  computed: {
    selectCondition () {
      const _query = [{ Key: 'Archived', Value: 1, Oper: 'eq' }, 'and', { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]
      return { query: _query }
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
