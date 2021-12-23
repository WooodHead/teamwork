import date from '@/utils/get-date.js'
export default {
  allTeams: [], // 供在通讯录里面显示所有团队
  listTeams: [],
  teams: [],
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 模糊查询
  search: '',
  query: [],
  // 其中的field与字典表中的field保持一致
  queryList: [
    {
      label: '创建时间',
      field: 'CreateTime',
      value: [
        { label: '今天', value: date.getToday(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '昨天', value: date.getYesterday(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '本周', value: date.getCurrWeekDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '上周', value: date.getLastWeekDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '上月', value: date.getLastMonthDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '上一季度', value: date.getLastSeasonDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '本季度', value: date.getCurrSeasonDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'CreateTime', labelSuffix: '创建' },
        { label: '上一年度', value: date.getLastYearDays(), name: 'CreateTime', labelSuffix: '创建' }
      ]
    },
    {
      label: '团队类型',
      field: 'Type',
      value: []
    }
  ],
  // 排序
  sort: 'myFocus',
  archivedCount: 0, // 已归档数量
  listStyle: 'showcards',
  selectTeams: { all: [] }, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  teamsInTrash: []// 我的废纸篓
}
