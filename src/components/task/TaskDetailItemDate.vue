<template>
  <div
    class="cursor-pointer flex items-center col"
    :title="$t('task.detail.redueDate')"
  >
    <!-- 日期显示-范围 -->
    <div
      class="flex items-center"
      v-if="dateType === 'range'"
    >
      <q-icon
        name="event"
        color="cyan-6"
        size="sm"
        class="cursor-pointer q-mr-xs"
      />
      <div>
        {{timeRangeFormat({ startTime: startTime, endTime: endTime, allDay:true,charMonth: false })}}
      </div>
    </div>
    <!-- 日期显示-天 -->
    <div
      class="flex items-center"
      v-if="dateType === 'day'"
    >
      <q-icon
        name="event"
        color="cyan-6"
        size="sm"
        class="cursor-pointer q-mr-xs"
      />
      <div>{{timeRangeFormat({ endTime: endTime, allDay:true,charMonth: false })}}</div>
    </div>
    <div
      v-if="dateType === 'none'"
      class="flex items-center text-grey"
    >{{$t('task.detail.selectDate')}}
    </div>
  </div>
</template>

<script>
import timeRangeFormat from '@/utils/time-range-format'
export default {
  name: 'TaskDetailItemDate',
  props: {
    dateType: {
      type: String,
      required: false,
      default: 'none'
    },
    startTime: {
      type: String,
      required: false,
      default: ''
    },
    endTime: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    timeRangeFormat
  }
}
</script>
