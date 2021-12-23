<template>
  <q-card-section class="column items-center text-center q-gutter-xs">
    <div class="text-subtitle2">{{event.title}}</div>
    <div class="text-caption">
      <q-icon
        class="text-light-green q-pr-xs"
        name="today"
        style="font-size: 1.4em;"
      />
      {{timeRangeFormat({startTime:event.startTime,endTime:event.endTime,allDay:event.allDay,charMonth:true})}}
    </div>
    <div>
      <tw-avatar
        v-for="id in event.withs"
        :key="id"
        :id="id"
        size="md"
        :popupCard="false"
      />
    </div>
  </q-card-section>
</template>

<script>
import { mapActions } from 'vuex'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'EventIntro',
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    model: {
      type: Object,
      default: null
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  data () {
    return {
      event: {}
    }
  },
  created () {
    if (this.model) {
      this.event = this.model
    } else {
      this.loadEvent(Number(this.id)).then((event) => {
        this.event = event
      })
    }
  },
  methods: {
    ...mapActions('schedule', ['loadEvent']),
    timeRangeFormat
  }
}
</script>

<style>
</style>
