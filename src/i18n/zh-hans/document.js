export default {
  module: '文档库',
  title: '文档',
  notes: '创建文档，上传文件、图片、视频等，灵活的组织文件夹，以便轻松查找。',
  center: '文档中心',
  blank: '该文件夹是空的，在这里就像电脑里的文件夹那样组织各类文档，你可以编写在线文档、上传文件或者添加各种链接等。',
  warning: {
    hasChildrenDocument: '这里面还有文档，确定要删除吗？'
  },
  error: {},
  action: {
    add: {
      Folder: '新建文件夹',
      Doc: '编写文档',
      Upload: '上传文件',
      LinkDoc: '新建链接',
      Markmap: '新建思维导图'
    },
    upload: '上传',
    download: '下载',
    openLink: '打开链接'
  },
  sortBy: {
    UnSorted: '默认排序',
    Title: '按标题排序',
    DueDate: '按日期排序',
    AuthorName: '按创建者排序',
    Size: '按大小排序'
  },
  field: {
    label: {
      title: '标题',
      notes: '说明'
    },
    placeholder: {
      title: '请输入标题',
      filePath: '示例：https://server.example.com/path/to/resource…',
      notes: '在这里输入更多...'
    },
    hint: {
      title: '按下Enter键确认...'
    },
    rule: {
      title: '标题必填',
      filePath: '链接必填'
    }
  },
  modify: {
    lastUpdated: ' 上一次更新于 ',
    lastEdited: '上次编辑于 {dateTime} ',
    postedBy: '由 {modifyBy} 更新'
  },
  routerNotes: {
    addLink: '新建链接文档',
    editLink: '编辑链接',
    copy: '复制',
    move: '移动',
    addDoc: '新建文件夹',
    addMarkMap: '新建思维导图',
    editMarkMap: '编辑思维导图',
    fullMarkMap: '思维导图',
    folderCopy: '复制文件夹',
    archivedDocuments: '归档',
    draftDocuments: '草稿文件',
    fileCopy: '复制文件',
    fileMove: '移动文件',
    fileDetail: '文件详情页',
    edit: '编辑',
    detail: '详情页',
    send: '发送'
  },
  editDraft: {
    notes: '这个草稿上一次更新于{modifyTime}。您可以',
    clickShare: '分享链接',
    or: '或者',
    continueEdit: '继续编辑',
    postSave: '直接发布',
    backDraftsList: '先看看，暂不编辑'
  },
  shareDraft: {
    notesTitle: '分享您的草稿链接',
    notesContent: '您可以把这个链接分享给任何人'
  },
  folder: '文件夹',
  download: '文件下载',
  downloadArea: '下载专区',
  guobiao: '国标库',
  fitsize: '适配显示',
  fullscreen: '全屏显示',
  fullscreen_exit: '退出全屏',
  pickColor: '设置我的配色',
  meEdit: '仅自己可编辑',
  meDownload: '别人可下载',
  everyoneCanEdit: '所有人可编辑',
  cannotDownload: '不可下载',
  authoritySet: '权限设置',
  titleDropDown: {
    card: '卡片视图',
    list: '列表视图',
    mindMap: '思维导图视图'
  },
  manage: '管理',
  version: '历史版本',
  versionTitle: '点击可以查看更多历史版本~',
  currentVersion: '当前版本',
  noVersion: '暂无历史版本~'
}
