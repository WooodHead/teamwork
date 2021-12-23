<template>
  <q-item
    class="q-pa-none"
    dense
    clickable
    @click="toPageTaskDetail(task.id)"
  >
    <!-- 任务清单 -->
    <q-item-section v-if="task.type==='list'">
      <!-- 任务名称 -->
      <q-item-label
        style="font-size:14px;"
        class="text-bold"
      >
        {{task.name}}{{task.startTime?` (${task.startTime} ~ ${task.endTime})`:''}}
      </q-item-label>
    </q-item-section>
    <!-- 任务组 -->
    <q-item-section v-else-if="task.type==='group'">
      <div class="row items-center">
        <span
          :class="task.color"
          class="text-bold text-body-g"
        >
          {{task.name}}
        </span>
        <q-separator class="fade-line" />
      </div>
    </q-item-section>
    <!-- 任务项 -->
    <template v-else>
      <q-item-section
        side
        top
        class="q-pa-none q-pr-xs"
        style="padding-top: 2px;"
      >
        <q-checkbox
          :value="task.finished"
          dense
          color="green-6"
        />
      </q-item-section>
      <q-item-section>
        <div class="row">
          {{task.name}}
          <!-- 日程 -->
          <span
            :title="$t('task.detail.redueDate')"
            class="text-brown q-mr-xs"
            v-if="dueDate"
          >
            <q-icon
              name="event"
              size="xs"
              color="cyan-6"
            />
            {{dueDate}}
          </span>
          <!-- 指派人员 -->
          <span
            :title="$t('task.detail.reassign')"
            class="text-brown"
            v-for="id in task.assignedTo"
            :key="id"
          >
            <tw-avatar
              size="xs"
              :id="id"
            />
            {{selectPersons[id]&&selectPersons[id].name}}
          </span>
        </div>
      </q-item-section>
    </template>

  </q-item>
</template>

<script>
import { mapState } from 'vuex'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'WidgetTaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    // 任务日期
    dueDate () {
      if (this.task.dateType === 'none') {
        return ''
      } else if (this.task.dateType === 'day') {
        return timeRangeFormat({ endTime: this.task.endTime, allDay: true, charMonth: false })
      } else {
        return timeRangeFormat({ startTime: this.task.startTime, endTime: this.task.endTime, allDay: true, charMonth: false })
      }
    }
  },
  methods: {
    toPageTaskDetail (id) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          category: this.task.objectType,
          objectID: +this.task.objectId,
          id: +id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
}
.q-item {
  min-height: auto;
}
.checkbox {
  display: inline-block;
  border: 1px solid rgba(161, 160, 160, 0.25);
  border-radius: 4px;
  vertical-align: middle;
  width: 16px;
  height: 16px;
}
.break-word {
  word-break: break-all;
}
</style>
