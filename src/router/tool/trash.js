import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category?/:objectID?/trash',
    name: 'trash',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'delete',
      label: i18n.t('trash.title'),
      requiresAuth: false,
      group: group.get('tool')
    },
    component: () =>
      import(/* webpackChunkName: "trash" */ 'pages/trash/Index.vue'),
    children: []
  }
]
