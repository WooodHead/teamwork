import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'
const config = require('app/app.config.js')
const thirdpartyApp = config.thirdpartyApp

export default [
  {
    path: thirdpartyApp.help,
    name: 'help',
    external: true, // 外部链接
    meta: {
      icon: 'help',
      label: i18n.t('app.help'),
      index: sort.help,
      group: group.get('system')
    }
    // component: () =>
    //   import(/* webpackChunkName: "help" */ 'pages/PageHelp.vue')
  }
]
