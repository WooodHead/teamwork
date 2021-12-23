<template>
  <q-page :class="{'q-pa-sm column items-center':$q.screen.gt.xs}">
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <service-evaluation
      :objectID="objectID"
      :category="category"
    />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'EvaluationIndex',
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
      newObjectID: this.objectID
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.newObjectID = to.params.objectID
    this.newCategory = to.params.category
    next()
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    ServiceEvaluation: () => import('components/service/ServiceEvaluation')
  },
  mounted () {
    this.setModuleBreadcrumbs()
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs'])
  }
}
</script>

<style scoped lang="scss">
</style>
