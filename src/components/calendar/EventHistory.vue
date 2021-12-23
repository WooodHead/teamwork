<template>
  <tw-history
    :category="category"
    :objectID="+objectID"
    type="event"
    :id="+id"
  >
    <template #content>
      <q-card :class="cardStyle+'-card'">
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
      </q-card>
    </template>
  </tw-history>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
import timeRangeFormat from '@/utils/time-range-format'
import { mapActions } from 'vuex'
export default {
  name: 'EventHistory',
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    model: {
      type: Object,
      default: null
    },
    id: {
      type: [Number, String],
      required: true
    },
    dense: {
      type: Boolean,
      default: false,
      required: false
    },
    cardStyle: {
      type: String,
      default: 'torn', // whole
      required: false,
      description: '撕边/完整卡片'
    }
  },
  data () {
    return {
      event: {}
    }
  },
  components: {
    TwHistory: () => import('components/base/TwHistory'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  methods: {
    formatDate,
    timeRangeFormat,
    ...mapActions('schedule', ['loadEvent'])
  },
  created () {
    if (this.model) {
      this.event = this.model
    } else {
      this.loadEvent(Number(this.id)).then((event) => {
        this.event = event
      })
    }
  }
}
</script>
