<!--
@Name：选择年份下拉框
@Author：陆欢
@date：2021/08/13
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-select
    filled
    clearable
    v-model="selected"
    :options="yearsOptions"
    options-dense
    emit-value
    map-options
    :label="label"
  >
  </q-select>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'TwSelectYear',
  props: {
    beforeYear: {
      type: Number,
      default: 10,
      required: false,
      description: '当前年超前推几年'
    },
    afterYear: {
      type: Number,
      default: 0,
      required: false,
      description: '当前年超后推几年'
    },
    isHaveLatestYear: {
      type: Boolean,
      default: true,
      required: false,
      description: '是否有最近一年下拉框选项'
    },
    label: {
      type: String,
      default: 'label',
      required: false
    },
    init: {
      type: String,
      default: '',
      required: false
    }
  },
  // data () {
  //   return {
  //     selected: ''
  //   }
  // },
  mounted () {
  },
  computed: {
    selected: {
      get () {
        return this.init
      },
      set (year) {
        if (year) {
          let StartDate = ''
          let EndDate = ''
          if (year === 'latest') {
            let nowYear = date.formatDate(Date.now(), 'YYYY')
            let nowMonth = date.formatDate(Date.now(), 'MM')
            let nowDay = date.formatDate(Date.now(), 'DD')
            StartDate = `${nowYear - 1}-${nowMonth}-${nowDay}`
            EndDate = `${nowYear}-${nowMonth}-${nowDay}`
          } else {
            StartDate = `${year}-01-01`
            EndDate = `${year}-12-31`
          }
          this.$emit('selectYear', { StartDate, EndDate, SelectYear: year })
        } else {
          this.$emit('selectYear', {})
        }
      }
    },
    yearsOptions () {
      // 获取当前年月日
      let nowYear = date.formatDate(Date.now(), 'YYYY')
      // let nowMonth = date.formatDate(Date.now(), 'MM')
      // let nowDay = date.formatDate(Date.now(), 'DD')
      let year = [{ label: `${nowYear}年`, value: `${nowYear}` }]
      for (let index = 0; index < this.beforeYear - 1; index++) {
        const element = index + 1
        year.push({ label: `${nowYear - element}年`, value: `${nowYear - element}` })
      }

      for (let index = 0; index < this.afterYear - 1; index++) {
        const element = index + 1
        year.unshift({ label: `${nowYear + element}年`, value: `${nowYear + element}` })
      }
      // 是否添加最近一年
      if (this.isHaveLatestYear) {
        year.unshift({ label: '近一年', value: 'latest' })
      }
      return year
    }
  }
}
</script>

<style scoped>
</style>
