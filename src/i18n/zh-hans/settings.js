export default {
  module: '系统设置',
  title: '系统设置',
  mySettings: '偏好设置',
  // 仪表盘设置
  dashboard: {
    name: '仪表盘设置',
    pageTitle: '{name}仪表盘设置'
  },
  // 职级查看权限设置
  position: {
    name: '职级设置',
    pageTitle: '职级查看权限设置',
    allowedRange: '允许查看职级的机构'
  },
  // 默认问题设置
  defaultQuestion: {
    addLabel: '问题',
    confirmDelete: '确定要删除该问题吗',
    name: '默认问题设置',
    titleRepeat: '问题已存在',
    pageTitle: '{name}的默认问题设置',
    noDefault: '{name}模块还未设置默认的问题，请添加',
    addQuestion: '添加{name}模块默认问题设置',
    questionCard: {
      header: {
        title: '{Cron}{time}发出提问。',
        cron: {
          firstweek: '每月第一周的{days}',
          lastweek: '每月最后一周的{days}',
          day: '每月{days}日',
          lastday: '每月的最后一天'
        },
        day: '每天',
        week: '每周的{days}',
        month: '每月的{days}日'
      }
    }
  },
  // 研发体系设置
  devSystem: {
    name: '研发体系设置',
    pageTitle: '研发体系设置',
    excludeOrgs: '非研发体系下的机构',
    excludeDutys: '非研发体系下的职位',
    selectExcludeDutys: '请选择职位'
  },
  editorTemplate: '富文本框模板设置',
  tag: '标签设置',
  contacts: '通讯录设置',
  orgNo: '机构编号设置',
  more: '更多',
  help: '帮助',
  visitOurWebsite: '访问我们的网站',
  emailUs: '邮件联系我们',
  pleaseChangePassword: '在此处修改您的密码',
  changePassword: '修改密码',
  // 工具包
  widget: {
    name: '设置模块工具包',
    pageTitle: '{name}的工具包',
    noDefault: '{name}模块还未设置默认的工具包，请添加',
    addWidget: '添加{name}模块工具包',
    addOther: '添加工具包',
    removeWidget: '删除{name}'
  },
  uploadPhoto: '上传照片',
  notificationsOff: '通知已关闭',
  notificationsOn: '通知已打开',
  buttonChangeSetting: '更改你的设置',
  linkChangeSetting: '更改你的通知设置',
  turnNotification: '打开通知',
  offNotification: '关闭通知',
  personalSetting: '个人设置',
  personalProfile: '个人资料（头像、邮箱等）',
  personalSettings: '偏好设置（{productDev}、{project}、{team}等）',
  personalSettingsTitle: '我的偏好设置',
  dataViewSetting: '数据视图设置',
  dataViewSettingNote: '设置我喜欢的数据视图',
  workCanWait: '通知设置',
  whatToNotify: '允许通知的消息类型',
  howToNotify: '通知方式',
  whenToNotify: '通知时间',
  notifyEverything: '任意类型',
  notifyEverythingDescription: '包括新的消息和评论，分配给你的待办事项，当有人提到你时，以及聊天等。',
  notifyChooseType: '自定义类型',
  notifyChooseTypeDescription: '选择允许通知的消息类型',
  notifyOnlyPings: '仅私聊、群组聊天或者@消息',
  notifyOnlyPingsDescription: 'Teamwork只会在有人向你发送聊天消息或@提到你的时候给你发送通知。你可以随时检查系统通知和Teamwork菜单手动查看最新通知。',
  notifyEmail: '接收电子邮件通知',
  notifyEmailDescription: '注意：为了防止收件箱爆满，Teamwork会将发生在几分钟内的通知捆绑在一起。如果你在操作Teamwork并且保持活跃，你不会收到电子邮件。',
  notifyPopup: '当Teamwork打开时，在我的电脑上弹出通知',
  notifyPopupDisabledDescription: '⚠️ 你的浏览器禁用了弹出式通知。更改您的浏览器设置以允许它们。',
  notifyPopupEnabledDescription: '注意：为了防止你被过度通知，如果你正盯着某条消息、待办事项或聊天，你不会收到弹出提醒。',
  notifyWechat: '微信通知',
  notifyWechatDescription: '当您入驻企业微信后，系统会通过企业微信发送消息。',
  notifyAnytime: '任意时间',
  notifyWorkhours: '仅在工作时间',
  passWord: '密码',
  confirmPassWord: '确认密码',
  changeTheme: '更换主题颜色',
  changeThemeDescription: '添加一些色彩，或者让它柔和一点:',
  changeTimezone: '切换时区',
  changeTimezoneDescription: 'Teamwork使用您的时区设置来处理您的邮件通知，事件提醒，',
  yourProfile: '个人信息',
  and: '，和',
  yourNotificationSettings: '通知设置',
  firstDayOfWeek: '一周的第一天',
  firstDayOfWeekDescription: 'Teamwork在展示日历时使用。',
  sententceEnd: '。',
  saveMyChanges: '保存我的设置',
  settingSucceed: '设置成功',
  weekOptions: [
    {
      value: 'sun',
      label: '星期日'
    },
    {
      value: 'mon',
      label: '星期一'
    },
    {
      value: 'tue',
      label: '星期二'
    },
    {
      value: 'wed',
      label: '星期三'
    },
    {
      value: 'thu',
      label: '星期四'
    },
    {
      value: 'fri',
      label: '星期五'
    },
    {
      value: 'sat',
      label: '星期六'
    }
  ],
  offNotificationDescription: '您已禁用所有Teamwork通知。除非您同意，否则我们不会向您发送任何通知。',
  noLegalWayDescription: '您已经关闭了浏览器和电子邮件通知。单击下面的按钮调整您的设置。',
  allowTodayDescription: '您已设置{when}接收{what}的{how}通知',
  notAllowTodayDescription: '通知已关闭，因为您设置只在{when}接收通知。',
  allTheTimeDescription: '任何时间',
  betweenTimeDescription: '从 {start} 到 {end}，{days}',
  everythingToNotifyDescription: '任意类型',
  customeToNotifyDescription: '自定义类型',
  pingsToNotifyDescription: '弹窗和聊天',
  emailAndBrowserDescription: '邮件和浏览器',
  emailDescription: '邮件',
  browserDescription: '浏览器'
}
