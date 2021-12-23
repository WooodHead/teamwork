import date from '@/utils/get-date.js'
export default {
  // 全局类型列表
  manufacturers: [],

  // 排序
  sort: 'CONVERT(OrganizeName USING gbk)',
  order: 'asc',
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  loadedAll: false,
  selectManufacturers: {}, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  listStyle: 'showcards',
  listPageType: 'myList',
  // 搜索
  search: '',
  query: [],
  queryList: [
    {
      label: '单位类型',
      value: [
        { label: '内部生产单位', value: 'internal', name: 'classification' },
        { label: '外协生产单位', value: 'outsource', name: 'classification' }
      ]
    },
    {
      label: '生产管控',
      value: [
        { label: '可管控', value: 1, name: 'canControl' },
        { label: '不可管控', value: 0, name: 'canControl' }
      ]
    },
    {
      label: '创建时间',
      value: [
        { label: '本周', value: date.getCurrWeekDays(), name: 'createTime' },
        { label: '上周', value: date.getLastWeekDays(), name: 'createTime' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'createTime' },
        { label: '上月', value: date.getLastMonthDays(), name: 'createTime' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'createTime' }
      ]
    }

  ]
}
