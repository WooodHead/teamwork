<template>
  <div class="tw-separator flex no-wrap items-center">
    <q-separator
      v-if="!left"
      class="q-mr-sm col-grow"
    />
    <slot></slot>
    <q-separator
      v-if="!right"
      class="q-ml-sm col-grow"
    />
  </div>
</template>

<script>
export default {
  name: 'TwSeparator',
  props: {
    left: {
      type: Boolean,
      default: false,
      required: false
    },
    right: {
      type: Boolean,
      default: false,
      required: false
    }
  }
}
</script>

<style scoped>
.tw-separator hr {
  height: 1px;
}
</style>
