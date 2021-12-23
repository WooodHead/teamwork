import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/notifications/settings',
    name: 'myNotificationSettings',
    hideInMenu: true,
    meta: {
      icon: 'settings',
      label: i18n.t('auth.myNotificationSettings'),
      index: 10,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ 'pages/my/NotificationSettings.vue')
  }
]
