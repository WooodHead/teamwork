export default {
  feedbacks: [],
  feedback: {},
  search: '',
  sortOptions: [
    { label: '标题', value: 'Title' }
  ],
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 排序
  sort: 'createTime',
  firstUpdateMessage: true, // 第一条type=upate消息
  closeRoom: false, // 是否关闭聊天室
  messageContent: [], // 当前聊天室内容
  adminMessageId: 0, // 管理员当前消息id
  feedbackId: 0, // 当前消息id
  feedbackState: 0, // 当前消息状态
  adminEndChat: '', // 谁结束了聊天
  customerEndChat: 'admin',
  endChat: false,
  feedbacksByProvider: [],
  assignId: 0,
  isVisible: false, // 反馈聊天窗口隐藏与否
  roomState: false, // 反馈聊天的聊天室打开与否
  messageState: false, // 历史反馈列表页打开与否
  adminChoose: 'unassignedFeedback', // 管理员端列表页选择的项
  unassignedFeedbackIndex: 0,
  myFeedbackIndex: 0,
  myAssignedFeedbackIndex: 0,
  allFeedbackIndex: 0,
  chatImageId: 0, // 动态数据头像id
  newChat: false, // 历史反馈详情页打开与否
  newChatId: 0, // 历史消息追加弹框时传递新消息id
  showMessage: false, // 打开历史反馈列表
  loadFromBackground: false, // 是否从后台加载
  adminFeedbackId: 0// 管理员端消息详情页ID
}
