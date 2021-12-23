<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card :title="$t('archive.someArchived',{count:events.length,something:$t('schedule.event')})">
    </tw-header-card>
    <q-card-section class="row justify-center q-gutter-md q-px-xxl">
      <q-card
        v-for="event in events"
        :key="event.id"
        class="torn-card cursor-pointer"
        @click.native="routeToEvent(event.id)"
      >
        <q-card-section class="archived">
          <event-intro :model="event" />
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ArchivedEvents',
  props: {
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    EventIntro: () => import('components/calendar/EventIntro')
  },
  data () {
    return {
      events: []
    }
  },
  created () {
    this.loadArchivedEvents({ resourceCategory: this.category, resourceId: +this.objectID })
      .then(events => {
        this.events = events
      })
  },
  methods: {
    ...mapActions('schedule', ['loadArchivedEvents']),
    routeToEvent (id) {
      this.$router.push({
        name: 'eventDetail',
        params: {
          category: this.category,
          objectID: this.objectID,
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
