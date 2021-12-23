import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/person/:id',
    name: 'personDetail',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'person',
      label: '人员详情',
      index: 0,
      group: group.get('oa')
    },
    component: () => import(/* webpackChunkName: "person" */'pages/PagePersonHome.vue')
  },
  {
    path: '/person',
    name: 'personIndex',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'person',
      label: i18n.t('person.title'),
      index: 10,
      group: group.get('oa')
    },
    component: () => import(/* webpackChunkName: "person" */'pages/resource/ResourceIndex.vue'),
    children: [
      {
        path: ':id/edit',
        name: 'personEdit',
        hideInMenu: true,
        props: route => ({
          id: Number(route.params.id)
        }),
        meta: {
          icon: 'edit',
          label: '维护人员',
          description: '维护人员'
        },
        component: () => import(/* webpackChunkName: "person" */'components/person/PersonEdit.vue')
      },
      {
        path: ':datetime/approval',
        name: 'personApproval',
        hideInMenu: true,
        props: route => ({
          datetime: String(route.params.datetime)
        }),
        meta: {
          icon: 'edit',
          label: '审批人员',
          description: '审批人员'
        },
        component: () => import(/* webpackChunkName: "person" */'components/person/PersonEdit.vue')
      }
    ]
  }
]
