
export default {
  // 客户端消息列表
  messages: [],
  // 客户端文件消息列表
  fileMessages: [],
  // 是否分页
  byPage: true,
  // 分页对象定义
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 是否分页
  byFilesPage: true,
  // 文件分页对象定义
  filesPage: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  }
}
