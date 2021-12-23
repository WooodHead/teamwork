<template>
  <resource-move-copy
    type='question'
    cardStyle="whole"
    :id="id"
    :category="category"
    :objectID="objectID"
  >
  </resource-move-copy>
</template>

<script>
export default {
  name: 'QuestionMoveCopy',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    actionType: {
      type: String,
      default: function () {
        return this.$route.path.split('/').slice(-1)[0]
      },
      required: false
    }
  },
  components: {
    ResourceMoveCopy: () => import('components/resource/ResourceMoveCopy')
  }
}
</script>

<style lang="scss" scoped>
</style>
