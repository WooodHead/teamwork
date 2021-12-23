<template>
    <div v-if="control">
      <tw-approval-date-range
        :control.sync="dateRangeControl"
        :filled="filled"
        :outlined="outlined"
        :borderless="borderless"
        :clearable="clearable"
        :hide-bottom-space="hideBottomSpace"
        :rounded="rounded"
        :square="square"
        :dense="dense"
        :item-aligned="itemAligned"
      ></tw-approval-date-range>
    </div>
</template>

<script>
export default {
  name: 'TwApprovalAttendance',
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
      dateRangeControl: {
        property: {
          control: 'DateRange',
          title: [
            {
              text: this.control.config.attendance.type === 1 ? '请假'
                : this.control.config.attendance.type === 3 ? '出差'
                  : this.control.config.attendance.type === 4 ? '外出' : '加班',
              lang: 'zh_CN'
            }
          ],
          placeholder: [
            {
              text: this.control.config.attendance.type === 1 ? '请假'
                : this.control.config.attendance.type === 3 ? '出差'
                  : this.control.config.attendance.type === 4 ? '外出' : '加班',
              lang: 'zh_CN'
            }
          ],
          value: {
            date_range: this.control.property.value.attendance.date_range
          },
          require: this.control.property.require,
          un_print: this.control.property.un_print
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
    TwApprovalDateRange: () => import('components/approval/temp/TwApprovalDateRange')
  }
}
</script>

<style scoped lang="scss">

</style>
