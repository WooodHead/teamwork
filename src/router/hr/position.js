import { i18n } from '../../boot/i18n'
import group from '../group'
import sort from '../sort'

export default [
  {
    path: '/position',
    name: 'positionHome',
    hideInMenu: false,
    meta: {
      icon: 'card_membership',
      label: i18n.t('position.module'),
      index: sort.position,
      requiresAuth: true,
      group: group.get('hr')
    },
    component: () =>
      import(/* webpackChunkName: "hr" */ 'pages/position/PagePosition')
  },
  {
    path: '/position',
    name: 'PositionIndex',
    hideInMenu: true,
    meta: {
      group: group.get('hr'),
      icon: 'card_membership',
      label: i18n.t('position.module'),
      onlyDesktop: true
    },
    component: () =>
      import(/* webpackChunkName: "project" */ 'pages/position/PositionIndex'),
    children: [
      {
        path: 'import',
        name: 'importPosition',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'card_membership',
          label: i18n.t('position.importPosition'),
          index: sort.position,
          requiresAuth: true,
          group: group.get('hr')
        },
        component: () =>
          import(/* webpackChunkName: "hr" */ 'components/position/ImportPosition')
      }
    ]
  },
  {
    path: '/position/view',
    name: 'ViewPosition',
    hideInMenu: true,
    meta: {
      icon: 'card_membership',
      label: i18n.t('position.showPosition'),
      index: sort.position,
      requiresAuth: true,
      group: group.get('hr')
    },
    component: () =>
      import(/* webpackChunkName: "hr" */ 'components/position/ViewPosition')
  }
]
