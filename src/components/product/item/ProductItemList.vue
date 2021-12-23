<template>
  <q-list>
    <product-item
      v-for="item in items"
      :key="item.id"
      :item="item"
      @delRelation="$emit('delRelation', item.id)"
    />
  </q-list>
</template>

<script>
export default {
  name: 'ProductItemList',

  components: {
    ProductItem: () => import('components/product/item/ProductItem')
  },

  props: {
    items: { type: Array, default: () => [] }
  }
}
</script>

<style lang="scss" scoped></style>
