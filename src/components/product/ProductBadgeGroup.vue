<template>
  <span>
    <q-badge
      v-if="product.classification==='machinetool'"
      align="middle"
      :color="product.params.axisCount===5?'primary1':'auxiliary5'"
      class="q-mr-sm"
    >
      {{ $t(`product.fields.axisCount${product.params.axisCount===void 0?5:product.params.axisCount}`) }}
    </q-badge>

    <template v-if="product.classification!=='sample'">
      <q-badge
        v-if="showConfigType"
        align="middle"
        :color="product.configType===0?'primary4':'auxiliary6'"
        class="q-mr-sm"
      >
        {{ $t(`product.fields.configType${product.configType===void 0?1:product.configType}`) }}
      </q-badge>
      <!-- <q-badge
        v-if="product.maturity<2"
        align="middle"
        :color="product.maturity===0?'auxiliary1':'auxiliary4'"
      >
        {{ $t(`product.fields.maturity${product.maturity===void 0?2:product.maturity}`) }}
      </q-badge> -->
    </template>

    <template v-else>
      <q-badge
        v-if="product.params.isRecommend"
        align="middle"
        color="auxiliary4"
        class="q-mr-sm"
      >
        {{ $t('product.recommend') }}
      </q-badge>
    </template>
  </span>
</template>

<script>
export default {
  name: 'ProductBadgeGroup',
  props: {
    product: { type: Object, required: true }
  },
  computed: {
    showConfigType () {
      return !(this.product.classification !== 'machinetool' && this.product.configType < 2)
    }
  }
}
</script>

<style lang='scss' scoped>
.q-badge {
  padding: 4px 6px;
}
</style>
