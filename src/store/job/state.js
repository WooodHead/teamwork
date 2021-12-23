export default function () {
  return {
    // 岗位列表
    jobs: [],
    // 岗位类别
    category: '',
    // 列表样式
    listStyle: 'showcards',
    // 草稿公告数量
    draftCount: 0,
    // 归档公告数量
    archiveCount: 0,
    // 是否是草稿列表
    isDraftList: false,
    // 是否是归档列表
    isArchivedList: false,
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 50,
      nextPageToken: 0
    },
    search: '',
    jobKind: {
      0: { kind: 0, label: '校招' },
      1: { kind: 1, label: '社招' }
    },
    jobStatus: {
      0: { kind: 0, label: '正常招聘', color: 'positive' },
      1: { kind: 1, label: '招满停招', color: 'blue-grey-4' }
    }
  }
}
