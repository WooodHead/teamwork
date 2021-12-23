<template>
  <tw-form
    class="q-pt-sm"
    @primary="debounceSubmit"
  >
    <!-- 来源 -->
    <div class="row items-center q-py-sm bg-grey-3">
      <div class="row q-pl-xs col-11">
        <div
          v-for="item in workSource"
          class="col-6"
          :key="item.id"
        >
          <q-radio
            v-model="workSourceTag"
            :val="item.dictValue"
            :label="item.dictValue"
          />
        </div>
      </div>
      <q-space />
      <div
        v-if="$myinfo.auth.role.isSystemAdministrator"
        @click.stop="showSourceCard=true"
      >
        <q-btn
          flat
          round
          dense
          icon="edit"
          color="grey-7"
          size="sm"
        />
      </div>
    </div>
    <!-- 类型 -->
    <div @click="showTypeCard=true">
      <q-input
        v-model="workTypeValue"
        filled
      >
        <template v-slot:prepend>
          <q-btn
            v-if="workTypeIcon==='sort_by_alpha'"
            icon="sort_by_alpha"
            color="grey-9"
            size="sm"
            round
            outline
          />
          <q-btn
            v-else
            :label="workTypeIcon"
            color="grey-9"
            size="sm"
            round
            outline
          />
        </template>
      </q-input>
    </div>
    <!-- 具体工作内容 -->
    <q-input
      v-model="task.name"
      filled
      autofocus
      :label="$t('workRecord.content')"
      lazy-rules
      :rules="[val => !!val || $t('rule.fieldIsRequired'),val => val.length <= 255 || $t('rule.atlatestNCharacters', { number: 255 })]"
    >
      <template v-slot:prepend>
        <q-icon name="content_paste" />
      </template>
    </q-input>
    <!-- 工作地址 -->
    <location-select
      class="q-px-none"
      showSearch
      filled
      :mylocation.sync="task.address"
      :placeholder="$t('workRecord.address')"
    />
    <!-- 开始时间、结束时间编辑状态 -->
    <tw-date-range
      :startTime="task.beginTime"
      :endTime="task.finishedTime"
      :startTimeLabel="$t('workRecord.beginWorkTime')"
      :endTimeLabel="$t('workRecord.finishWorkTime')"
      @updateStartTime="beginTimeUpdate"
      @updateEndTime="finishTimeUpdate"
    />
    <!-- 工作用时、路途用时的编辑状态显示 -->
    <div class="row items-center">
      <q-input
        type="number"
        step="0.1"
        class="col"
        filled
        v-model="task.workHour"
        :label="$t('workRecord.workHour')"
      >
        <template v-slot:append>
          <span class="text-caption">{{$t('date.hour')}}</span>
        </template>
      </q-input>
      <q-input
        type="number"
        step="0.1"
        class="col q-pl-xs"
        filled
        v-model="task.onRoadHour"
        :label="$t('workRecord.onRoadHour')"
      >
        <template v-slot:append>
          <span class="text-caption">{{$t('date.hour')}}</span>
        </template>
      </q-input>
    </div>
    <!-- 工作结果说明 -->
    <quasar-editor
      class="q-pt-sm"
      :focus="false"
      @input="(val)=>{task.description=val}"
      :value="newDescription"
      folder="workRecord"
      :applied="goIntoAction"
      :placeholder="$t('workRecord.description')"
    ></quasar-editor>
    <!-- 类型选择弹窗 -->
    <q-dialog
      v-model="showTypeCard"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <q-card>
        <q-card-section class="row items-center justify-center relative-position q-pb-none">
          <span class="text-weight-bold text-subtitle1">{{$t('workRecord.workType')}}</span>
          <div
            class="absolute-right q-mr-md"
            style="top:auto"
          >
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              v-if="$myinfo.auth.role.isSystemAdministrator"
              @click.stop="editTypeCard=!editTypeCard"
            />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              @click.stop="closeTypeCard()"
            />
          </div>
        </q-card-section>
        <q-separator />
        <work-type-card
          @click="selectedType"
          :showEditBtn="editTypeCard"
        />
      </q-card>
    </q-dialog>
    <!-- 编辑来源 -->
    <q-dialog
      v-model="showSourceCard"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <options-edit
        :select-options="workSource"
        module="workRecord"
        field="source"
        :keys="['source']"
        @close="showSourceCard=false"
      />
    </q-dialog>
  </tw-form>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { date, debounce } from 'quasar'
