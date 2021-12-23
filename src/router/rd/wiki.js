import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/wiki',
    meta: {
      label: i18n.t('wiki.title'),
      description: i18n.t('wiki.notes'),
      icon: 'app:tw-icon-menu-wiki',
      index: sort.wiki,
      group: group.get('oa')
    },
    component: () =>
      import(/* webpackChunkName: "wiki" */ 'pages/wiki/WikiIndex.vue'),
    children: [
      {
        path: '/wiki',
        name: 'wikiHome',
        meta: {
          label: i18n.t('wiki.title'),
          description: i18n.t('wiki.notes'),
          group: group.get('oa'),
          requiresAuth: true,
          icon: 'app:tw-icon-menu-wiki'
        },
        component: () =>
          import(/* webpackChunkName: "wiki" */ 'components/wiki/WikiIndex.vue')
      },
      {
        path: ':id(\\d+)/manage',
        name: 'wikiManage',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'wikiHome',
          icon: 'app:tw-icon-menu-wiki',
          label: i18n.t('wiki.title'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
            /* webpackChunkName: "wiki" */ 'components/wiki/WikiManage.vue'
          )
      },
      {
        path: 'add',
        name: 'wikiAdd',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'wikiHome',
          icon: 'app:tw-icon-menu-wiki',
          label: i18n.t('wiki.title'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
            /* webpackChunkName: "wiki" */ 'components/wiki/WikiSpaceForm.vue'
          )
      },
      {
        path: ':id(\\d+)/edit',
        name: 'wikiEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          goBack: 'wikiHome',
          icon: 'app:tw-icon-menu-wiki',
          label: i18n.t('wiki.title'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
            /* webpackChunkName: "wiki" */ 'components/wiki/WikiSpaceForm.vue'
          )
      }
    ]
  }
]
