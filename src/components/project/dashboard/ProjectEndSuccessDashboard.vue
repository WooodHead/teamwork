<!--
@Name：结项成功项目数量排行
@Author：陆欢
@date：2021/07/28
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div style="height:400px">
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import projectDashboard from './mixins-project-dashboard'
export default {
  name: 'ProjectEndSuccessDashboard',
  mixins: [projectDashboard],
  data () {
    let that = this
    return {
      initOption: {
        title: {
          left: 'left',
          text: that.chart.title,
          textStyle: {
            color: 'dimgrey',
            fontWeight: 'normal',
            fontSize: 16,
            'font-family': 'system-ui'
          }
        },
        // 鼠标放置提示信息
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        // legend: {
        //   data: [that.$t('dashboard.NewPostProjectNumber')],
        //   top: 7,
        //   right: 30
        // },
        grid: {
          top: '60',
          left: '0',
          right: '30',
          bottom: '40',
          containLabel: true
        },
        xAxis: {
          name: that.$t('dashboard.dateOnSunday'),
          boundaryGap: false,
          data: [],
          nameRotate: -90,
          axisLabel: {
            rotate: -70
          }
        },
        yAxis: {
          name: that.$t('dashboard.ProjectNumber'),
          type: 'value',
          nameTextStyle: {
            align: 'left'
          }
        },
        series: [
          {
            name: that.$t('dashboard.NewPostProjectNumber'),
            type: 'line',
            smooth: false,
            data: []
          }
        ],
        dataZoom: [{
          start: 0,
          type: 'inside'
        }, {
          start: 0
        }]
      }
    }
  },
  beforeDestroy () {
  },
  computed: {
    ...mapState('project', ['dashboardRank']),
    option () {
      let that = this
      let data = this.dashboardRank[`${this.uid}-${this.chart.name}`] || []
      // 基准日期调整（周日分割）
      let today = new Date()
      let baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      let weekDay = baseDate.getDay()
      baseDate = new Date(+baseDate + (24 * 3600 * 1000 * (7 - (weekDay === 0 ? 7 : weekDay))))
      let oneWeek = 24 * 3600 * 1000 * 7
      // 图表数据
      let weeks = []
      let weekDones = []
      for (let i = 0; i < 53; i++) { // 一年约53周
        // 日期
        weeks.push([baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate()].join('-'))
        // 上一周截止日期
        let lastWeek = new Date(+baseDate - oneWeek)
        // 上一周结项数
        weekDones.push(_.filter(data, (p) => {
          let endDate = new Date(p.EndDate.replace(/-/g, '/'))
          return +endDate > +lastWeek && +endDate <= +baseDate
        }).length)
        baseDate = lastWeek
      }
      that.initOption.xAxis.data = _.reverse(weeks)
      that.initOption.series[0].data = _.reverse(weekDones)
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  // .tw-dashboard .not-display {
  //   display: none;
  // }
</style>
