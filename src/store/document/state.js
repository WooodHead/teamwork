export default {
  // 虚拟文件夹
  documentList: [
    {
      id: 0,
      classify: 'folder',
      title: '文档中心',
      parentId: -1,
      level: 0,
      path: '0',
      objectType: 'document',
      objectID: 0,
      isPublish: 1,
      tag: 'RESOURCE_FOLDER',
      children: [],
      orderNumber: 0,
      acl: 0
    },
    {
      id: -2,
      classify: 'folder',
      title: '精益改进报告',
      parentId: 0,
      level: 2,
      path: '-2',
      objectType: 'document',
      objectID: 0,
      isPublish: 1,
      tag: 'LEAN_QUALITY',
      children: [],
      orderNumber: 1,
      acl: 0
    },
    {
      id: -3,
      classify: 'folder',
      title: '精益改进报告',
      parentId: 102, // 西安研发中心
      level: 3,
      path: '1,102,-3',
      objectType: 'organize',
      objectID: 18,
      isPublish: 1,
      tag: 'LEAN_QUALITY',
      children: [],
      orderNumber: 2,
      acl: 0
    }
  ],
  emptyFolder: {},
  sort: 'IsPublish asc,OrderNumber',
  order: 'desc',
  search: '',
  // search: {},
  byPage: true, // 是否分页
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  archivedCount: {},
  tag: {
    resourceFolder: 'RESOURCE_FOLDER',
    systemCreate: 'SYSTEM_CREATE',
    leanQuality: 'LEAN_QUALITY'
  },
  // 废纸篓中的文档
  documentsInTrash: [],
  listType: 'card', // card,table,mindMap,list
  arrMarkDown: [],
  treeList: []
  // archivedCount: { 10: { id: 10, count: 5 }...}
}
