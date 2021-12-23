<template>
  <!-- 任务 -->
  <q-item
    class="q-pa-none q-mb-sm"
    style="min-height: auto;"
  >
    <q-item-section>
      <!-- 任务项 -->
      <div class="full-width">
        <div class="row no-wrap items-start">
          <!-- 是否完成 -->
          <span
            class="check q-mr-sm"
            :class="task.finished ? 'text-green' : ''"
          >
            {{task.finished ? '✓' : '▢'}}
          </span>
          <span>
            {{task.name}}

            <span
              class="text-brown q-ml-xs"
              v-if="dueDate &&dueDate!='1000-01-01'"
              style="white-space: nowrap;"
            >
              {{dueDate}}
            </span>

            <span
              class="q-mx-xs"
              v-if="task.assignedTo.length"
            >-</span>
            <span
              class="text-brown"
              v-for="id in task.assignedTo"
              :key="id"
              style="font-size:14px;"
            >
              {{assignPersonName(id)}}
            </span>
          </span>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>
<script>
import { mapState } from 'vuex'
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'TaskItemOnlyShow',
  props: {
    task: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
    // comment: {
    //   type: Array,
    //   required: false,
    //   default () {
    //     return []
    //   }
    // }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('task', ['publicPersons']),
    // 任务日期
    dueDate () {
      if (this.task.dateType === 'none') {
        return ''
      } else if (this.task.dateType === 'day') {
        return timeRangeFormat({ endTime: this.task.endTime, allDay: true, charMonth: false, isShowDiffDay: false })
      } else {
        return timeRangeFormat({ startTime: this.task.startTime, endTime: this.task.endTime, allDay: true, charMonth: false, isShowDiffDay: false })
      }
    }
  },
  methods: {
    assignPersonName (id) {
      if (this.selectPersons[id]) {
        return this.selectPersons[id] && this.selectPersons[id].name
      } else {
        return this.publicPersons.find(i => i.id === id).name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ p {
    margin: 0;
  }
  .check {
    font-size: 20px;
    color: $grey-7;
  }
  /deep/ img {
    width: 100%;
  }
</style>
