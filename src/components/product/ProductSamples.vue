<template>
  <div>
    <div class="relative-position row items-center text-subtitle1 q-pt-md">
      <q-separator class="col gradient-right-to-left" />
      <span class="q-px-md">应用案例</span>
      <q-separator class="col gradient-left-to-right" />
      <span
        v-if="$myinfo.auth.role.isProductManager"
        class="absolute-right q-pt-md q-pr-md"
      >
        <q-btn
          flat
          dense
          round
          icon="link"
          :title="$t('product.relateUseSample')"
          color="secondary"
          @click="
            $refs.relatedSample.$refs.productSelectPanel.showConfig = true
          "
        />
      </span>
    </div>

    <related-products
      isPathRelation
      :id="productId"
      category1="product"
      category2="sample"
      :arrClassification="['sample']"
      :noRelatedNotes="$t('product.noRelatedUseSampleNotes')"
      :panelTitle="$t('product.relateSample')"
      ref="relatedSample"
    />
  </div>
</template>

<script>
export default {
  name: 'ProductSamples',

  props: {
    productId: { type: Number, required: true }
  },

  components: {
    RelatedProducts: () => import('components/product/related/RelatedProducts')
  }
}
</script>

<style lang="scss" scoped></style>
