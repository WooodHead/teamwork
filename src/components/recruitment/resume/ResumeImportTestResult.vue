<!-- 导入测评结果 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card title="导入测评结果" />
    <!-- 1.步进器部分 -->
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
    >
      <q-step
        v-for="item in stepList"
        :key="item.name"
        :name=item.name
        :title=item.title
        :icon=item.icon
        :done="step>item.name"
      >
        <!-- 第一步：导入结果 -->
        <div v-if="step === 1">
          <p>注意事项：</p>
          <p>1、将根据“测评结果”列的内容更新简历状态</p>
          <p>2、测评结果仅识别“待测评、测评中、通过、未通过”</p>
          <input
            type="file"
            @change="onChange"
          />
        </div>
        <!-- 第二步：数据预览 -->
        <resume-import-test-result-check
          v-if="step === 2"
          moduleType="resume"
          :modelList="modelList"
          :tableFixedColumn="['简历ID（必选字段）', '姓名']"
          @next="next"
          @back="back"
        />
      </q-step>
    </q-stepper>
    <!-- 2.excel解析 -->
    <xlsx-read :file="file">
      <xlsx-json @parsed="xlsxJsonParse"></xlsx-json>
    </xlsx-read>
  </q-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { XlsxRead, XlsxJson } from 'vue-xlsx'
import { showSuccessMessage } from '@/utils/show-message'

const appConfig = require('app/app.config.js')

export default {
  name: 'ResumeImportTestResult',
  data () {
    return {
      file: null,
      step: 1,
      modelList: {}, // 导入总数
      stepList: [
        { name: 1, title: this.$t('resume.actions.stepper.import'), icon: 'cloud_upload' },
        { name: 2, title: this.$t('resume.actions.stepper.check'), icon: 'upload' }
      ]
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
    ...mapActions('resume', ['importTestResult', 'loadStatusCount']),
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'pushWidgetBreadcrumb', 'clearBreadcrumbs']),
    ...mapMutations('resume', ['setSelectedStatus']),
    // 面包屑处理
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `resume`,
        title: this.$t('recruitment.modules.resumeManage'),
        to: {
          name: 'resume'
        }
      })
      this.setSelectedStatus('waitTest')
    },
    onChange (event) {
      this.file = event.target.files ? event.target.files[0] : null
    },
    // 解析出来的数据
    xlsxJsonParse (list, sheetName) {
      let temp = {}
      temp[sheetName] = []
      temp[sheetName] = list
      this.modelList = temp
      this.$refs.stepper.next()
    },
    // 下一步
    next (checklist) {
      if (Object.values(checklist)[0].length) {
        let endList = this.toEndlist(Object.values(checklist)[0])
        this.importTestResult(endList).then(res => {
          if (res) {
            showSuccessMessage(this.$t('resume.actionSucceed'))
          }
          this.backHome()
        })
      }
    },
    backHome () {
      this.loadStatusCount()
      this.setSelectedStatus('waitTest')
      this.$router.push({
        name: 'resume'
      })
    },
    toEndlist (list) {
      let endList = []
      list.map(e => {
        let temp = {}
        temp.Id = e['简历ID（必选字段）']
        temp.Interviewee = e['姓名']
        temp.Status = e['测评结果']
        endList.push(temp)
      })
      return endList
    },
    // 返回上一步
    back () {
      this.step = 1
    }
  },
  components: {
    XlsxRead,
    XlsxJson,
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResumeImportTestResultCheck: () => import('components/recruitment/resume/ResumeImportTestResultCheck')
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
      }
    }
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
