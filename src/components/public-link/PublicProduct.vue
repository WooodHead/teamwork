<template>
  <q-card-section class="product-public q-pt-xl q-gutter-md">
    <brief :product="product" />

    <div class="text-center title-page"> 技术参数 </div>
    <product-tech-params :techParamsFlat="techParamsFlat" />
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
import Product from '@/store/product/model'
export default {
  name: 'PublicProduct',
  components: {
    Brief: () => import('components/product/template/Brief'),
    ProductTechParams: () => import('components/product/ProductTechParams')
  },
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('product', ['productTechParamsFlat']),
    product () {
      return Product.from(this.publicContent)
    },
    techParamsFlat () {
      return this.productTechParamsFlat(this.product)
    }
  }
}

</script>

<style lang="scss" scoped>
.product-public {
  color: #283c46;
  font-size: 16px;
}
.title-page {
  font-size: 20px;
  font-weight: 700;
}
</style>
