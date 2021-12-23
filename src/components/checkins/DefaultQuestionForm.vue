<template>
  <q-card
    :flat="!editingQuestionEvent ? false : true"
    class="card-grow-in-page"
    clickable
  >
    <tw-form @primary="onSubmit">
      <q-card-section>
        <div class="text-body1 text-weight-bolder">
          {{ $t("checkins.ask.what") }}
        </div>
        <div class="q-mt-md">
          <q-input
            outlined
            v-model="model.content"
            :placeholder="this.$t('checkins.ask.hint')"
            :rules="[
              val =>
                (!!val && val.trim().length > 0) || $t('rule.fieldIsRequired')
            ]"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-body1 text-weight-bolder">
          {{ $t("checkins.ask.frequency") }}
        </div>
        <q-item-label class="q-mt-md">
          <q-list
            bordered
            separator
          >
            <q-item class="column">
              <q-item-label>
                <q-radio
                  v-model="cronType"
                  val="day"
                  :label="$t('checkins.ask.day')"
                />
              </q-item-label>
            </q-item>
            <q-item class="column">
              <q-item-label>
                <q-radio
                  v-model="cronType"
                  val="week"
                  :label="$t('checkins.ask.week')"
                />
              </q-item-label>
              <q-item-label
                v-if="cronType === 'week'"
                class="q-pl-lg"
              >
                <tw-select-week-day
                  :cronDays="model.cron.days"
                  @select="GetSelectDays"
                />
              </q-item-label>
            </q-item>
            <q-item class="column">
              <q-item-label class="row">
                <q-radio
                  v-model="cronType"
                  val="month"
                  :label="$t('checkins.ask.month')"
                />
                <div v-if="model.cron && cronType === 'month'">
                  <q-option-group
                    v-model="model.cron.monthtype"
                    :options="scheduleOptions"
                    color="primary"
                    inline
                  />
                </div>
              </q-item-label>
              <q-item-label
                v-if="cronType === 'month'"
                class="q-pl-lg"
              >
                <tw-select-week-day
                  v-if="
                    model.cron.monthtype === 'firstweek' ||
                      model.cron.monthtype === 'lastweek'
                  "
                  :cronDays="model.cron.days"
                  @select="GetSelectDays"
                />
                <div
                  v-if="model.cron.monthtype === 'day'"
                  class="row"
                  style="max-width: 800px; width: 100%; overflow: hidden;"
                >
                  <q-calendar
                    ref="calendar"
                    v-model="selectedDate"
                    view="month"
                    locale="en-us"
                    mini-mode
                    :hide-header="true"
                    animated
                    transition-prev="flip-left"
                    transition-next="flip-right"
                    :selected-dates="selectedDates"
                    @click:day2="onToggleDate"
                    @click:date2="onToggleDate"
                    style="max-width: 300px; min-width: auto; overflow: hidden"
                  />
                </div>
              </q-item-label>
            </q-item>
          </q-list>
        </q-item-label>
      </q-card-section>
      <q-card-section>
        <div class="text-body1 text-weight-bolder">
          {{ $t("checkins.ask.when") }}
        </div>
        <div class="q-mt-md">
          <q-list
            bordered
            separator
          >
            <q-item>
              <q-item-label>
                <q-radio
                  v-model="cronTime"
                  val="9:30"
                  :label="$t('checkins.ask.beginTime')"
                />
              </q-item-label>
            </q-item>
            <q-item>
              <q-item-label>
                <q-radio
                  v-model="cronTime"
                  val="16:30"
                  :label="$t('checkins.ask.endTime')"
                />
              </q-item-label>
            </q-item>
            <q-item class="column">
              <q-item-label>
                <q-radio
                  v-model="cronTime"
                  val="pick"
                  :label="$t('checkins.ask.pickTime')"
                />
                <q-input
                  v-if="model.cron && model.cron.time === 'pick'"
                  outlined
                  v-model="time"
                  :rules="['time']"
                  style="width:30%"
                  readonly
                  @click="showtime = true"
                >
                  <template v-slot:append>
                    <q-icon
                      name="access_time"
                      class="cursor-pointer"
                      @click="showtime = true"
                    >
                    </q-icon>
                  </template>
                </q-input>
              </q-item-label>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-dialog v-model="showtime">
        <q-time
          v-model="time"
          format24h
          :minute-options="minuteOptions"
        />
      </q-dialog>
    </tw-form>
  </q-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { LocalStorage, date } from 'quasar'
