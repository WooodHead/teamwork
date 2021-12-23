<!--
@Name：任务导出控制中心
@Author：陆欢
@date：2021/01/25
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card-section class="q-pt-xs">
    <q-input
      filled
      bottom-slots
      v-model="discussStartTime"
      dense
      readonly
      placeholder="默认为最新讨论"
      class="q-pb-sm"
    >
      <template v-slot:before>
        <span class="text-subtitle2">讨论开始日期</span>
      </template>

      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
            ref="popupProxy"
            :breakpoint="2000"
          >
            <q-date
              :value="qDate"
              @input="updateDate($event)"
              mask="YYYY-MM-DD"
              minimal
              :options="optionsFn"
            >
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="text-grey-7 text-subtitle2 q-mt-md">截止日期默认为至今</div>
    <div class="text-grey-7 text-subtitle2 q-mt-md">
      <q-checkbox
        left-label
        v-model="isExportTableOfPdf"
        label="是否导出汇总表格:"
      />
    </div>
  </q-card-section>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'TaskSetting',
  props: {
    needSettingProperty: {
      type: Object,
      required: true,
      description: '需要更新的内容'
    }
  },
  data () { return { isExportTable: this.$q.localStorage.getItem('isExportTaskTableOfPdf') } },
  // mounted () {
  //   if (this.isExportTable === null || this.isExportTable === undefined) {
  //     this.isExportTable = true
  //   }
  // },
  computed: {
    qDate: {
      get () {
        return this.needSettingProperty.startTime || date.formatDate(Date.now(), 'YYYY-MM-DD')
      }
    },
    discussStartTime: {
      get () {
        return (this.needSettingProperty && this.needSettingProperty.startTime) || ''
      },
      set (value) {
        this.needSettingProperty.startTime = value
      }
    },
    isExportTableOfPdf: {
      get () {
        return (this.isExportTable === null || this.isExportTable === undefined) ? true : this.isExportTable
      },
      set (value) {
        this.$q.localStorage.set('isExportTaskTableOfPdf', value)
        this.isExportTable = value
        this.$emit('apply', { startTime: this.qDate, isExportTaskTableOfPdf: value, updateType: 'isExportTable' })
      }
    }
  },
  methods: {
    updateDate (value) {
      !value && (value = date.formatDate(Date.now(), 'YYYY-MM-DD'))
      this.discussStartTime = value
      this.$refs.popupProxy.hide()
      this.$emit('apply', { startTime: value, isExportTaskTableOfPdf: this.isExportTable, updateType: 'exportDate' })
    },
    optionsFn (value) {
      return value <= date.formatDate(Date.now(), 'YYYY/MM/DD')
    }
  }
}
</script>

<style scoped>
</style>
