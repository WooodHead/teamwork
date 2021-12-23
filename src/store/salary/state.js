import { date } from 'quasar'
import { i18n } from '@/boot/i18n'
export default {
  salaryModel: {},
  adminSalaryModel: {},
  salarys: [],
  adminSalarys: [],
  adminSecurityCode: {},
  staffSalarys: [],
  allSalaryDateAndType: [],
  currentDateAndType: {},
  salaryCountAndStatus: {},
  salaryFilterStatus: {},
  // 工资条上传条数
  importProgress: 0,
  page: {}, // offset: 0,limit: 20,nextPageToken: 0
  byPage: true,
  // 排序
  sort: 'myFocus',
  // 搜索
  search: '',
  // 排序方向：正序asc、倒序desc，默认倒序
  order: 'desc',
  salaryTypes: [
    { label: i18n.t('salary.salaryType.salary'), value: 'salary' },
    { label: i18n.t('salary.salaryType.reward'), value: 'reward' },
    { label: i18n.t('salary.salaryType.subsidy'), value: 'subsidy' },
    { label: i18n.t('salary.salaryType.reimburse'), value: 'reimburse' },
    { label: i18n.t('salary.salaryType.resalary'), value: 'resalary' }
  ],
  salaryYear: [
    { label: `${+date.formatDate(Date.now(), 'YYYY') + 1}年`, value: +date.formatDate(Date.now(), 'YYYY') + 1 },
    { label: `${+date.formatDate(Date.now(), 'YYYY')}年`, value: +date.formatDate(Date.now(), 'YYYY') },
    { label: `${+date.formatDate(Date.now(), 'YYYY') - 1}年`, value: +date.formatDate(Date.now(), 'YYYY') - 1 },
    { label: `${+date.formatDate(Date.now(), 'YYYY') - 2}年`, value: +date.formatDate(Date.now(), 'YYYY') - 2 },
    { label: `${+date.formatDate(Date.now(), 'YYYY') - 3}年`, value: +date.formatDate(Date.now(), 'YYYY') - 3 }
  ],
  salaryMonth: [
    { label: '1月', value: 1 },
    { label: '2月', value: 2 },
    { label: '3月', value: 3 },
    { label: '4月', value: 4 },
    { label: '5月', value: 5 },
    { label: '6月', value: 6 },
    { label: '7月', value: 7 },
    { label: '8月', value: 8 },
    { label: '9月', value: 9 },
    { label: '10月', value: 10 },
    { label: '11月', value: 11 },
    { label: '12月', value: 12 }
  ],
  isReSend: false
}
