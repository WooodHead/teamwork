import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/:category/:objectID/assess/archived',
    name: 'archivedAssess',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'business',
      label: i18n.t('assess.title'),
      keepAlive: true,
      index: 0,
      group: group.get('crm')
    },
    component: () => import(/* webpackChunkName: "assess" */ 'pages/assess/Index.vue')
  },
  {
    path: '/:category/:objectID(\\d+)/assess',
    props: true,
    name: 'assess',
    hideInMenu: true,
    meta: {
      icon: 'business',
      label: i18n.t('assess.title'),
      keepAlive: true, // 是否需要被缓存
      index: 0,
      group: group.get('crm')
    },
    component: () => import(/* webpackChunkName: "assess" */ 'pages/assess/Index.vue'),
    children: [
      {
        path: 'add',
        name: 'assessAdd',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('crm'),
          description: '新建评估'
        },
        component: () => import(/* webpackChunkName: "assess" */ 'components/assess/assessForm.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'assessEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('crm'),
          description: '编辑评估'
        },
        component: () => import(/* webpackChunkName: "assess" */ 'components/assess/assessForm.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'assessDetail',
        props: route => ({
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'business',
          label: i18n.t('assess.title'),
          index: 10,
          group: group.get('crm')
        },
        component: () => import(/* webpackChunkName: "assess" */ 'components/assess/assessDetail.vue')
      }
    ]
  }
]
