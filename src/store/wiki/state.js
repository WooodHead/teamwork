export default {
  wikis: [],
  listWikis: [],
  selectWikis: { all: [] }, // 包含all，存储后台返回的原始数组，排序和后台一致
  inMembers: {}, // 是否是某个知识空间的成员，形如：wikiid:true
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 模糊查询
  search: '',
  // 排序
  sort: '',
  order: 'desc',
  archivedCount: 0, // 已归档数量
  listStyle: 'showcards',
  loadedSelect: false,
  wikisInTrash: [], // 我的废纸篓
  allWikiCoverPictures: [
    // 封面
    {
      name: '规章制度',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_1.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '文化建设',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_2.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '产品研发',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_3.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '市场营销',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_4.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '项目管理',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_5.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '学习交流',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_6.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '企业资料',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_7.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '客户服务',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_8.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '精益生产',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_9.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '关键技术',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_10.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '其他1',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_11.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '其他2',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_12.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '其他3',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_13.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '其他4',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_14.PNG',
      intensity: 'text-grey-9'
    },
    {
      name: '其他5',
      type: 'color',
      path: '/icons/wiki-cover-picture/picture_15.PNG',
      intensity: 'text-grey-9'
    }
  ]
}
