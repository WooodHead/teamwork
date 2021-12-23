<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProductIndex',
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  data () {
    return {}
  },
  watch: {
    $route () {
      this.init()
    }
  },
  methods: {
    ...mapActions('product', ['setProductBreadcrumbs']),

    init () {
      this.setProductBreadcrumbs()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>>
