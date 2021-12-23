<template>
  <resource-layout
    category='wiki'
    :objectID='+id'
    :categoryModel="model"
  />
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'WikiManage',
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    model () {
      return this.$store.getters['wiki/wiki'](+this.id)
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout')
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.loadWiki(Number(to.params.id))
    next()
  },
  methods: {
    ...mapActions('wiki', ['loadWiki'])
  },
  mounted () {
    this.loadWiki(+this.id)
  }
}
</script>

<style lang="scss" scoped>
</style>
