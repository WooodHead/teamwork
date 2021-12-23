<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <tw-header title="系统设置"></tw-header>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwHeader: () => import('components/base/TwHeader')
  },
  methods: {
    ...mapMutations('breadcrumbs', ['setModuleBreadcrumbs', 'clearBreadcrumbs'])
  },
  beforeRouteEnter (to, from, next) {
    var myinfo = LocalStorage.getItem('myself')
    if (myinfo && !myinfo.auth.role.isSystemAdministrator) {
      next({ path: '/' })
    } else {
      next()
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        let bread = []
        if (newVal.name === 'settingsIndex') {
          bread = []
          this.clearBreadcrumbs()
        } else {
          bread = [{
            id: 'settingsIndex',
            title: this.$t('settings.title'),
            to: { name: 'settingsIndex' }
          }]
        }
        if (newVal.name === 'settingsWidgetSelect') {
          let label = newVal.params.category
          bread.push({
            id: 'settingsWidget',
            title: this.$t('settings.widget.pageTitle',
              { name: this.$t(`${label}.module`) }),
            to: { name: 'settingsWidget' }
          })
        }
        this.setModuleBreadcrumbs(bread)
      }
    }
  }
}
</script>
