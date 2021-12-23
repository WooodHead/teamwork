import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/work-record',
    name: 'workRecordHome',
    hideInMenu: false,
    meta: {
      icon: 'app:tw-icon-work-record-manage',
      label: i18n.t('workRecord.module'),
      index: sort.workRecord,
      requiresAuth: true,
      group: group.get('jd')
    },
    props: true,
    component: () =>
      import(/* webpackChunkName: "workRecord" */ 'pages/work-record/Index.vue'),
    children: [
      {
        path: 'add',
        name: 'workRecordAdd',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'content_paste',
          label: i18n.t('workRecord.module'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/WorkRecordForm.vue'
          )
      },
      {
        path: ':id(\\d+)/edit',
        name: 'workRecordEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'content_paste',
          label: i18n.t('workRecord.module'),
          group: group.get('jd')
        },
        component: () =>
          import(
                  /* webpackChunkName: "workRecord" */ 'components/work-record/WorkRecordForm.vue'
          )
      },
      {
        path: 'districtLayer',
        name: 'workRecordDistrictLayer',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'content_paste',
          label: i18n.t('workRecord.module'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/WorkRecordDistrictLayer.vue'
          )
      },
      {
        path: ':id(\\d+)/history',
        name: 'workRecordHistory',
        hideInMenu: true,
        props: route => ({
          id: Number(route.params.id),
          type: 'task'
        }),
        meta: {
          icon: 'history',
          label: i18n.t('workRecord.module'),
          requiresAuth: true
        },
        component: () =>
          import(/* webpackChunkName: "workRecord" */ 'components/base/TwHistory.vue')
      },
      {
        path: 'list',
        name: 'workRecordList',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-work-record-manage',
          label: i18n.t('workRecord.dashboard.viewDetail'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/dashboard/ViewDetailIndex.vue'
          )
      },
      {
        path: 'calendar',
        name: 'workRecordCalendar',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'poll',
          label: i18n.t('workRecord.dashboard.workRecordCalendar'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/dashboard/WorkRecordCalendar.vue'
          )
      },
      {
        path: 'person-calendar',
        name: 'personWorkRecordCalendar',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'poll',
          label: i18n.t('workRecord.personCalendar'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/PersonWorkRecordCalendar.vue'
          )
      },
      {
        path: ':type(calendar|list|person-calendar)?/:id(\\d+)',
        name: 'workRecordDetail',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-work-record-manage',
          label: i18n.t('workRecord.module'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                  /* webpackChunkName: "workRecord" */ 'components/work-record/WorkRecordDetail.vue'
          )
      },
      {
        path: 'dashboard',
        name: 'workRecordDashboard',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-work-record-manage',
          label: i18n.t('workRecord.dashboard.workRecord'),
          requiresAuth: true,
          group: group.get('jd')
        },
        component: () =>
          import(
                /* webpackChunkName: "workRecord" */ 'components/work-record/dashboard/WorkRecordChart.vue'
          )
      }
    ]
  }
]
