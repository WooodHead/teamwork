<template>
  <div :class="['row items-center',{'mobile-time-style':$q.screen.lt.sm}]">
    <q-input
      class="col"
      filled
      v-model="formatStartTime"
      type="datetime-local"
      :label="startTimeLabel||$t('task.startTime')"
    />
    <q-input
      class="col q-pl-xs"
      filled
      v-model="formatEndTime"
      type="datetime-local"
      :label="endTimeLabel||$t('task.endTime')"
    />
  </div>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'TwDateRange',
  props: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    formatString: {
      type: String,
      required: false,
      default: 'YYYY-MM-DD HH:mm'
    },
    startTimeLabel: {
      type: String,
      required: false
    },
    endTimeLabel: {
      type: String,
      required: false
    },
    initDiffMinutes: {
      type: [String, Number],
      required: false,
      default: 0,
      description: '默认的初始化时间差（分钟的形式传递）。如果不传，则默认结束时间与开始时间时间差为1小时'
    }
  },
  computed: {
    formatStartTime: {
      get () {
        return formatDate(this.startTime.replace(/T/g, ' ').replace(/-/g, '/'), 'YYYY-MM-DDTHH:mm')
      },
      set (val) {
        this.$emit('updateStartTime', val.replace(/T/g, ' '))
      }
    },
    formatEndTime: {
      get () {
        return formatDate(this.endTime.replace(/T/g, ' ').replace(/-/g, '/'), 'YYYY-MM-DDTHH:mm')
      },
      set (val) {
        this.$emit('updateEndTime', val.replace(/T/g, ' '))
      }
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.mobile-time-style /deep/.q-field--filled .q-field__control {
  padding-right: 2px;
}
</style>
