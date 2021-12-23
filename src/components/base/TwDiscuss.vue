<template>
  <q-btn
    :outline="total===0"
    rounded
    color="primary"
    :label="label"
    size="sm"
    no-caps
    @click.stop="$emit('clickDiscuss')"
  />
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: false,
      default: 0
    }
  },
  computed: {
    label () {
      if (this.total === 0) {
        return this.$t('answer.discuss')
      } else {
        return this.$t('answer.comment', { number: this.total })
      }
    }
  }

}
</script>

<style>
</style>
