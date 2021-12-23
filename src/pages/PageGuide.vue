<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'PageGuide',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false,
      description: '模块类型：project、team、product'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  computed: {
  },
  watch: {
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', [
      'clearWidgetBreadcrumbs',
      'pushWidgetBreadcrumb'])
  },
  mounted () {
    this.setModuleBreadcrumbs()
  }
}
</script>

<style scoped lang="scss">
</style>
