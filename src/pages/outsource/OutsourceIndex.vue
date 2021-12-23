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
  name: 'OutsourceIndex',
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  watch: {
    $route () {
      this.setModuleBreadcrumbs()
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs'])
  },
  created () {
    this.setModuleBreadcrumbs()
  }
}
</script>

<style>
</style>
