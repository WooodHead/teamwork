<template>
  <div class="calendar-panel">
    <q-toolbar class="bg-primary text-white calender-toolbar">
      <q-btn
        flat
        round
        :title="$t('schedule.backAMonth')"
        icon="navigate_before"
        @click="calendarPrev"
      />
      <q-btn
        flat
        stretch
        :title="$t('schedule.returnToToday')"
        :label="$t('schedule.today')"
        @click="returnToToday"
      />
      <q-space v-if="!$q.screen.gt.sm" />
      <q-item-label :class="{'text-h6':true,
      'q-mr-xl q-pr-xl':!$q.screen.gt.sm,
      'q-mx-lg q-px-xl':$q.screen.gt.sm}">
        {{monthLabel}}
        <span class="text-caption">
          {{yearLabel}}</span>
      </q-item-label>
      <q-space v-if="$q.screen.gt.sm" />
      <q-separator
        vertical
        color="grey"
        v-if="$q.screen.gt.sm"
      />
      <q-space v-if="$q.screen.gt.sm" />
      <template v-if="$q.screen.gt.sm">
        <q-item-label
          class="text-h6 q-mx-lg q-px-xl"
          style="padding-right: 108px;"
        >{{monthLabel2}}
          <span class="text-caption">
            {{yearLabel2}}</span>
        </q-item-label>

      </template>

      <q-btn
        flat
        round
        :title="$t('schedule.forwardAMonth')"
        icon="navigate_next"
        @click="calendarNext"
      />
    </q-toolbar>
    <div class="row justify-center calendar">
      <q-calendar
        view="month"
        v-model="monthDate"
        short-weekday-label
        short-month-label
        ref="calendar"
        month-label-size="md"
        @click:day2="onToggleDate"
        @click:date2="onToggleDate"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        :show-month-label="false"
        :selected-dates="selectedDates"
        :mini-mode="false"
        :day-height="60"
        :day-class="getDayClass"
      >
        <template #day="{ timestamp,outside }">
          <div
            v-if="!outside"
            class="row justify-center q-gutter-none"
            style="padding-top:2px"
          >
            <q-avatar
              rounded
              v-for="(event, index) in eventsOneDay(timestamp.date).slice(0,maxOneDay)"
              :key=index
              :text-color="dotColor"
              :title="event.title"
            >•</q-avatar>
          </div>
        </template>
      </q-calendar>

      <q-separator
        vertical
        color="grey"
        v-if="$q.screen.gt.sm"
      />
      <q-calendar
        v-if="$q.screen.gt.sm"
        view="month"
        v-model="monthDate2"
        short-weekday-label
        short-month-label
        ref="calendar2"
        month-label-size="md"
        @click:day2="onToggleDate2"
        @click:date2="onToggleDate2"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        :show-month-label="false"
        :selected-dates="selectedDates"
        :mini-mode="false"
        :day-height="60"
        :day-class="getDayClass"
      >
        <template #day="{ timestamp,outside }">
          <div
            v-if="!outside"
            class="row justify-center q-gutter-none"
            style="padding-top:2px"
          >
            <q-avatar
              rounded
              v-for="(event, index) in eventsOneDay(timestamp.date).slice(0,maxOneDay)"
              :key=index
              :text-color="dotColor"
              :title="event.title"
            >•</q-avatar>
          </div>
        </template>
      </q-calendar>
    </div>
    <q-list
      separator
      class="q-pt-md"
    >
      <q-item
        v-for="(date,index) in getHasEventDates(selectedDate)"
        :key="date"
      >
        <event-list
          :show-add-btn="!index"
          :date="date"
          :events="eventsOneDay(date)"
          :resource="{category:category,id:objectID}"
          clickable
        />
      </q-item>
    </q-list>
    <q-separator spaced />
    <div class="row justify-center q-pa-sm">
      <q-btn
        color="primary"
        flat
        :label="$t('schedule.showEverythingUpTo',{date:niceDate(nextUpToDate.date)})"
        @click="loadNextEvents({ resourceCategory: category, resourceId: objectID })"
      />
    </div>
  </div>
</template>
<script>

import { date, LocalStorage } from 'quasar'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
const my = LocalStorage.getItem('myself') || {}
const CURRENT_DAY = new Date()

function getCurrentMonth (month) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setMonth(month)
  const tm = QCalendar.parseDate(newDay)
  return tm.date
}
function today () {
  return QCalendar.parseDate(CURRENT_DAY).date
}
/** 日程安排组件
 *  可展示多中类型的资源的工作日程：
 *  某人，某项目，某团队，某部门
 *  某机床，某工具，某会议室等
 *  获取的资源数据来源包括：
 *  任务（task）,事件（event）,
 */
