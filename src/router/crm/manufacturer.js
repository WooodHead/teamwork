import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/manufacturer',
    name: 'manufacturerHome',
    hideInMenu: false,
    meta: {
      icon: 'app:tw-icon-production',
      label: i18n.t('manufacturer.title'),
      index: sort.manufacturer,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(/* webpackChunkName: "manufacturer" */ 'pages/manufacturer/PageManufacturer.vue')
  },
  {
    path: '/manufacturer',
    name: 'manufacturerIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-production',
      group: group.get('crm'),
      requiresAuth: true
    },
    component: () =>
      import(
            /* webpackChunkName: "manufacturer" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: ':id(\\d+)?/:openType(add|edit)',
        name: 'manufacturerEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-production',
          label: i18n.t('manufacturer.update')
        },
        component: () => import(/* webpackChunkName: "manufacturer" */ 'components/manufacturer/ManufacturerEdit.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'manufacturerDetail',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-production',
          label: i18n.t('manufacturer.title')
        },
        component: () => import(/* webpackChunkName: "manufacturer" */ 'components/manufacturer/ManufacturerDetail.vue')
      }
    ]
  }
]
