import { Platform } from 'quasar'
import { i18n } from '../boot/i18n'
import sort from './sort'
import group from './group'
import contacts from './oa/contacts'
import approval from './oa/approval'
import organize from './oa/organize'
import consult from './oa/consult'
import person from './oa/person'
import salary from './finance/salary'
import productDev from './rd/product-dev'
import team from './rd/team'
import project from './rd/project'
import service from './rd/service'
import rdGlobal from './rd/global'
import wiki from './rd/wiki'
import workRecord from './jd/work-record'
import jd50Alarm from './jd/jd50Alarm'
import activity from './tool/activity'
import message from './tool/message'
import notice from './tool/notice'
import task from './tool/task'
import document from './tool/document'
import chat from './tool/chat'
import schedule from './tool/schedule'
import checkins from './tool/checkins'
import evaluation from './tool/evaluation'
import workHour from './tool/work-hour'
import generatePublicLink from './tool/generate-public-link'
import qrcode from './tool/qrcode'
import guide from './tool/guide'
import trash from './tool/trash'
import product from './crm/product'
import productCase from './crm/productCase'
import customer from './crm/customer'
import opportunity from './crm/opportunity'
import assess from './crm/assess'
import order from './crm/order'
import followup from './crm/followup'
import allocation from './crm/allocation'
import myProfile from './my/my-profile'
import myTasks from './my/my-tasks'
import myBoosts from './my/my-boosts'
import myDrafts from './my/my-drafts'
import myBookmarks from './my/my-bookmarks'
import myChat from './my/my-chat'
import mySettings from './my/my-settings'
import myNotificationSettings from './my/notification-settings'
import settings from './system/settings'
import feedback from './system/feedback'
import search from './system/search'
import treasures from './treasures'
import job from './recruitment/job'
import resume from './recruitment/resume'
import interviewer from './recruitment/interviewer'
import recruitPlan from './recruitment/recruit-plan'
import manufacturer from './crm/manufacturer'
import outsource from './crm/outsource'
import recommendCode from './recruitment/recommend-code'
import position from './hr/position'
import userDefined from './system/user-defined'
import help from './thirdparty/help'
import user from './tool/product-user'

/**
 * 路由数组
 */
