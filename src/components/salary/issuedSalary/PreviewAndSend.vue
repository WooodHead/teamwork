<!--
@Name：上传工资条
@Author：陆欢
@date：2021/04/28
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <div
      class="flex justify-between q-gutter-x-lg"
      style="height: 60vh;"
    >
      <q-card class="col column preview-card">
        <q-virtual-scroll
          style="max-height: calc(60vh - 90px);"
          :items="sendSalaryList"
          separator
          class="q-ma-md bg-green-1"
          bordered
        >
          <template v-slot="{ item, index }">
            <q-item
              :key="index"
              clickable
              v-ripple
              @click="transformModel(item)"
              :class="[item.recordNum===salaryModel.recordNum&&item.name===salaryModel.name&&`bg-${primaryColor} text-white`]"
            >
              {{item.name}}
            </q-item>
          </template>
        </q-virtual-scroll>
        <q-space />
        <q-separator />
        <q-card-section class="">
          <p
            class="q-mb-none text-caption text-grey-8"
            v-html="$t(`salary.listTip`, {length: sendSalaryList.length})"
          ></p>
        </q-card-section>
      </q-card>
      <q-card class="col q-pa-none preview-card">
        <q-scroll-area style="height: 60vh;">
          <salary-detail
            :model="salaryModel"
            class="salary-detail"
            :isPreview="true"
            :primaryColor="primaryColor"
            :type="type"
          ></salary-detail>
        </q-scroll-area>
        <q-card-section class="q-px-none preview-card-tips">
          <q-separator class="q-mb-md" />
          <p
            class="q-mb-none q-px-md text-caption text-grey-8"
            v-html="$t(`salary.previewTip`, {name: salaryModel.name})"
          ></p>
        </q-card-section>
      </q-card>
      <q-card class="col column preview-card">
        <div class="q-mb-none q-pa-md text-grey-6">{{$t(`salary.sendnowTip`)}}</div>
        <q-space />
        <q-stepper-navigation
          align="center"
          class="q-px-md q-mb-xl"
        >
          <q-btn
            unelevated
            :disable="sendButtonDisables"
            class="q-mx-md full-width"
            :class="`bg-${primaryColor}`"
            size="lg"
            @click="toCountdown()"
            style="color:white"
            :label="$t('salary.sendNow')"
          />
        </q-stepper-navigation>
      </q-card>
    </div>
    <q-stepper-navigation align="center">
      <q-btn
        flat
        color="primary"
        :label="$t('salary.stepLabel.back')"
        @click="$emit('back')"
      />
    </q-stepper-navigation>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <send-wechat-message
        :modelList="sendMessageList"
        @closeDialog="showDialog=false"
        @toHome="toSalaryHome"
        class="full-width"
      />
    </q-dialog>
    <!-- loading -->
    <div
      v-if="showLoading"
      class="absolute-center flex flex-center send-loading"
    >
      <div class="row justify-center q-py-md">
        <q-knob
          readonly
          v-model="importProgress"
          size="200px"
          show-value
          :thickness="0.3"
          color="primary"
          track-color="blue-3"
          class="text-primary q-ma-md"
        >
          <div>
            <div class="block text-grey-8 text-subtitle1 text-weight-bold text-center">已上传</div>
            <div class="block">{{importProgress}}%</div>
          </div>
        </q-knob>
      </div>
    </div>
    <q-dialog
      v-model="showCountdown"
      persistent
    >
      <q-card
        class="q-py-lg q-px-xl"
        style="width: 100%; max-width: 500px;"
      >
        <q-card-actions
          align="center"
          class="text-subtitle1"
        >
          <span
            class="text-h3 text-primary"
            style="white-space: pre;"
          >{{countdown}} </span>秒后发送
        </q-card-actions>
        <q-card-section align="center">
          <img
            src="emoji-jingdiaojun/精雕君-财神到.gif"
            alt="精雕君-财神到"
            style="width: 100px;"
          >
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            unelevated
            label="取消发送"
            color="primary"
            @click="cancelCountdown()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
