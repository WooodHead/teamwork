<!--
@Name：上传工资条
@Author：陆欢
@date：2021/04/28
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-form
    class="q-gutter-y-md"
    style="width:500px"
  >
    <q-select
      :value="model.type"
      @input="typeSelect($event)"
      dense
      outlined
      :options="salaryTypes"
      options-dense
      emit-value
      map-options
    >
      <template v-slot:before>
        <div class="text-grey-10">{{$t('salary.salaryTypeSelect')}}</div>
      </template>
    </q-select>
    <div :class="$q.screen.gt.sm?'row items-center q-mb-md':'q-gutter-y-md'">
      <div class="col">
        <q-select
          dense
          outlined
          :value="model.salaryYear"
          @input="salaryYearSelect($event)"
          :options="salaryYear"
          options-dense
          emit-value
          map-options
        >
          <template v-slot:before>
            <div class="text-grey-10">{{$t('salary.salaryTimeSelect')}}</div>
          </template>
        </q-select>
      </div>
      <div :class="['col', {'q-ml-md':$q.screen.gt.sm}]">
        <q-select
          dense
          outlined
          :value="model.salaryMonth"
          @input="salaryMonthSelect($event)"
          :options="salaryMonth"
          options-dense
          emit-value
          map-options
        >
        </q-select>
      </div>
    </div>
    <div
      class="text-grey-6"
      style="white-space: pre-wrap;"
      v-html="$t('salary.uploadTips')"
    ></div>
    <q-stepper-navigation align="center">
      <q-btn
        size="lg"
        @click="uploadSalaryExcel()"
        style="background:#33ac37;color:white"
        :label="$t('salary.stepLabel.uploadExcel')"
        icon="file_upload"
      />
    </q-stepper-navigation>
    <q-stepper-navigation
      align="center"
      class="q-pt-none"
    >
      <a
        style="text-decoration:none"
        :href="href"
        class="text-primary"
      >{{hrefContent}}</a>
    </q-stepper-navigation>
    <input
      v-show="false"
      ref="inputFile"
      type="file"
      @change="onChange"
    />
    <!-- <xlsx-read :file="file">
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read> -->

    <xlsx-read :file="file">
      <xlsx-sheets>
        <template #default="{sheets}">
          <xlsx-json
            :sheet="sheet"
            v-for="(sheet,index) in sheets"
            :key="sheet"
            @parsed="xlsxJsonParse($event,sheet,index,sheets.length)"
          ></xlsx-json>
        </template>
      </xlsx-sheets>
    </xlsx-read>
    <!-- 弹出管理员需要输入验证码界面 -->
    <q-dialog v-model="showSecurityDialog">
      <admin-security-code
        @input="inputCode"
        @close="()=>{showSecurityDialog=false}"
        :uploadSalary="{salaryYear:model.salaryYear,salaryMonth:model.salaryMonth,type:model.type}"
      >
        <template>
          <q-card-section style="color: rgba(0, 0, 0, 0.54);padding-bottom: 0;">
            该月{{$t(`salary.salaryType.${model.type}`)}}已经上传，如需重新上传请先输入验证码
          </q-card-section>
        </template>
      </admin-security-code>
    </q-dialog>
  </q-form>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
