import { i18n } from '@/boot/i18n'
import { LocalStorage } from 'quasar'
import help from '@/router/thirdparty/help'
const thirdparty = { help }
const config = require('app/app.config.js')
const userDefinedApp =
{
  guobiao: {
    name: 'guobiao',
    to: { name: 'guobiao' },
    icon: 'app:tw-icon-guobiao',
    color: 'blue-10', // 'teal-10',
    label: i18n.t('document.guobiao'),
    notes: '集团收集的各类国家标准、行业标准、企业标准都在这里集中共享。',
    latest: true
  },
  room: {
    name: 'room',
    to: { name: 'room' },
    icon: 'app:tw-icon-meeting',
    color: 'blue-10', // 'teal-10',
    label: i18n.t('room.module'),
    notes: ''
  },
  equipment: {
    name: 'equipment',
    to: { name: 'equipment' },
    icon: 'app:tw-icon-meeting',
    color: 'blue-10', // 'teal-10',
    label: i18n.t('equipment.module'),
    notes: ''
  }
},
  thirdpartyApp = Object.keys(thirdparty).length
    ? {
      help: {
        name: 'help',
        to: thirdparty.help,
        icon: 'help',
        color: 'blue-10',
        label: '用户手册',
        notes: ''
      }
    } : {}
