import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/boosts',
    name: 'myBoosts',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'help',
      label: i18n.t('boost.module'),
      index: 40,
      requiresAuth: false,
      group: group.get('oa')
    },
    component: () =>
      import(/* webpackChunkName: "boosts" */ 'pages/my/MyBoosts.vue')
  }
]
