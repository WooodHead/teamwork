<template>
  <tw-form @primary="onSubmit">
    <q-card-section
      v-if="$route.name==='questionEdit'"
      class="text-center"
    >
      <div v-if="question.isStop">
        <q-icon name="pause_circle_outline" />
        <span>
          {{question.cronName}}
        </span>
        <span
          class="text-primary  cursor-pointer"
          @click="Start(id)"
        >
          {{ $t('checkins.ask.start')}}
        </span>
      </div>
      <div v-else>
        <q-icon name="loop" />
        <span>
          {{question.cronName}}
        </span>
        <span
          class="text-primary cursor-pointer"
          @click="Stop(id)"
        >
          {{ $t('checkins.ask.stop')}}
        </span>
      </div>
    </q-card-section>
    <div>
      <div class="text-body1 text-weight-bolder">{{$t('checkins.ask.what')}}</div>
      <div class="q-mt-md">
        <q-input
          outlined
          v-model="model.content"
          :placeholder="this.$t('checkins.ask.hint')"
          :rules="[val => !!val&&val.trim().length>0 || $t('rule.fieldIsRequired')]"
        />
      </div>
    </div>
    <div>
      <div class="text-body1 text-weight-bolder">{{$t('checkins.ask.frequency')}}</div>
      <q-item-label class="q-mt-md">
        <q-list
          bordered
          separator
        >
          <q-item class="column">
            <q-item-label>
              <q-radio
                v-model="model.cron.type"
                val="day"
                :label="$t('checkins.ask.day')"
              />
            </q-item-label>
          </q-item>
          <q-item class="column">
            <q-item-label>
              <q-radio
                v-model="model.cron.type"
                val="week"
                :label="$t('checkins.ask.week')"
              />
            </q-item-label>
            <q-item-label
              v-if="model.cron.type==='week'"
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
                v-model="model.cron.type"
                val="month"
                :label="$t('checkins.ask.month')"
              />
              <div v-if="model.cron.type ==='month'">
                <q-option-group
                  v-model="model.cron.monthtype"
                  :options="scheduleOptions"
                  color="primary"
                  inline
                />
              </div>
            </q-item-label>
            <q-item-label
              v-if="model.cron.type ==='month'"
              class="q-pl-lg"
            >
              <tw-select-week-day
                v-if="model.cron.monthtype==='firstweek' ||model.cron.monthtype==='lastweek'"
                :cronDays="model.cron.days"
                @select="GetSelectDays"
              />
              <div
                v-if="model.cron.monthtype==='day'"
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
    </div>
    <div>
      <div class="text-body1 text-weight-bolder">{{$t('checkins.ask.when')}}</div>
      <div class="q-mt-md">
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-label>
              <q-radio
                v-model="model.cron.time"
                val="9:30"
                :label="$t('checkins.ask.beginTime')"
              />
            </q-item-label>

          </q-item>
          <q-item>
            <q-item-label>
              <q-radio
                v-model="model.cron.time"
                val="16:30"
                :label="$t('checkins.ask.endTime')"
              />
            </q-item-label>
          </q-item>
          <q-item class="column">
            <q-item-label>
              <q-radio
                v-model="model.cron.time"
                val="pick"
                :label="$t('checkins.ask.pickTime')"
              />
              <q-input
                v-if="model.cron.time==='pick'"
                outlined
                v-model="time"
                :rules="['time']"
                style="width:30%"
                readonly
                @click="showtime=true"
              >
                <template v-slot:append>
                  <q-icon
                    name="access_time"
                    class="cursor-pointer"
                    @click="showtime=true"
                  >
                  </q-icon>
                </template>
              </q-input>
            </q-item-label>
          </q-item>
        </q-list>
      </div>
    </div>
    <div>
      <div class="q-mb-md text-body1 text-weight-bolder">{{$t('checkins.ask.who')}}</div>
      <person-select-panel
        :isVirtualScroll="true"
        :isSearchSort="false"
        @multiSelect="getPersons"
        @multiSelectAll="getPersons"
        :multiple="true"
        :isShowButton="false"
        :isSelectByGroup='false'
        :initSelectedPersonIDs="model.assignedTo"
        :objectType="category"
        :objectID="objectID"
        memberDutys="leader,member"
      ></person-select-panel>
    </div>
    <q-dialog v-model="showtime">
      <q-time
        v-model="time"
        format24h
        :minute-options="minuteOptions"
      />
    </q-dialog>
  </tw-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Checkin from '@/store/checkins/model'
import timeCeil from '@/utils/time-ceil'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date
function leftClick (e) {
  return e.button === 0
}
export default {
  name: 'QuestionForm',
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
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      model: new Checkin.Question(),
      showtime: false,
      time: '',
      selectedDate: '2020-03-01',
      minuteOptions: [0, 30],
      selectedDates: [],
      selectedPersonIds: [],
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
    question () {
      if (this.$route.name === 'questionEdit') {
        return this.$store.getters['checkins/question'](+this.id)
      } else {
        return this.model
      }
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    // 引入人员头像组件
    'person-select-panel': () => import('components/person/PersonSelectPanel'),
    // 引入星期选择组件
    'tw-select-week-day': () => import('components/checkins/TwSelectWeekDay')
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion', 'addQuestion', 'updateQuestion', 'stopQuestion', 'startQuestion']),
    // 点击获取选中人
    getPersons (selectedPersons) {
      this.selectedPersonIds = []
      selectedPersons.forEach(item => {
        this.selectedPersonIds.push(item.id)
      })
    },
    // 获取选中的星期或者日期
    GetSelectDays (selectDays) {
      this.model.cron.days = selectDays.join(',')
    },
    onSubmit () {
      this.model.assignedTo = Array.from(new Set(this.selectedPersonIds))
      // 编辑时初始化选中的日期
      if (this.model.cron.type === 'month' && this.model.cron.monthtype === 'day') {
        this.model.cron.days = this.selectedDates.map(item => {
          return formatDate(item, 'DD')
        }).join(',')
      }
      // 如果选择具体时间
      if (this.model.cron.time === 'pick') {
        this.model.cron.time = this.time
      }
      if (this.$route.name === 'questionEdit') {
        this.updateQuestion({ ...this.model })
      } else {
        this.model.createByID = this.myinfo.id
        this.model.objectId = +this.objectID
        this.model.objectType = this.category
        this.model.objectTitle = this.resource.title
        this.addQuestion({ ...this.model })
      }
      // 路由跳转
      this.$router.push({ // 核心语句
        name: 'checkins',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    },
    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
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
    },
    // 停止提问
    Stop (id) {
      this.stopQuestion(+id)
        .then(res => {
          this.model.isStop = true
        })
    },
    // 开始提问
    Start (id) {
      this.startQuestion(+id)
        .then(res => {
          this.model.isStop = false
        })
    }
  },
  mounted () {
    this.model = new Checkin.Question()
    this.time = formatDate(timeCeil({ date: new Date() }), 'HH:mm')
    let that = this
    if (this.$route.name === 'questionEdit') {
      this.loadQuestion(+this.id).then(question => {
        that.model = _.cloneDeep(question)
        // 给 selectedPersonIds 赋初始值
        this.selectedPersonIds = question.assignedTo
        if (this.model.cron.type === 'month' && this.model.cron.monthtype === 'day') {
          that.selectedDates = that.model.cron.days.split(',').map(item => {
            return '2020-03-' + item
          })
        }
        if (that.model.cron.time !== '9:30' && that.model.cron.time !== '16:30') {
          that.time = that.model.cron.time
          that.model.cron.time = 'pick'
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
