<template>
  <div v-if="control">
    <tw-approval-selector
      :control.sync="selectorControl"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    ></tw-approval-selector>
    <tw-approval-attendance
      :control.sync="attendanceControl"
      :filled="filled"
      :outlined="outlined"
      :borderless="borderless"
      :clearable="clearable"
      :hide-bottom-space="hideBottomSpace"
      :rounded="rounded"
      :square="square"
      :dense="dense"
      :item-aligned="itemAligned"
    ></tw-approval-attendance>
  </div>
</template>

<script>
export default {
  name: 'TwApprovalVacation',
  props: {
    control: {
      type: Object,
      require: true,
      default: () => { }
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
      selectorControl: {
        property: {
          control: 'Selector',
          title: [
            {
              text: '请假类型',
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: '请选择请假类型',
              lang: 'zh_CN'
            }
          ],
          value: {
            selector: this.control.property.value.vacation.selector
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
        },
        config: {
          selector: this.control.config.vacation.selector
        }
      },
      attendanceControl: {
        property: {
          control: 'Attendance',
          title: [
            {
              text: '请假时长',
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: '请输入请假时长',
              lang: 'zh_CN'
            }
          ],
          value: {
            attendance: this.control.property.value.vacation.attendance
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
        },
        config: {
          attendance: this.control.config.vacation.attendance
        }
      }
    }
  },
  computed: {
  },
  created () {

  },
  mounted () {

  },
  watch: {
  },
  methods: {
  },
  components: {
    TwApprovalSelector: () => import('components/approval/temp/TwApprovalSelector'),
    TwApprovalAttendance: () => import('components/approval/temp/TwApprovalAttendance')
  }
}
</script>

<style scoped lang="scss">
</style>
