<!--  -->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题 -->
    <product-header-card :title="$t('product.myOrder')" />

    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      category='productSelection'
      class="q-gutter-y-lg q-px-xxl"
      :key="$route.name"
      :selectCondition="selectCondition"
    />
    <!--归档配置单说明区-->
    <q-card-section v-if="archivedCount">
      <tw-archived-count
        :label="$t('archive.someArchived',{count:archivedCount,something:'产品配置'})"
        @click="showArchiveList()"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SelectionList',
  data () {
    return {
    }
  },
  computed: {
    ...mapState('productSelection', ['archivedCount', 'selections']),
    selectCondition () {
      const _query = [{ Key: 'Archived', Value: 0, Oper: 'eq' }, 'and', { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]
      return { query: _query }
    }
  },
  components: {
    ProductHeaderCard: () => import('components/product/ProductHeaderCard'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwArchivedCount: () => import('components/base/TwArchivedCount')
  },
  mounted () {
    this.loadProductSelections()
    this.loadArchivedCount()
  },
  methods: {
    ...mapActions('productSelection', ['loadProductSelections', 'loadArchivedCount']),
    // 跳转至我的配置单详情页
    toSelectDetail (id) {
      this.$router.push({
        name: 'productSelectionDetail',
        params: {
          id: +id
        }
      })
    },
    // 跳转到归档区
    showArchiveList () {
      this.$router.push({
        name: 'archivedProductSelection',
        params: { type: this.listPageType }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.setting-card {
  width: 150px;
  height: 150px;
}
.setting-card-border {
  border-radius: 0.3rem;
  border: 1px solid $grey-4;
}
.my-card {
  width: 100%;
  max-width: 240px;
}
</style>
