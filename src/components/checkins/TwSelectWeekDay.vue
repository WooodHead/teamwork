<!--
 * @Author: your name
 * @Date: 2020-06-20 16:14:15
 * @LastEditTime: 2020-06-28 09:08:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\checkins\TwSelectWeekDay.vue
-->
<!-- select week days -->
<template>
  <div class="q-gutter-sm row">
    <div
      v-for="option in initOptions"
      :key="option.id"
    >
      <q-btn
        rounded
        :class="$q.platform.is.desktop ?'btn-pc-width':''"
        @click="selectWeekDays(option.value)"
        :color="option.selected?'primary':''"
        :text-color="option.selected?'white':'black'"
        :label="option.label"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 编辑星期时，初始化选中的天（如星期一，星期二）
    cronDays: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      options: [
        {
          value: 'mon',
          label: 'Mon',
          selected: false
        },
        {
          value: 'tue',
          label: 'Tue',
          selected: false
        },
        {
          value: 'wed',
          label: 'Wed',
          selected: false
        },
        {
          value: 'thu',
          label: 'Thu',
          selected: false
        },
        {
          value: 'fri',
          label: 'Fri',
          selected: false
        },
        {
          value: 'sat',
          label: 'Sat',
          selected: false
        },
        {
          value: 'sun',
          label: 'Sun',
          selected: false
        }
      ]
    }
  },
  computed: {
    // emit 向外传递的星期（星期一，星期二）
    selectDays () {
      let days = []
      this.options.forEach(item => {
        if (item.selected) {
          days.push(item.value)
        }
      })
      return days
    },
    // 初始化星期（星期一，星期二）
    initOptions () {
      return this.options
    }
  },
  components: {
  },
  methods: {
    selectWeekDays (val) {
      let index = this.options.findIndex(a => a.value === val)
      this.options[index].selected = !this.options[index].selected
      this.$emit('select', this.selectDays)
    }
  },
  mounted () {
    if (this.cronDays !== '') {
      this.options.map(item => {
        if (this.cronDays.includes(item.value)) {
          item.selected = true
        }
      })
    }
  }
}

</script>

<style  scoped>
.btn-pc-width {
  width: 80px;
}
</style>
