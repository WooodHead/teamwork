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
    ...mapState('followup', ['search']),
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs'])
  },
  watch: {
    resource: {
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
      },
      immediate: true,
      deep: true
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
