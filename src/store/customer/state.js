import date from '@/utils/get-date.js'
export default {
  // 全局类型列表
  customers: [],
  // 废纸篓中的客户
  customersInTrash: [],
  // 搜索
  search: '',
  // 排序
  sort: 'CreateTime',
  // 参与排序的对象列表
  sortOptions: [
    { label: '默认排序', value: 'CreateTime' },
    { label: '按名称排序', value: 'CustomerName' },
    { label: '按类型排序', value: 'CustomerType' },
    { label: '按等级排序', value: 'Grade' }
  ],
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  loadedAll: false,
  selectCustomers: {}, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  listStyle: 'showcards',
  listPageType: 'allList',
  // 客户等级
  grade: {
    'A': { name: '重要', color: 'positive' },
    'B': { name: '中等', color: 'secondary' },
    'C': { name: '一般', color: 'primary' }
  },
  // 模糊查询
  query: [],
  queryList: [
    {
      label: '创建时间',
      value: [
        { label: '本周', value: date.getCurrWeekDays(), name: 'createTime' },
        { label: '上周', value: date.getLastWeekDays(), name: 'createTime' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'createTime' },
        { label: '上月', value: date.getLastMonthDays(), name: 'createTime' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'createTime' },
        { label: '自定义', value: { from: '', to: '' }, name: 'createTime', labelPrefix: '创建时间:', custom: true }
      ]
    },
    {
      label: '客户类型',
      value: [
        { label: '科研院所', value: 6, name: 'customerType' },
        { label: '企业', value: 5, name: 'customerType' },
        { label: '高校', value: 4, name: 'customerType' },
        { label: '子公司', value: 3, name: 'customerType' },
        { label: '分公司', value: 2, name: 'customerType' },
        { label: '母公司', value: 1, name: 'customerType' }
      ]
    },
    {
      label: '客户等级',
      value: [
        { label: '重要', value: 'A', name: 'grade' },
        { label: '中等', value: 'B', name: 'grade' },
        { label: '一般', value: 'C', name: 'grade' }
      ]
    },
    {
      label: '行业',
      value: [
        { label: '医疗器械', value: 1, name: 'applyIndustry' },
        { label: '特种行业', value: 2, name: 'applyIndustry' },
        { label: '消费电子', value: 3, name: 'applyIndustry' },
        { label: '机器人', value: 4, name: 'applyIndustry' },
        { label: '仪器仪表', value: 5, name: 'applyIndustry' },
        { label: '汽车', value: 6, name: 'applyIndustry' },
        { label: '模具工具', value: 7, name: 'applyIndustry' },
        { label: '无人机', value: 8, name: 'applyIndustry' },
        { label: '生物医学', value: 9, name: 'applyIndustry' },
        { label: '电子信息', value: 10, name: 'applyIndustry' },
        { label: '机械装备及制造', value: 11, name: 'applyIndustry' },
        { label: '文化创意', value: 12, name: 'applyIndustry' },
        { label: '机械装备及制造', value: 13, name: 'applyIndustry' },
        { label: '新能源', value: 14, name: 'applyIndustry' }
      ]
    },
    {
      label: '来源',
      value: [
        { label: '内部', value: 0, name: 'infoSource' },
        { label: '展会', value: 1, name: 'infoSource' },
        { label: '朋友介绍', value: 2, name: 'infoSource' }
      ]
    }
  ]
}
