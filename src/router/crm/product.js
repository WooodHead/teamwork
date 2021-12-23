import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/product',
    name: 'productHome',
    hideInMenu: false,
    meta: {
      icon: 'app:tw-icon-product',
      label: i18n.t('product.module'),
      index: sort.product,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(
            /* webpackChunkName: "product" */ 'pages/product/PageProduct.vue'
      )
  },
  {
    path: '/product',
    name: 'productIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-product',
      label: i18n.t('product.module'),
      index: 0,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(/* webpackChunkName: "product" */ 'pages/product/Index.vue'),
    children: [
      {
        path: ':id(\\d+)',
        name: 'productDetail',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/ProductDetail.vue'
          )
      },
      {
        path: ':id(\\d+)/add',
        name: 'productAdd',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/ProductForm.vue'
          )
      },
      {
        path: ':id/:openType(edit|copy)',
        name: 'productEdit',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/ProductForm.vue'
          )
      },
      {
        path: ':id/move',
        name: 'productMove',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/ProductMove.vue'
          )
      },
      {
        path: ':id/history',
        name: 'productHistory',
        hideInMenu: true,
        props: route => ({
          id: route.params.id,
          objectID: route.params.id,
          type: 'product'
        }),
        meta: {
          icon: 'help',
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "history" */ 'components/base/TwHistory.vue'
          )
      },
      {
        path: 'pk/:classification/:id',
        name: 'productPK',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/pk/Index.vue'
          )
      },
      {
        path: 'matchbyprocess',
        name: 'matchByProcess',
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/selection/MatchByProcess.vue'
          )
      },
      {
        path: 'selection',
        name: 'productSelection',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/selection/SelectionList.vue'
          )
      },
      {
        path: 'selection/:id(\\d+)',
        name: 'productSelectionDetail',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/selection/SelectionDetail.vue'
          )
      },
      {
        path: 'selection/:selectionId(\\d+)/edit/:id(\\d+)',
        name: 'workPieceEdit',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
                /* webpackChunkName: "product" */ 'components/product/ProductDetail.vue'
          )
      },
      {
        path: 'selection/archived',
        name: 'archivedProductSelection',
        hideInMenu: true,
        meta: {
          icon: 'group',
          label: i18n.t('product.module'),
          requiresAuth: true,
          group: group.get('crm')
        },
        component: () =>
          import(
              /* webpackChunkName: "product" */ 'components/product/selection/SelectionArchived.vue'
          )
      }
    ]
  }
]
