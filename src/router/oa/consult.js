import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/consult',
    name: 'consultHome',
    hideInMenu: false,
    meta: {
      icon: 'app:tw-icon-consult',
      label: i18n.t('consult.module'),
      index: sort.consult,
      requiresAuth: true,
      group: group.get('oa')
    },
    component: () =>
      import(/* webpackChunkName: "consult" */ 'pages/PageConsult.vue'),
    children: [
      {
        path: 'item',
        name: 'consultItem',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-consult',
          label: i18n.t('consult.module'),
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(/* webpackChunkName: "consult" */ 'components/consult/item/ItemList')
      },
      {
        path: 'transactor',
        name: 'consultTransactor',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-consult',
          label: i18n.t('consult.module'),
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(/* webpackChunkName: "consult" */ 'components/consult/transactor/TransactorList')
      },
      {
        path: 'item/:itemId(\\d+)/transactor/:transactorId(\\d+)/:openType(add)',
        name: 'consultAdd',
        hideInMenu: true,
        props: route => ({
          openType: route.params.openType,
          transactorId: route.params.transactorId,
          itemId: route.params.itemId
        }),
        meta: {
          icon: 'app:tw-icon-consult',
          label: i18n.t('consult.module'),
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(/* webpackChunkName: "consult" */ 'components/consult/ConsultForm.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'consultDetail',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'app:tw-icon-consult',
          label: i18n.t('consult.module'),
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(/* webpackChunkName: "consult" */ 'components/consult/detail/ConsultDetail.vue')
      }
    ]
  }
]
