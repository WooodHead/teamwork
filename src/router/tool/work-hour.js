import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)?/work-hour',
    props: true,
    name: 'workHour',
    hideInMenu: true,
    meta: {
      icon: 'event_note',
      label: i18n.t('workHour.title'),
      keepAlive: true, // 是否需要被缓存
      index: 0,
      group: group.get('tool')
    },
    component: () => import(/* webpackChunkName: "work-hour" */ 'pages/work-hour/Index.vue')
  }
]
