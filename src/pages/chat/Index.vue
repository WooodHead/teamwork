<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view></router-view>
  </q-page>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'ChatIndex',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false
    },
    objectID: {
      type: [String, Number],
      default: '0',
      required: false
    }
  },
  data () {
    return {
      newCategory: this.category,
      newObjectID: this.objectID,
      chatItemRouteNames: ['chatFiles', 'chatMembers']
    }
  },
  computed: {
    objectIDAndCategory () {
      const { objectID, category } = this
      return {
        objectID,
        category
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs')
    // ChatRoom: () => import('components/chat/ChatRoom')
  },
  watch: {
    objectIDAndCategory (newVal, oldVal) {
      this.newObjectID = newVal.objectID
      this.newCategory = newVal.category
    },
    $route: {
      immediate: true,
      deep: true,
      handler (route) {
        if (this.$q.platform.is.mobile) return
        if (!route.path.includes('chat')) return
        // 初始化面包屑
        this.$nextTick(() => {
          this.initBreadcrumb(route)
        })
      }
    }
  },
  methods: {
    ...mapActions('chat', ['loadMessages']),
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    initBreadcrumb (route) {
      this.clearWidgetBreadcrumbs()
      this.setModuleBreadcrumbs()
      this.chatItemRouteNames.includes(route.name)
        ? this.pushWidgetBreadcrumb({
          id: `${this.category}${this.objectID}ChatIn`,
          title: '聊天室',
          to: {
            name: 'chat',
            params: { category: this.category, objectID: +this.objectID }
          }
        }) 
        : this.deleteWidgetBreadcrumb(`${this.category}${this.objectID}ChatIn`)
    }
  }
}
</script>

<style scoped lang="scss"></style>