import { convertToCron } from '@/store/checkins/model'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import timeCeil from '@/utils/time-ceil'
const { formatDate } = date
function leftClick (e) {
  return e.button === 0
}
export default {
  props: {
    question: {
      type: Object,
      required: false,
      default: null
    },
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    questionID: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      defaultQuestion: {},
      model: {},
      showtime: false,
      time: '',
      oldTime: '',
      selectedDate: '2020-03-01',
      minuteOptions: [0, 30],
      selectedDates: [],
      scheduleOptions: [
        { label: this.$t('checkins.ask.cron.firstweek'), value: 'firstweek' },
        { label: this.$t('checkins.ask.cron.lastweek'), value: 'lastweek' },
        { label: this.$t('checkins.ask.cron.lastday'), value: 'lastday' },
        { label: this.$t('checkins.ask.cron.day'), value: 'day' }
      ],
      myinfo: LocalStorage.getItem('myself') || {}
    }
  },
  computed: {
    ...mapState('breadcrumbs', ['resource']),
    cronTime: {
      get () {
        return this.model && this.model.cron && this.model.cron.time
      },
      set (value) {
        this.model.cron.time = value
      }
    },
    cronType: {
      get () {
        return this.model && this.model.cron && this.model.cron.type
      },
      set (value) {
        this.model.cron.type = value
      }
    },
    editingQuestionEvent: {
      get () {
        return this.$store.state.settings.settings.editingQuestionEvent
      },
      set (value) {
        this.setEditQuestionEvent(value)
      }
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    // 引入星期选择组件
    'tw-select-week-day': () => import('components/checkins/TwSelectWeekDay')
  },
  methods: {
    ...mapActions('settings', ['loadSettings', 'updateSetting']),
    ...mapMutations('settings', [
      'setAddQuestionEvent',
      'setEditQuestionEvent'
    ]),
    // 获取选中的星期或者日期
    GetSelectDays (selectDays) {
      this.model.cron.days = selectDays.join(',')
    },
    /**
     * UUID工具
     */
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = ''
      var uuid = s.join('')
      return uuid.toUpperCase()
    },
    onSubmit () {
      let _this = this
      let category = this.$store.state.settings.settings.currQuestionCategory
      let currQuestion = this.$store.state.settings.settings.currQuestion
      let setting = {
        id: _this.defaultQuestion.id,
        type: 'defaultQuestion',
        settings: {}
      }
      // 编辑时初始化选中的日期
      if (this.editingQuestionEvent) {
        if (
          this.model.cron &&
          this.cronType === 'month' &&
          this.model.cron.monthtype === 'day'
        ) {
          this.model.cron.days = this.selectedDates
            .map(item => {
              return formatDate(item, 'DD')
            })
            .join(',')
        }
        // 如果选择具体时间
        if (this.cronTime === 'pick') {
          this.model.cron.time = this.time
        }
        let questions = _this.defaultQuestion[category]
        let index = _.findIndex(questions, function (question) {
          return question.ID === currQuestion.ID
        })
        _this.defaultQuestion[category][index] = {
          ID: currQuestion.ID,
          Content: this.model.content,
          CronSchedule: convertToCron(this.model.cron)
        }
        console.log(category)
      } else {
        // 新建
        let isRepeat =
          _.filter(
            _this.defaultQuestion[category],
            activity => activity.Content === this.model.content
          ).length > 0
        if (isRepeat) {
          showWarningMessage(i18n.t(`settings.defaultQuestion.titleRepeat`))
          return
        }
        let addModle = {
          ID: _this.uuid(),
          Content: this.model.content,
          CronSchedule: convertToCron(this.model.cron)
        }
        _this.defaultQuestion[category].push(addModle)
      }
      setting.settings = {
        organize: _this.defaultQuestion.organize,
        team: _this.defaultQuestion.team,
        productDev: _this.defaultQuestion.productDev,
        project: _this.defaultQuestion.project,
        customer: _this.defaultQuestion.customer,
        wiki: _this.defaultQuestion.wiki
      }
      this.updateSetting(setting).then(res => {
        _this.setAddQuestionEvent(false)
        _this.setEditQuestionEvent(false)
      })
    },
    classDay (timestamp) {
      if (
        this.anchorDayIdentifier !== false &&
        this.otherDayIdentifier !== false
      ) {
        return this.getBetween(timestamp)
      }
    },
    onToggleDate ({ scope }) {
      const timestamp = scope.timestamp
      if (leftClick(event)) {
        if (this.selectedDates.join(',').includes(timestamp.date)) {
          // remove the date
          for (let i = 0; i < this.selectedDates.length; ++i) {
            if (timestamp.date === this.selectedDates[i]) {
              this.selectedDates.splice(i, 1)
              break
            }
          }
        } else {
          // add the date
          this.selectedDates.push(timestamp.date)
        }
      }
    }
  },
  mounted () {
    let that = this
    this.time = formatDate(timeCeil({ date: new Date() }), 'HH:mm')
    // 编辑
    if (this.editingQuestionEvent) {
      this.model = this.$store.state.settings.settings.currQuestion

      this.oldTime = this.model.cron.time
      if (
        this.model.cron &&
        this.cronType === 'month' &&
        this.model.cron.monthtype === 'day'
      ) {
        that.selectedDates = that.model.cron.days.split(',').map(item => {
          return '2020-03-' + item
        })
      }
      if (that.cronTime !== '9:30' && that.cronTime !== '16:30') {
        that.time = that.cronTime
        that.model.cron.time = 'pick'
      }
    } else {
      that.model = {
        content: '',
        cron: {
          time: '9:30',
          days: 'mon',
          type: 'day',
          monthtype: ''
        }
      }
    }
  },
  created () {
    this.loadSettings().then(res => {
      this.defaultQuestion = _.cloneDeep(res.defaultQuestion)
    })
  }
}
</script>

<style scoped></style>
