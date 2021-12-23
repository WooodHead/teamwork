<template>
  <q-page>
    <tw-breadcrumbs style="maxWidth: '100%'"></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// import { LocalStorage } from 'quasar'
export default {
  name: 'ProductCaseIndex',
  computed: {
    ...mapState('widget', ['widgets']),
    addWidth () {
      if (this.$q.screen.gt.sm) {
        if (['markmapEdit', 'markmapAdd'].includes(this.$route.name)) {
          return { maxWidth: 'calc(100vw - 96px)' }
        } else {
          return {}
        }
      } else {
        return { maxWidth: '100%' }
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.clearModuleBreadcrumbs()
        this.clearWidgetBreadcrumbs()
        if (newVal.name === 'productCaseDetail') {
          this.pushWidgetBreadcrumb({
            id: 1,
            title: this.$t('productCase.module'),
            to: { name: 'productCaseHome' }
          })
        }
      }
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   var myinfo = LocalStorage.getItem('myself')
  //   if (myinfo && !(myinfo.auth.role.isSystemAdministrator || myinfo.auth.role.isSeniorManager)) {
  //     next(vm => {
  //       if (!vm.category) {
  //         vm.$router.push({ path: '/' })
  //       }
  //     })
  //   } else {
  //     next()
  //   }
  // },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  methods: {
    ...mapActions('document', ['loadFolders', 'loadResourceDocument', 'loadProductDocument', 'loadDocumentWithoutChildren', 'loadDocumentByQuery']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', [
      'clearModuleBreadcrumbs',
      'pushWidgetBreadcrumb',
      'clearWidgetBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>
