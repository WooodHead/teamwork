<template>
  <div>
    <div class="row">
      <q-item
        clickable
        class="row items-center"
        :class="showDelete?'show-delete-style col-9 q-pr-none':'col-12'"
        v-touch-pan.horizontal.prevent="handlePan"
        @click.stop="click()"
      >
        <q-item-section
          top
          avatar
          class="work-type-font"
        >
          <template>
            <slot name="avatarIcon">
              <q-btn
                :label="workTypeIcon"
                color="grey-9"
                round
                outline
              />
            </slot>
          </template>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            <template>
              <slot name="typeIcon"></slot>
            </template>
            {{task&&task.name}}
          </q-item-label>
          <q-item-label
            v-if="task&&task.beginTime"
            lines="1"
            caption
            class="row items-center text-grey-7 q-gutter-x-sm"
          >
            <span>{{task.beginTime|formatDate}} ~ {{task.finishedTime|formatDate}}</span>
            <span class="text-teal row items-center">
              <q-icon name="timer" />
              <span>{{task.workHour}}</span>
            </span>
            <span
              v-if="task.onRoadHour"
              class="text-info row items-center"
            >
              <q-icon name="local_taxi" />
              <span>{{task.onRoadHour}}</span>
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section
          side
          v-if="task&&task.finished&&!showDelete"
        >
          <q-item-label class="row items-center">
            <q-icon
              color="grey-7"
              size="sm"
              name="keyboard_arrow_right"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
      <div
        v-if="showDelete"
        class="col-3 bg-red text-white row items-center justify-center"
      >
        <span
          v-if="!confirmDelete"
          @click="confirmDelete=!confirmDelete"
        > {{$t('label.delete')}}</span>
        <span
          v-else
          @click="onDelete"
        >{{$t('workRecord.deleteIt')}}</span>
      </div>
    </div>
    <q-separator />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'WorkRecordItem',
  props: {
    task: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      showDelete: false,
      confirmDelete: false
    }
  },
  computed: {
    workTypeIcon () {
      return this.task && this.task.businessType && this.task.businessType.split('—') ? this.task.businessType.split('—')[0].trim() : 'sort_by_alpha'
    }
  },
  filters: {
    formatDate (value) {
      return formatDate(value.replace(/-/g, '/'), 'HH:mm')
    }
  },
  methods: {
    ...mapActions('task', ['deleteTask']),
    onDelete () {
      this.deleteTask(+this.task.id)
    },
    click () {
      let tag = {
        'workRecordList': 'list',
        'workRecordCalendar': 'calendar',
        'personWorkRecordCalendar': 'person-calendar'
      }
      let type = tag[this.$route.name] || '',
        params = {
          name: 'workRecordDetail',
          params: { id: +this.task.id }
        }
      if (type) {
        params.params.type = type
      }
      this.$router.push(params)
    },
    handlePan ({ evt, ...info }) {
      if (info && info.touch) {
        if (info.direction === 'left') {
          // 左移
          if (info.offset.x < -15 && this.task && this.task.finished) {
            this.showDelete = true
            this.confirmDelete = false
          }
        } else {
          // 右移
          this.showDelete = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.show-delete-style {
  transform: translateX(-10%);
}
.work-type-font /deep/.block {
  font-size: 20px;
}
.work-type-font /deep/.material-icons {
  font-size: 26px;
}
</style>
