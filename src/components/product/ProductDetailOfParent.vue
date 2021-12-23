<template>
  <!-- 类别卡片列表 -->
  <div :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'">
    <div
      v-if="loading"
      class="row justify-center q-pa-md"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <product-card-list
      v-else
      :menus="['edit', 'delete', 'changeCover']"
      :items="products"
    />

    <product-samples :product-id="product.id" />

    <product-documents :product-id="product.id" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProductDetailOfParent',
  components: {
    ProductCardList: () => import('components/product/card/ProductCardList'),
    ProductSamples: () => import('components/product/ProductSamples'),
    ProductDocuments: () => import('components/product/ProductDocuments')
  },
  props: {
    product: { type: Object, required: true }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters('product', ['productChildren']),
    products () {
      return this.productChildren(this.product.id)
    }
  },
  methods: {
    ...mapActions('product', ['loadProductChildren'])
  },
  mounted () {
    this.loadProductChildren(this.product.id).then(() => { this.loading = false })
  }
}
</script>

<style lang='scss' scoped>
</style>
