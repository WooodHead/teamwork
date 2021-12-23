<template>
  <q-page
    class="column items-center"
    :class="{'q-pa-sm':!$q.platform.is.mobile}"
  >
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view />
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Index',
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
  computed: {
    ...mapState('widget', ['widgets']),
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    }
  },
  watch: {
    resource: {
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
      },
      immediate: true,
      deep: true
    },
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        if (!this.$route.path.includes('notice')) return
        let route = newVal
        // 公告主页面包屑
        this.clearWidgetBreadcrumbs()
        this.setModuleBreadcrumbs()
        route.name === 'notice' ||
          this.pushWidgetBreadcrumb({
            id: `${this.category}${this.objectID}NoticeIndex`,
            title: this.widgets.notice.label,
            to: {
              name: 'notice',
              params: { category: this.category, objectID: +this.objectID }
            }
          })
        const id = +this.$route.params.id || 0
        const notice = await this.loadNotice(id)
        if (!notice || !notice.id) {
          return
        }

        // 公告草稿箱面包屑
        !notice.isPublish
          ? this.pushWidgetBreadcrumb({
            id: 'noticeDrafts',
            title: '草稿箱',
            to: {
              name: 'noticeDrafts',
              params: { category: this.category, objectID: +this.objectID }
            }
          })
          : this.deleteWidgetBreadcrumb('noticeDrafts')

        // 公告归档箱面包屑
        notice.archived
          ? this.pushWidgetBreadcrumb({
            id: 'archivedNotices',
            title: '归档区',
            to: {
              name: 'archivedNotices',
              params: { category: this.category, objectID: +this.objectID }
            }
          })
          : this.deleteWidgetBreadcrumb('archivedNotices')

        // 当公告edit,copy,move,send,publicLink,history时，加入公告详情面包屑
        const name = _.last(route.path.split('/'))
        if (['edit', 'copy', 'move', 'send', 'publicLink', 'history'].includes(name)) {
          this.pushWidgetBreadcrumb({
            id: 'notice' + notice.id,
            title: notice.title,
            to: {
              name: 'noticeDetail',
              params: { category: this.category, objectID: +this.objectID, id: notice.id }
            }
          })
        } else {
          this.deleteWidgetBreadcrumb('notice' + notice.id)
        }
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', [
      'pushWidgetBreadcrumb',
      'clearWidgetBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ]),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('notice', ['loadNotice'])
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  }
}
</script>

<style lang="scss" scoped>
</style>
