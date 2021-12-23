import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category?/:objectID?/activity',
    name: 'activity',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'av_timer',
      label: i18n.t('activity.module'),
      index: 0,
      requiresAuth: true,
      group: group.get('tool')
    },
    component: () => import('pages/PageActivity.vue')
  }
]
