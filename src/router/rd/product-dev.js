import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/productDev',
    name: 'productDevHome',
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-product-dev-manage',
      label: i18n.t('productDev.module'),
      index: sort.productDev,
      requiresAuth: true,
      group: group.get('rd')
    },
    component: () =>
      import(
            /* webpackChunkName: "productDev" */ 'pages/product-dev/PageProductDev.vue'
      )
  },
  {
    path: '/productDev',
    name: 'productDevIndex',
    hideInMenu: true,
    meta: {
      icon: 'explore',
      label: i18n.t('productDev.module'),
      group: group.get('rd')
    },
    component: () =>
      import(
            /* webpackChunkName: "productDev" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: 'archived',
        name: 'archivedProductDevs',
        hideInMenu: true,
        props: route => ({
          category: 'productDev'
        }),
        meta: {
          icon: 'app:tw-icon-product-dev-manage',
          label: i18n.t('productDev.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ArchivedProductDevs.vue'
          )
      },
      {
        path: ':id(\\d+)',
        name: 'productDevDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'productDevHome',
          icon: 'app:tw-icon-product-dev-manage',
          label: i18n.t('productDev.module'),
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevDetail.vue'
          )
      },
      {
        path: ':id?/:openType(add|edit)',
        name: 'productDevEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-product-dev-manage',
          label: i18n.t('productDev.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevForm.vue'
          )
      },
      {
        path: 'addFromTemplate',
        name: 'productDevAddFromTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'productDev',
          action: 'use'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('productDev.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: ':id(\\d+)/suspended',
        name: 'productDevSuspended',
        props: route => ({
          openType: 'suspended',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'drag_handle',
          group: group.get('rd'),
          label: i18n.t('productDev.suspended')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevStatus'
          )
      },
      {
        path: ':id(\\d+)/activate',
        name: 'productDevActivate',
        props: route => ({
          openType: 'activate',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'wb_incandescent',
          group: group.get('rd'),
          label: i18n.t('productDev.activate')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevStatus'
          )
      },
      {
        path: ':id(\\d+)/start',
        name: 'productDevStart',
        props: route => ({
          openType: 'start',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'play_arrow',
          group: group.get('rd'),
          label: i18n.t('productDev.approval')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevApplyFor'
          )
      },
      {
        path: ':id(\\d+)/done',
        name: 'productDevDone',
        props: route => ({
          openType: 'done',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'stop',
          group: group.get('rd'),
          label: i18n.t('productDev.finish')
        },
        component: () => import(
               /* webpackChunkName: "productDev" */ 'components/product-dev/ProductDevApplyFor'
        )
      },
      {
        path: 'exportHour',
        name: 'productDevExportHour',
        props: route => ({
        }),
        hideInMenu: true,
        meta: {
          icon: 'wb_incandescent',
          group: group.get('rd'),
          label: i18n.t('productDev.exportHour')
        },
        component: () =>
          import(
                /* webpackChunkName: "productDev" */ 'components/product-dev/export/ExportHour'
          )
      },
      {
        path: 'templatet/index',
        name: 'productDevTemplateManage',
        hideInMenu: true,
        props: route => ({
          category: 'productDev',
          action: 'manage'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('productDev.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: 'template/archived',
        name: 'archivedProductDevTemplates',
        hideInMenu: true,
        props: true,
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'archive',
          label: i18n.t('productDev.archive')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/ArchivedTemplate'
          )
      },
      {
        path: 'template/add',
        name: 'productDevAddTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'productDev'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('productDev.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateForm')
      },
      {
        path: '/:category/template/:id/:openType',
        name: 'productDevTemplateEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'mode_edit',
          group: group.get('rd'),
          label: i18n.t('productDev.update')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/TemplateForm'
          )
      }
    ]
  }
]
