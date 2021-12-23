import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'
const config = require('app/app.config.js')
// 外网或开发环境启用工程服务
const showLink = config.extranet || process.env.NODE_ENV === 'development'

export default [
  {
    path: '/service',
    name: 'serviceHome',
    hideInMenu: !showLink,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-service',
      label: i18n.t('service.module'),
      index: sort.service,
      requiresAuth: true,
      group: group.get('rd')
    },
    component: () =>
      import(
            /* webpackChunkName: "service" */ 'pages/service/PageService.vue'
      )
  },

  {
    path: '/service',
    name: 'serviceIndex',
    hideInMenu: true,
    meta: {
      icon: 'explore',
      label: i18n.t('service.module'),
      group: group.get('rd')
    },
    component: () =>
      import(
            /* webpackChunkName: "service" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: ':id(\\d+)',
        name: 'serviceDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'serviceHome',
          icon: 'app:tw-icon-service',
          label: i18n.t('service.module'),
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "service" */ 'components/service/ServiceDetail.vue'
          )
      },
      {
        path: ':id?/:openType(add|edit)',
        name: 'serviceEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-service',
          label: i18n.t('service.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "service" */ 'components/service/ServiceForm.vue'
          )
      },
      {
        path: 'archive',
        name: 'serviceArchive',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-service',
          label: i18n.t('service.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "service" */ 'components/service/ServiceArchive.vue'
          )
      },
      {
        path: 'chart',
        name: 'serviceChart',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-service',
          label: i18n.t('service.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(
          /* webpackChunkName: "service" */ 'components/service/ServiceChart.vue'
        )
      }

    ]
  },
  {
    path: '/service/:id(\\d+)/assignTo',
    name: 'serviceAssignTo',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'play_arrow',
      label: i18n.t('service.action.assignTo'),
      group: group.get('rd')
    },
    component: () => import(
      /* webpackChunkName: "service" */ 'pages/service/PageServiceAssignTo'
    )
  }
]
