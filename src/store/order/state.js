import date from '@/utils/get-date.js'
export default {
  // 前端的订单数据
  orders: [],
  // 废纸篓中的订单数据
  ordersInTrash: [],
  // 是否分页
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 模糊查询
  search: '',
  query: [],
  queryList: [
    {
      label: '订单状态',
      value: [
        { label: '待生产', value: 100, name: 'status' },
        { label: '生产中', value: 101, name: 'status' },
        { label: '已生产', value: 102, name: 'status' },
        { label: '待发货', value: 200, name: 'status' },
        { label: '已发货', value: 202, name: 'status' },
        { label: '待结单', value: 600, name: 'status' },
        { label: '已结单', value: 602, name: 'status' }
      ]
    },
    {
      label: '创建时间',
      value: [
        { label: '本周', value: date.getCurrWeekDays(), name: 'createTime', labelPrefix: '创建时间:' },
        { label: '上周', value: date.getLastWeekDays(), name: 'createTime', labelPrefix: '创建时间:' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'createTime', labelPrefix: '创建时间:' },
        { label: '上月', value: date.getLastMonthDays(), name: 'createTime', labelPrefix: '创建时间:' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'createTime', labelPrefix: '创建时间:' },
        { label: '自定义', value: { from: '', to: '' }, name: 'createTime', labelPrefix: '创建时间:', custom: true }
      ]
    },
    {
      label: '预计交期',
      value: [
        { label: '本周', value: date.getCurrWeekDays(), name: 'expectedDeliveryDate', labelPrefix: '预计交期:' },
        { label: '上周', value: date.getLastWeekDays(), name: 'expectedDeliveryDate', labelPrefix: '预计交期:' },
        { label: '本月', value: date.getCurrMonthDays(), name: 'expectedDeliveryDate', labelPrefix: '预计交期:' },
        { label: '上月', value: date.getLastMonthDays(), name: 'expectedDeliveryDate', labelPrefix: '预计交期:' },
        { label: '本年度', value: date.getCurrYearDays(), name: 'expectedDeliveryDate', labelPrefix: '预计交期:' },
        { label: '自定义', value: { from: '', to: '' }, name: 'expectedDeliveryDate', labelPrefix: '预计交期:', custom: true }
      ]
    },
    {
      label: '客户类型',
      value: [
        { label: '高校', value: 4, name: 'customerType' },
        { label: '企业', value: 5, name: 'customerType' },
        { label: '科研院所', value: 6, name: 'customerType' },
        { label: '子公司', value: 3, name: 'customerType' },
        { label: '分公司', value: 2, name: 'customerType' },
        { label: '母公司', value: 1, name: 'customerType' }
      ]
    }
  ],
  // 排序
  sort: 'CreateTime',
  // 参与排序的对象列表
  sortOptions: [
    { label: '默认排序', value: 'CreateTime' },
    { label: '按编号排序', value: 'OrderNo' },
    { label: '按状态排序', value: 'Status' },
    { label: '按预计交期排序', value: 'ExpectedDeliveryDate' }
  ],
  selectOrders: {},
  loadedSelect: false,
  listPageType: 'allList',
  listStyle: 'showcards',
  archivedCount: 0,
  firstLoaded: true,
  status: {
    100: {
      id: 100,
      name: 100,
      color: 'indigo',
      title: '待生产',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    101: {
      id: 101,
      name: 101,
      color: 'indigo',
      title: '生产中',
      activeIcon: 'edit',
      doneIcon: 'edit'
    },
    102: {
      id: 102,
      name: 102,
      color: 'indigo',
      title: '已生产',
      activeIcon: 'check',
      doneIcon: 'check'
    },
    200: {
      id: 200,
      name: 200,
      color: 'accent',
      title: '待发货',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    202: {
      id: 202,
      name: 202,
      color: 'accent',
      title: '已发货',
      activeIcon: 'check',
      doneIcon: 'check'
    },
    600: {
      id: 600,
      name: 600,
      color: 'positive',
      title: '待结单',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    602: {
      id: 602,
      name: 602,
      color: 'positive',
      title: '已结单',
      activeIcon: 'check',
      doneIcon: 'check'
    }
  }
}
