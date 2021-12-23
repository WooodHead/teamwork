import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/profile',
    name: 'myProfile',
    hideInMenu: true,
    meta: {
      icon: 'settings',
      label: i18n.t('auth.myProfile'),
      index: 0,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ 'pages/my/MyProfile.vue')
  }
]
