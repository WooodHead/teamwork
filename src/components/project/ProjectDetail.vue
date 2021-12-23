<template>
  <resource-layout
    category='project'
    :objectID='+id'
    :categoryModel="model"
    :showMenu="(model.isTemplate&&model.createByID===$myinfo.id)||!model.isTemplate"
  >
    <template #titleBadge>
      <tw-status-badge
        v-if="model&&model.status"
        :value="model.status"
        :endDate="model.predictEndDate"
        align="top"
      />
    </template>
    <template #subtitle>
      <div class="q-gutter-sm">
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{model.projNum}}
        </q-badge>
        <q-badge
          outline
          align="middle"
          color="secondary"
        >
          {{model.projLevel}}
        </q-badge>
        <q-badge
          v-if="period"
          outline
          align="middle"
          color="secondary"
        >
          {{period}}
        </q-badge>
      </div>
    </template>
    <template #orgBottom>
      <div v-if="!extranet">
        <span v-if="model.classify">{{model.classify}}</span>
        <span v-if="model.saled">，{{$t('project.saled')}}</span>
      </div>
    </template>
  </resource-layout>
</template>

<script>
import { mapActions } from 'vuex'
import period from '@/utils/period'
const config = require('app/app.config.js')
export default {
  name: 'ProjectDetail',
  props: {
    id: { type: [String, Number], required: true }
  },
  data () {
    return {
      extranet: config.extranet
    }
  },
  computed: {
    model () {
      return this.$store.getters['project/project'](+this.id)
    },
    period () {
      const { status, beginDate, endDate, predictEndDate } = this.model
      return period({ status, beginDate, endDate, predictEndDate })
    }
  },
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout'),
    TwStatusBadge: () => import('components/base/TwStatusBadge')
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.loadProject(Number(to.params.id))
    next()
  },
  mounted () {
    this.loadProject(+this.id)
  },
  methods: {
    ...mapActions('project', ['loadProject'])
  }
}
</script>

<style lang="scss" scoped>
.q-badge {
  padding: 4px 6px;
}
</style>
