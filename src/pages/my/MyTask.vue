<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MyTask',
  data () {
    return {
      bread: []
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        this.clearBreadcrumbs()
        if (newVal.name === 'myTasksCompleted') {
          this.pushModuleBreadcrumb({
            id: 'myTasks',
            title: this.$t('task.mystuff.title'),
            to: {
              name: 'MyTasks'
            }
          })
        }
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['clearBreadcrumbs', 'pushModuleBreadcrumb'])
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-breadcrumbs__el {
  font-weight: 700;
}
</style>