import Task from '@/store/task/model'
const { formatDate, getDateDiff, addToDate } = date
import { showWarningMessage } from '@/utils/show-message'
import { showConfirm } from '@/utils/show-confirm'
import { calcHoursOfWork } from '@/utils/hours-of-work'
export default {
  name: 'WorkRecordForm',
  data () {
    return {
      task: new Task(),
      newSource: '',
      newDescription: '',
      showTypeCard: false, // 是否显示工作类型
      showSourceCard: false, // 是否显示工作来源
      initFinishTime: '',
      editTypeCard: false, // 编辑工作类型
      goIntoAction: false,
      formatString: 'YYYY-MM-DD HH:mm'
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    workSource () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['source'] : []
    },
    workSourceTag: {
      get () {
        return this.newSource || (this.workSource.length && this.workSource[0].dictValue)
      },
      set (val) {
        this.newSource = val
      }
    },
    workTypeIcon () {
      return this.task && this.task.businessType && this.task.businessType.split('—') ? this.task.businessType.split('—')[0].trim() : 'sort_by_alpha'
    },
    workTypeValue () {
      return (this.task && this.task.businessType && this.task.businessType.split('—') && this.task.businessType.split('—')[1]) || this.$t('workRecord.selectType')
    }
  },
  mounted () {
    this.loadDictionarys('workRecord')
    if (+this.id) {
      this.loadTask(+this.id).then(res => {
        this.task = _.cloneDeep(res)
        this.newSource = this.task.source
        this.newDescription = this.task.description
        this.task.beginTime = this.task.beginTime === '1000-01-01 00:00' ? formatDate(new Date(), this.formatString) : formatDate(this.task.beginTime.replace(/-/g, '/'), this.formatString)
        if (this.task.finishedTime === '1000-01-01 00:00') {
          this.task.finishedTime = formatDate(new Date(), this.formatString)
        } else {
          this.task.finishedTime = formatDate(this.task.finishedTime.replace(/-/g, '/'), this.formatString)
          this.initFinishTime = _.cloneDeep(this.task.finishedTime)
        }
      })
    } else {
      this.task.beginTime = formatDate(new Date(), this.formatString)
      this.task.finishedTime = formatDate(addToDate(this.task.beginTime.replace(/-/g, '/'), { hours: 1 }), this.formatString)
    }
  },
  methods: {
    ...mapActions('task', ['addTask', 'loadTask', 'updateTask', 'deleteTask', 'batchAddTasks']),
    ...mapActions('dictionary', ['loadDictionarys', 'deleteDictionary', 'editDictionary']),
    selectedType (value) {
      this.showTypeCard = false
      this.task.businessType = `${value.dictKey} — ${value.dictValue}`
    },
    debounceSubmit: debounce(function () {
      this.onSubmit()
    }, 3000, true),
    onSubmit () {
      this.goIntoAction = true
      let taskSource = this.newSource || (this.workSource.length && this.workSource[0].dictValue)
      if (!this.task.businessType) {
        showWarningMessage(this.$t('workRecord.typeIsNotNull'))
      } else if (!taskSource) {
        showWarningMessage(this.$t('workRecord.sourceIsNotNull'))
      } else {
        // 如果工作用时大于结束减去开始时间，则提示
        const begin = this.task.beginTime.replace(/T/g, ' ').replace(/-/g, '/')
        const finish = this.task.finishedTime.replace(/T/g, ' ').replace(/-/g, '/')
        const time = getDateDiff(new Date(finish), new Date(begin), 'minutes')
        if (time < 0) {
          showWarningMessage(this.$t('workRecord.startTimeGreater'))
        } else if (this.task.workHour * 60 > time) {
          showWarningMessage(this.$t('workRecord.workHourDiff'))
        } else {
          // 先判断是否跨天，不跨天，按照hours-of-work组件计算真正工作的时间差；
          // 如果跨天，系统会有个默认工作时间，将默认工作时间分到每天，比如形式是[6,8,8,8,7],
          // 用户如果不改，就这样提交，开始时间、结束时间默认8点半17点半；
          // 如果改了，原来总和是37，比如改成了50，那么均分到每个，[6*(50/37),8*(50/37),8*(50/37),8*(50/37),7*(50/37)]，开始时间00：00结束时间23:59
          if (date.isSameDate(begin, finish, 'day')) {
            Object.assign(this.task,
              {
                source: taskSource,
                finished: true,
                finishedBy: +this.$myinfo.id
              })
            if (this.task && this.task.id) {
              this.updateTask(this.task)
                .then(res => {
                  if (res) this.toWorkRecordHome()
                })
            } else {
              Object.assign(this.task,
                {
                  objectId: +this.$myinfo.id,
                  objectType: 'person',
                  type: 'item',
                  source: taskSource,
                  assignedByID: +this.$myinfo.id,
                  assignedTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                  assignedTo: [+this.$myinfo.id],
                  finished: true,
                  finishedBy: +this.$myinfo.id
                })
              this.addTask(this.task)
                .then(res => {
                  if (res) this.toWorkRecordHome()
                })
            }
          } else {
            const diffDay = date.getDateDiff(finish, begin, 'days')
            showConfirm(this.$t('workRecord.crossDayRemind', { day: diffDay }), () => {
              let diffDays = diffDay + 1
              const workTime = calcHoursOfWork(begin, finish)
              const rangeDay = _.range(1, diffDays + 1), taskLists = [], isEditTime = this.task.workHour !== workTime
              _.forEach(rangeDay, (r, index) => {
                let taskCopy = _.cloneDeep(this.task)
                Object.assign(taskCopy,
                  {
                    source: taskSource,
                    finished: true,
                    finishedBy: +this.$myinfo.id,
                    beginTime: r === 1 ? taskCopy.beginTime : (isEditTime ? this.beginOrFinishTime(r - 1, 0, 0) : this.beginOrFinishTime(r - 1, 8, 30)),
                    finishedTime: r === diffDays ? taskCopy.finishedTime : (isEditTime ? this.beginOrFinishTime(r - 1, 23, 59) : this.beginOrFinishTime(r - 1, 17, 30))
                  })
                taskCopy.workHour = Math.floor(calcHoursOfWork(taskCopy.beginTime.replace(/-/g, '/'), taskCopy.finishedTime.replace(/-/g, '/')) * (taskCopy.workHour / workTime) * 10) / 10
                taskCopy.assignedTime = taskCopy.beginTime
                taskCopy.onRoadHour = Math.floor(taskCopy.onRoadHour / diffDays * 10) / 10
                if (!taskCopy.id) {
                  Object.assign(taskCopy,
                    {
                      objectId: +this.$myinfo.id,
                      objectType: 'person',
                      type: 'item',
                      assignedByID: +this.$myinfo.id,
                      assignedTo: [+this.$myinfo.id]
                    })
                }
                taskLists.push(taskCopy)
              })
              this.batchAddTasks({ modelList: taskLists }).then(res => {
                this.toWorkRecordHome()
              })
            })
          }
        }
      }
    },
    beginOrFinishTime (day, hour, minite) {
      return formatDate(date.adjustDate(date.addToDate(this.task.beginTime.replace(/T/g, ' ').replace(/-/g, '/'), { days: day }), { hours: hour, minutes: minite }), 'YYYY-MM-DD HH:mm:ss')
    },
    toWorkRecordHome () {
      this.$router.push({
        name: 'workRecordHome'
      })
    },
    closeTypeCard () {
      this.showTypeCard = false
      this.editTypeCard = false
    },
    beginTimeUpdate (value) {
      this.task.beginTime = value
    },
    finishTimeUpdate (value) {
      this.task.finishedTime = value
    },
    timeDiff () {
      const begin = this.task.beginTime.replace(/T/g, ' ').replace(/-/g, '/')
      const finish = this.task.finishedTime.replace(/T/g, ' ').replace(/-/g, '/')
      const time = getDateDiff(new Date(finish), new Date(begin), 'minutes')
      if (time > 0) {
        this.task.workHour = calcHoursOfWork(begin, finish)
      } else {
        this.task.workHour = 0
      }
    }
  },
  watch: {
    'task.beginTime': {
      deep: true,
      handler: function (newV, oldV) {
        newV && oldV && this.timeDiff()
      }
    },
    'task.finishedTime': {
      deep: true,
      handler: function (newV, oldV) {
        if (this.initFinishTime) {
          newV && oldV && this.timeDiff()
        } else {
          this.timeDiff()
        }
      }
    }
  },
  components: {
    LocationSelect: () => import('components/location/LocationSelect'),
    WorkTypeCard: () => import('components/work-record/WorkTypeCard'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    OptionsEdit: () => import('components/base/select-edit/OptionsEdit'),
    TwDateRange: () => import('components/base/TwDateRange'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style lang="scss" scoped>
/deep/ div::-webkit-scrollbar {
  width: 0;
}
/deep/.q-field--with-bottom {
  padding-bottom: 0px;
}
/deep/.q-field__label {
  font-size: 14px;
}
/* 去掉input尾部上下小箭头*/
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
/deep/.q-field__append {
  padding-left: 0px;
  margin-left: -10px;
}
</style>
