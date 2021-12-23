/**
 * 系统公告 vuex state
 */
export default function () {
  return {
    // 公告列表
    notices: [],
    // 草稿公告数量
    draftCount: 0,
    // 归档公告数量
    archiveCount: 0,
    // 类别过滤
    type: '',
    // 模糊查询
    search: '',
    // 排序
    sort: 'modifyTime',
    // 参与排序的对象列表
    sortOptions: [
      { label: '标题', value: 'title' }
    ],
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    },
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
    },
    // 废纸篓中的公告
    noticesInTrash: []
  }
}
