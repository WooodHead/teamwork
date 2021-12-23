
import { i18n } from '@/boot/i18n'
export default {
  messages: [],
  readPage: {
    limit: 10,
    offset: 0,
    nextPageToken: 0
  },
  messagePanelFloat: true,
  messageType: {
    notice: {
      icon: 'message',
      color: 'primary',
      value: 'notice',
      label: '公告'
    },
    discuss: {
      icon: 'message',
      color: 'primary',
      value: 'discuss',
      label: '讨论'
    },
    question: {
      icon: 'notifications',
      color: 'indigo',
      value: 'question',
      label: '问题'
    },
    answer: {
      icon: 'answer',
      color: 'indigo',
      value: 'answer',
      label: '回答',
      isSvg: true
    },
    schedule: {
      icon: 'today',
      color: 'pink',
      value: 'schedule',
      label: '日程'
    },
    doc: {
      icon: 'insert_drive_file',
      color: 'grey',
      value: 'doc',
      label: '文档'
    },
    boost: {
      icon: 'thumb_up',
      color: 'orange-6',
      value: 'boost',
      label: '点赞'
    },
    chat: {
      icon: 'forum',
      color: 'cyan',
      value: 'chat',
      label: '群聊',
      tag: 'Chatroom' // 群聊
    },
    talk: {
      icon: 'forum',
      color: 'cyan',
      value: 'talk',
      label: '单聊',
      tag: 'Talk' // 单聊
    },
    consult: {
      icon: 'app:tw-icon-consult',
      color: 'info',
      value: 'consult',
      label: '咨询'
    },
    approval: {
      icon: 'gavel',
      color: 'green-6',
      value: 'approval',
      label: '审批知会消息',
      tag: ''
    },
    approvalDone: {
      icon: 'done',
      color: 'secondary',
      tag: ''
    },
    mention: {
      icon: 'at',
      color: 'red-10',
      value: 'mention',
      label: '提到@',
      isSvg: true,
      tag: 'Mention'
    },
    taskCompleted: {
      icon: 'done',
      color: 'green',
      value: 'taskCompleted',
      label: '完成任务',
      tag: 'TaskCompleted'
    },
    taskDueDateChanged: {
      icon: 'add',
      color: 'green',
      value: 'taskDueDateChanged',
      label: '任务日期变更',
      tag: 'DueDateChanged'
    },
    taskDueDateAdded: {
      icon: 'add',
      color: 'green',
      value: 'taskDueDateAdded',
      label: '任务添加日期',
      tag: 'DueDateAdded'
    },
    taskAssigned: {
      icon: 'assignment_ind',
      color: 'cyan',
      value: 'taskAssigned',
      label: '指派任务',
      tag: 'Assigned'
    },
    taskNotify: {
      icon: 'notifications',
      color: 'indigo',
      value: 'taskNotify',
      label: '任务到期提醒/逾期提醒'
    },
    taskActivated: {
      icon: 'assignment_ind',
      color: 'cyan',
      value: 'taskActivated',
      label: '任务激活',
      tag: 'TaskActivated'
    },
    projectApproval: {
      icon: 'gavel',
      color: 'green-6',
      value: 'projectApproval',
      label: '项目立项'
    },
    projectDone: {
      icon: 'gavel',
      color: 'green-6',
      value: 'projectDone',
      label: '项目结项'
    },
    productDevApproval: {
      icon: 'gavel',
      color: 'green-6',
      value: 'productDevApproval',
      label: i18n.t('productDev.title') + '立项'
    },
    productDevDone: {
      icon: 'gavel',
      color: 'green-6',
      value: 'productDevDone',
      label: i18n.t('productDev.title') + '结项'
    },
    inviteToJoin: {
      icon: 'gavel',
      color: 'green-6',
      tag: 'inviteToJoin'
    },
    service: {
      icon: 'gavel',
      color: 'green-6',
      tag: 'service'
    },
    projectDueWarning: {
      icon: 'notifications',
      color: 'indigo',
      value: 'projectDueWarning',
      label: '项目结项提醒'
    },
    productDevDueWarning: {
      icon: 'notifications',
      color: 'indigo',
      value: 'productDevDueWarning',
      label: i18n.t('productDev.title') + '结项提醒'
    },
    feedback: {
      icon: 'forum',
      color: 'cyan',
      value: 'feedback',
      label: '在线反馈',
      tag: 'feedback' // 群聊
    },
    consultAcceptDue: {
      icon: 'notifications',
      color: 'indigo',
      value: 'consultAcceptDue',
      label: '咨询受理超时提醒'
    }
  },
  person: {
    id: null,
    name: '',
    type: 'all'
  }
}
