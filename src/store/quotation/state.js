export default {
  // 全局类型列表
  quotations: [],

  // 搜索
  search: '',
  // 排序
  sort: '',
  // 参与排序的对象列表
  sortOptions: [

  ],
  loadedAll: false,
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  partsPicTag: 'OPPORTUNITY_QUOTATION_PARTS', // 商机报价零件图
  quotationBillsTag: 'OPPORTUNITY_QUOTATION_BILLS' // 商机报价单
}
