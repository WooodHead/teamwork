<template>
  <q-card
    :flat="flat"
    :bordered="bordered"
    :class="{'card-grow-in-page':grow,'q-px-xxl':xxlPadding}"
  >
    <q-card-section v-if="grow">
    </q-card-section>
    <q-form
      autofocus
      @submit.prevent="onSubmit"
      @reset="onReset"
      class="q-pa-sm"
    >
      <q-card-section :class="{'q-gutter-sm':true,'q-pa-none':$q.screen.lt.sm}">
        <q-input
          filled
          v-model="fields.title"
          :label="$t('schedule.field.label.title')"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('rule.fieldIsRequired')]"
        />
        <q-checkbox
          v-model="fields.allDay"
          :label="$t('schedule.allDay')"
        />
        <q-input
          :label="$t('schedule.startTime')"
          v-model="fields.startTime"
          borderless
          readonly
        >
          <template v-slot:prepend>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fields.startTime"
                  :mask="formatString"
                  today-btn
                />
              </q-popup-proxy>
            </q-icon>
          </template>

          <template
            v-if="!fields.allDay"
            v-slot:append
          >
            <q-icon
              name="access_time"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="fields.startTime"
                  :mask="formatString"
                  :minute-options="minuteOptions"
                  format24h
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          :label="$t('schedule.endTime')"
          v-model="fields.endTime"
          borderless
          readonly
        >
          <template v-slot:prepend>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fields.endTime"
                  :mask="formatString"
                  today-btn
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template
            v-if="!fields.allDay"
            v-slot:append
          >
            <q-icon
              name="access_time"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="fields.endTime"
                  :mask="formatString"
                  :minute-options="minuteOptions"
                  format24h
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          filled
          v-model="fields.repeat.type"
          emit-value
          map-options
          :options="repeatOptions"
          :label="$t('schedule.Repeat')"
        >
          <template
            v-slot:after
            v-if="fields.repeat.type!==repeatType.DONT_REPEAT"
          >
            <q-input
              borderless
              v-model="fields.repeat.until"
              :label="$t('schedule.repeatUntil')"
              readonly
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="fields.repeat.until"
                      @input="() => $refs.qDateProxy.hide()"
                      mask='YYYY-MM-DD'
                      :options="repeatUntilDate"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </template>
        </q-select>

        <tw-select-person
          filled
          v-model="fields.withs"
          multiple
          :label="$t('schedule.withs')"
          emit-value
          by-group
          :rules="[$rules.required($t('rule.fieldIsRequired'))]"
        />
        <q-input
          v-if="!showEditor"
          class="q-mt-md"
          type="text"
          :placeholder="$t('schedule.addExtraDetailsOrAttachAFile')"
          outlined
          Readonly
          @click="showEditor=true"
        />
        <quasar-editor
          v-else
          :focus="!notes"
          @input="(val)=>{fields.notes=val}"
          :value="notes"
          :folder="category"
          :applied="goIntoAction"
          :placeholder="$t('schedule.addExtraDetailsOrAttachAFile')"
        ></quasar-editor>
        <tw-choose-notify
          :module="{category,id:+objectID}"
          :widget="{category:'event',id:+id}"
          :always="false"
          :subscribers.sync="subscribers"
        />
      </q-card-section>

      <q-card-actions
        align="left"
        class="q-px-md"
      >
        <q-btn
          :label="$q.lang.label.ok"
          type="submit"
          color="primary"
        />
        <q-btn
          outline
          :label="$q.lang.label.cancel"
          type="reset"
          color="primary"
        />
      </q-card-actions>
    </q-form>
    <event-confirm
      action="update"
      :confirm.sync="confirm"
      @justThis="justThis"
      :loadingJustThis="loadingJustThis"
      :loadingChangeAll="loadingChangeAll"
    />
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import timeCeil from '@/utils/time-ceil'
import Event from '@/store/schedule/model'
const { formatDate, endOfDate, addToDate, getDateDiff, adjustDate } = date
export default {
  name: 'EventForm',
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    EventConfirm: () => import('components/calendar/EventConfirm'),
    TwChooseNotify: () => import('components/base/TwChooseNotify')
  },
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    date: {
      type: String,
      required: false,
      default: () => {
        return formatDate(new Date(), 'YYYY-MM-DD')
      }
    },
    bordered: {
      type: Boolean,
      required: false,
      default: true
    },
    flat: {
      type: Boolean,
      required: false,
      default: function () {
        return this.$q.screen.lt.sm
      }
    },
    grow: {
      type: Boolean,
      required: false,
      default: true
    },
    xxlPadding: {
      type: Boolean,
      required: false,
      default: function () {
        return this.$q.screen.gt.sm
      }
    }
  },
  data () {
    return {
      remSTime: '',
      remETime: '',
      fields: new Event(),
      oldFields: new Event(),
      notes: '',
      subscribers: [],
      showEditor: false,
      confirm: false,
      minuteOptions: [0, 15, 30, 45],
      loadingJustThis: false,
      loadingChangeAll: false,
      goIntoAction: false
    }
  },
  computed: {
    ...mapState('schedule', ['repeatType', 'repeatOptions']),
    ...mapGetters('resource', ['item']),
    formatString () {
      return this.fields.allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
    }
  },
  watch: {
    formatString (val) {
      if (this.fields.allDay) {
        this.remSTime = formatDate(this.fields.startTime, 'HH:mm')
        this.remETime = formatDate(this.fields.endTime, 'HH:mm')
        this.fields.startTime = formatDate(this.fields.startTime, val)
        this.fields.endTime = formatDate(this.fields.endTime, val)
      } else {
        this.fields.startTime = formatDate(this.fields.startTime + ' ' + this.remSTime, val)
        this.fields.endTime = formatDate(this.fields.endTime + ' ' + this.remETime, val)
      }
    },
    'fields.startTime': {
      deep: true,
      handler: function (newV, oldV) {
        const startDate = new Date(newV.replace(/-/g, '/'))
        const endDate = new Date(this.fields.endTime)
        if (getDateDiff(startDate, endDate, 'minutes') > 0) {
          this.fields.endTime = formatDate(addToDate(startDate, { hours: 1 }), this.formatString)
        }
        if (this.fields.repeat.type !== this.repeatType.DONT_REPEAT) {
          const repeatUntil = new Date(this.fields.repeat.until.replace(/-/g, '/'))
          if (getDateDiff(startDate, repeatUntil, 'days') > 0) {
            this.fields.repeat.until = formatDate(endOfDate(startDate, 'year'), 'YYYY-MM-DD')
          }
        }
      }
    },
    'fields.endTime': {
      deep: true,
      handler: function (newV, oldV) {
        const startDate = new Date(this.fields.startTime.replace(/-/g, '/'))
        const endDate = new Date(newV.replace(/-/g, '/'))
        if (getDateDiff(startDate, endDate, 'minutes') > 0) {
          this.fields.startTime = formatDate(addToDate(endDate, { hours: -1 }), this.formatString)
        }
      }
    },
    'fields.repeat.type': {
      deep: true,
      handler: function (newV, oldV) {
        if (newV !== this.repeatType.DONT_REPEAT && this.fields.repeat.until === '') {
          this.fields.repeat.until = formatDate(endOfDate(new Date(this.fields.startTime.replace(/-/g, '/')), 'year'), 'YYYY-MM-DD')
        }
      }
    }
  },
  mounted () {
    if (+this.id === 0) {
      let curDate = new Date(this.date.replace(/-/g, '/'))
      let now = new Date()
      curDate = adjustDate(curDate, { hours: now.getHours(), minutes: now.getMinutes() })
      this.fields.startTime = formatDate(timeCeil({ date: curDate }), this.formatString)
      this.fields.endTime = formatDate(addToDate(timeCeil({ date: curDate }), { hours: 1 }), this.formatString)
    } else {
      this.loadEvent(+this.id).then(e => {
        // 如果当前选定的日期不在该事件的时间范围内，这选定事件的起始时间
        const { startTime, endTime } = e
        this.setSelectedDateBetween({ startTime, endTime })
        Object.assign(this.fields, _.cloneDeep(e))
        Object.assign(this.oldFields, _.cloneDeep(e))
        this.notes = this.fields.notes
        this.showEditor = !!this.notes
      })
    }
  },
  methods: {
    ...mapMutations('schedule', ['setSelectedDateBetween']),
    ...mapActions('schedule', ['loadEvent', 'addEvent', 'updateEvent']),
    repeatUntilDate (date) {
      const startDate = new Date(this.fields.startTime.replace(/-/g, '/'))
      const repeatUntil = new Date(date.replace(/-/g, '/'))
      getDateDiff(startDate, repeatUntil, 'days')
      return getDateDiff(repeatUntil, startDate, 'days') > 0
    },
    onSubmit () {
      this.goIntoAction = true
      const resItem = this.item(this.category, Number(this.objectID)) || {}
      this.fields.objectTitle = resItem.title || resItem.name
      this.fields.subscribers = this.subscribers

      // 订阅人员处理
      if (!this.fields.id) {
        Object.assign(this.fields,
          {
            resourceCategory: this.category,
            resourceId: +this.objectID
          })
        this.addEvent(this.fields)
          .then((res) => {
            res && this.$emit('ok', this.fields)
          })
      } else {
        const { id, type, until } = this.fields.repeat,
          newRepeat = { id, type, until },
          oldRepeat = {
            id: this.oldFields.repeat.id,
            type: this.oldFields.repeat.type,
            until: this.oldFields.repeat.until
          }
        if (this.fields.repeat.type !== this.repeatType.DONT_REPEAT &&
          _.isEqual(newRepeat, oldRepeat)
        ) {
          this.confirm = true
        } else {
          this.update()
        }
      }
    },
    onReset () {
      this.$nextTick(() => {
        if (this.fields.id) {
          this.$router.push({
            name: 'eventDetail',
            params: { category: this.category, objectID: this.objectID, id: this.id }
          })
        }
        this.$emit('cancel')
      })
    },
    justThis (justThis) {
      this.loadingJustThis = justThis
      this.loadingChangeAll = !justThis
      this.update(justThis)
    },
    update (justThis = false) {
      this.updateEvent({ justThis: justThis, model: this.fields })
        .then((res) => {
          this.loadingJustThis = false
          this.loadingChangeAll = false
          if (res) {
            this.confirm = false
            this.$router.push({
              name: 'eventDetail',
              params: { category: this.category, objectID: this.objectID, id: this.id }
            })
            this.$emit('ok', this.fields)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  margin: unset;
}
</style>
