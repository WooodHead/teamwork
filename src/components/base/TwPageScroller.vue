<template>
  <q-page-scroller
    v-if="$q.platform.is.desktop"
    position="bottom-left"
    :scroll-offset="600"
  >
    <q-btn
      fab-mini
      icon="keyboard_arrow_up"
      color="accent"
    />
  </q-page-scroller>
</template>

<script>
export default {
  name: 'TwPageScroller'
}
</script>
<style>
</style>
