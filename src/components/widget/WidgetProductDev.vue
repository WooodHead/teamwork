<template>
  <widget-related
    widget="productDev"
    :category="category"
    :objectID="objectID"
    :model="model"
  />
</template>

<script>
export default {
  name: 'WidgetProductDev',
  components: {
    WidgetRelated: () => import('components/widget/WidgetRelated')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: true },
    model: { type: Object, required: true }
  }
}
</script>

<style scoped>
</style>
