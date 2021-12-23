export default function () {
  return {
    // 面试官列表
    interviewers: [],
    // 列表样式
    listStyle: 'showcards',
    // 模糊查询
    search: '',
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    }
  }
}
