import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/drafts',
    name: 'myDrafts',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'drafts',
      label: i18n.t('draft.module'),
      requiresAuth: false,
      group: group.get('tool')
    },
    component: () =>
      import(/* webpackChunkName: "drafts" */ 'pages/my/MyDrafts.vue')
  }
]
