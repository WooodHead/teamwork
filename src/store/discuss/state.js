export default {
  comments: [],
  objectID: 0,
  objectType: '',
  loaded: {}, // 记录哪些资源的数据已经被获取
  // 是否分页
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  }
}
