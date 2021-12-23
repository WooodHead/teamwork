<template>
  <div v-if="control">
    <tw-approval-date
      :control.sync="beginDateControl"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    ></tw-approval-date>
    <tw-approval-date
      :control.sync="endDateControl"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    ></tw-approval-date>
    <tw-approval-number
      :control.sync="durationControl"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    ></tw-approval-number>
  </div>
</template>
<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'TwApprovalDateRange',
  props: {
    control: {
      type: Object,
      require: true,
      default: null
    },
    filled: {
      type: Boolean,
      require: false,
      default: false
    },
    outlined: {
      type: Boolean,
      require: false,
      default: false
    },
    borderless: {
      type: Boolean,
      require: false,
      default: false
    },
    clearable: {
      type: Boolean,
      require: false,
      default: false
    },
    hideBottomSpace: {
      type: Boolean,
      require: false,
      default: false
    },
    rounded: {
      type: Boolean,
      require: false,
      default: false
    },
    square: {
      type: Boolean,
      require: false,
      default: false
    },
    dense: {
      type: Boolean,
      require: false,
      default: false
    },
    itemAligned: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data () {
    return {
      beginDateControl: {
        property: {
          control: 'Date',
          title: [
            {
              text: '开始时间',
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: '请输入开始时间',
              lang: 'zh_CN'
            }
          ],
          value: {
            date: {
              type: this.control.property.value.date_range.type,
              s_timestamp: this.control.property.value.date_range.new_begin
            }
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
        },
        config: {
          date: {
            type: this.control.property.value.date_range.type
          }
        }
      },
      endDateControl: {
        property: {
          control: 'Date',
          title: [
            {
              text: '结束时间',
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: '请输入结束时间',
              lang: 'zh_CN'
            }
          ],
          value: {
            date: {
              type: this.control.property.value.date_range.type,
              s_timestamp: this.control.property.value.date_range.new_end
            }
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
        },
        config: {
          date: {
            type: this.control.property.value.date_range.type
          }
        }
      },
      durationControl: {
        property: {
          control: 'Number',
          title: [
            {
              text: `${this.control.property.title[0].text}时长`,
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: `请输入${this.control.property.placeholder[0].text}时长`,
              lang: 'zh_CN'
            }
          ],
          value: {
            new_number:
            this.control.property.value.date_range.new_duration
              ? (this.control.property.value.date_range.type === 'day'
                ? (this.control.property.value.date_range.new_duration / 3600 / 24)
                : (this.control.property.value.date_range.new_duration / 3600)) : ''
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
        }
      }
    }
  },
  computed: {
    changeParams () {
      let { beginDateControl, endDateControl, durationControl } = this
      return { beginDateControl, endDateControl, durationControl }
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    changeParams: {
      deep: true,
      handler (item) {
        let beginDateControlDate = item.beginDateControl.property.value.date.s_timestamp
        let endDateControlDate = item.endDateControl.property.value.date.s_timestamp
        if (beginDateControlDate && endDateControlDate && endDateControlDate > beginDateControlDate) {
          let hour = (endDateControlDate - beginDateControlDate) / 3600
          if (this.control.property.value.date_range.type === 'day') {
            item.durationControl.property.value.new_number = this.roundFun(hour, 1) / 24 + ''
          } else {
            item.durationControl.property.value.new_number = this.roundFun(hour, 1) + ''
          }
          this.control.property.value.date_range.new_begin = beginDateControlDate
          this.control.property.value.date_range.new_end = endDateControlDate
        } else {
          item.durationControl.property.value.new_number = ''
        }
        this.control.property.value.date_range.new_duration = this.control.property.value.date_range.type === 'day'
          ? item.durationControl.property.value.new_number * 24 * 3600
          : item.durationControl.property.value.new_number * 3600
      }
    }
  },
  methods: {
    formatDate,
    roundFun (value, n) {
      return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
    }
  },
  components: {
    TwApprovalDate: () => import('components/approval/temp/TwApprovalDate'),
    TwApprovalNumber: () => import('components/approval/temp/TwApprovalNumber')
  }
}
</script>

<style scoped lang="scss">
</style>
