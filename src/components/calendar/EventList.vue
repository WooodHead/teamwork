<template>
  <div :class="layout">
    <div
      :class="dateClass"
      class="col-auto"
    >
      <q-icon
        v-if="dense"
        class="text-light-green"
        name="today"
        style="font-size: 1.2em;"
      />
      {{date}}
    </div>
    <q-list class="col-shrink">
      <q-item
        v-for="event in events"
        :key="event.id"
        :clickable="clickable"
        :v-ripple="clickable"
        @click="clickEvent(event.id)"
      >
        <q-item-section wrap>
          <q-item-label
            :class="{'text-h6':$q.screen.gt.sm&&!dense}"
            :title="htmlToText(event.notes)"
          >{{event.title}}
            <template v-for="id in event.withs">
              <tw-avatar
                :popupCard="clickable"
                :key="'event_avatar_'+id"
                :id="id"
                :name="withs&&withs[id].name"
                :img="withs&&withs[id].img"
                size="sm"
              />
              <span
                v-if="!clickable"
                class="text-caption text-grey-7"
                :key="id"
              > {{withs&&withs[id].name}}</span>
            </template>
          </q-item-label>
          <q-item-label :caption="$q.screen.lt.sm||dense">
            <q-chip
              v-if="event.allDay"
              outline
              square
              color="red"
              text-color="white"
              label="全天"
              size="sm"
            />
            {{timeRangeFormat({startTime:event.startTime,endTime:event.endTime,allDay:event.allDay})}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item-label
        header
        class="text-h6 q-pt-xs q-pl-md"
        v-if="!events||events.length===0"
      >
        {{$t('schedule.NothingsOnTheSchedule')}}
      </q-item-label>
      <q-btn
        v-if="showAddBtn&&!addingEvent"
        class="q-ml-md q-mt-sm"
        rounded
        outline
        color="primary"
        :label="$t('schedule.addAnEvent')"
        @click="setAddingEvent(true)"
      />

      <q-item-section
        v-if="showAddBtn&&addingEvent"
        style="max-width:90vw;width:590px;"
      >
        <event-form
          :category="resource.category"
          :objectID="resource.id"
          :date="date"
          flat
          :bordered="!$q.screen.lt.sm"
          :grow="false"
          :xxlPadding="false"
          @cancel="setAddingEvent(false)"
          @ok="setAddingEvent(false)"
        />
      </q-item-section>

    </q-list>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapMutations } from 'vuex'
import htmlToText from '@/utils/html-to-text'
import timeRangeFormat from '@/utils/time-range-format'

export default {
  name: 'EventList',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    EventForm: () => import('components/calendar/EventForm')
  },
  props: {
    date: {
      type: String,
      required: true
    },
    events: {
      type: Array,
      required: true
    },
    withs: {
      type: Object,
      required: false
    },
    showAddBtn: {
      type: Boolean,
      required: false,
      default: false
    },
    resource: {
      type: Object,
      required: false,
      default: function () {
        return {
          category: 'person',
          id: LocalStorage.getItem('myself') ? LocalStorage.getItem('myself').id : 0
        }
      }
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    clickable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      layout: this.dense ? 'column'
        : (this.$q.platform.is.desktop ? 'row no-wrap' : 'column'),
      dateClass: this.dense ? 'text-left text-subtitle text-weight-bold q-pb-xs'
        : (this.$q.platform.is.desktop ? 'text-h6 q-pr-lg q-py-sm' : 'text-subtitle q-pb-sm')
    }
  },
  computed: {
    ...mapState('schedule', ['addingEvent', 'repeatType'])
  },
  methods: {
    ...mapMutations('schedule', ['setAddingEvent', 'setClickEvent']),
    htmlToText,
    timeRangeFormat,
    clickEvent (id) {
      this.setClickEvent(true)
      this.$router.push({
        name: 'eventDetail',
        params: {
          id: +id,
          category: this.resource.category,
          objectID: +this.resource.id
        }
      })
    }
  }
}
</script>

<style>
</style>
