
export default {
  allocations: [],
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  allCount: 0,
  archivedCount: 0,
  search: '',
  sort: 'Title',
  sortOptions: [
    { label: '标题', value: 'Title' }
  ],
  selectAllocations: {},
  loadedSelect: false,
  // 待生产、生产中、待检验、已检验、已发货状态色设定
  statusList: [
    {
      label: '待生产',
      color: 'info'
    },
    {
      label: '生产中',
      color: 'positive'
    },
    {
      label: '待检验',
      color: 'secondary'
    },
    {
      label: '检验中',
      color: 'positive'
    },
    {
      label: '已检验',
      color: 'warning'
    },
    {
      label: '已发货',
      color: 'primary'
    },
    {
      label: '已完成',
      color: 'primary'
    }
  ]
}
// 订单生产任务状态：
// 待生产、生产中、待检验、已检验、已发货
