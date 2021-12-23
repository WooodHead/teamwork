<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page text-center"
  >
    <tw-header-card :title="'服务统计'" />
    <q-card-section
      class="q-px-xxl"
      :class="{'q-pt-none':$q.screen.gt.xs}"
    >
      <!-- 检索 -->
      <div class="row q-col-gutter-sm q-pb-sm">
        <q-input
          filled
          readonly
          class="col-12"
          v-model="dateModel"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="dateRange"
                  range
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          filled
          v-model="personSelected"
          clearable
          use-input
          hide-selected
          fill-input
          option-value="id"
          option-label="name"
          input-debounce="0"
          class="col-12 col-md-6"
          label="人员筛选"
          :options="personSelectOptions"
          @filter="personSelectOptionsFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          filled
          v-model="serviceTypeSelected"
          clearable
          use-input
          hide-selected
          fill-input
          option-value="dictValue"
          option-label="dictKey"
          input-debounce="0"
          class="col-12 col-md-6"
          label="服务类型"
          :options="serviceTypeSelectOptions"
          @filter="serviceTypeSelectOptionsFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- 图表 -->
      <div
        class="q-py-sm"
        :style="{height: (chartBarData.yAxis.data.length*50+40)+'px',minHeight:'200px'}"
      >
        <v-chart
          :options="chartBarData"
          theme="macarons"
          autoresize
        />
      </div>

      <div
        class="q-py-sm"
        :style="{height: (chartPolarData.series.length*50+40)+'px',minHeight:'300px'}"
      >
        <v-chart
          :options="chartPolarData"
          theme="macarons"
          autoresize
        />
      </div>

      <!-- 按钮 -->
      <q-btn
        unelevated
        rounded
        icon="file_download"
        class="q-my-md"
        color="green-6"
        label="生成报表"
        @click="onExport"
      ></q-btn>

    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
