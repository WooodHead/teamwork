export default {
  // 前台数据
  activitys: [],
  objectID: 1,
  objectType: 'project',
  // 是否分页
  search: '',
  byPage: true,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  isCache: {}, // 是否从缓存读数据. ture 从缓存读取; false从后台DB读取
  deletedActivitys: [], // 记录已删除的动态
  stateStorage: {} // 本地临时缓存动态数据池
}
