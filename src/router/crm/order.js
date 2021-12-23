import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/order',
    name: 'orderHome',
    hideInMenu: false,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-order-manage',
      label: i18n.t('order.module'),
      index: sort.order,
      group: group.get('crm')
    },
    component: () =>
      import(/* webpackChunkName: "order" */ 'pages/order/PageOrder.vue')
  },
  {
    path: '/order',
    name: 'orderIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-order-manage',
      label: i18n.t('order.module')
    },
    component: () =>
      import(
            /* webpackChunkName: "order" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: ':id/:openType(add|edit)',
        name: 'orderEdit',
        props: true,
        hideInMenu: true,
        component: () =>
          import(
                /* webpackChunkName: "order" */ 'components/order/OrderEdit.vue'
          )
      },
      {
        path: ':id(\\d+)',
        name: 'orderDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'orderHome'
        },
        component: () =>
          import(
                /* webpackChunkName: "order" */ 'components/order/OrderDetail.vue'
          )
      },
      {
        path: 'archived',
        name: 'archivedOrders',
        props: true,
        hideInMenu: true,
        component: () =>
          import(
                /* webpackChunkName: "order" */ 'components/order/OrderArchived'
          )
      }
    ]
  }
]
