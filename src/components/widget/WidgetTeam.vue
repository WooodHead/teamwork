<template>
  <widget-related
    widget="team"
    :category="category"
    :objectID="objectID"
    :model="model"
  />
</template>

<script>
export default {
  name: 'WidgetTeam',
  components: {
    WidgetRelated: () => import('components/widget/WidgetRelated')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: [String, Number], required: true },
    model: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
</style>
