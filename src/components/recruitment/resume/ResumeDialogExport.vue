<!-- 带测评简历导出 -->
<template>
  <q-card style="width:400px;max-width:560px;">
    <!-- 导出提醒 -->
    <div v-show="!showExport">
      <q-card-section>
        <div
          v-if="selectedStatus !== 'waitTest'"
          class="text-h6"
        >
          确认
        </div>
        <div
          v-else
          class="text-h6"
        >请选择需要导出的简历</div>
      </q-card-section>

      <q-card-section
        v-if="selectedStatus !== 'waitTest'"
        class="q-pt-none"
      >
        {{condition}}
      </q-card-section>

      <q-card-section
        v-else
        class="q-pt-none"
      >
        <q-option-group
          type="radio"
          :options="waitTestOptions"
          v-model="waitTestOption"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          type="reset"
          color="primary"
          class="q-ml-sm"
          :label="$t('action.cancel')"
          v-close-popup
        />
        <q-btn
          flat
          color="primary"
          :label="$t('action.confirm')"
          @click="goExport()"
        />
      </q-card-actions>
    </div>
    <export-excel
      v-show="showExport"
      moduleType="resume"
      :fields="fields"
      :search="search"
      :query="exportQuery"
      loadDataAction="GetViList"
      :fileName="fileName"
      :sheetName="sheetName"
      :showHeader="false"
    />
  </q-card>
</template>

<script>
import { date, LocalStorage } from 'quasar'
const { formatDate } = date
import { mapGetters } from 'vuex'
export default {
  name: 'ResumeDialogExport',
  data () {
    return {
      city: '',
      showExport: false,
      waitTestOption: 'waitTest',
      waitTestOptions: [
        { label: '待测评', value: 'waitTest' },
        { label: '测评中', value: 'inTest' },
        { label: '待测评 + 测评中', value: 'both' }
      ],
      exportQuery: []
    }
  },
  computed: {
    ...mapGetters('resume', ['resumeViews', 'resumeViewQuerys']),
    fields () {
      let commonFields = [
        'Interviewee',
        'Sex',
        'Tel',
        'Email',
        'City',
        'JobTitle',
        'HighestEducation',
        {
          'EducationsCollege': "Educations ->> '$[0].College' as EducationsCollege"
        },
        {
          'EducationsMajor': "Educations ->> '$[0].Major' as EducationsMajor"
        },
        {
          'LanguagesLevel': "replace(replace(replace(JSON_EXTRACT(Languages, '$[*].Level'), '\"', ''), '[', ''), ']', '') AS LanguagesLevel"
        },
        'ExpectedSalary',
        'InterviewTime',
        'InterviewPlace',
        'Status'
      ]
      let storage = LocalStorage.getItem('exportChoiceFields') || { resume: { choiced: [] } }
      if (this.selectedStatus === 'waitTest') {
        // 排到最前
        commonFields.unshift('ResumeDeliveryID')
        // 使简历ID默认选中
        if (!storage['resume'].choiced.includes('ResumeDeliveryID')) {
          storage['resume'].choiced.push('ResumeDeliveryID')
          LocalStorage.set('exportChoiceFields', storage)
        }
      } else {
        if (storage['resume'].choiced.includes('ResumeDeliveryID')) {
          storage['resume'].choiced = _.difference(storage['resume'].choiced, ['ResumeDeliveryID'])
          LocalStorage.set('exportChoiceFields', storage)
        }
      }
      return commonFields
    },
    selectedStatus () {
      return this.$store.state.resume.selectedStatus
    },
    search () {
      return this.$store.getters['resume/search']
    },
    query () {
      return this.$store.getters['resume/query']
    },
    // 当前查询条件
    condition () {
      let temp = []
      // 状态条件
      temp.push(this.$t('resume.status.' + this.selectedStatus))
      // 搜索条件
      if (this.search.length) {
        temp.push(this.search)
      }
      // 多选条件
      if (this.query.length) {
        temp.push(..._.map(this.query, 'label'))
      }
      return '当前条件：' + temp.join('，')
    },
    sheetName () {
      let name = this.$t('resume.status.' + this.$store.state.resume.selectedStatus)
      if (this.selectedStatus === 'waitTest') {
        if (this.waitTestOption === 'waitTest') {
          name = '待测评'
        } else if (this.waitTestOption === 'inTest') {
          name = '测评中'
        } else {
          name = '待测评 + 测评中'
        }
      }
      return name
    },
    fileName () {
      return '精雕招聘（' + this.sheetName + '）人员信息' + formatDate(new Date(), 'YYYY-MM-DD-HH-mm')
    }
  },
  methods: {
    goExport () {
      if (this.selectedStatus === 'waitTest') {
        switch (this.waitTestOption) {
          case 'both':
            this.exportQuery.push([
              { Key: 'Status', Value: 10, Oper: 'eq' },
              'or',
              { Key: 'Status', Value: 15, Oper: 'eq' }
            ])
            break
          case 'inTest':
            this.exportQuery.push({ Key: 'Status', Value: 15, Oper: 'eq' })
            break
          default:
            this.exportQuery.push({ Key: 'Status', Value: 10, Oper: 'eq' })
        }
        let statusArray = _.find(this.resumeViewQuerys.query, q => q.length > 0)
        this.exportQuery.push(..._.without(this.resumeViewQuerys.query, statusArray))
      } else {
        this.exportQuery = this.resumeViewQuerys.query
      }
      this.showExport = true
    }
  },
  components: {
    ExportExcel: () => import('components/export/ExportExcel')
  }
}

</script>

<style lang='scss' scoped>
</style>