const appConfig = require('app/app.config.js')
import { showWarningMessage } from '@/utils/show-message'
// const recordNumKey = appConfig.salary.templateRequiredColumn[1]
export default {
  name: 'PreviewAndSend',
  props: {
    salaryList: {
      type: Object,
      required: true,
      description: '上传的工资条数据'
    },
    salaryYear: {
      type: Number,
      required: true,
      description: '发薪年'
    },
    salaryMonth: {
      type: Number,
      required: true,
      description: '发薪月'
    },
    type: {
      type: String,
      required: true,
      description: '发薪类型'
    }
  },
  components: {
    SalaryDetail: () => import('components/salary/SalaryDetail'),
    SendWechatMessage: () => import('components/salary/admin/SendWechatMessage')
  },
  data () {
    return {
      showCountdown: false,
      countdown: 5,
      showLoading: false,
      showDialog: false,
      sendMessageList: [],
      modelList: [],
      salaryModel: {},
      sendButtonDisables: true,
      primaryColor: 'green',
      timer: 0
    }
  },
  watch: {
    modelList () {
      this.salaryModel = this.modelList[0]
    }
  },
  mounted () {
    this.packageData()
  },
  methods: {
    ...mapActions('salary', ['importSalary', 'reImportSalary', 'sendMessage', 'adminSendCode']),
    ...mapMutations('salary', ['setSalaryCountAndStatus', 'addSalarydateAndType', 'setCurrentDateAndType']),
    reSendNow () {
      this.showCountdown = false
      this.showLoading = true
      // // 循环次数
      // this.importCount = Math.ceil(this.modelList.length / this.importNum)
      let code = this.adminSecurityCode[`${this.salaryYear}-${this.salaryMonth}-${this.type}`]

      this.reImportSalary({ list: this.modelList, code, total: this.modelList.length, salaryYear: this.salaryYear, salaryMonth: this.salaryMonth, type: this.type })
        .then(res => {
          this.showLoading = false
          if (res) {
            this.sendSalary(code)
          } else {
            showWarningMessage('工资条上传失败')
            this.$router.push({ name: 'salaryHome' })
          }
        })
    },
    sendNow () {
      this.showCountdown = false
      this.showLoading = true
      // // 循环次数
      // this.importCount = Math.ceil(this.modelList.length / this.importNum)
      let code = Math.random().toFixed(6).slice(-6)
      // 给管理员发送验证码
      this.adminSendCode({ code, salaryYear: this.salaryYear, salaryMonth: this.salaryMonth, type: this.type })

      this.importSalary({ list: this.modelList, code, total: this.modelList.length })
        .then(res => {
          this.showLoading = false
          if (res) {
            this.addSalarydateAndType({ id: 0, salaryYear: this.salaryYear, salaryMonth: this.salaryMonth, type: this.type })
            this.setCurrentDateAndType({ salaryYear: this.salaryYear, salaryMonth: this.salaryMonth, type: this.type })
            this.sendSalary(code)
          } else {
            showWarningMessage('工资条上传失败')
            this.$router.push({ name: 'salaryHome' })
          }
        })
    },
    sendSalary (code) {
      // 初始化状态数量
      let countAndStatus = {
        all: this.modelList.length,
        error: 0,
        sended: 0,
        success: 0,
        salaryYear: this.salaryYear,
        salaryMonth: this.salaryMonth,
        type: this.type
      }
      this.setSalaryCountAndStatus(countAndStatus)
      // 跳转到工资条管理页面
      let query = [
        { Key: 'SalaryYear', Value: this.salaryYear, Oper: 'eq' },
        'and',
        { Key: 'SalaryMonth', Value: this.salaryMonth, Oper: 'eq' },
        'and',
        { Key: 'Type', Value: this.type, Oper: 'eq' },
        'and',
        { Key: 'CreateByID', Value: +this.$myinfo.id, Oper: 'eq' },
        'and',
        { Key: 'SendStatus', Value: 0, Oper: 'eq' }
      ]
      this.sendMessage({ query, code, salaryYear: this.salaryYear, salaryMonth: this.salaryMonth, type: this.type })
      this.$router.push({ name: 'salaryHome' })
    },
    toCountdown () {
      this.showCountdown = true
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          !this.isReSend && this.sendNow()
          this.isReSend && this.reSendNow()
        }
      }, 1000)
    },
    cancelCountdown () {
      clearInterval(this.timer)
      this.showCountdown = false
      this.countdown = 5
    },
    packageData () {
      const requiredColumn = appConfig.salary.templateRequiredColumn
      const notDisplayIf0 = appConfig.salary.notDisplayIf0
      let salarys = []
      for (let key in this.salaryList) {
        salarys.push(...this.salaryList[key])
      }
      let sL = _.cloneDeep(salarys)
      // 先过滤掉没有工号的
      sL = _.filter(sL, s => {
        return s[requiredColumn[1]]
      })
      _(sL).forEach(e => {
        let item = {
          id: e.id || 0,
          name: e[requiredColumn[0]],
          recordNum: e[requiredColumn[1]],
          organizeName: e[requiredColumn[2]],
          salaryYear: this.salaryYear,
          salaryMonth: this.salaryMonth,
          type: this.type,
          createByID: this.$myinfo.id,
          sendStatus: 0
        }
        // 去掉工资详细信息中不显示的字段
        let salary = _.pickBy(e, (value, key) => {
          return !requiredColumn.includes(key) && !['psonID', 'name', 'relevanceWeChat', 'id'].includes(key)
        })
        // 去掉为0不显示的字段
        _(notDisplayIf0).forEach(n => {
          if (!salary[n]) {
            salary = _.omit(salary, [n])
          }
        })
        Object.assign(item, { value: salary })
        this.modelList.push(item)
      })
      this.sendButtonDisables = false
    },
    transformModel (model) {
      this.salaryModel = model
    },
    toSalaryHome () {
      this.$router.push({ name: 'salaryHome' })
    }
  },
  computed: {
    ...mapState('salary', ['importProgress', 'isReSend', 'adminSecurityCode']),
    sendSalaryList () {
      // // 不显示异常数据
      // return _.filter(this.modelList, item => item.sendStatus < 3)
      return this.modelList
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.q-field__marginal {
    font-size: 14px;
  }
  .preview-card {
    overflow: auto;
    height: 100%;
  }
  /deep/ .q-item {
    min-height: auto;
    line-height: 30px;
    font-size: 16px;
    color: $grey-8;
    .active {
      background: $blue-3;
    }
  }
  /deep/ .salary-detail {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 60px;
  }
  /deep/.q-separator--horizontal {
    display: block;
  }
  .preview-card-tips {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
  }
  .send-loading {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    & > div {
      width: 50%;
    }
    .q-badge {
      background: transparent;
    }
    /deep/ .q-linear-progress__track--light {
      background: rgba(0, 0, 0, 0.5);
    }
  }
</style>
