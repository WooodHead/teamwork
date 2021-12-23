import { i18n } from '../../boot/i18n'
import group from '../group'
export default [
  {
    path: '/jd50-alarm-query',
    name: 'jd50AlarmQuery',
    hideInMenu: true,
    meta: {
      icon: 'warning',
      label: i18n.t('service.module'),
      requiresAuth: true,
      group: group.get('rd')
    },
    component: () => import(
    /* webpackChunkName: "service" */ 'pages/jd50-alarm/PageJD50AlarmQuery.vue'
    )
  },
  {
    path: '/jd50-alarm/:alarmCode',
    name: 'jd50Alarm',
    props: route => ({
      alarmCode: route.params.alarmCode
    }),
    hideInMenu: true,
    meta: {
      icon: 'warning',
      label: i18n.t('service.module'),
      requiresAuth: true,
      group: group.get('rd')
    },
    component: () => import(
    /* webpackChunkName: "service" */ 'pages/jd50-alarm/PageJD50AlarmDetail.vue'
    )
  }
]
