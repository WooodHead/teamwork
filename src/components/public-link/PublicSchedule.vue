<template>
  <q-card-section class="q-pt-xl">
    <event-list
      v-for="date in dates"
      :key="date"
      :date="date"
      :events="eventsOneDay(date,events)"
      :withs="withs"
    />
  </q-card-section>

</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
import { mapGetters } from 'vuex'
import Event from '@/store/schedule/model'
import Person from '@/store/person/model'
export default {
  name: 'PublicSchedule',
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      events: Event.from(this.publicContent.Events),
      withs: _.keyBy(Person.from(this.publicContent.Withs), 'id')
    }
  },
  components: {
    EventList: () => import('components/calendar/EventList')
  },
  computed: {
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
  }
}
</script>

<style>
</style>
