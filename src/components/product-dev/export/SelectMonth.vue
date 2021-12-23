<template>
  <div class="q-gutter-sm">
    <q-btn
      v-for="option in options"
      :key="option.id"
      :color="option.selected?'primary':'grey-3'"
      :text-color="option.selected?'white':'black'"
      :label="option.label"
      @click="selectMonth(option)"
    >
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'SelectMonth',
  props: {
    value: { type: [Number, Array] },
    multiple: {
      type: Boolean,
      default: false,
      description: '是否多选模式'
    }
  },
  data () {
    return {
      options: [
        {
          id: 1,
          label: '01月',
          selected: false
        },
        {
          id: 2,
          label: '02月',
          selected: false
        },
        {
          id: 3,
          label: '03月',
          selected: false
        },
        {
          id: 4,
          label: '04月',
          selected: false
        },
        {
          id: 5,
          label: '05月',
          selected: false
        },
        {
          id: 6,
          label: '06月',
          selected: false
        },
        {
          id: 7,
          label: '07月',
          selected: false
        },
        {
          id: 8,
          label: '08月',
          selected: false
        },
        {
          id: 9,
          label: '09月',
          selected: false
        },
        {
          id: 10,
          label: '10月',
          selected: false
        },
        {
          id: 11,
          label: '11月',
          selected: false
        },
        {
          id: 12,
          label: '12月',
          selected: false
        }
      ]
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.emitSelected()
    }
  },
  methods: {
    selectMonth (month) {
      if (this.multiple) {
        month.selected = !month.selected
      } else {
        this.options.forEach(opt => {
          opt.selected = opt.id === month.id
        })
      }
      this.emitSelected()
    },
    emitSelected () {
      const selectedIds = this.options.filter(opt => opt.selected).map(opt2 => opt2.id)
      const selected = this.multiple ? selectedIds : (selectedIds.length > 0 ? selectedIds[0] : null)
      this.$emit('select', selected)
    },
    setMonthState (id, state) {
      const selectedOpt = this.options.find(opt => opt.id === id)
      selectedOpt && (selectedOpt.selected = state)
    }
  },
  mounted () {
    if (this.multiple) {
      if (_.isArray(this.value)) {
        let that = this
        this.value.forEach(val => {
          that.setMonthState(val, true)
        })
      }
    } else {
      !isNaN(this.value) && this.setMonthState(this.value, true)
    }
  }
}
</script>

<style scoped>
</style>
