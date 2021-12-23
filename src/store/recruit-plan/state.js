export default function () {
  return {
    // 招聘计划列表
    recruitPlans: [],
    // 列表样式
    listStyle: 'showcards',
    // 页面类型 myList/allList
    listPageType: 'myList',
    // 模糊查询
    search: '',
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    },
    // 未开始、进行中、已结束状态色设定
    closedStatus: {
      0: { color: 'info', label: '未开始' },
      1: { color: 'positive', label: '进行中' },
      2: { color: 'blue-grey-4', label: '已结束' }
    },
    // 归档公告数量
    archiveCount: 0,
    // 是否是归档列表
    isArchivedList: false
  }
}
