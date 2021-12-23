<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
    clickable
  >
    <!-- 头部logo -->
    <q-card-section>
      <div class="row justify-center items-center">
        <span class="text-h5">
          任务仪表盘
        </span>
        <q-btn
          dense
          round
          flat
          icon="refresh"
          title="刷新"
          @click="Refresh"
        />
      </div>
      <div v-if="latestUpdateTime && latestUpdateTime!='1000-01-01 00:00:00'"
      class="row justify-center items-center">
        <span class="text-grey">
          更新于{{latestUpdateTime}}
        </span>        
      </div>
    </q-card-section>
    <q-card-section
      class="q-py-none"
      :class="$q.screen.lt.sm?'':'q-px-xl'"
    >
      <q-toolbar class="q-px-none">
        <q-radio
          v-model="statustype"
          val="all"
          label="所有"
          color="primary"
        />
        <q-radio
          v-model="statustype"
          val="task"
          label="任务"
          color="accent"
        />
        <q-radio
          v-model="statustype"
          val="bug"
          label="缺陷"
          color="red"
        />
        <q-space />
        <q-chip
          v-if="!$q.screen.lt.sm"
          class="cursor-pointer"
          icon="event"
          :removable="chartDate.from!==''"
          square
          color="white"
          text-color="dark"
          @remove="setChartDate"
        >
          <span v-if="chartDate.from!==''">
            {{chartDate.from+' ~ '+chartDate.to}}
          </span>
          <span
            v-else
            class="text-grey-7"
          >
            选择时间段
          </span>
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="chartDate"
              mask="YYYY/MM/DD"
              minimal
              range
            />
          </q-popup-proxy>
        </q-chip>
      </q-toolbar>
      <q-toolbar
        v-if="$q.screen.lt.sm"
        class="q-px-none"
      >
        <q-chip
          class="cursor-pointer q-ml-none"
          icon="event"
          :removable="chartDate.from!==''"
          square
          color="white"
          text-color="dark"
          @remove="setChartDate"
        >
          <span v-if="chartDate.from!==''">
            {{chartDate.from+' ~ '+chartDate.to}}
          </span>
          <span
            v-else
            class="text-grey-7"
          >
            选择时间段
          </span>
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="chartDate"
              mask="YYYY/MM/DD"
              minimal
              range
            />
          </q-popup-proxy>
        </q-chip>
      </q-toolbar>
    </q-card-section>
    <q-card-section
      class="q-gutter-sm"
      :class="$q.screen.lt.sm?'':'q-px-xl'"
    >
      <task-create-chart
        :category="category"
        :objectID="objectID"
        :statustype="statustype"
        :chartDate="chartDate"
      ></task-create-chart>
      <task-finished-chart
        :category="category"
        :objectID="objectID"
        :statustype="statustype"
        :chartDate="chartDate"
      ></task-finished-chart>
      <task-person-chart
        :category="category"
        :objectID="objectID"
        :statustype="statustype"
        :chartDate="chartDate"
        :personRelatedCharts="personRelatedCharts"         
      ></task-person-chart>
      <task-delay-chart
        :category="category"
        :objectID="objectID"
        :statustype="statustype"
        :chartDate="chartDate"   
        :personRelatedCharts="personRelatedCharts"     
      ></task-delay-chart>
      <task-hour-chart
        :category="category"
        :objectID="objectID"
        :statustype="statustype"
        :chartDate="chartDate"
        :personRelatedCharts="personRelatedCharts"
      ></task-hour-chart>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return LocalStorage.getItem('myself').id
      }
    }
  },
  inject: ['reload'],
  data () {
    return {
      personRelatedCharts: [],
      statustype: 'all',
      dialog: false,
      chartDate: {
        from: '',
        to: ''
      }
    }
  },
  components: {
    'task-create-chart': () => import('components/task/dashboard/TaskCreateChart'),
    'task-finished-chart': () => import('components/task/dashboard/TaskFinishedChart'),
    'task-person-chart': () => import('components/task/dashboard/TaskPersonChart'),
    'task-delay-chart': () => import('components/task/dashboard/TaskDelayChart'),
    'task-hour-chart': () => import('components/task/dashboard/TaskHourChart')
  },
  methods: {
    ...mapActions('taskchart', ['UpdateObjectChart', 'loadTaskCharts', 'loadPersonRelatedCharts']),
    Refresh () {
      this.setChartDate()
      this.statustype = 'all'
      this.UpdateObjectChart({
        ObjectID: +this.objectID,
        ObjectType: this.category
      }).then(() => {
        this.reload()
      })
    },
    setChartDate () {
      this.chartDate.from = ''
      this.chartDate.to = ''
    },        
    getPersonRelatedChartsByDate () {      
      if (this.chartDate.from) {
        this.loadPersonRelatedCharts({
          objectID: +this.objectID,
          objectType: this.category,
          statusType: this.statustype,
          beginDate: this.chartDate.from,
          endDate: this.chartDate.to
        }).then(
          res => {
            this.personRelatedCharts = res
          })
      } else {
        this.personRelatedCharts = []
      }
    }
  },
  mounted () {
    const query = [
      { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' }]
    this.loadTaskCharts({ query })
  },
  computed: {
    latestUpdateTime () {
      let charts = this.$store.state.taskchart.taskcharts.filter(a =>
        a.objectType === this.category &&
        a.objectId === +this.objectID)
      let data = _.sortBy(charts, ['latestUpdateTime']).reverse()
      // 获取最大的更新时间
      if (data && data.length) {
        let aa = data[0].latestUpdateTime ? data[0].latestUpdateTime : ''
        return aa
      } else {
        return ''
      }
    }    
  },
  watch: {
    'statustype': {
      handler () {
        this.getPersonRelatedChartsByDate()
      }
    },
    'chartDate': {
      deep: true,
      handler () {
        this.getPersonRelatedChartsByDate()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.q-space {
  flex-grow: 1 !important;
}
</style>
