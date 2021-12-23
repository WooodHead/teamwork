<template>
  <div style="overflow-x: hidden;">
    <div
      v-for="group in groups"
      :key="group.id"
    >
      <!-- 列表标题 -->
      <tw-group-header
        :title="group.title+' '+$t('product.new')"
        class="text-body1 q-pt-xs"
      />

      <!-- 列表内容 -->
      <div
        v-if="group.children.length>0"
        class="flex q-gutter-y-md q-my-md"
      >
        <product-card
          v-for="item in group.children"
          :key="item.id"
          :item="item"
        />
      </div>

      <tw-banner-no-result
        v-else
        :info="$t('product.noProducts')"
        class="q-my-md"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ProductHomeCardList',
  components: {
    TwGroupHeader: () => import('components/base/TwGroupHeader'),
    ProductCard: () => import('components/product/card/ProductCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  computed: {
    ...mapGetters('product', ['products']),
    groups () {
      let that = this, res = []
      const rootProducts = this.products.filter(p => p.level === 1)
      _.forEach(rootProducts, rootProduct => {
        let group = { id: rootProduct.id, title: rootProduct.title }
        group.children = _.slice(
          _.filter(that.products, { classification: rootProduct.classification, maturity: 1, level: 4 }),
          0, 6
        )
        res.push(group)
      })
      return res
    }
  },
  methods: {
    ...mapMutations('product', ['resetPage']),
    ...mapActions('product', ['loadProducts'])
  },
  mounted () {
    // 查询条件加入新品限制！！！
    let query = [
      { Key: 'TplCode', Value: '', Oper: 'eq' },
      'and',
      { Key: 'Maturity', Value: 1, Oper: 'eq' }
    ]
    this.resetPage()
    this.loadProducts({ query })
  }
}
</script>

<style lang='scss' scoped>
</style>