const state = {
  // 所有工具（新创建的工具需要在这里定义）
  tools: {
    task: {
      name: 'task',
      to: { name: 'MyTasks' },
      color: 'menu2',
      icon: 'done',
      notes: i18n.t('home.widget.myTasks')
    },
    schedule: {
      name: 'schedule',
      to: { name: 'schedule' },
      color: 'menu2',
      icon: 'event',
      notes: i18n.t('home.widget.schedule')
    },
    activity: {
      name: 'activity',
      to: { name: 'activity' },
      color: 'menu2',
      icon: 'av_timer',
      notes: i18n.t('home.widget.activity')
    },
    myBookmarks: {
      name: 'myBookmarks',
      to: { name: 'myBookmarks' },
      color: 'menu2',
      icon: 'bookmark',
      notes: i18n.t('home.widget.myBookmarks')
    },
    myDrafts: {
      name: 'myDrafts',
      to: { name: 'myDrafts' },
      color: 'menu2',
      icon: 'drafts',
      notes: i18n.t('home.widget.myDrafts')
    },
    history: {
      name: 'history',
      to: { name: 'history' },
      color: 'menu2',
      icon: 'history',
      notes: i18n.t('home.widget.history')
    },
    myBoosts: {
      name: 'myBoosts',
      to: { name: 'myBoosts' },
      color: 'menu2',
      icon: 'insert_emoticon',
      notes: i18n.t('home.widget.myBoosts')
    },
    trash: {
      name: 'trash',
      to: { name: 'trash' },
      color: 'menu2',
      icon: 'delete',
      notes: i18n.t('home.widget.trash')
    }
  },
  // 所有应用（新创建的应用需要在这里定义）
  apps: {
    contacts: {
      name: 'contacts',
      to: { name: 'contactsHome' },
      icon: 'app:tw-icon-contacts',
      color: 'blue-10',
      label: i18n.t('contacts.module'),
      notes: ''
    },
    downloadArea: {
      name: 'downloadArea',
      to: { name: 'downloadArea' },
      icon: 'app:tw-icon-download',
      color: 'blue-10', // 'blue-grey-10',
      label: i18n.t('document.downloadArea'),
      notes: ''
    },
    team: {
      name: 'team',
      to: { name: 'teamHome' },
      toAdd: { name: 'teamAdd' },
      icon: 'app:tw-icon-team-manage',
      color: 'blue-10', // 'green-10',
      label: i18n.t('team.module'),
      notes: i18n.t('team.notes')
    },
    project: {
      name: 'project',
      to: { name: 'projectHome' },
      toAdd: { name: 'projectAdd' },
      icon: 'inbox',
      color: 'blue-10', // 'orange-10',
      label: i18n.t('project.module'),
      notes: i18n.t('project.notes')
    },
    productDev: {
      name: 'productDev',
      to: { name: 'productDevHome' },
      toAdd: { name: 'productDevEdit', params: { openType: 'add' } },
      icon: 'app:tw-icon-product-dev-manage',
      color: 'blue-10', // 'indigo-10',
      label: i18n.t('productDev.module'),
      notes: i18n.t('productDev.notes')
    },
    product: {
      name: 'product',
      to: { name: 'productHome' },
      icon: 'app:tw-icon-product',
      color: 'blue-10', // 'indigo-10',
      label: i18n.t('product.module'),
      notes: i18n.t('product.notes')
    },
    service: {
      name: 'service',
      to: { name: 'serviceHome' },
      icon: 'app:tw-icon-service',
      color: 'blue-10', // 'orange-10',
      label: i18n.t('service.module'),
      notes: ''
    },
    consult: {
      name: 'consult',
      to: { name: 'consultHome' },
      icon: 'app:tw-icon-consult',
      color: 'blue-10', // 'green-10',
      label: i18n.t('consult.module'),
      notes: i18n.t('consult.slogan')
    },
    jobHome: {
      name: 'jobHome',
      to: { name: 'jobHome' },
      icon: 'app:tw-icon-recruitment',
      color: 'blue-10', // 'orange-10',
      label: '精雕招聘',
      notes: ''
    },
    position: {
      name: 'position',
      to: { name: 'positionHome' },
      toAdd: { name: '' },
      icon: 'card_membership',
      color: 'blue-10', // 'green-10',
      label: '职级管理',
      notes: ''
    },
    bomPK: {
      name: 'bomPK',
      to: { name: 'materialHome' },
      icon: 'graphic_eq',
      color: 'blue-10', // 'green-10',
      label: 'BOM比对',
      notes: ''
    },
    workRecord: {
      name: 'workRecord',
      to: { name: 'workRecordHome' },
      icon: 'app:tw-icon-work-record',
      color: 'blue-10',
      label: i18n.t('workRecord.module'),
      notes: ''
    },
    // menus（部分菜单项与上面重复，职位职级保持禁用状态）
    customer: {
      name: 'customer',
      to: { name: 'customerHome' },
      icon: 'app:tw-icon-customer-manage',
      color: 'blue-10',
      label: '客户管理',
      notes: ''
    },
    opportunity: {
      name: 'opportunity',
      to: { name: 'opportunityHome' },
      icon: 'app:tw-icon-opportunity-manage',
      color: 'blue-10',
      label: '商机管理',
      notes: ''
    },
    order: {
      name: 'order',
      to: { name: 'orderHome' },
      icon: 'app:tw-icon-order-manage',
      color: 'blue-10',
      label: '订单管理',
      notes: ''
    },
    manufacturer: {
      name: 'manufacturer',
      to: { name: 'manufacturerHome' },
      icon: 'app:tw-icon-production',
      color: 'blue-10',
      label: '生产单位',
      notes: ''
    },
    document: {
      name: 'document',
      to: { name: 'documentCenter' },
      icon: 'app:tw-icon-document',
      color: 'blue-10',
      label: '文档中心',
      notes: ''
    },
    salary: {
      name: 'salary',
      to: { name: 'salaryHome' },
      icon: 'inbox',
      color: 'blue-10',
      label: i18n.t('salary.title'),
      notes: ''
    },
    settings: {
      name: 'settings',
      to: { name: 'settings' },
      icon: 'settings',
      color: 'blue-10',
      label: '设置',
      notes: ''
    },
    feedback: {
      name: 'feedback',
      to: { name: 'adminFeedbackHome' },
      icon: 'description',
      color: 'blue-10',
      label: i18n.t('feedback.module'),
      notes: ''
    },
    productCase: {
      name: 'productCase',
      to: { name: 'productCaseHome' },
      icon: 'app:tw-icon-product',
      color: 'blue-10',
      label: i18n.t('productCase.module'),
      notes: '',
      latest: true
    },
    wiki: {
      name: 'wiki',
      to: { name: 'wikiHome' },
      icon: 'app:tw-icon-menu-wiki',
      color: 'blue-10',
      label: i18n.t('wiki.module'),
      notes: ''
    },
    approval: {
      name: 'approval',
      to: { name: 'approvalHome' },
      icon: 'card_membership',
      color: 'blue-10',
      label: i18n.t('approval.module'),
      notes: '对接企业微信审批'
    },
    ...userDefinedApp,
    ...thirdpartyApp
  }

}

const getters = {
  myAppsOfOnlyName: (state) => {
    const myself = LocalStorage.getItem('myself')
    const roleMenus = myself.auth.route.roleMenus || []
    const menus = [...roleMenus]
    menus.splice(0, 1)
    const apps = Object.values(state.apps)
    const myApps = menus.map(m => {
      const app = _.find(apps, app => {
        return app.to.name === m
      })
      return app && app.name
    })
    return _.compact(myApps)
  },

  commonUseAppsOfOnlyName: (state, getters) => {
    const myself = LocalStorage.getItem('myself')
    let commonUse = (myself.settings.commonUseApps && myself.settings.commonUseApps.length)
      ? myself.settings.commonUseApps
      : config.app.modulesInCommonUse
    return _.intersection(commonUse, getters.myAppsOfOnlyName)
  },

  commonUseApps: (state, getters) => {
    return getters.commonUseAppsOfOnlyName.map(item => state.apps[item])
  }
}
export default {
  namespaced: true,
  state,
  getters
}