export default {
  name: 'TwCalendar',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    objectID: {
      type: Number,
      required: false,
      default: () => {
        return my.id
      }
    }
  },
  components: {
    EventList: () => import('components/calendar/EventList')
  },
  data () {
    return {
      monthDate: '',
      selectedDates: [this.selectedDate],
      monthDate2: '',
      maxOneDay: 9,
      dotColor: 'primary'
    }
  },
  computed: {
    ...mapState('schedule', ['constMonths', 'intervalMonths', 'events']),
    ...mapGetters('schedule', ['upToDate', 'nextUpToDate', 'eventsOneDay', 'haveEventsOneDay']),
    selectedDate: {
      get () {
        return this.$store.state.schedule.selectedDate
      },
      set (value) {
        this.$store.commit('schedule/setSelectedDate', value)
      }
    },
    monthLabel () {
      return this.$q.lang.date.monthsShort[new Date(this.monthDate.replace(/-/g, '/')).getMonth()]
    },
    monthLabel2 () {
      return this.$q.lang.date.monthsShort[new Date(this.monthDate2.replace(/-/g, '/')).getMonth()]
    },
    yearLabel () {
      const curYear = new Date().getFullYear()
      const year = new Date(this.monthDate.replace(/-/g, '/')).getFullYear()
      return year === curYear ? '' : year
    },
    yearLabel2 () {
      const curYear = new Date().getFullYear()
      const year = new Date(this.monthDate2.replace(/-/g, '/')).getFullYear()
      return year === curYear ? '' : year
    },
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    }
  },
  watch: {
    resource: {
      handler (newVal, oldVal) {
        this.clearEvents()
        this.loadEvents({ resourceCategory: newVal.category, resourceId: newVal.objectID })
      },
      immediate: true,
      deep: true
    },
    selectedDate (val) {
      this.selectedDates = [val]
    }
  },
  beforeMount () {
    // this.selectedDate = today()
    const selectedDate = new Date(this.selectedDate.replace(/-/g, '/'))
    this.monthDate = getCurrentMonth(selectedDate.getMonth())
    this.$q.screen.gt.sm && (this.monthDate2 = getCurrentMonth(selectedDate.getMonth() + 1))
  },
  methods: {
    ...mapMutations('schedule', ['clearEvents', 'initIntervalMonths']),
    ...mapActions('schedule', ['loadEvents', 'loadNextEvents', 'loadCurrentMonthEvents']),
    getHasEventDates (date) {
      let startDate = QCalendar.parseTimestamp(this.selectedDate)
      const endDate = this.upToDate
      const dates = []
      dates.push(startDate.date) // 第一个日期无论有没有事件都要显示
      startDate = QCalendar.addToDate(startDate, { day: 1 })
      const endDayIdentifier = QCalendar.getDayIdentifier(endDate)
      while (QCalendar.getDayIdentifier(startDate) <= endDayIdentifier) {
        if (this.haveEventsOneDay(startDate.date)) {
          // 其余只显示有事件的日期
          dates.push(startDate.date)
        }
        startDate = QCalendar.addToDate(startDate, { day: 1 })
      }
      return dates
    },
    niceDate (value) {
      const curYear = new Date().getFullYear()
      const year = new Date(value.replace(/-/g, '/')).getFullYear()
      return curYear === year ? date.formatDate(value, this.$t('date.MMDD')) : date.formatDate(value, this.$t('date.YYYYMMDD'))
    },
    returnToToday () {
      this.monthDate = getCurrentMonth(CURRENT_DAY.getMonth())
      this.$q.screen.gt.sm && (this.monthDate2 = getCurrentMonth(CURRENT_DAY.getMonth() + 1))
      this.selectedDate = today()
      // this.selectedDates = [this.selectedDate]
    },
    calendarNext () {
      this.$refs.calendar.next()
      if (this.$q.screen.gt.sm) {
        this.$refs.calendar2.next()
      }
      this.loadCurrentMonthEvents({
        currentMonth: this.$q.screen.gt.sm ? this.monthDate2 : this.monthDate,
        resourceCategory: this.category,
        resourceId: this.objectID
      })
    },
    calendarPrev () {
      this.$refs.calendar.prev()
      if (this.$q.screen.gt.sm) {
        this.$refs.calendar2.prev()
      }
      this.loadCurrentMonthEvents({
        currentMonth: this.monthDate,
        resourceCategory: this.category,
        resourceId: this.objectID
      })
    },
    getDayClass () {
      return { 'column items-center cursor-pointer': true }
    },
    onToggleDate ({ scope }) {
      const curMonth = new Date(this.monthDate.replace(/-/g, '/')).getMonth() + 1
      this.loadCurrentEvents(curMonth, scope.timestamp)
    },
    onToggleDate2 ({ scope }) {
      const curMonth = new Date(this.monthDate2.replace(/-/g, '/')).getMonth() + 1
      this.loadCurrentEvents(curMonth, scope.timestamp)
    },
    loadCurrentEvents (curMonth, selectedDay) {
      const selectedMonth = selectedDay.month
      if (curMonth === selectedMonth) { // outside
        this.selectedDate = selectedDay.date
        const month = new Date(this.selectedDate.replace(/-/g, '/')).getMonth() + 1
        if (month !== selectedMonth) {
          this.initIntervalMonths()
          this.loadEvents({ resourceCategory: this.category, resourceId: this.objectID })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar-panel {
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
}
.calender-toolbar {
  border: #9e9e9e 1px solid;
  border-bottom: none;
}
.calendar {
  border: #9e9e9e 1px solid;
  border-top: none;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}
.q-calendar {
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  flex-direction: column;
}
/deep/ .q-calendar-weekly__head {
  max-height: 25px;
}
/deep/ .q-calendar-weekly__week--wrapper {
  border-bottom: none;
}
/deep/ .q-calendar-weekly .q-calendar-weekly__head-weekday {
  border-right: none;
  border-bottom: #e0e0e0 1px solid;
  color: white;
  background: $primary;
  font-weight: 400;
}
/deep/ .q-calendar-weekly__week {
  border: none;
}
/deep/ .q-calendar-weekly .q-calendar-weekly__day {
  border: none;
}
/deep/ .q-calendar-weekly__day-label {
  left: auto;
  position: relative;
  display: block;
}
/deep/ .q-calendar-weekly__day--content {
  margin-top: 0;
  height: auto;
}
.q-calendar .q-avatar {
  width: auto;
  height: auto;
}
</style>
