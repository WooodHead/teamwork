import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category(team|project|productDev|customer|service|opportunity|order|manufacturer|wiki)/:objectID(\\d+)',
    props: true,
    hideInMenu: true,
    meta: {
      requiresAuth: true,
      group: group.get('tool'),
      icon: 'swap_horiz',
      label: i18n.t('widget.relation')
    },
    component: () => import(/* webpackChunkName: "resource" */ 'pages/resource/ResourceIndex'),
    children: [
      {
        path: 'widget-setting',
        name: 'widgetSetting',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'assignment',
          label: i18n.t('settings.module'),
          index: 0,
          group: group.get('tool')
        },
        component: () => import(/* webpackChunkName: "settings" */'components/widget/WidgetSetting.vue')
      },
      {
        path: 'relation/:relates(team|project|productDev|customer|service)',
        name: 'resourceRelation',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'swap_horiz',
          group: group.get('rd'),
          label: i18n.t('widget.relation')
        },
        component: () =>
          import(/* webpackChunkName: "resource" */ 'components/resource/ResourceRelation.vue')
      },
      {
        path: ':relates(order|opportunity)',
        name: 'customerRelation',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'swap_horiz',
          group: group.get('rd'),
          label: i18n.t('widget.relation')
        },
        component: () =>
          import(/* webpackChunkName: "resource" */ 'components/customer/CustomerRelation.vue')
      },
      // 仅项目和产品有
      {
        path: ':type(start|finish)/approval',
        name: 'deadlineApproval',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'gavel',
          group: group.get('rd'),
          label: i18n.t('approval.applyFor')
        },
        component: () =>
          import(/* webpackChunkName: "approval" */ 'components/approval/DeadlineApproval')
      },
      {
        path: 'member',
        name: 'member',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'verified_user',
          group: group.get('rd'),
          label: i18n.t('project.member')
        },
        component: () => import(/* webpackChunkName: "member" */ 'components/member/MemberIndex')
      },
      {
        path: 'customer-info',
        name: 'customerInfo',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'verified_user',
          group: group.get('rd'),
          label: i18n.t('project.member')
        },
        component: () => import(/* webpackChunkName: "member" */ 'components/customer/CustomerInfo')
      }
    ]
  }
]
