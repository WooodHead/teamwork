<template>
  <div>
    <event-list
      v-for="date in dates"
      :key="date"
      :date="date"
      :events="eventsOneDay(date)"
      :dense="true"
      :resource="{category:param.category,id:+param.objectID}"
    />
  </div>
</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ScheduleIntro',
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  components: {
    EventList: () => import('components/calendar/EventList')
  },
  mounted () {
    if (this.param.category && this.param.objectID) {
      this.clearEvents()
      this.loadHenceforwardEvents({
        count: 4,
        resourceCategory: this.param.category,
        resourceId: +this.param.objectID
      })
    }
  },
  computed: {
    ...mapState('schedule', ['events']),
    ...mapGetters('schedule', ['eventsOneDay']),
    dates: function () {
      // 如果跨过今天，就取今天的日期，否则取开始日期
      const today = QCalendar.parseDate(new Date())
      return _.uniq(_.map(this.events, e => {
        const startDate = QCalendar.parseTimestamp(e.startTime)
        const endDate = QCalendar.parseTimestamp(e.endTime)
        if (QCalendar.isBetweenDates(today, startDate, endDate)) {
          return today.date
        } else {
          return startDate.date
        }
      }))
    }
  },
  methods: {
    ...mapMutations('schedule', ['clearEvents']),
    ...mapActions('schedule', ['loadHenceforwardEvents'])
  }
}
</script>

<style>
</style>
