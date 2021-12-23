<template>
  <q-card-section>
    <q-list separator>
      <q-item :class="{ column: $q.screen.lt.sm }">
        <q-item-section side>
          <div class="row">
            <tw-date :date="event.startTime" />
            <template v-if="multiDay">
              <div
                class="q-px-xs "
                style="line-height:47.6px;"
              >
                -
              </div>
              <tw-date :date="event.endTime" />
            </template>
          </div>
        </q-item-section>
        <q-item-section>
          <div class="text-h5 text-weight-bold ">
            {{event.title}}
          </div>
          <tw-edit-by
            :modifyBy="event.modifyBy"
            :modifyTime="event.modifyTime"
          />
        </q-item-section>
      </q-item>
      <q-item :class="{ column: $q.screen.lt.sm }">
        <q-item-section
          side
          :class="labelClass"
          :style="labelStyle"
        >
          {{$t('schedule.when')}}
        </q-item-section>
        <q-item-section>
          {{timeRangeFormat({startTime:event.startTime,endTime:event.endTime,allDay:event.allDay,charMonth:true})}}
        </q-item-section>
        <q-item-section
          v-if="false"
          side
        >
          <q-btn
            flat
            dense
            color="primary"
            :label="$t('schedule.addToMyCalendar')"
            @click="$q.notify('弹出日历复制')"
          />
        </q-item-section>
      </q-item>
      <q-item
        :class="{ column: $q.screen.lt.sm }"
        v-if="event.repeat.type!=='dontRepeat' && !event.archived"
      >
        <q-item-section
          side
          :class="labelClass"
          :style="labelStyle"
        >
          {{$t('schedule.repeats')}}
        </q-item-section>
        <q-item-section>
          {{repeatLabel(event.repeat.type)}} 直到 {{event.repeat.until|niceDate}}
        </q-item-section>
      </q-item>
      <q-item :class="{ column: $q.screen.lt.sm }">
        <q-item-section
          side
          :class="labelClass"
          :style="labelStyle"
        >
          {{$t('schedule.participants')}}
        </q-item-section>
        <q-item-section>
          <div class="row q-gutter-sm">
            <div
              v-for="id in event.withs"
              :key="id"
            >
              <tw-avatar
                :id="id"
                :name="persons[id]?persons[id].name:null"
                :img="persons[id]?persons[id].img:null"
                size="md"
                :popupCard="!onlyShow"
              />
              {{persons[id]?persons[id].name:""}}
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item :class="{ column: $q.screen.lt.sm }">
        <q-item-section
          side
          :class="labelClass"
          :style="labelStyle"
        >
          {{$t('schedule.field.label.notes')}}
        </q-item-section>
        <q-item-section>
          <div
            class="tiptap-content editor__content"
            v-html="event.notes"
          ></div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
import timeRangeFormat from '@/utils/time-range-format'
const { getDateDiff, formatDate } = date
export default {
  name: 'EventContent',
  props: {
    event: {
      type: Object,
      required: true
    },
    withs: {
      type: Object,
      required: false,
      default: null
    },
    onlyShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      labelClass: 'text-dark text-weight-bold text-subtitle1  ' + (this.$q.screen.lt.sm ? 'text-start' : 'items-end'),
      labelStyle: 'width:4rem'
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    persons () {
      return this.withs || this.selectPersons
    },
    multiDay () {
      const startDate = new Date(this.event.startTime.replace(/-/g, '/'))
      const endDate = new Date(this.event.endTime.replace(/-/g, '/'))
      return getDateDiff(endDate, startDate, 'days') > 0
    }
  },
  filters: {
    niceDate (value) {
      const thisDate = new Date(value.replace(/-/g, '/'))
      const today = new Date()
      const yearFormat = getDateDiff(thisDate, today, 'years') ? 'YYYY ' : ''
      return formatDate(thisDate, yearFormat + 'MMM DD ddd')
    }
  },
  components: {
    TwEditBy: () => import('components/base/TwEditBy'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwDate: () => import('components/base/TwDate')
  },
  methods: {
    repeatLabel (type) {
      const repeat = _.find(this.$store.state.schedule.repeatOptions, rpop => rpop.value === type)
      return repeat ? repeat.label : type
    },
    timeRangeFormat
  }
}
</script>

<style>
</style>
