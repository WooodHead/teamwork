<template>
  <div class="btn-font-size">
    <div
      v-if="!task"
      class="row justify-center q-my-md "
    >
      <q-btn
        class="q-px-md q-py-xs"
        unelevated
        rounded
        color="positive"
        :label="$t('workRecord.beginWork')"
        @click.stop="showTypeCard = true"
      />
    </div>
    <div
      v-if="task&&!task.finished"
      class="q-my-sm q-gutter-y-sm"
    >
      <div class="row items-center">
        <span class="text-subtitle1 col-8 ellipsis text-start">{{task.businessType}}</span>
        <span class="col text-right">{{task.beginTime|formatDate}}{{$t('action.recruitPlanStart')}}</span>
      </div>
      <div class="column items-center">
        <span class="text-h6">{{showTimeDiffValue}}</span>
        <q-btn
          class="q-px-md q-py-xs q-my-sm"
          outline
          rounded
          color="primary"
          :label="$t('workRecord.finishWork')"
          @click.stop="toWorkRecordEdit()"
        />
      </div>
    </div>
    <!-- 类型选择弹窗 -->
    <q-dialog
      v-model="showTypeCard"
      transition-show="slide-up"
      transition-hide="slide-down"
      position="bottom"
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
              @click.stop="closeTypeCard"
            />
          </div>
        </q-card-section>
        <work-type-card
          @click="debounceSubmit"
          :showEditBtn="editTypeCard"
        />
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { date, debounce } from 'quasar'
import Task from '@/store/task/model'
const { formatDate, getDateDiff } = date
export default {
  name: 'WorkRecordMobileAdd',
  props: {
    task: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      showTypeCard: false,
      editTypeCard: false,
      timer: '',
      beforeTimeDiffValue: 0,
      showTimeDiffValue: ''
    }
  },
  filters: {
    formatDate (value) {
      return formatDate(value.replace(/-/g, '/'), 'MM-DD HH:mm')
    }
  },
  components: {
    WorkTypeCard: () => import('components/work-record/WorkTypeCard')
  },
  methods: {
    ...mapActions('task', ['addTask', 'updateTask']),
    debounceSubmit: debounce(function (val) {
      this.onSubmit(val)
    }, 3000, true),
    onSubmit (value) {
      this.showTypeCard = false
      if (this.task) {
        if (value) this.task.businessType = `${value.dictKey} — ${value.dictValue}`
        this.updateTask(this.task)
      } else {
        let newTask = new Task()
        Object.assign(newTask,
          {
            objectId: +this.$myinfo.id,
            objectType: 'person',
            type: 'item',
            beginTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            assignedByID: +this.$myinfo.id,
            assignedTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            assignedTo: [+this.$myinfo.id],
            businessType: value ? `${value.dictKey} — ${value.dictValue}` : ''
          })
        this.addTask(newTask)
      }
    },
    toWorkRecordEdit () {
      this.$router.push({
        name: 'workRecordEdit',
        params: { id: +this.task.id }
      })
    },
    closeTypeCard () {
      this.showTypeCard = false
      this.editTypeCard = false
    },
    timeDiff () {
      const that = this// 声明一个变量指向vue实例this,保证作用域一致
      that.timer = setInterval(() => {
        if (!that.beforeTimeDiffValue) {
          that.beforeTimeDiffValue = getDateDiff(new Date(), new Date(that.task.beginTime.replace(/-/g, '/')), 'seconds')
        } else {
          that.beforeTimeDiffValue++
        }
        if (that.beforeTimeDiffValue > 0) {
          let hr = parseInt(that.beforeTimeDiffValue / 60 / 60)
          let min = parseInt(that.beforeTimeDiffValue / 60 % 60)
          let sec = parseInt(that.beforeTimeDiffValue % 60)

          hr = hr > 9 ? hr : '0' + hr
          min = min > 9 ? min : '0' + min
          sec = sec > 9 ? sec : '0' + sec
          that.showTimeDiffValue = `${hr}:${min}:${sec}`
        }
      }, 1000)
    },
    startTimer () {
      if (this.$q.screen.lt.sm) {
        if (this.task && !this.task.finished) {
          !this.timer && this.timeDiff()
        } else {
          clearInterval(this.timer)
          this.beforeTimeDiffValue = 0
          this.showTimeDiffValue = ''
        }
      }
    }
  },
  mounted () {
    this.startTimer()
  },
  watch: {
    'task.id': {
      deep: true,
      handler: function (newV, oldV) {
        this.startTimer()
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
    this.beforeTimeDiffValue = 0
  }
}
</script>
<style  lang="scss" scoped>
.btn-font-size /deep/.block {
  font-size: 16px;
}
</style>
