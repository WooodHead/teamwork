<template>
  <q-page>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>
<script>

export default {
  components: {
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>
