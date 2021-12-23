<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Index',
  created () {
    // 添加主页面包屑
    const breads = [
      {
        id: 'materialHome',
        title: this.$t('material.module'),
        to: { name: 'materialHome' },
        level: 'home'
      }
    ]
    this.clearBreadcrumbs()
    this.setModuleBreadcrumbs(breads)
  },
  methods: {
    ...mapMutations('breadcrumbs', ['clearBreadcrumbs', 'setModuleBreadcrumbs'])
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>
<style lang="scss" scoped>
/deep/.widget-header-bread {
  max-width: 1330px;
}
</style>
