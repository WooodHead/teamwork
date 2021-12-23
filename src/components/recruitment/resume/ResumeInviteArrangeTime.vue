<!-- 邀约组件 面试时间段安排 -->
<template>
  <div
    class="q-gutter-y-sm"
    :class="showAddArea?'':'col'"
  >
    <!-- 已添加的 -->
    <div
      class="row"
      v-show="Object.keys(myArrange).length"
    >
      <div
        v-if="$q.platform.is.desktop"
        class="text-dark text-weight-bold text-subtitle1 q-field__before self-start"
      >
        {{title}}：
      </div>
      <q-field
        v-if="$q.platform.is.mobile"
        class="col-12 mobile-field"
        :label="title"
        stack-label
        filled
      >
        <div
          v-for="key in Object.keys(myArrange)"
          :key="key"
          class="row"
        >
          <q-chip
            color="grey-3"
            icon="event"
            text-color="grey-9"
          >
            {{key}}
          </q-chip>
          <div class="col">
            <q-chip
              v-for="obj in myArrange[key]"
              :key="obj.time"
              removable
              color="grey-3"
              icon="access_time"
              text-color="grey-9"
              @remove="removeModel(key, obj.time)"
            >
              {{obj.time}}
            </q-chip>
          </div>
        </div>
      </q-field>
      <div v-if="$q.platform.is.desktop">
        <div
          v-for="key in Object.keys(myArrange)"
          :key="key"
          class="row"
        >
          <q-chip
            color="grey-3"
            icon="event"
            text-color="grey-9"
            class="q-mt-none"
          >
            {{key}}
          </q-chip>
          <div class="col">
            <q-chip
              v-for="obj in myArrange[key]"
              :key="obj.time"
              removable
              color="grey-3"
              icon="access_time"
              text-color="grey-9"
              class="q-mt-none"
              @remove="removeModel(key, obj.time)"
            >
              {{obj.time}}
            </q-chip>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加安排 -->
    <div
      v-if="showAddArea"
      class="resume-arrange-time q-py-md"
    >
      <div class="row q-gutter-x-sm justify-around q-mb-md">
        <!-- 日期 -->
        <q-date
          flat
          minimal
          mask="YYYY-MM-DD"
          :options="optionsDate"
          v-model="selecteDate"
        />
        <!-- 时间段 -->
        <div
          class="row"
          style="max-width: 300px"
        >
          <q-btn
            v-for="time in timePoints"
            :key="time"
            flat
            @click="selectTime(time)"
            :color="selecteTimes.includes(time) ? 'primary' : ''"
            :class="selecteTimes.includes(time) ? 'text-primary' : 'text-black'"
            :disable="getDateDiff(new Date(selecteDate.replace(/-/g, '/') + ' ' + time + ':00'), new Date(), 'hours') < 3 "
          >
            {{time}}<br>{{getInviteCount(selecteDate + ' ' + time)}}
          </q-btn>
        </div>
      </div>
      <div class="row justify-center">
        <q-btn
          color="primary"
          :label="$t('action.confirm')"
          @click="addModel()"
        />
        <q-btn
          outline
          color="primary"
          class="q-ml-sm"
          :label="$t('action.cancel')"
          @click="addModelCancel()"
        />
      </div>
    </div>
    <!-- 添加按钮 -->
    <q-btn
      v-else
      outline
      rounded
      color="primary"
      :label="$t('action.add') + type + '面试时间'"
      @click="showAddArea=true"
    />
  </div>
</template>

<script>
import { date } from 'quasar'
const { getDateDiff, formatDate } = date
import { mapActions } from 'vuex'
export default {
  name: 'ResumeInviteArrangeTime',
  props: {
    type: {
      type: String,
      default: '线下'
    },
    arrange: {
      type: Object,
      default () {
        return {}
      }
    },
    invites: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showAddArea: false,
      selecteDate: '',
      selecteTimes: [],
      timeArrange: {},
      timePoints: [
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30'
      ]
    }
  },
  computed: {
    title () {
      return this.type + '面试时间'
    },
    myArrange () {
      let myObj = {}
      if (!_.isEmpty(this.arrange) && this.type) {
        let dates = Object.keys(this.arrange)
        dates.map(date => {
          this.arrange[date].map(obj => {
            if (obj.type === this.type) {
              if (!myObj[date]) {
                myObj[date] = []
              }
              myObj[date].push(obj)
            }
          })
        })
      }
      return myObj
    }
  },
  mounted () {
    this.initModel()
  },
  methods: {
    getDateDiff,
    ...mapActions('job', ['loadJobs']),
    initModel () {
      this.selecteDate = ''
      this.selecteTimes = []
      this.timeArrange = this.arrange
    },
    selectTime (num) {
      if (this.selecteTimes.includes(num)) {
        this.$delete(this.selecteTimes, this.selecteTimes.findIndex(item => item === num))
      } else {
        this.selecteTimes.push(num)
      }
    },
    removeModel (key, value) {
      this.$delete(this.timeArrange[key], this.timeArrange[key].findIndex(obj => obj.time === value))
      if (this.timeArrange[key].length === 0) {
        this.$delete(this.timeArrange, key)
      }
      this.$emit('timeArrange', this.timeArrange)
    },
    addModel () {
      if (_.isEmpty(this.selecteDate)) {
        this.$q.dialog({
          title: '请选择日期',
          cancel: true,
          persistent: true
        })
      } else if (this.selecteTimes.length === 0) {
        this.$q.dialog({
          title: '请选择时间段',
          cancel: true,
          persistent: true
        })
      } else {
        if (!this.timeArrange[this.selecteDate]) {
          this.$set(this.timeArrange, this.selecteDate, [])
        }
        this.selecteTimes.map(time => {
          let key = this.selecteDate
          let index = _.findIndex(this.timeArrange[key], obj => obj.time === time)
          index < 0 && this.timeArrange[key].push({
            time: time,
            type: this.type
          })
        })
        this.$emit('timeArrange', this.timeArrange)
        this.showAddArea = false
        this.initModel()
      }
    },
    addModelCancel () {
      this.showAddArea = false
      this.initModel()
    },
    optionsDate (date) {
      return date >= formatDate(new Date(), 'YYYY/MM/DD')
    },
    getInviteCount (date) {
      if (this.invites.length) {
        let count = 0
        this.invites.map(invite => {
          if (Object.keys(invite.detail).includes(date)) {
            count += invite.countPerHour
          }
        })
        return count > 0 ? count + '人' : ''
      } else {
        return ''
      }
    }
  }
}

</script>

<style lang='scss' scoped>
.resume-arrange-time {
  border: 1px solid lightgrey;
  border-radius: 5px;
}
.mobile-field /deep/.q-field__control-container {
  flex-direction: column;
}
/deep/.q-date__calendar {
  padding-bottom: 0;
  padding-right: 0;
  padding-left: 0;
}
</style>
