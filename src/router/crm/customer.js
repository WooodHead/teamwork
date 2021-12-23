import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/customer',
    name: 'customerHome',
    hideInMenu: false,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-customer-manage',
      label: i18n.t('customer.module'),
      index: sort.customer,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(/* webpackChunkName: "customer" */ 'pages/PageCustomer.vue')
  },
  {
    path: '/customer',
    name: 'customerIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-customer-manage',
      group: group.get('crm'),
      requiresAuth: true
    },
    component: () =>
      import(
            /* webpackChunkName: "customer" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: ':id/:openType(add|edit)',
        name: 'customerEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-customer-manage',
          label: i18n.t('customer.update')
        },
        component: () => import(/* webpackChunkName: "customer" */ 'components/customer/CustomerEdit.vue')
      },
      {
        path: ':id',
        name: 'customerDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'customerHome',
          icon: 'app:tw-icon-customer-manage',
          label: i18n.t('customer.module')
        },
        component: () => import(/* webpackChunkName: "customer" */ 'components/customer/CustomerDetail.vue')
      }
    ]
  }
]
