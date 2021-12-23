<template>
  <q-chip
    :color="newColor"
    :text-color="textColor"
    :size="size"
  >
    {{label}}
  </q-chip>
</template>

<script>
export default {
  name: 'TwChip',
  props: {
    color: {
      type: String,
      default: undefined,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      required: false
    }
  },
  computed: {
    newColor () {
      return ['严重', '致命'].includes(this.label)
        ? 'negative' : ['疑难'].includes(this.label)
          ? 'deep-orange'
          : this.color
    },
    textColor () {
      return this.newColor ? 'white' : undefined
    }
  }
}
</script>

<style>
</style>
