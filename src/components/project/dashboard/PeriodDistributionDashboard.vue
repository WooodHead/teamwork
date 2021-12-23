<template>
  <div style="height:400px">
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
      @click="itemClick"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { date } from 'quasar'
import projectDashboard from './mixins-project-dashboard'
export default {
  name: 'PeriodDistributionDashboard',
  mixins: [projectDashboard],
  data () {
    return {
      initOption: {
        title: {
          left: 'left',
          text: this.chart.title,
          textStyle: {
            color: 'dimgrey',
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow'
          },
          // position: function (point, params, dom, rect, size) {
          //   // 固定在顶部
          //   return [point[0] - 10, point[1] - 10]
          // },
          enterable: true
        },
        grid: {
          top: '60',
          left: '0',
          right: '30',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          name: this.$t('dashboard.ProjectCycle'),
          type: 'category',
          boundaryGap: false,
          nameRotate: -90,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          name: this.$t('dashboard.ProjectNumber'),
          type: 'value',
          boundaryGap: [0, '30%'],
          nameTextStyle: {
            align: 'left'
          }
        },
        series: [
          {
            name: this.$t('dashboard.ProjectNumber'),
            type: 'line',
            smooth: 0.6,
            // symbol: 'none',
            lineStyle: {
              width: 2
            },
            areaStyle: {},
            data: []
          }
        ]
      }
    }
  },
  methods: {
    itemClick (params) {
      let distribution = {
        OneWeek: ['周期小于7天', 0, 7],
        TwoWeeks: ['周期两周以内', 7, 14],
        OneMonth: ['周期一个月以内', 14, 30],
        TwoMonths: ['周期两个月以内', 30, 60],
        ThreeMonths: ['周期三个月以内', 60, 90],
        HalfAYear: ['周期半年以内', 90, 180],
        OneYear: ['周期一年以内', 180, 365],
        TwoYears: ['周期两年以内', 365, 730],
        MoreThanTwoYears: ['两年以上', 730]
      }
      let p = {
        data: { value: params.data[1], startDate: distribution[params.data[2]][1], endDate: distribution[params.data[2]][2] || '' },
        name: distribution[params.data[2]][0]
      }
      this.item(p)
    }
  },
  computed: {
    ...mapState('project', ['dashboardRank']),
    option () {
      let that = this
      let projects = that.dashboardRank[`${that.uid}-${that.chart.name}`] || []
      projects = _.filter(projects, (p) => { return p.BeginDate && p.BeginDate !== '1000-01-01 00:00:00' && ((p.EndDate && p.EndDate !== '1000-01-01 00:00:00') || (p.PredictEndDate && p.PredictEndDate !== '1000-01-01 00:00:00')) })
      let periodDistributionData = []
      periodDistributionData.push([that.$t('dashboard.OneWeek'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days <= 7 }).length, 'OneWeek'])
      periodDistributionData.push([that.$t('dashboard.TwoWeeks'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 7 && days <= 14 }).length, 'TwoWeeks'])
      periodDistributionData.push([that.$t('dashboard.OneMonth'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 14 && days <= 30 }).length, 'OneMonth'])
      periodDistributionData.push([that.$t('dashboard.TwoMonths'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 30 && days <= 60 }).length, 'TwoMonths'])
      periodDistributionData.push([that.$t('dashboard.ThreeMonths'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 60 && days <= 90 }).length, 'ThreeMonths'])
      periodDistributionData.push([that.$t('dashboard.HalfAYear'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 90 && days <= 180 }).length, 'HalfAYear'])
      periodDistributionData.push([that.$t('dashboard.OneYear'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 180 && days <= 365 }).length, 'OneYear'])
      periodDistributionData.push([that.$t('dashboard.TwoYears'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 365 && days <= 730 }).length, 'TwoYears'])
      periodDistributionData.push([that.$t('dashboard.MoreThanTwoYears'), _.filter(projects, (p) => { let days = date.getDateDiff(p.Status === 'done' ? p.EndDate.replace(/-/g, '/') : p.PredictEndDate.replace(/-/g, '/'), p.BeginDate.replace(/-/g, '/'), 'days'); return days > 730 }).length, 'MoreThanTwoYears'])
      that.initOption.series[0].data = periodDistributionData
      return _.cloneDeep(that.initOption)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
