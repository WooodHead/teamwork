import { i18n } from '@/boot/i18n'
// import sort from '../sort'
// import group from '../group'

export default [
  {
    path: '/message',
    name: 'message',
    hideInMenu: true,
    meta: {
      icon: 'notifications',
      label: i18n.t('message.module'),
      index: 0
    },
    component: () =>
      import(/* webpackChunkName: "message" */ 'pages/PageMessage.vue')
  }
]
