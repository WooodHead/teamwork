<!--
@Name：知识库页面框架
@Author：陆欢
@date：2021/12/07
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-page>
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'WikiIndex',
  props: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapMutations('breadcrumbs', [
      'clearModuleBreadcrumbs',
      'pushWidgetBreadcrumb',
      'clearWidgetBreadcrumbs'
    ]),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs'])
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.clearModuleBreadcrumbs()
        this.clearWidgetBreadcrumbs()
        if (newVal.name === 'wikiAdd') {
          this.pushWidgetBreadcrumb({
            id: 0,
            title: this.$t('wiki.title'),
            to: {
              name: 'wikiHome'
            }
          })
        } else if (['wikiManage', 'wikiEdit'].includes(newVal.name)) {
          this.setModuleBreadcrumbs()
        }
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style scoped>
</style>
