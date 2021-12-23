import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/my/settings',
    name: 'mySettings',
    hideInMenu: true,
    meta: {
      icon: 'settings',
      label: i18n.t('settings.mySettings'),
      index: 0,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ 'pages/my/MySettings.vue')
  }
]
