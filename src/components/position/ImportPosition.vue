<template>
  <q-card class="card-grow-in-page q-px-md q-pt-md">
    <!-- 头部信息 -->
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
    >
      <!-- 步进器部分 -->
      <q-step
        v-for="item in stepList"
        :key="item.name"
        :name=item.name
        :title=item.title
        :icon=item.icon
        :done="step>item.name"
      >
        <!-- 第一步：下载模板、导入模板 -->
        <import-and-download-template
          v-if="step===1"
          :importType=importType
          :file.sync=file
          :showChoiceRepeatWay="false"
        >
          <template>
            <slot></slot>
          </template>
        </import-and-download-template>
        <!-- 第二步：数据预览 -->
        <check-data
          v-if="step===2"
          moduleType="position"
          :modelList="modelList"
          :tableFixedColumn="['系统匹配','姓名']"
          @next="next"
          @back="back"
        ></check-data>
      </q-step>
    </q-stepper>
    <xlsx-read :file="file">
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read>
    <!-- 发送消息弹出框 -->
    <q-dialog
      v-model="showSendWeChatDialog"
      persistent
    >
      <send-wechat-message
        class="full-width"
        type="position"
        :modelList="sendMessageList"
        @toHome="toHome"
      />
    </q-dialog>
    <!-- 验证码输入框 -->
    <q-dialog v-model="showInputCode">
      <div
        class="relative-position no-shadow"
        style="width: 96vw;max-width: 320px;"
      >
        <dynamic-code-input
          :smallMode="true"
          @ok="code=>codeNext(code)"
        />
      </div>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { XlsxRead, XlsxJson } from 'vue-xlsx'
import { showWarningMessage } from '@/utils/show-message'