const routes = [
  {
    path: '/',
    meta: {
      icon: 'home',
      label: i18n.t('app.home'),
      index: sort.home,
      requiresAuth: true,
      group: group.get('index')
    },
    component: () => import(/* webpackChunkName: "layout" */'layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        meta: {
          icon: 'home',
          label: i18n.t('app.home'),
          index: sort.home,
          group: group.get('index')
        },
        component: () => import('pages/PageHome.vue')
      },
      {
        path: '/me',
        name: 'me',
        meta: {
          icon: 'person',
          label: '我的',
          index: sort.home,
          requiresAuth: true,
          group: group.get('index')
        },
        component: () => import('pages/PageMe.vue')
      },
      {
        path: '/change-password',
        name: 'changePassword',
        meta: {
          icon: 'lock_outline',
          label: '修改密码',
          index: sort.home,
          requiresAuth: true,
          group: group.get('index')
        },
        component: () => import('components/profile/ChangePassword.vue')
      },
      // OA group
      ...contacts,
      ...organize,
      ...consult,
      ...person,
      ...approval,

      // tool group
      ...activity,
      ...message,
      ...notice,
      ...task,
      ...document,
      ...wiki,
      ...chat,
      ...schedule,
      ...checkins,
      ...workHour,
      ...generatePublicLink,
      ...qrcode,
      ...guide,
      ...trash,
      ...user,

      // myself group
      ...myProfile,
      ...myTasks,
      ...myBoosts,
      ...myDrafts,
      ...myBookmarks,
      ...myChat,
      ...mySettings,
      ...myNotificationSettings,

      // system manage
      ...settings,
      ...feedback,
      ...search,

      // rd group
      ...productDev,
      ...team,
      ...project,

      // crm group
      ...customer,
      ...opportunity,
      ...assess,
      ...order,
      ...allocation,
      ...manufacturer,
      ...followup,
      ...(Platform.is.mobile ? [] : product),
      ...productCase,

      // jd group
      ...service,
      ...evaluation,
      ...jd50Alarm,
      ...workRecord,

      // recruitment
      ...resume,
      ...job,
      ...interviewer,
      ...recruitPlan,
      ...recommendCode,

      // finance group
      ...salary,
      ...position,

      ...rdGlobal,
      ...userDefined
    ]
  },

  {
    path: '/',
    meta: {
      icon: 'home',
      label: i18n.t('app.home'),
      index: sort.home,
      requiresAuth: true,
      group: group.get('index')
    },
    component: () => import(/* webpackChunkName: "layout" */'layouts/ProductLayoutMobile.vue'),
    children: Platform.is.mobile ? product : []
  },
  ...outsource,
  {
    path: '/auth',
    name: 'auth',
    hideInMenu: true,
    meta: {
      icon: 'verified_user',
      label: i18n.t('app.moduleGroup.auth'),
      index: 0
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ 'layouts/AuthLayout.vue'),
    children: [
      {
        path: '/login',
        alias: '/auth',
        name: 'login',
        hideInMenu: true,
        meta: {
          icon: 'account_circle',
          label: i18n.t('auth.login'),
          index: 1
        },
        component: () =>
          import(/* webpackChunkName: "auth" */ 'pages/auth/PageLogin.vue')
      },
      {
        path: '/wxlogin',
        alias: '/wxauth',
        name: 'wxlogin',
        hideInMenu: true,
        meta: {
          icon: 'account_circle',
          label: i18n.t('auth.login'),
          requiresAuth: false,
          index: 1
        },
        component: () =>
          import(/* webpackChunkName: "auth" */ 'pages/auth/PageWxLogin.vue')
      },
      {
        path: '/register',
        name: 'register',
        hideInMenu: true,
        meta: {
          icon: 'person_pin',
          label: i18n.t('auth.register'),
          index: 2
        },
        component: () =>
          import(/* webpackChunkName: "auth" */ 'pages/auth/PageRegister.vue')
      },
      {
        path: '/forgot-password',
        name: 'forgotPassword',
        hideInMenu: true,
        meta: {
          icon: 'vpn_key',
          label: i18n.t('auth.forgotPassword'),
          index: 3
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ 'pages/auth/PageForgotPassword.vue'
          )
      },
      {
        path: '/reset-password',
        name: 'resetPassword',
        hideInMenu: true,
        meta: {
          icon: 'vpn_key',
          label: i18n.t('auth.resetPassword'),
          index: 4
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ 'pages/auth/PageResetPassword.vue'
          )
      },
      // support
      {
        path: '/support',
        name: 'support',
        hideInMenu: true,
        meta: {
          icon: 'vpn_key',
          label: i18n.t('feedback.support'),
          index: 5
        },
        component: () =>
          import(
            /* webpackChunkName: "auth" */ 'pages/auth/PageSupport.vue'
          )
      }
    ]
  },
  {
    path: '/blank',
    name: 'blank',
    hideInMenu: true,
    meta: {
      icon: 'help',
      label: i18n.t('publicLink.module'),
      index: 40,
      requiresAuth: false,
      group: group.get('oa')
    },
    component: () =>
      import(/* webpackChunkName: "layout" */ 'layouts/BlankLayout.vue'),
    children: [
      {
        path: '/public/:code',
        name: 'publicLink',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('publicLink.module'),
          index: 40,
          requiresAuth: false,
          group: group.get('oa')
        },
        component: () => import(/* webpackChunkName: "auth" */ 'pages/PagePublicLink.vue')
      },
      {
        path: '/secrecy/salary/:id/:recordNum/:type/:year/:month',
        name: 'salarySecrecyVerify',
        hideInMenu: true,
        meta: {
          icon: 'attach_money',
          label: i18n.t('salary.title'),
          index: sort.salary,
          requiresAuth: false,
          group: group.get('finance')
        },
        component: () => import(/* webpackChunkName: "salary" */'components/salary/staff/StaffSecurityCode.vue'),
        children: []
      },
      {
        path: '/secrecy/salary/view',
        name: 'salarySecrecyDetail',
        hideInMenu: true,
        meta: {
          icon: 'attach_money',
          label: i18n.t('salary.title'),
          index: sort.salary,
          requiresAuth: false,
          group: group.get('finance')
        },
        component: () => import(/* webpackChunkName: "salary" */'components/salary/staff/StaffSalaryDetail.vue'),
        children: []
      },
      {
        path: '/position/:recordNum/:positionId',
        name: 'viewPosition',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'inbox',
          label: i18n.t('position.showPosition'),
          index: sort.position,
          requiresAuth: false,
          group: group.get('hr')
        },
        component: () => import(/* webpackChunkName: "position" */ 'components/position/ViewPosition.vue')
      }
    ]
  },
  {
    path: '/onlyDesktop',
    name: 'onlyDesktop',
    hideInMenu: true,
    component: () => import('pages/PageOnlyDesktop.vue')
  },

  ...help
]

if (process.env.DEV) {
  routes[0].children.push(...treasures)
}

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    name: '404',
    hideInMenu: true,
    component: () => import('pages/Error404.vue')
  })
}

export default routes
