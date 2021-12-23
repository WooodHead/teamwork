import date from '@/utils/get-date.js'
import { i18n } from '@/boot/i18n'
export default {
  listProductDevs: [],
  productDevs: [],
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 不同进度状态对应的进度操作菜单
  progressMenus: {
    wait: ['start'],
    doing: ['start', 'suspended', 'done'],
    putoff: ['start', 'suspended', 'done'],
    suspended: ['start', 'activate', 'done'],
    done: ['start', 'done']
  },
  // 模糊查询
  search: '',
  query: [],
  // 其中的field与字典表中的field保持一致

  queryList: [
    {
      label: i18n.t('productDev.title') + '状态',
      field: 'Status',
      value: [
        { label: '未开始', value: 'wait', name: 'Status' },
        { label: '进行中', value: 'doing', name: 'Status' },
        { label: '已挂起', value: 'suspended', name: 'Status' },
        { label: '已延期', value: 'putoff', name: 'Status' },
        { label: '已结项', value: 'done', name: 'Status' }
      ]
    },
    {
      label: i18n.t('productDev.title') + '类型',
      field: 'Type',
      value: []
    },
    {
      label: '立项日期',
      field: 'BeginDate',
      value: [
        { label: '今天', value: date.getToday(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '昨天', value: date.getYesterday(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '本周', value: date.getCurrWeekDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '上周', value: date.getLastWeekDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '上月', value: date.getLastMonthDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '上一季度', value: date.getLastSeasonDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '本季度', value: date.getCurrSeasonDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'BeginDate', labelSuffix: '立项' },
        { label: '上一年度', value: date.getLastYearDays(), name: 'BeginDate', labelSuffix: '立项' }
      ]
    },
    {
      label: '结项日期',
      field: 'EndDate',
      value: [
        { label: '今天', value: date.getToday(), name: 'EndDate', labelSuffix: '结项' },
        { label: '昨天', value: date.getYesterday(), name: 'EndDate', labelSuffix: '结项' },
        { label: '本周', value: date.getCurrWeekDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '上周', value: date.getLastWeekDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '上月', value: date.getLastMonthDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '上一季度', value: date.getLastSeasonDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '本季度', value: date.getCurrSeasonDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'EndDate', labelSuffix: '结项' },
        { label: '上一年度', value: date.getLastYearDays(), name: 'EndDate', labelSuffix: '结项' }
      ]
    }
  ],
  // 排序
  sort: 'myFocus',
  // 排序方向：正序asc、倒序desc，默认倒序
  order: 'desc',
  archivedCount: 0, // 已归档数量
  listStyle: 'showcards',
  selectProductDevs: { all: [] }, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  productDevsInTrash: [] // 废纸篓中的产品研发
}
