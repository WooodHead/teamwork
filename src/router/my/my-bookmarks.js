import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/bookmarks',
    name: 'myBookmarks',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'bookmark',
      label: i18n.t('bookmark.module'),
      requiresAuth: false,
      group: group.get('tool')
    },
    component: () =>
      import(/* webpackChunkName: "bookmark" */ 'pages/my/MyBookmark.vue')
  }
]
