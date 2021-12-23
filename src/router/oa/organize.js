import { i18n } from '../../boot/i18n'
// import sort from '../sort'
// import group from '../group'

export default [
  {
    path: '/organize',
    name: 'organizeHome',
    hideInMenu: true,
    redirect: { name: 'contactsHome' }
  },
  {
    path: '/organize',
    name: 'organizeIndex',
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "organize" */'pages/resource/ResourceIndex.vue'),
    children: [
      {
        path: ':id(\\d+)',
        name: 'organizeDetail',
        props: true,
        hideInMenu: true,
        meta: {
          label: i18n.t('organize.module')
        },
        component: () => import(/* webpackChunkName: "organize" */'components/organize/OrganizeDetail.vue')
      },
      {
        path: ':id(\\d+)/:openType(edit)',
        name: 'organizeEdit',
        props: route => ({
          openType: route.params.openType,
          id: Number(route.params.id)
        }),
        meta: {
          label: i18n.t('organize.update')
        },
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "organize" */'components/organize/OrganizeEdit.vue')
      }
    ]
  }
]
