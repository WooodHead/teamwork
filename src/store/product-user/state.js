export default {
  listProductUsers: [],
  productUsers: [],
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
  // 排序
  sort: 'myFocus',
  // 排序方向：正序asc、倒序desc，默认倒序
  order: 'desc',
  loadedSelect: false,
  selectProductUsers: { all: [] } 
}
