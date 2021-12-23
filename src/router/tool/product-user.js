// import { i18n } from '@/boot/i18n'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)?/user',
    hideInMenu: true,
    props: true,
    name: 'user',
    meta: {
      icon: 'list',
      label: '用户',
      index: 0,
      group: group.get('tool'),
      keepAlive: false
    },
    component: () =>
      import(/* webpackChunkName: "product-user" */ 'pages/product-user/Index.vue')
  }
]
