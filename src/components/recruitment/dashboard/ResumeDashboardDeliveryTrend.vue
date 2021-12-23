<!-- 每日简历投递量趋势图 -->
<template>
  <div style="height:400px;">
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResumeDashboardDeliveryTrend',
  props: {
    uid: {
      type: String,
      default: '',
      required: false,
      description: '图表数据的唯一标识'
    },
    chart: {
      type: Object,
      required: true,
      default () {
        return {}
      },
      description: '图形chart数据'
    }
  },
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
          triggerOn: 'mousemove'
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        grid: {
          top: '60',
          left: '18',
          right: '30',
          bottom: '35',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          data: [],
          nameRotate: -90,
          axisLabel: {
            rotate: -70
          }
        },
        yAxis: {
          name: '投递量',
          type: 'value',
          boundaryGap: [0, '20%']
        },
        series: [
          {
            type: 'line',
            data: [],
            label: {
              show: false
            }
          }
        ]
      }
    }
  },
  computed: {
    sourceData () {
      return this.$store.getters['resume/dashDayData'](this.uid) || {}
    },
    option () {
      let that = this
      let xData = []
      let yData = []
      _.forEach(that.sourceData, (item, key) => {
        xData.push(item.DeliveryDay)
        yData.push(item.num)
      })
      that.initOption.xAxis.data = xData
      that.initOption.series[0].data = yData
      that.initOption.title.text = that.chart.title
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    ...mapActions('resume', ['loadDashDayData']),
    loadData () {
      this.loadDashDayData({
        uid: this.uid,
        where: this.chart.where
      })
    }
  },
  watch: {
    chart (newVal, oldVal) {
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style>
</style>
