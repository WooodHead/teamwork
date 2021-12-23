export default {
  products: [],
  productDetails: [],
  // 是否已加载首页快捷链接
  quickLinksLoaded: false,
  // 是否正在选型
  inSelection: false,
  // 匹配机床
  productMatchs: [],
  // 反向校验
  checkAccessoryIds: [],
  productCheck: [],
  // 是否展示产品树或工艺表单
  showProductTree: false,
  showWorkPiece: false,
  // 是否分页
  byPage: false,
  page: {
    offset: 0,
    limit: 10,
    nextPageToken: 0
  },
  // 模糊查询
  search: '',
  // 排序
  sort: 'name',
  // 预设字段顺序
  arrClassification: ['machinetool', 'spindle', 'toolmagazine', 'measure', 'accessory', 'automation', 'software', 'sample'],
  arrTplCode: ['FiveAxis', 'ThreeAxis', 'Spindle', 'ToolMagazine', 'DustCollector',
    'ChipRemovalFilterSystem', 'CuttingFluidFiltrationSystem', 'HollowWaterFiltrationSystem',
    'MicroscaleOilMistLubrication', 'OilMistCollector', 'CentralizedRefrigerationSystem',
    'Refrigerator', 'LaserToolAligner', 'TouchingProbe', 'TouchingToolAligner',
    'ZeroPointChangeClampingSystem', 'AutomaticFeedingSystemOther'],
  // 分类
  classifications: [
    { name: 'machinetool', icon: '/icons/product/机床产品.png', color: 'primary', leafLevel: 4 },
    { name: 'spindle', icon: '/icons/product/电主轴.png', color: 'primary', leafLevel: 3 },
    { name: 'toolmagazine', icon: '/icons/product/刀库.png', color: 'primary', leafLevel: 3 },
    { name: 'measure', icon: '/icons/product/在机检测.png', color: 'primary', leafLevel: 3 },
    { name: 'accessory', icon: '/icons/product/附件产品.png', color: 'primary', leafLevel: 4 },
    { name: 'automation', icon: '/icons/product/自动化产品.png', color: 'primary', leafLevel: 4 },
    { name: 'software', icon: '/icons/product/软件.png', color: 'primary', leafLevel: 3 },
    { name: 'usecase', icon: '/icons/product/选型案例库.png', color: 'primary', leafLevel: 1 },
    { name: 'sample', icon: '/icons/product/样品.png', color: 'primary', leafLevel: 4 }
  ],
  fields: {
    id: 0,
    parentId: 0,
    level: 0,
    path: '',
    classification: '', // 产品系列【机床产品、附件产品、软件产品等】
    title: '',
    notes: '', // 备注，可以是机床特点等
    brand: '精雕',
    specModel: '',
    materialCode: '',
    configType: 1, // 0选配；1标配；2定制
    maturity: 2, // 默认是成熟产品
    tplCode: '',
    imgUrl: '',
    params: {}, // 由level、tplCode决定结构
    customParams: {}, // 自定义参数
    isPublish: 0, // 【草稿、已发布】默认已发布
    orderNo: 0,
    history: []
  },
  currentProductClassification: 'machinetool',
  productTree: {
    machinetool: [],
    spindle: [],
    toolmagazine: [],
    measure: [],
    accessory: [],
    automation: [],
    software: [],
    sample: []
  }
}
