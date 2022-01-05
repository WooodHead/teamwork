import date from '@/utils/get-date.js'
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
    ObjectType: 'customer',
    ObjectID: 0,
    addingEvent: false,
    filterType: '',
    firstLoaded: true,
    // 卡片/列表视图
    listType: 'card',
    sort: 'followupDate',
    contactForm: [
      { label: '电话', val: '电话', iconName: 'smartphone', iconColor: 'primary' },
      { label: '邮件', val: '邮件', iconName: 'mail_outline', iconColor: 'orange' },
      { label: '面谈', val: '面谈', iconName: 'supervisor_account', iconColor: 'accent' },
      { label: '视频会议', val: '视频会议', iconName: 'videoMeeting', iconColor: 'positive' },
      { label: '其他', val: '其他', iconName: 'call_missed_outgoing', iconColor: 'secondary' }
    ],
    // 模糊查询
    search: '',
    query: [],
    queryList: [
      {
        label: '跟进时间',
        value: [
          { label: '本周', value: date.getCurrWeekDays(), name: 'createTime' },
          { label: '上周', value: date.getLastWeekDays(), name: 'createTime' },
          { label: '本月', value: date.getCurrMonthDays(), name: 'createTime' },
          { label: '上月', value: date.getLastMonthDays(), name: 'createTime' },
          { label: '本年度', value: date.getCurrYearDays(), name: 'createTime' },
          { label: '自定义', value: { from: '', to: '' }, name: 'createTime', labelPrefix: '跟进时间:', custom: true }
        ]
      },
      {
        label: '跟进方式',
        value: [
          { label: '电话', value: '电话', name: 'contactForm' },
          { label: '邮件', value: '邮件', name: 'contactForm' },
          { label: '面谈', value: '面谈', name: 'contactForm' },
          { label: '视频会议', value: '视频会议', name: 'contactForm' },
          { label: '其他', value: '其他', name: 'contactForm' }
        ]
      }
    ]
  }
}
