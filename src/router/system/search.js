import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/search',
    redirect: '/search/result',
    name: 'searchIndex',
    hideInMenu: true,
    meta: {
      icon: 'search',
      label: i18n.t('search.module'),
      index: sort.settings,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ 'pages/search/Index.vue'),
    children: [
      {
        path: 'result/:query',
        name: 'search',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'search',
          label: i18n.t('search.module'),
          index: 10,
          requiresAuth: true,
          group: group.get('system')
        },
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/search/PageSearchResult.vue')
      }
    ]
  }, {
    path: 'search-panel',
    name: 'SearchPanel',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'search',
      label: i18n.t('search.module'),
      index: 10,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () => import(/* webpackChunkName: "search" */ 'components/search/SearchPanel.vue')
  }
]
