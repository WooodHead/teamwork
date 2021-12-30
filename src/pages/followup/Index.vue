<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      required: false,
      default: 'customer'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('followup', ['followups', 'search'])
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    initBreadcrumb (newVal) {
      if (this.$q.platform.is.mobile) return
      this.clearWidgetBreadcrumbs()
      this.setModuleBreadcrumbs()
      new RegExp(/.+followup\/.+/).test(newVal.path) &&
        this.pushWidgetBreadcrumb({
          id: `${this.category}${this.objectID}FollowupIndex`,
          title: '跟进',
          to: {
            name: 'followup',
            params: { category: this.category, objectID: +this.objectID }
          }
        })
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        if (!newVal.path.includes('followup')) return
        // 初始化面包屑
        this.initBreadcrumb(newVal)
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style>
</style>
