<!--
@Name：严重缺陷统计图
@Author：陆欢
@date：2021/08/12
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
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
import projectDashboard from './mixins-project-dashboard'
export default {
  name: 'ServerityDistributionDashboard',
  mixins: [projectDashboard],
  data () {
    let that = this
    return {
      initOption: {
        title: {
          left: 'left',
          text: that.chart.title,
          subtext: that.$t('dashboard.SeriousDefectRefersToATaskWithAFatalOrSeriousLabeInThProjectBacklog'),
          textStyle: {
            color: 'dimgrey',
            fontWeight: 'normal',
            fontSize: 16,
            'font-family': 'system-ui'
          }
        },
        // 鼠标放置提示信息
        tooltip: {
          borderWidth: 1,
          formatter: function (obj) {
            var value = obj.value
            return '<div><div style="border-bottom: 1px solid rgba(255,255,255,.3);">' +
              value[4] +
              '</div>' +
              that.$t('dashboard.NumberOfSeriousDefects') + '：' + value[0] + '<br>' +
              that.$t('dashboard.ResolvedNumber') + '：' + value[2] + '<br>' +
              that.$t('dashboard.UnresolvedNumber') + '：' + value[3] + '<br>' +
              that.$t('dashboard.UnsolvedRate') + '：' + value[1] + '%<br></div>'
          },
          // position: function (point, params, dom, rect, size) {
          //   // 固定在顶部
          //   return [point[0] - 10, point[1] - 10]
          // },
          enterable: true
        },
        // grid: {
        //   top: '50',
        //   left: '0',
        //   right: '30',
        //   bottom: '50',
        //   containLabel: true
        // },
        grid: {
          top: '90',
          left: '10',
          right: '30',
          bottom: '40',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: that.$t('dashboard.NumberOfSeriousDefects'),
          nameGap: 16,
          splitLine: {
            show: false
          },
          boundaryGap: [0, '10%'],
          nameRotate: -90,
          nameTextStyle: {
            padding: [0, 30, 0, 0]
          }
        },
        yAxis: {
          type: 'value',
          name: that.$t('dashboard.UnsolvedRate'),
          nameLocation: 'end',
          splitLine: {
            show: false
          },
          min: 0,
          max: 100,
          boundaryGap: [0, '20%']
        },
        visualMap: [
          {
            left: 0,
            dimension: 0,
            min: 0,
            max: 0,
            itemWidth: 20,
            itemHeight: 60,
            calculable: true,
            precision: 0.1,
            text: [that.$t('dashboard.NumberOfSeriousDefects')],
            textGap: 15,
            inRange: {
              symbolSize: [10, 30]
            },
            outOfRange: {
              symbolSize: [10, 30],
              color: ['rgba(255,255,255,.2)']
            },
            controller: {
              inRange: {
                color: ['#b71c1c']
              }
            },
            orient: 'horizontal',
            align: 'left'
          },
          {
            right: 0,
            dimension: 1,
            min: 0,
            max: 100,
            itemWidth: 10,
            itemHeight: 60,
            precision: 0.1,
            text: [that.$t('dashboard.UnsolvedRate')],
            textGap: 10,
            inRange: {
              colorLightness: [0.8, 0.5]
            },
            outOfRange: {
              color: ['rgba(255,255,255,.2)']
            },
            controller: {
              inRange: {
                color: ['#b71c1c']
              }
            },
            orient: 'horizontal'
          }
        ],
        series: [
          {
            type: 'scatter',
            itemStyle: {
              opacity: 0.8,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            color: '#b71c1c',
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.$store.dispatch('task/loadDashboardtProjectSeriousTasks')
  },
  beforeDestroy () {
  },
  computed: {
    ...mapState('project', ['dashboardRank']),
    ...mapState('task', ['dashboardtProjectSeriousTasks']),
    option () {
      let that = this
      let source = this.dashboardRank[`${this.uid}-${this.chart.name}`] || []
      let data = []
      if (!_.isEmpty(source) && !_.isEmpty(that.dashboardtProjectSeriousTasks)) {
        _.forEach(_.groupBy(that.dashboardtProjectSeriousTasks, 'objectId'), function (task, projectId) {
          let taskNum = task.length
          let finishedTaskNum = _.filter(task, { finished: true }).length
          let unfinishedTaskNum = taskNum - finishedTaskNum
          let project = _.find(source, { 'ProjectID': +projectId })
          let projectName = project && project.ProjName
          let unfinishedTaskPix = Math.round(((unfinishedTaskNum / taskNum) * 10000)) / 100
          if (project) {
            data.push([taskNum, unfinishedTaskPix, finishedTaskNum, unfinishedTaskNum, projectName, projectId])
            if (taskNum > that.initOption.visualMap[0].max) {
              that.initOption.visualMap[0].max = taskNum
            }
          }
        })
      }
      that.initOption.series[0].data = data
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    itemClick (params) {
      if (params.data.value !== 0) {
        this.$router.push({
          name: 'projectSeverityDistributionDetail',
          params: {
            id: +params.data[5]
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // .tw-dashboard .not-display {
  //   display: none;
  // }
</style>
