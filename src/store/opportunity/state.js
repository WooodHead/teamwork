import date from '@/utils/get-date.js'
export default {
  // 全局类型列表
  opportunitys: [],
  // 废纸篓中的商机
  opportunitysInTrash: [],
  // 模糊查询
  search: '',
  query: [],
  queryList: [
    {
      label: '商机状态',
      value: [
        { label: '待认领', value: 100, name: 'status' },
        { label: '已认领', value: 102, name: 'status' },
        { label: '待评估', value: 200, name: 'status' },
        { label: '评估中', value: 201, name: 'status' },
        { label: '已评估', value: 202, name: 'status' },
        { label: '待报价', value: 300, name: 'status' },
        { label: '报价中', value: 301, name: 'status' },
        { label: '已报价', value: 302, name: 'status' },
        { label: '待下单', value: 600, name: 'status' },
        { label: '已下单', value: 602, name: 'status' },
        { label: '输单', value: 1, name: 'isLost' }
      ]
    },
    {
      label: '创建时间',
      value: [
        {
          label: '本周',
          value: date.getCurrWeekDays(),
          name: 'createTime',
          labelPrefix: '创建时间:'
        },
        {
          label: '上周',
          value: date.getLastWeekDays(),
          name: 'createTime',
          labelPrefix: '创建时间:'
        },
        {
          label: '本月',
          value: date.getCurrMonthDays(),
          name: 'createTime',
          labelPrefix: '创建时间:'
        },
        {
          label: '上月',
          value: date.getLastMonthDays(),
          name: 'createTime',
          labelPrefix: '创建时间:'
        },
        {
          label: '本年度',
          value: date.getCurrYearDays(),
          name: 'createTime',
          labelPrefix: '创建时间:'
        },
        {
          label: '自定义',
          value: { from: '', to: '' },
          name: 'createTime',
          labelPrefix: '创建时间:',
          custom: true
        }
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
    { label: '按名称排序', value: 'Title' },
    { label: '按类型排序', value: 'ProcessType' },
    { label: '按状态排序', value: 'Status' },
    { label: '按成交价排序', value: 'TransactionPrice' },
    { label: '按期望交期排序', value: 'ExpectedDeliveryDate' }
  ],
  selectOpportunitys: {}, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  listPageType: 'allList',
  listStyle: 'showcards',
  // 是否是归档列表
  isArchivedList: false,
  archivedCount: 0,
  firstLoaded: true,
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  loadedAll: false,
  status: {
    100: {
      id: 100,
      name: 100,
      color: 'auxiliary4',
      title: '待认领',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    102: {
      id: 102,
      name: 102,
      color: 'auxiliary4',
      title: '已认领',
      activeIcon: 'check',
      doneIcon: 'check'
    },
    200: {
      id: 200,
      name: 200,
      color: 'auxiliary1',
      title: '待评估',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    201: {
      id: 201,
      name: 201,
      color: 'auxiliary1',
      title: '评估中',
      activeIcon: 'edit',
      doneIcon: 'edit'
    },
    202: {
      id: 202,
      name: 202,
      color: 'auxiliary1',
      title: '已评估',
      activeIcon: 'check',
      doneIcon: 'check'
    },
    300: {
      id: 300,
      name: 300,
      color: 'auxiliary5',
      title: '待报价',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    301: {
      id: 301,
      name: 301,
      color: 'auxiliary3',
      title: '报价中',
      activeIcon: 'edit',
      doneIcon: 'edit'
    },
    302: {
      id: 302,
      name: 302,
      color: 'auxiliary3',
      title: '已报价',
      activeIcon: 'check',
      doneIcon: 'check'
    },
    600: {
      id: 600,
      name: 600,
      color: 'auxiliary5',
      title: '待下单',
      icon: 'assignment',
      activeIcon: 'assignment',
      doneIcon: 'assignment',
      doneColor: 'grey'
    },
    602: {
      id: 602,
      name: 602,
      color: 'auxiliary5',
      title: '已下单',
      activeIcon: 'check',
      doneIcon: 'check'
    }
  },
  statusFlow: [100, 200, 300, 600]
}
