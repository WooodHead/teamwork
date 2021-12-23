<!--
@Name：项目总览图
@Author：陆欢
@date：2021/07/26
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div style="height:300px;font-family: system-ui;">
    <q-card-section
      class="q-pa-none"
      style="color:dimgrey;font-size:16px;"
    >{{chart.title}}</q-card-section>
    <q-card-section class="text-bold">
      <div class="row text-center items-center">
        <!-- 暂未立项 -->
        <div
          class="q-col-gutter-y-xs col-4 cursor-pointer"
          style="margin-top: -27px;"
          @click="overviewItemClick('wait')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.wait')}}</div>
          <div class="text-bold text-h4 text-info ">
            {{statusCount.wait?statusCount.wait:0}}
          </div>
        </div>
        <q-separator
          inset
          vertical
          class="q-mt-md"
        />
        <!-- 累计立项 -->
        <div
          class="q-col-gutter-y-xs col-4 cursor-pointer"
          @click="overviewItemClick('approval')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.approval')}}</div>
          <div class="text-bold text-h4 text-primary">
            {{statusCount.approval?statusCount.approval:0}}
          </div>
          <div style="font-size:12px">
            <span class="text-grey-7">近一周</span>
            <span v-if="statusCount.addApprovalOneWeek&&statusCount.addApprovalOneWeek">+</span>
            <span v-if="!statusCount.addApprovalOneWeek">&nbsp;</span>
            <span class="text-primary">{{statusCount.addApprovalOneWeek?statusCount.addApprovalOneWeek:0}}</span>
          </div>
        </div>
        <q-separator
          inset
          vertical
          class="q-mt-md"
        />
        <!-- 累计结项 -->
        <div
          class="q-col-gutter-y-xs cursor-pointer"
          style="width: 32%;"
          @click="overviewItemClick('done')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.done')}}</div>
          <div class="text-bold text-h4 text-blue-grey-4">
            {{statusCount.done?statusCount.done:0}}
          </div>
          <div style="font-size:12px">
            <span class="text-grey-7">近一周</span>
            <span v-if="statusCount.addDoneOneWeek&&statusCount.addDoneOneWeek">+</span>
            <span v-if="!statusCount.addDoneOneWeek">&nbsp;</span>
            <span class="text-blue-grey-4">{{statusCount.addDoneOneWeek?statusCount.addDoneOneWeek:0}}</span>
          </div>
        </div>
        <!-- 进行中 -->
        <div
          class="q-col-gutter-y-xs q-mt-lg col-4 cursor-pointer"
          @click="overviewItemClick('doing')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.doing')}}</div>
          <div class="text-bold text-h4 text-positive">
            {{statusCount.doing?statusCount.doing:0}}
          </div>
        </div>
        <q-separator
          inset
          vertical
          class="q-mt-xl"
        />
        <!-- 延期 -->
        <div
          class="q-col-gutter-y-xs q-mt-lg col-4 cursor-pointer"
          @click="overviewItemClick('delay')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.delay')}}</div>
          <div class="text-bold text-h4 text-negative">
            {{statusCount.delay?statusCount.delay:0}}
          </div>
        </div>
        <q-separator
          inset
          vertical
          class="q-mt-xl"
        />
        <!-- 挂起 -->
        <div
          class="q-col-gutter-y-xs q-mt-lg cursor-pointer"
          style="width: 32%;"
          @click="overviewItemClick('suspended')"
        >
          <div class="q-mt-sm text-grey-10">{{$t('dashboard.suspended')}}</div>
          <div class="text-bold text-h4 text-warning">
            {{statusCount.suspended?statusCount.suspended:0}}
          </div>
        </div>
      </div>
    </q-card-section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import projectDashboard from './mixins-project-dashboard'
export default {
  name: 'ProjectOverviewDashboard',
  mixins: [projectDashboard],
  data () {
    return {}
  },
  computed: {
    ...mapState('project', ['dashboardRank']),
    statusCount () {
      return this.dashboardRank[`${this.uid}-${this.chart.name}`] || {}
    }
  },
  methods: {
    overviewItemClick (status) {
      if (this.statusCount[status] !== 0) {
        this.$router.push({
          name: 'projectDashboardDetail',
          params: {
            chart: this.chart,
            clickedChart: { name: this.$t(`dashboard.${status}`), status, data: this.statusCount[status] }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
