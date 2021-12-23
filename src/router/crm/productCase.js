import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/select-product-case',
    // hideInMenu: false,
    meta: {
      icon: 'app:tw-icon-product',
      label: i18n.t('productCase.module'),
      index: sort.product,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(
        /* webpackChunkName: "product" */ 'pages/product-case/ProductCaseIndex.vue'
      ),
    children: [
      {
        path: '/select-product-case',
        hideInMenu: false,
        name: 'productCaseHome',
        meta: {
          label: i18n.t('productCase.module'),
          group: group.get('crm'),
          requiresAuth: true,
          icon: 'app:tw-icon-product'
        },
        component: () =>
          import(
            /* webpackChunkName: "document" */ 'components/product-case/ProductCaseFolder.vue'
          )
      },
      {
        path: 'detail/:id(\\d+)',
        props: true,
        hideInMenu: true,
        name: 'productCaseDetail',
        meta: {
          label: i18n.t('productCase.module'),
          group: group.get('crm'),
          requiresAuth: true,
          icon: 'app:tw-icon-product'
        },
        component: () =>
          import(
            /* webpackChunkName: "document" */ 'components/product-case/ProductCaseDetail.vue'
          )
      }
    ]
  }
]
