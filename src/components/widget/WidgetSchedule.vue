<template>
  <widget-layout
    :isEmpty="!this.events.length"
    widget="schedule"
    :category="category"
    :id="objectID"
  >
    <template slot="content">
      <q-card-section class="q-py-sm text-left">
        <event-list
          v-for="date in dates"
          :key="date"
          :date="date"
          dense
          :events="eventsOneDay(date)"
          :resource="{category:category,id:objectID}"
        />
      </q-card-section>
    </template>

  </widget-layout>
</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'WidgetSchedule',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: Number,
      required: true
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    EventList: () => import('components/calendar/EventList')
  },
  mounted () {
    this.clearEvents()
    this.loadHenceforwardEvents({
      count: 4,
      resourceCategory: this.category,
      resourceId: this.objectID
    })
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

<style lang="scss" scoped>
</style>
