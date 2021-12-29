import { i18n } from '@/boot/i18n'
export default {
  results: [],
  resources: [],
  organizes: [],
  list: [],
  recordLeaveList: [],
  recordLeaveCount: 0,
  sort: 'createTime',
  order: 'desc',
  // 搜索组件初始值
  search: '',
  searchDate: null,
  object: {
    label: '',
    value: 'all',
    type: 'all'
  },
  modules: {
    label: i18n.t('search.everything'),
    value: 'all',
    type: 'all'
  },
  person: {
    id: null,
    name: '',
    type: 'all'
  },
  organize: {
    id: 0,
    name: '',
    type: 'organize'
  },
  selectOptions: '',
  matchTag: false,
  // 是否分页
  byPage: true,
  page: {
    limit: 10,
    offset: 0,
    nextPageToken: 0
  },
  resultType: {
    project: {
      icon: 'inbox',
      color: 'primary',
      tag: 'project'
    },
    productDev: {
      icon: 'inbox',
      color: 'primary',
      tag: 'productDev'
    },
    team: {
      icon: 'group',
      color: 'primary',
      tag: 'team'
    },
    message: {
      icon: 'message',
      color: 'primary',
      tag: 'notice'
    },
    notice: {
      icon: 'message',
      color: 'primary',
      tag: 'notice'
    },
    discuss: {
      icon: 'message',
      color: 'primary',
      tag: 'discuss'
    },
    checkins: {
      icon: 'answer',
      color: 'indigo',
      isSvg: true,
      tag: 'checkins'
    },
    schedule: {
      icon: 'today',
      color: 'pink',
      tag: 'schedule'
    },
    document: {
      icon: 'insert_drive_file',
      color: 'orange',
      tag: 'document'
    },
    boost: {
      icon: 'thumb_up',
      color: 'orange-6',
      tag: 'boost'
    },
    task: {
      icon: 'done',
      color: 'green',
      tag: 'task'
    },
    list: {
      icon: 'done',
      color: 'primary',
      tag: 'task'
    }
  },
  // 搜索模块
  moduleOptions:
    [
      {
        label: i18n.t('project.title'),
        value: 'project',
        controller: 'projects',
        type: 'project'
      },
      {
        label: i18n.t('productDev.title'),
        value: 'productDev',
        controller: 'productDevs',
        type: 'productDev'
      },
      {
        label: i18n.t('team.title'),
        value: 'team',
        controller: 'teams',
        type: 'team'
      },
      {
        label: i18n.t('search.everything'),
        value: 'all',
        controller: 'all',
        type: 'all'
      },
      {
        label: i18n.t('notice.title'),
        value: 'notice',
        controller: 'notices',
        type: 'notice'
      },
      {
        label: i18n.t('task.title'),
        value: 'task',
        controller: 'tasks',
        type: 'task'
      },
      {
        label: i18n.t('document.title'),
        value: 'document',
        controller: 'documents',
        type: 'document'
      },
      {
        label: i18n.t('schedule.title'),
        value: 'schedule',
        controller: 'schedules',
        type: 'schedule'
      },
      {
        label: i18n.t('checkins.title'),
        value: 'checkins',
        controller: 'answers',
        type: 'checkins'
      },
      {
        label: i18n.t('discuss.title'),
        value: 'discuss',
        controller: 'discuss',
        type: 'discuss'
      }
    ]
}
