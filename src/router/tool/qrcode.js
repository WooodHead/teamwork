import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/qrcode',
    name: 'qrcode',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'crop_free',
      label: i18n.t('qrcode.title'),
      index: 0,
      requiresAuth: true,
      group: group.get('tool')
    },
    component: () => import('pages/qrcode/index.vue')
  }
]
