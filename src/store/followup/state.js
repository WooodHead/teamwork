export default function () {
  return {
    // 跟进列表
    followups: [],
    // 是否分页
    byPage: true,
    page: {
      offset: 0,
      limit: 3,
      nextPageToken: 0
    },
    // 模糊查询
    search: '',
    ObjectType: 'customer',
    ObjectID: 0,
    addingEvent: false,
    filterType: '',
    // 列表/卡片视图
    view: 'list',
    contactForm: [
      { label: '电话', val: '电话', iconName: 'smartphone', iconColor: 'primary' },
      { label: '邮件', val: '邮件', iconName: 'mail_outline', iconColor: 'orange' },
      { label: '面谈', val: '面谈', iconName: 'supervisor_account', iconColor: 'accent' },
      { label: '视频会议', val: '视频会议', iconName: 'videoMeeting', iconColor: 'primary' },
      { label: '其他', val: '其他', iconName: 'call_missed_outgoing', iconColor: 'secondary' }
    ]
  }
}
