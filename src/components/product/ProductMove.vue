<template>
  <resource-move-copy
    type="product"
    :objectID="+id"
    :id="+id"
    :subId="subId"
  >
    <template v-slot:subSelect>
      <product-tree-switch
        withoutBtns
        :levelHidden="curProduct && curProduct.level || 0"
        @selected-event="selectedEvent"
        class="q-mb-md"
      />
    </template>
  </resource-move-copy>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProductMove',
  components: {
    ResourceMoveCopy: () => import('components/resource/ResourceMoveCopy'),
    ProductTreeSwitch: () => import('components/product/ProductTreeSwitch')
  },
  props: {
    id: { type: [Number, String] }
  },
  data () {
    return {
      subId: 0
    }
  },
  computed: {
    ...mapGetters('product', ['product']),
    curProduct () {
      return this.product(+this.id)
    }
  },
  methods: {
    selectedEvent (node) {
      if (node.tplCode !== 'Default' && node.tplCode !== '') {
        this.subId = node.id
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
