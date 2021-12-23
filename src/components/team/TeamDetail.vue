<template>
  <resource-layout
    category='team'
    :objectID='+id'
    :categoryModel="model"
    :showMenu="(model.isTemplate&&model.createByID===$myinfo.id)||!model.isTemplate"
  >
    <template #subtitle>
      {{model.code}}
    </template>
    <template
      #titleBadge
      v-if="model.type&&!model.isTemplate"
    >
      <q-badge
        color="orange"
        align="top"
        class="q-pa-xs cursor-pointer q-mr-md"
      >
        {{model.type|type}}
        <q-tooltip>
          {{model.type|typeTooltip}}
        </q-tooltip>
      </q-badge>
    </template>
  </resource-layout>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TeamDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    model () {
      return this.$store.getters['team/team'](+this.id)
    }
  },
  filters: {
    type (value) {
      if (value) {
        return value.split(':').length > 1 ? value.split(':')[0] : value
      }
    },
    typeTooltip (value) {
      if (value) {
        return value.split(':').length > 1 ? value.split(':')[1] : value
      }
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
    this.loadTeam(Number(to.params.id))
    next()
  },
  methods: {
    ...mapActions('team', ['loadTeam'])
  },
  mounted () {
    this.loadTeam(+this.id)
  }
}
</script>

<style lang="scss" scoped>
  .q-badge {
    padding: 4px 6px;
  }
</style>
