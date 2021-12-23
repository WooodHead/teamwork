<template>
  <q-card
    flat
    class="q-mb-md"
  >
    <q-card-section>
      <div class="q-gutter-sm">
        <div class="row  items-center">
          <span class="text-h6">{{ product.title }}</span>
          <product-badge-group :product="product" />
          <q-space />
          <div
            v-if="showDetailBtn"
            class="text-primary cursor-pointer"
            @click="$router.push({name:'productDetail',params:{id:product.id}})"
          >跳转详情</div>
        </div>

        <div style="white-space: pre-wrap;">{{ product.notes }}</div>

        <template v-if="showBrandSpecModel">
          <div >{{ `品牌：${product.brand}` }}</div>
          <div >{{ `规格：${product.specModel}` }}</div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'Brief',
  components: {
    ProductBadgeGroup: () => import('components/product/ProductBadgeGroup')
  },
  props: {
    product: { type: Object, required: true },
    showDetailBtn: { type: Boolean, default: false }
  },
  computed: {
    showBrandSpecModel () {
      return !['machinetool', 'sample'].includes(this.product.classification)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