const appConfig = require('app/app.config.js')
export default {
  name: 'ImportPosition',
  props: {
    importType: {
      type: String,
      default: '',
      required: false,
      description: '导入类型,例如：person、document'
    }
  },
  data () {
    return {
      file: null,
      step: 1,
      modelList: {}, // 导入总数
      stepList: [
        { name: 1, title: this.$t('position.step.import'), icon: 'cloud_upload' },
        { name: 2, title: this.$t('position.step.check'), icon: 'upload' }
      ],
      showSendWeChatDialog: false,
      sendMessageList: [],
      showInputCode: false,
      checklistData: [] // 若需输入验证码时，临时存放待导入的数据
    }
  },
  computed: {
    requiredColumns () {
      let temp = _.cloneDeep(appConfig.position.templateRequiredColumn)
      temp.push(appConfig.position.defaultActual)
      return temp
    }
  },
  methods: {
    ...mapActions('position', ['importPosition', 'adminSendCode', 'staffSendPosition']),
    // 解析出来的数据
    xlsxJsonParse (list, sheetName) {
      let temp = {}
      temp[sheetName] = []
      temp[sheetName] = list
      this.modelList = temp
      this.$refs.stepper.next()
    },
    // 导入并发送
    importAndSendPositions (checklist, oldCode = '') {
      let newCode = Math.random().toFixed(6).slice(-6)
      console.log(newCode)
      // 过滤没有工号的
      let filteredlist = this.filterModelList(Object.values(this.modelList)[0])
      let endList = this.toEndList(filteredlist, oldCode)
      // 给管理员发送消息
      this.adminSendCode(newCode)
      // 导入
      this.importPosition({
        list: endList,
        oldCode: oldCode,
        newCode: newCode
      })
        .then(res => {
          this.$q.loading.hide()
          if (res) {
            // 跳转到列表页面，给员工发送信息
            let query = [
              { Key: 'SendStatus', Value: 0, Oper: 'eq' }
            ]
            // TODO:处理导入失败
            if (res.index && res.index.length) {
              let info = ''
              for (let i = 0; i < res.index.length; i++) {
                info += (res.index[i] + 2) + '—' + (res.index[i] + res.offset + 1)
                if (i !== (res.index.length - 1)) {
                  info += '、'
                }
              }
              this.$q.notify({
                message: 'Excel中第 ' + info + '行 导入失败，请重新尝试导入！',
                color: 'orange',
                multiLine: true,
                icon: 'info',
                timeout: 0,
                position: 'bottom-right',
                actions: [
                  {
                    label: '确定',
                    color: 'yellow',
                    handler: () => { }
                  }
                ]
              })
            }
            // 发送消息
            this.staffSendPosition({ query, code: newCode })
            // 跳转列表页
            this.$router.push({ name: 'positionHome' })
          } else {
            showWarningMessage('职位职级导入失败')
          }
        })
    },
    // 如果有历史数据，则输入验证码下一步
    codeNext (code) {
      this.$q.loading.show()
      // 验证code是否正确的查询条件
      let condition = { code, limit: 1, byPage: true, offset: '0', isCommit: false }
      this.$store.dispatch('position/loadPositions', condition).then(positions => {
        // 验证码正确
        if (code && positions && positions.length > 0 && positions[0].value) {
          // 关闭验证码弹框
          this.showInputCode = false
          // 导入并发送
          this.importAndSendPositions(this.checklistData, code)
        } else {
          // 验证码错误
          showWarningMessage(this.$t(`position.codeErr`))
        }
      })
    },
    // 下一步
    next (checklist) {
      // 若state有数据需要输入验证码
      if (this.$store.state.position.positions.length) {
        this.checklistData = checklist
        this.showInputCode = true
      } else {
        // 若state中没数据，则查询数据库，有数据需要输入验证码
        this.$store.dispatch('position/loadPositions', {}).then(positions => {
          if (this.$store.state.position.positions.length) {
            this.checklistData = checklist
            this.showInputCode = true
          } else {
            // 没有历史数据，直接导入并发送
            this.importAndSendPositions(checklist)
          }
        })
      }
    },
    // 返回上一步
    back () {
      this.step = 1
    },
    filterModelList (list) {
      // 过滤无工号数据
      return _.filter(list, s => {
        return s[this.requiredColumns[1]]
      })
    },
    // excel解析的数据key是汉字，这里转换成model
    toEndList (list, code) {
      let requiredColumns = _.cloneDeep(appConfig.position.templateRequiredColumn)
      requiredColumns.push(appConfig.position.defaultActual)
      let endList = []
      list.map(e => {
        let temp = {}
        temp.ID = 0
        temp.PsonName = e[this.requiredColumns[0]]
        temp.RecordNum = e[this.requiredColumns[1]]
        temp.OrganizeName = e[this.requiredColumns[2]]
        temp.AdminPosition = e[this.requiredColumns[3]]
        temp.AdminRank = e[this.requiredColumns[4]]
        temp.AdminBlessing = e['祝福语']
        temp.StaffPosition = ''
        temp.StaffRank = ''
        temp.StaffBlessing = ''
        temp.IsRead = 0
        temp.PsonId = e.psonID
        temp.SendStatus = e.sendStatus
        temp.AdminCode = code
        endList.push(temp)
      })
      return endList
    },
    toHome () {
      this.showSendWeChatDialog = true
      this.$router.push({ name: 'positionHome' })
    }
  },
  mounted () {
    if (!this.$myinfo.auth.role.isPositionManager) {
      showWarningMessage(this.$t('position.noAuth'))
      this.$router.push({
        name: 'home'
      })
    }
  },
  components: {
    XlsxRead,
    XlsxJson,
    ImportAndDownloadTemplate: () => import('components/import/ImportAndDownloadTemplate'),
    CheckData: () => import('components/salary/issuedSalary/CheckData'),
    SendWechatMessage: () => import('components/salary/admin/SendWechatMessage'),
    DynamicCodeInput: () => import('components/position/DynamicCodeInput')
  }
}
</script>

<style lang="scss" scoped>
/deep/ .q-stepper__header--border {
  border-bottom: none;
}
a:hover {
  text-decoration: underline;
}
</style>
