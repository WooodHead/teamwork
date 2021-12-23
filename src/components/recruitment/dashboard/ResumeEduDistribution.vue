<!-- 所有应聘者学历分布 -->
<template>
  <div style="height:400px;">
    <v-chart
      :options="option"
      theme="walden"
      :autoresize="true"
      @click="item"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ResumeEduDistribution',
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
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: 'bottom'
        },
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '25',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            minAngle: 5,
            data: []
          }
        ]
      }
    }
  },
  computed: {
    sourceData () {
      return this.$store.getters['resume/dashSourceData'](this.uid) || {}
    },
    option () {
      let that = this
      // 学历分布统计
      let data = []
      let backgrounds = _.groupBy(that.sourceData, (item) => { return item.Background })
      _.forEach(backgrounds, function (item, key) {
        data.push({
          'name': key,
          'value': _.sumBy(item, 'num')
        })
      })
      that.initOption.series[0].data = data
      that.initOption.title.text = that.chart.title
      return _.cloneDeep(that.initOption)
    }
  },
  methods: {
    ...mapActions('resume', ['loadDashSourceData']),
    item (params) {
      this.$router.push({
        name: 'dashboardDetail',
        params: {
          chart: this.chart,
          clickedChart: params.data
        }
      })
    },
    loadData () {
      this.loadDashSourceData({
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
