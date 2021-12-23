<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 仪表盘首页 -->
    <tw-header-card title="仪表盘" />
    <tw-dashboard
      :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'"
      category="project"
    />
  </q-card>
</template>

<script>
export default {
  name: 'ProjectDashboard',
  props: {
    isRank: { type: Boolean, required: false, default: true }
  },
  mounted () {
  },
  components: {
    TwDashboard: () => import('components/base/dashboard/TwDashboard'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
</style>
