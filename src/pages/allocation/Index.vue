<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      default: undefined,
      required: false
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: false
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (route) {
        if (this.$q.platform.is.mobile) return
        if (!route.path.includes('allocation')) return
        // 初始化面包屑
        this.initBreadcrumb(route)
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('allocation', ['loadAllocation']),
    async initBreadcrumb (route) {
      this.clearWidgetBreadcrumbs()
      this.setModuleBreadcrumbs()
      new RegExp(/.+allocation\/.+/).test(route.path) &&
        this.pushWidgetBreadcrumb({
          id: `${this.category}${this.objectID}AllocationList`,
          title: this.$t('allocation.title'),
          to: {
            name: this.$myinfo.auth.role.isOutsource ? 'myAllocation' : 'allocation',
            params: { category: this.category, objectID: +this.objectID }
          }
        })
      const id = +this.$route.params.id || 0
      const allocation = id > 0 ? await this.loadAllocation(id) : null
      if (!allocation) { return }
      allocation.archived
        ? this.pushWidgetBreadcrumb({
          id: 'archivedAllocations',
          title: '归档箱',
          to: { name: 'archivedAllocations', params: { category: this.category, objectID: +this.objectID } }
        })
        : this.deleteWidgetBreadcrumb('archivedAllocations')
      // 当edit,copy,move,send,publicLink,history时，加入详情面包屑
      const name = _.last(route.path.split('/'))
      if (['edit', 'copy', 'move', 'send', 'publicLink', 'history'].includes(name)) {
        this.pushWidgetBreadcrumb({
          id: 'allocation' + allocation.id,
          title: allocation.title,
          to: {
            name: this.$myinfo.auth.role.isOutsource ? 'myAllocationDetail' : 'allocationDetail',
            params: { category: this.category, objectID: +this.objectID, id: allocation.id }
          }
        })
      } else {
        this.deleteWidgetBreadcrumb('allocation' + allocation.id)
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style lang="scss" scoped>
</style>
