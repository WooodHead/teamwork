<template>
  <div style="overflow-x: hidden;">
    <!-- 选型结果列表 -->
    <template v-if="fromSelection">
      <template v-if="matchsObj.title!==''">
        <tw-banner-no-result
          :info="matchsObj.title"
          class="q-mb-md"
        />
      </template>

      <template v-if="matchsObj.matchs.length>0">
        <div class="flex q-gutter-y-md">
          <product-card
            v-for="item in matchsObj.matchs"
            :key="item.id"
            :fromSelection="fromSelection"
            :item="item"
            :menus="menus"
          />
        </div>
      </template>
    </template>

    <!-- 普通列表 -->
    <template v-else>
      <template v-if="items.length>0">
        <div class="flex q-gutter-y-md">
          <product-card
            v-for="item in items"
            :key="item.id"
            :showRelationDel="showRelationDel"
            :item="item"
            :menus="menus"
            @remove="remove"
            @delRelation="$emit('delRelation', item.id)"
          />
        </div>
      </template>

      <template v-else>
        <q-card-section>
          <tw-banner-no-result :info="$t('product.noProducts')" />
        </q-card-section>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProductCardList',
  components: {
    ProductCard: () => import('components/product/card/ProductCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  props: {
    fromSelection: { type: Boolean, default: false },
    showRelationDel: { type: Boolean, default: false },
    items: { type: Array, required: true },
    menus: { type: Array, default: () => [], desc: 'menus可选值delete、edit' }
  },
  computed: {
    matchsObj () {
      let res = { title: '', matchs: [] }
      if (this.fromSelection) {
        // 完全匹配
        let bestMatchs = this.items.filter(i => i.proportion === 100)
        if (bestMatchs.length > 0) {
          res.matchs = bestMatchs
        } else {
          // 匹配度>=50的
          let ltFiftys = this.items.filter(i => i.proportion >= 50)
          if (ltFiftys.length) {
            res.title = '没有完全匹配，推荐以下部分匹配的机床：'
            res.matchs = ltFiftys
          } else {
            // 其它
            res.title = '没有匹配的机床，请修改工艺参数！'
          }
        }
      }
      return res
    }
  },
  methods: {
    remove (item) {
      this.$emit('remove', item)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
