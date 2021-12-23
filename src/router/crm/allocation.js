import { i18n } from '../../boot/i18n'
export default [
  {
    path: '/:category/:objectID(\\d+)/allocation/archived',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'assignment',
      label: i18n.t('allocation.title')
    },
    component: () => import(/* webpackChunkName: "allocation" */'pages/allocation/Index.vue'),
    children: [
      {
        path: '/',
        name: 'archivedAllocations',
        hideInMenu: true,
        props: route => ({
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t('allocation.title')
        },
        component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationArchived.vue')
      }
    ]
  },
  {
    path: '/:category/:objectID(\\d+)/allocation',
    props: true,
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "allocation" */ 'pages/allocation/Index.vue'),
    children: [
      {
        path: '/',
        name: 'allocation',
        hideInMenu: true,
        props: route => ({
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t('allocation.title')
        },
        component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationList.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'allocationDetail',
        hideInMenu: true,
        props: route => ({
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t('allocation.detail')
        },
        component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationDetail.vue')
      },
      {
        path: 'add',
        name: 'allocationAdd',
        hideInMenu: true,
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t(`allocation.add`)
        },
        component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationForm.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'allocationEdit',
        hideInMenu: true,
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t(`allocation.edit`)
        },
        component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationForm.vue')
      }
    ]
  }
]