import { XlsxRead, XlsxSheets, XlsxJson } from 'vue-xlsx'
const appConfig = require('app/app.config.js')
export default {
  name: 'UploadSalary',
  props: {
    uploadSalary: {
      type: Object,
      required: true,
      description: '上传工资条的年月类型信息。包含：salaryYear、salaryMonth、type属性'
    }
  },
  data () {
    return {
      file: null,
      model: {},
      excelSheets: {},
      showSecurityDialog: false
    }
  },
  mounted () {
    this.model = _.cloneDeep(this.uploadSalary)
  },
  computed: {
    ...mapState('salary', ['allSalaryDateAndType', 'salaryTypes', 'salaryYear', 'salaryMonth']),
    href () {
      const typeObject = _.find(this.salaryTypes, s => { return s.value === this.uploadSalary.type })
      return `${process.env.API_HOST}/excelTemplate/工资条${typeObject.label}导入模板.xlsx`
    },
    hrefContent () {
      const type = this.$t(`salary.salaryType.${this.uploadSalary.type}`)
      return this.$t('salary.downloadTemplate', { type })
    }
  },
  methods: {
    ...mapMutations('salary', ['setAdminSecurityCode', 'setCurrentDateAndType', 'setIsReSend']),
    ...mapActions('salary', ['loadSalaryDateAndType', 'codeIsRight']),
    inputCode (code) {
      // 判断验证码是否正确
      this.codeIsRight({ code, salaryYear: this.model.salaryYear, salaryMonth: this.model.salaryMonth, type: this.model.type })
        .then(res => {
          if (res) {
            this.setCurrentDateAndType({
              salaryYear: this.model.salaryYear,
              salaryMonth: this.model.salaryMonth,
              type: this.model.type
            })
            this.setAdminSecurityCode(code)
            this.showSecurityDialog = false
            this.$refs.inputFile.click()
          } else {
            showWarningMessage(this.$t('salary.codeError'))
          }
        })
    },
    typeSelect (type) {
      this.model.type = type
      this.$emit('update:uploadSalary', this.model)
    },
    salaryYearSelect (val) {
      this.model.salaryYear = val
      this.$emit('update:uploadSalary', this.model)
    },
    salaryMonthSelect (val) {
      this.model.salaryMonth = val
      this.$emit('update:uploadSalary', this.model)
    },
    uploadSalaryExcel () {
      // 防呆校验
      // 一年一个月一个类型只能上传一次
      this.loadSalaryDateAndType()
        .then(res => {
          let findType = _.find(this.allSalaryDateAndType, e => {
            return e.salaryYear === this.model.salaryYear &&
              e.salaryMonth === this.model.salaryMonth &&
              e.type === this.model.type
          })
          if (findType) {
            this.showSecurityDialog = true
            this.setIsReSend(true)
            // let type = this.$t(`salary.salaryType.${this.model.type}`)
            // showWarningMessage(this.$t('salary.alreySend', { salaryYear: this.model.salaryYear, salaryMonth: this.model.salaryMonth, type: type }))
            return false
          }
          this.setIsReSend(false)
          this.$refs.inputFile.click()
        })
    },
    onChange (event) {
      this.file = event.target.files ? event.target.files[0] : null
    },
    xlsxJsonParse (list, sheetName, index, sheetsLength) {
      if (list.length) {
        // 校验必要列是否存在
        const columns = _.keys(list[0])
        const requiredColumns = _.cloneDeep(appConfig.salary.templateRequiredColumn)
        requiredColumns.push(appConfig.salary.defaultActual[this.model.type])
        const interColumn = _.intersection(requiredColumns, columns)
        if (interColumn.length !== requiredColumns.length) {
          let diffColumn = _.difference(requiredColumns, interColumn)
          showWarningMessage(this.$t('salary.colunmConnotLess', { columns: diffColumn.toString() }))
          return false
        }
        // 返回数据
        if (this.excelSheets.sheetName) {
          this.excelSheets[sheetName].push(...list)
        } else {
          this.excelSheets[sheetName] = []
          this.excelSheets[sheetName] = list
        }
      }
      if (index === (sheetsLength - 1)) {
        this.$emit('importSalary', this.excelSheets)
      }
    }
  },
  components: {
    XlsxRead,
    XlsxJson,
    XlsxSheets,
    AdminSecurityCode: () => import('components/salary/admin/AdminSecurityCode')
  }
}
</script>

<style lang="scss" scoped>
  /deep/.q-field__marginal {
    font-size: 14px;
  }
</style>
