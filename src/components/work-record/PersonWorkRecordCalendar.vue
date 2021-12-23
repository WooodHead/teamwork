<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <q-card-section class="q-px-xxl q-mt-md">
      <div class="calendar-panel">
        <q-toolbar class="row bg-primary text-white calender-toolbar">
          <div class="row items-center">
            <q-btn
              flat
              round
              :title="$t('schedule.backAMonth')"
              icon="navigate_before"
              @click="calendarPrev"
            />
            <q-btn
              flat
              dense
              stretch
              :title="$t('schedule.returnToToday')"
              :label="$t('schedule.today')"
              @click="returnToToday"
            />
          </div>
          <q-space />
          <div
            class="row justify-center items-center"
            style="word-break:break-all;"
          >
            <span :class="$q.screen.lt.sm?'text-subtitle1':'text-h6'">{{$t('workRecord.dashboard.totalByMonth')}}{{totalHours}}</span>
          </div>
          <q-space />
          <div class="row justify-end items-center">
            <q-btn
              flat
              round
              :title="$t('workHour.next')"
              icon="navigate_next"
              @click="calendarNext"
            />
          </div>
        </q-toolbar>
        <div class="calendar">
          <q-calendar
            ref="calendar"
            v-model="selectedDate"
            view="month"
            animated
            transition-prev="slide-right"
            transition-next="slide-left"
            :weekdays="[1,2,3,4,5,6,0]"
            short-weekday-label
            :locale="$q.lang.getLocale()"
            :day-height="100"
          >
            <template #day="{ timestamp }">
              <div
                v-if="personOneMonthTasksList[timestamp.date]"
                class="fit row items-center justify-center"
              >
                <div
                  class="text-h6"
                  style="word-break:break-all;"
                >
                  {{ personOneMonthTasksList[timestamp.date].totalHour }}
                </div>
                <!-- 有任务显示• -->
                <div
                  class="row justify-center task-avatar cursor-pointer"
                  style="bottom: 2px;position: absolute;width:100%;"
                >
                  <q-avatar
                    rounded
                    v-for="(task, index) in personOneMonthTasksList[timestamp.date].tasklist"
                    :key=index
                    text-color="primary"
                    :title="task.name"
                  >•</q-avatar>
                </div>
              </div>

              <q-popup-edit
                v-if="personOneMonthTasksList[timestamp.date]"
                value
                :anchor="$q.screen.gt.sm?'center left':'center middle'"
              >
                <template>
                  <div class="row">
                    <q-space />
                    <q-btn
                      icon="close"
                      flat
                      round
                      dense
                      v-close-popup
                    />
                  </div>
                  <div>
                    <span class="text-weight-bold">{{$t('workRecord.dashboard.workRecordsToday')}}</span>
                    <q-item class="column cursor-pointer text-left text-caption q-gutter-sm">
                      <work-record-item
                        v-for="task in personOneMonthTasksList[timestamp.date].tasklist"
                        :key="task.id"
                        :task="task"
                      />
                    </q-item>
                  </div>
                </template>
              </q-popup-edit>
            </template>
          </q-calendar>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { date } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
import QCalendar from '@quasar/quasar-ui-qcalendar'
const { formatDate } = date, currentDay = new Date()
function today () {
  return QCalendar.parseDate(currentDay).date
}
export default {
  name: 'PersonWorkRecordCalendar',
  data () {
    return {
      selectedDate: '',
      startTime: formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth(), 1), 'YYYY-MM-DD'),
      endTime: formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1), 'YYYY-MM-DD')
    }
  },
  computed: {
    ...mapState('task', ['tasks', 'selectDate']),
    personOneMonthTasksList () {
      let personOneMonthTask = _.filter(this.tasks, p =>
        p.objectType === 'person' && p.objectId === +this.$myinfo.id && p.type === 'item' && p.finished &&
        p.beginTime >= this.startTime && p.finishedTime < this.endTime
      )
      let groupByList = _.groupBy(personOneMonthTask, item => {
        return date.formatDate(item.beginTime.replace(/-/g, '/'), 'YYYY-MM-DD')
      }) || []
      let tasksObj = {}
      Object.keys(groupByList).forEach(item => {
        let total = 0, totalWorkHour = 0, totalOnRoadHour = 0
        groupByList[item].forEach(p => {
          total += (p.workHour + p.onRoadHour)
          totalWorkHour += p.workHour
          totalOnRoadHour += p.onRoadHour
        })
        tasksObj[item] = {
          date: item,
          tasklist: groupByList[item],
          totalHour: Math.abs(total.toFixed(1)),
          totalWorkHour: Math.abs(totalWorkHour.toFixed(1)),
          totalOnRoadHour: Math.abs(totalOnRoadHour.toFixed(1))
        }
      })
      return tasksObj
    },
    totalHours () {
      return Math.abs(_.sum(_.values(this.personOneMonthTasksList).map(n => n.totalHour)).toFixed(1))
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('task', ['setSelectDate']),
    ...mapActions('task', ['loadWorkRecordTaskList']),
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    returnToToday () {
      this.selectedDate = today()
    },
    init () {
      let query = [
        { Key: 'ObjectType', Value: 'person', Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.$myinfo.id, Oper: 'eq' },
        'and',
        { Key: 'Type', Value: 'item', Oper: 'eq' },
        'and',
        { Key: 'BeginTime', Value: this.startTime, Oper: 'ge' },
        'and',
        { Key: 'FinishedTime', Value: this.endTime, Oper: 'lt' }
      ]
      this.loadWorkRecordTaskList({ query: query })
      this.setSelectDate(this.startTime)
    }
  },
  components: {
    WorkRecordItem: () => import('components/work-record/WorkRecordItem')
  },
  watch: {
    selectedDate: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (newVal) {
          let time = new Date(newVal)
          this.startTime = formatDate(new Date(time.getFullYear(), time.getMonth(), 1), 'YYYY-MM-DD')
          this.endTime = formatDate(new Date(time.getFullYear(), time.getMonth() + 1, 1), 'YYYY-MM-DD')
          if (this.selectDate.indexOf(this.startTime) < 0) {
            this.init()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar-panel {
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
}
.calender-toolbar {
  border: #e0e0e0 1px solid;
  border-bottom: none;
}
.calendar {
  border: #e0e0e0 1px solid;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}
.q-calendar .task-avatar .q-avatar {
  width: auto;
  height: auto;
}
</style>
