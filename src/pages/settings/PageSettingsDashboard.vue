<!-- 仪表盘设置页 -->
<template>
  <q-card
    class="card-grow-in-page tw-bg-grid"
    :flat="$q.screen.lt.sm"
  >
    <!-- header -->
    <tw-header-card :title="$t('settings.dashboard.pageTitle',
     {name: $t(`${category}.module`)})" />
    <q-card-section class="q-px-xxl">
      <!-- 图表区域 -->
      <tw-dashboard
        :category="category"
        :isDefault="true"
        :conditionNeedMap="category === 'resume'"
        @down="onDataLoaded"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'PageSettingsDashboard',
  props: {
    category: {
      type: String,
      required: true,
      default: 'resume'
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {
    onDataLoaded () {

    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwDashboard: () => import('components/base/dashboard/TwDashboard')
  }
}

</script>

<style lang='scss' scoped>
</style>