import { jsonToExcel } from '@/utils/json-to-excel'
import { mapState, mapGetters, mapActions } from 'vuex'
let currentDate = new Date()
currentDate.setDate(currentDate.getDate() + 1)
let currentToDate = formatDate(currentDate, 'YYYY-MM-DD')
currentDate.setMonth(currentDate.getMonth() - 1)
currentDate.setDate(currentDate.getDate() - 1)
let currentFromDate = formatDate(currentDate, 'YYYY-MM-DD')
export default {
  data () {
    return {
      dateRange: { from: currentFromDate, to: currentToDate },
      dateModel: currentFromDate + ' ~ ' + currentToDate,
      personSelectOptions: [],
      personSelected: null,
      serviceTypeSelectOptions: [],
      serviceTypeSelected: null
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('service', ['services', 'currentListPageParams']),
    personSelectData () {
      return this.$store.getters['person/selectPersonsOfRoleCode']('ServiceConnector')
    },
    tableData: {
      get () {
        let services = this.services
        // 检索过滤
        services = _.filter(services, s => {
          var fromDate = this.dateRange ? new Date(this.dateRange.from).getTime() : new Date(currentFromDate)
          var toDate = this.dateRange ? new Date(this.dateRange.to).getTime() : new Date(currentToDate)
          var createtime = new Date(s.createTime).getTime()
          var isPass = createtime >= fromDate && createtime < toDate
          if (this.personSelected) {
            isPass = isPass && s.members.includes(this.personSelected.id)
          }
          if (this.serviceTypeSelected) {
            isPass = isPass && (s.type === '' ? '其它' : s.type) === this.serviceTypeSelected.dictKey
          }
          return isPass
        })
        // 获取类别
        let types = _.union(_.map(services, 'type'))
        // 拼接表格数据
        let data = []
        _.forEach(types, type => {
          let doingCount = _.filter(services, s => s.type === type && s.status !== 'confirmed').length
          let doneCount = _.filter(services, { status: 'confirmed', type }).length
          let noStarNum = _.filter(services, { evaluation: { rating: 0 }, type }).length
          let oneStarNum = _.filter(services, { evaluation: { rating: 1 }, type }).length
          let twoStarNum = _.filter(services, { evaluation: { rating: 2 }, type }).length
          let threeStarNum = _.filter(services, { evaluation: { rating: 3 }, type }).length
          let fourStarNum = _.filter(services, { evaluation: { rating: 4 }, type }).length
          let fiveStarNum = _.filter(services, { evaluation: { rating: 5 }, type }).length
          let starNumArray = [noStarNum, oneStarNum, twoStarNum, threeStarNum, fourStarNum, fiveStarNum]
          if (doingCount || doneCount) {
            data.push({
              title: type === '' ? '其它' : type,
              doing: doingCount,
              done: doneCount,
              total: doingCount + doneCount,
              starNumArray: starNumArray
            })
          }
        })
        // 返回表格数据
        return data
      }
    },
    chartBarData () {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        // 提示框。
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['进行中', '已完成'],
          top: 'bottom'
        },
        grid: {
          left: '10',
          right: '60',
          top: '10',
          bottom: '30',
          containLabel: true
        },
        xAxis: {
          name: '服务数',
          // nameLocation: 'start',
          type: 'value',
          boundaryGap: [0, '20%'],
          minInterval: Math.floor(Math.max(..._.map(this.tableData, 'total')) / 5),
          maxInterval: Math.floor(Math.max(..._.map(this.tableData, 'total')) / 5),
          position: 'top'
        },
        yAxis: {
          nameLocation: 'start',
          type: 'category',
          data: _.filter(_.map(this.tableData, 'title'), t => t !== '总计')
        },
        series: [
          {
            name: '进行中',
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: _.map(this.tableData, 'doing')
          },
          {
            name: '已完成',
            type: 'bar',
            stack: '1',
            label: {
              show: true,
              position: 'right'
            },
            data: _.map(this.tableData, 'done')
          }
        ]
      }
    },
    chartPolarData () {
      let series = []
      _.forEach(this.tableData, td => {
        series.push({
          type: 'bar',
          data: td.starNumArray,
          coordinateSystem: 'polar',
          name: td.title,
          stack: 'a'
        })
      })
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        angleAxis: {
          type: 'category',
          data: ['未评价', '一星', '二星', '三星', '四星', '五星']
        },
        radiusAxis: {
          name: '服务数',
          nameTextStyle: {
            padding: [-5, 5]
          }
        },
        polar: { center: ['50%', '50%'], radius: '70%' },
        series: series,
        legend: {
          show: true,
          data: _.filter(_.map(this.tableData, 'title'), t => t !== '总计'),
          top: 'bottom'
        }
      }
    },
    serviceTypes () {
      const types = this.dictionary['service'] ? this.dictionary['service']['serviceInfo'] : []
      types.push({
        dictKey: '其它',
        dictValue: '其它'
      })
      return types
    }
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    personSelectOptionsFilterFn (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.personSelectOptions = this.personSelectData
            } else {
              const needle = val.toLowerCase()
              this.personSelectOptions = this.personSelectData.filter(v =>
                v.name.toLowerCase().indexOf(needle) > -1 ||
                v.pinyin.toLowerCase().indexOf(needle) > -1
              )
            }
          }
        )
      }, 300)
    },
    serviceTypeSelectOptionsFilterFn (val, update, abort) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.serviceTypeSelectOptions = this.serviceTypes
            } else {
              const needle = val.toLowerCase()
              this.serviceTypeSelectOptions =
                this.serviceTypes.filter(v => v.dictKey.toLowerCase().indexOf(needle) > -1)
            }
          }
        )
      }, 300)
    },
    onExport () {
      let options = {
        name: '服务统计报表' + new Date().getTime(),
        data: _.map(this.tableData, t => _.omit(t, 'starNumArray')),
        keyMap: {
          title: '项目类别',
          doing: '进行中',
          done: '已完成',
          total: '总计'
        },
        filters: [],
        title: [
          { name: '服务统计报表', colspan: 4 }
        ],
        footer: [
          { name: '导出时间：' + formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'), colspan: 4 }
        ]
      }
      jsonToExcel(options)
    },
    initData () {
      this.loadDictionarys('service')
      this.$store.dispatch(`service/loadServices`, {
        byPage: false,
        ...this.currentListPageParams.selectCondition
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initData()
    })
  },
  watch: {
    dateRange (newVal, oldVal) {
      this.dateModel = newVal ? newVal.from + ' ~ ' + newVal.to : currentFromDate + ' ~ ' + currentToDate
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style scoped lang="scss">
</style>
