<!--
@Name：下发工资
@Author：陆欢
@date：2021/04/28
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    class="table-grow-in-page q-px-xxl"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section />
    <q-stepper
      v-model="salaryStep"
      ref="stepper"
    >
      <!-- 步进器部分 -->
      <q-step
        v-for="item in stepList"
        :key="item.name"
        :name=item.name
        :title=item.title
        :icon=item.icon
        :done="salaryStep>item.name"
      >
        <!-- 第一步 -->
        <div
          class="flex flex-center"
          v-if="salaryStep===1"
        >
          <upload-salary
            :uploadSalary.sync="uploadSalary"
            @importSalary="importSalary"
          ></upload-salary>
        </div>
        <!-- 第二步 -->
        <check-data
          v-if="salaryStep===2"
          :modelList.sync="salaryList"
          :tableFixedColumn="['系统匹配','姓名']"
          moduleType="salary"
          @next="next"
          @back="back"
        ></check-data>
        <!-- 预览并发送 -->
        <preview-and-send
          v-if="salaryStep===3"
          @back="back"
          :salaryList="salaryList"
          v-bind="uploadSalary"
        />
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { date } from 'quasar'
import { showWarningMessage } from '@/utils/show-message'
const appConfig = require('app/app.config.js')
export default {
  name: 'IssuedSalaryIndex',
  data () {
    return {
      requiredColumn: appConfig['salary'].templateRequiredColumn,
      salaryStep: 1,
      salaryList: {},
      uploadSalary: { salaryYear: +date.formatDate(Date.now(), 'YYYY'), salaryMonth: +date.formatDate(Date.now(), 'M'), type: 'salary' },
      stepList: [
        { name: 1, title: this.$t('salary.salaryStep.uploadSalary'), icon: 'cloud_upload' },
        { name: 2, title: this.$t('salary.salaryStep.checkData'), icon: 'touch_app' },
        { name: 3, title: this.$t('salary.salaryStep.previewAndSend'), icon: 'done' }
      ]
    }
  },
  computed: {
    ...mapState('salary', ['currentDateAndType'])
  },
  methods: {
    importSalary (list) {
      this.salaryList = list
      this.next()
    },
    next () {
      if (this.salaryStep === 2 && !_.keys(this.salaryList).length) {
        showWarningMessage(this.$t('salary.dataCannotEmpty'))
      } else {
        this.salaryStep += 1
      }
    },
    back () {
      this.salaryStep -= 1
    }
  },
  components: {
    UploadSalary: () => import('components/salary/issuedSalary/UploadSalary'),
    CheckData: () => import('components/salary/issuedSalary/CheckData'),
    PreviewAndSend: () => import('components/salary/issuedSalary/PreviewAndSend')
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-stepper__header--border {
  border-bottom: none;
}
/deep/.q-separator--horizontal {
  display: none;
}
/deep/.q-stepper__tab--active .q-stepper__dot {
  background: #33ac37;
}
/deep/.q-stepper__title {
  font-size: 18px;
}
/deep/.q-stepper__tab--active {
  color: black;
}
</style>
