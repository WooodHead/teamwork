import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category?/:objectID?/schedule',
    name: 'schedule',
    hideInMenu: true,
    meta: {
      icon: 'today',
      label: i18n.t('schedule.module'),
      index: 0,
      requiresAuth: true,
      group: group.get('tool')
    },
    props: true,
    component: () =>
      import(/* webpackChunkName: "schedule" */ 'pages/schedule'),
    children: [
      {
        path: 'archived',
        name: 'archivedEvents',
        hideInMenu: true,
        meta: {
          icon: 'event',
          label: i18n.t('schedule.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/calendar/ArchivedEvents'
          )
      },
      {
        path: 'event/:id',
        name: 'eventDetail',
        hideInMenu: true,
        meta: {
          icon: 'event',
          label: i18n.t('schedule.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/calendar/EventDetail'
          )
      },
      {
        path: 'event/:id/edit',
        name: 'eventEdit',
        hideInMenu: true,
        meta: {
          icon: 'event',
          label: i18n.t('schedule.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/calendar/EventForm'
          )
      },
      {
        path: 'event/:id/move',
        name: 'eventMove',
        hideInMenu: true,
        meta: {
          icon: 'event',
          label: i18n.t('schedule.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/resource/ResourceMoveCopy.vue'
          )
      },
      {
        path: 'event/:id/copy',
        name: 'eventCopy',
        hideInMenu: true,
        meta: {
          icon: 'event',
          label: i18n.t('schedule.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/resource/ResourceMoveCopy.vue'
          )
      },
      {
        path: ':id/history',
        name: 'eventHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('schedule.module'),
          index: 50,
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(
                /* webpackChunkName: "schedule" */ 'components/calendar/EventHistory.vue'
          )
      }
    ]
  }
]
