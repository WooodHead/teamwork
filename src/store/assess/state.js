
export default {
  // 前端的订单数据
  allAssess: [],
  // 是否分页
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  archivedCount: 0,
  // 模糊查询
  search: '',
  // 排序
  sort: 'OrderNo',
  // 评估列表类别
  s_category: undefined,
  s_objectID: 0,
  // 参与排序的对象列表
  sortOptions: [
    { label: '订单编号', value: 'OrderNo' },
    { label: '订单状态', value: 'Status' },
    { label: '预计交期', value: 'ExpectedDeliveryDate' }
  ],
  selectAssess: {},
  loadedSelect: false,
  listPageType: 'myList',
  listStyle: 'showcards',
  firstLoaded: true,
  // 是否是归档列表
  isArchivedList: false,
  // 拖动组件配置
  dragOptions: {
    direction: 'vertical',
    animation: 300,
    delay: 100,
    scroll: true,
    scrollSensitivity: '500',
    // 输入组件不可拖拽
    filter: 'input, textarea',
    // 不禁止原生事件
    preventOnFilter: false,
    // 样式
    ghostClass: 'ghost',
    chosenClass: 'chosen'
  }
}
