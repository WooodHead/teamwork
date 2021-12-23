<template>
  <q-page
    class="column items-center"
    :class="{'q-pa-sm':!$q.platform.is.mobile}"
  >
    <tw-breadcrumbs :class="{'bread-width-with-table':withTable}"></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResourceIndex',
  created () {
    this.setModuleBreadcrumbs()
  },
  watch: {
    $route () {
      this.setModuleBreadcrumbs()
    }
  },
  computed: {
    withTable () {
      // 表格视图，返回true
      if (this.$route.name === 'resourceRelation') {
        return this.$store.state[this.$route.params.relates].listStyle === 'showtable'
      } else {
        const regExp = new RegExp('^((\\D*)Home)|(archived(\\D*)s)$')
        if (regExp.test(this.$route.name)) {
          let category = this.$route.path.split('/')[1]
          return this.$store.state[category].listStyle === 'showtable'
        }
        return false
      }
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs'])
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style>
</style>
