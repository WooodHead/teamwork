import { i18n } from '../../boot/i18n'
import group from '../group'
import sort from '../sort'

export default [
  /** **********管理员相关路由 */
  {
    path: '/salary',
    name: 'salaryHome',
    meta: {
      icon: 'inbox',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance'),
      onlyDesktop: true
    },
    component: () => import(/* webpackChunkName: "project" */ 'pages/salary/PageSalary')
  },
  {
    path: '/salary/administer/:year/:month/:type',
    name: 'administerSalary',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'inbox',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance'),
      onlyDesktop: true
    },
    component: () => import(/* webpackChunkName: "project" */ 'pages/salary/PageSalary')
  },
  {
    path: '/salary',
    hideInMenu: true,
    meta: {
      group: group.get('finance'),
      icon: 'inbox',
      label: i18n.t('salary.title'),
      onlyDesktop: true
    },
    component: () =>
      import(/* webpackChunkName: "project" */ 'pages/salary/SalaryIndex'),
    children: [
      {
        path: 'issued',
        name: 'salaryIssued',
        props: true,
        hideInMenu: true,
        meta: {
          group: group.get('finance'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('salary.add'),
          onlyDesktop: true
        },
        component: () =>
          import(/* webpackChunkName: "project" */ 'components/salary/issuedSalary/IssuedSalaryIndex')
      },
      {
        path: ':year/:month/:type/:status/issued',
        name: 'salaryReCall',
        props: true,
        hideInMenu: true,
        meta: {
          group: group.get('finance'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('salary.add')
        },
        component: () =>
          import(/* webpackChunkName: "project" */ 'components/salary/issuedSalary/IssuedSalaryIndex')
      }
    ]
  },
  /** **********员工相关路由 */
  {
    path: '/salary/apply',
    name: 'applyCode',
    hideInMenu: true,
    meta: {
      icon: 'attach_money',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance')
    },
    component: () => import(/* webpackChunkName: "salary" */'components/salary/staff/StaffSalaryApply.vue'),
    children: []
  },
  {
    path: '/:year/:month/:type/detail/:id',
    name: 'applySalary',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'inbox',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance')
    },
    component: () => import(/* webpackChunkName: "project" */ 'components/salary/admin/AdminSalaryDetail')
  },
  {
    path: '/salary/:id/view/:type/:year/:month',
    name: 'salaryVerify',
    hideInMenu: true,
    meta: {
      icon: 'attach_money',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance')
    },
    component: () => import(/* webpackChunkName: "salary" */'components/salary/staff/StaffSecurityCode.vue'),
    children: []
  },
  {
    path: '/salary/view',
    name: 'salaryDetail',
    hideInMenu: true,
    meta: {
      icon: 'attach_money',
      label: i18n.t('salary.title'),
      index: sort.salary,
      requiresAuth: true,
      group: group.get('finance')
    },
    component: () => import(/* webpackChunkName: "salary" */'components/salary/staff/StaffSalaryDetail.vue'),
    children: []
  }
]
