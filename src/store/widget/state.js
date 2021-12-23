
import { i18n } from '@/boot/i18n'
export default {
  widgets: {
    chat: {
      value: 'chat',
      label: i18n.t('chat.module'),
      color: 'cyan-6',
      icon: 'forum',
      order: 1,
      notes: i18n.t('chat.notes'),
      setting: { onlyLeaderAndMember: true }
    },
    notice: {
      value: 'notice',
      label: i18n.t('notice.module'),
      color: 'yellow-8',
      icon: 'assignment',
      order: 2,
      notes: i18n.t('notice.notes')
    },
    task: {
      value: 'task',
      label: i18n.t('task.module'),
      color: 'green',
      icon: 'done',
      order: 3,
      notes: i18n.t('task.notes'),
      setting: { taskForm: [] } // ["predictHour", "actualHour"]
    },
    document: {
      value: 'document',
      label: i18n.t('document.module'),
      color: 'primary',
      icon: 'insert_drive_file',
      order: 4,
      notes: i18n.t('document.notes')
    },
    schedule: {
      value: 'schedule',
      label: i18n.t('schedule.module'),
      color: 'red',
      icon: 'event',
      order: 5,
      notes: i18n.t('schedule.notes')
    },
    checkins: {
      value: 'checkins',
      label: i18n.t('checkins.module'),
      color: 'green-14',
      icon: 'help',
      order: 6,
      notes: i18n.t('checkins.notes')
    },
    workHour: {
      value: 'workHour',
      label: i18n.t('workHour.title'),
      color: 'accent',
      icon: 'event_note',
      order: 7,
      notes: i18n.t('workHour.notes'),
      setting: { road: false }
    },
    project: {
      value: 'project',
      label: `关联${i18n.t('project.title')}`,
      color: 'indigo-12',
      icon: 'inbox',
      order: 8,
      notes: '请选择关联的项目。'
    },
    productDev: {
      value: 'productDev',
      label: `关联${i18n.t('productDev.title')}`,
      color: 'indigo-12',
      icon: 'app:tw-icon-product-dev-manage',
      order: 9,
      notes: `请选择关联的${i18n.t('productDev.title')}。`
    },
    team: {
      value: 'team',
      label: `关联${i18n.t('team.title')}`,
      color: 'secondary',
      icon: 'group',
      order: 10,
      notes: '请选择关联的团队'
    },
    customer: {
      value: 'customer',
      label: `关联${i18n.t('customer.title')}`,
      color: 'blue',
      icon: 'app:tw-icon-customer-manage',
      order: 11,
      notes: '请选择关联的客户。'
    },
    // 客户档案
    customerArchives: {
      value: 'customerArchives',
      label: '客户档案',
      color: 'blue',
      icon: 'description',
      order: 12,
      notes: '客户管理模块专用工具'
    },
    followup: {
      value: 'followup',
      label: i18n.t('followup.title'),
      color: 'primary',
      icon: 'assignment_ind',
      order: 13,
      notes: i18n.t('followup.notes')
    },
    opportunity: {
      value: 'opportunity',
      label: `关联${i18n.t('opportunity.title')}`,
      color: 'primary',
      icon: 'app:tw-icon-opportunity-manage',
      order: 14,
      notes: '请选择相关商机。'
    },
    quotation: {
      value: 'quotation',
      label: '评估报价',
      color: 'green',
      icon: 'attach_money',
      order: 15,
      notes: '商机的评估报价单(商机模块专用工具)。'
    },
    order: {
      value: 'order',
      label: `关联${i18n.t('order.title')}`,
      color: 'primary',
      icon: 'app:tw-icon-order-manage',
      order: 16,
      notes: '请选择相关订单。'
    },
    allocation: {
      value: 'allocation',
      label: '下发生产需求',
      icon: 'assignment',
      color: 'green',
      order: 17,
      notes: '列出已经创建的生产需求，进行生产任务的安排和记录(订单模块专用工具)。'
    },
    opportunityAssess: {
      value: 'opportunityAssess',
      label: '商机评估',
      color: 'primary',
      icon: 'business',
      order: 18,
      notes: '在这里您可以评估商机(生产单位模块专用工具)。'
    },
    productionDemand: {
      value: 'productionDemand',
      label: '生产需求',
      color: 'secondary',
      icon: 'assignment',
      order: 19,
      notes: '在这里您可以管控生产需求(生产单位模块专用工具)。'
    },
    bom: {
      value: 'bom',
      label: '物料清单',
      color: 'primary',
      icon: 'list',
      order: 20,
      notes: '管理整个产品的物料清单。'
    },
    user: {
      value: 'user',
      label: '关联用户',
      color: 'purple',
      icon: 'people',
      order: 21,
      notes: '请选择它的用户。'
    },
    evaluation: {
      value: 'evaluation',
      label: i18n.t('evaluation.title'),
      color: 'primary',
      icon: 'border_color',
      order: 22,
      notes: i18n.t('evaluation.notes')
    },
    // 不应该有这个
    trash: {
      value: 'trash',
      label: i18n.t('trash.title'),
      color: 'primary',
      icon: 'delete',
      order: 98,
      notes: i18n.t('trash.notes')
    },
    activity: {
      value: 'activity',
      label: i18n.t('activity.title'),
      color: 'primary',
      icon: 'av_timer',
      order: 99,
      notes: i18n.t('activity.notes')
    }
  }
}
