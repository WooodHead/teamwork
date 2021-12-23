<template>
  <q-page>
    <tw-breadcrumbs
      :class="{'bread-width-with-table':withTable}"
      class="print-hide"
    >
    </tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
export default {
  name: 'Index',
  components: {
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs')
  },
  computed: {
    withTable () {
      return this.$q.screen.gt.sm &&
        ['job', 'recruitPlan', 'interviewer'].includes(this.$route.name) &&
        this.$store.state[this.$route.name].listStyle === 'showtable'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
