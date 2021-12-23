import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [{
  path: '/manufacturer',
  meta: {
    icon: '',
    label: i18n.t('app.home'),
    index: sort.home,
    requiresAuth: true,
    group: group.get('index')
  },
  component: () => import(/* webpackChunkName: "layout" */'layouts/OutsourceLayout.vue'),
  children: [
    {
      path: '/',
      meta: {
        // icon: 'outsourceIndex',
        label: i18n.t('app.home'),
        index: sort.home,
        requiresAuth: true,
        group: group.get('index')
      },
      component: () => import(/* webpackChunkName: "layout" */'pages/outsource/OutsourceIndex.vue'),
      children: [
        {
          path: 'mine',
          name: 'myManufacturerDetail',
          props: true,
          hideInMenu: true,
          meta: {
            icon: 'business',
            group: group.get('crm'),
            requiresAuth: true
          },
          component: () => import(/* webpackChunkName: "outsource" */ 'components/manufacturer/ManufacturerDetail.vue')
        },
        {
          path: 'mine/:openType(edit)',
          name: 'myManufacturerEdit',
          props: true,
          hideInMenu: true,
          meta: {
            icon: 'business',
            label: i18n.t('manufacturer.update')
          },
          component: () => import(/* webpackChunkName: "outsource" */ 'components/manufacturer/ManufacturerEdit.vue')
        }
      ]
    },
    // ============================================================
    {
      path: 'mine/assess/archived',
      name: 'myArchivedAssess',
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
      path: 'mine/assess',
      props: true,
      name: 'myAssess',
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
          path: ':id(\\d+)',
          name: 'myAssessDetail',
          props: true,
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
    },
    // ============================================================
    {
      path: 'mine/allocation/archived',
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
          name: 'myArchivedAllocations',
          hideInMenu: true,
          props: true,
          meta: {
            icon: 'assignment',
            label: i18n.t('allocation.title')
          },
          component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationArchived.vue')
        }
      ]
    },
    {
      path: 'mine/allocation',
      props: true,
      hideInMenu: true,
      component: () => import(/* webpackChunkName: "allocation" */ 'pages/allocation/Index.vue'),
      children: [
        {
          path: '/',
          name: 'myAllocation',
          hideInMenu: true,
          props: true,
          meta: {
            icon: 'assignment',
            label: i18n.t('allocation.title')
          },
          component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationList.vue')
        },
        {
          path: ':id(\\d+)',
          name: 'myAllocationDetail',
          hideInMenu: true,
          props: true,
          meta: {
            icon: 'assignment',
            label: i18n.t('allocation.detail')
          },
          component: () => import(/* webpackChunkName: "allocation" */ 'components/allocation/AllocationDetail.vue')
        }
      ]
    }
  ]
}]
