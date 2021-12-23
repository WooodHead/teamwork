import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: 'generate-public-link/:category/:param',
    name: 'generatePublicLink',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'assignment',
      label: i18n.t('publicLink.module'),
      index: 0,
      group: group.get('tool')
    },
    component: () => import(/* webpackChunkName: "share" */'pages/PageGeneratePublicLink.vue')
  }
]
