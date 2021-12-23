import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'
const config = require('app/app.config.js')
const userDefined = config.userDefined
function route () {
  const route = []
  if (userDefined) {
    userDefined.help &&
      route.push({
        path: '/help',
        name: userDefined.help,
        external: true, // 外部链接
        meta: {
          icon: 'help',
          label: i18n.t('app.help'),
          index: sort.help,
          group: group.get('system')
        }
      })
    userDefined.downloadArea &&
      route.push({
        path: '/downloadArea',
        redirect: userDefined.downloadArea,
        name: 'downloadArea', // 下载专区
        props: true,
        meta: {
          icon: 'app:tw-icon-download',
          label: i18n.t('document.downloadArea'),
          index: sort.downloadArea,
          group: group.get('oa')
        },
        component: () => import(/* webpackChunkName: "document" */ 'pages/document/DocumentIndex.vue')
      })
    // userDefined.wikiHome &&
    //   route.push({
    //     path: userDefined.wikiHome,
    //     redirect: userDefined.wikiHome,
    //     name: 'wikiHome',
    //     meta: {
    //       label: '知识库',
    //       description: '知识库',
    //       icon: 'app:tw-icon-menu-wiki',
    //       index: sort.wiki,
    //       group: group.get('oa')
    //     }
    //   })
    userDefined.room &&
      route.push({
        path: '/room',
        redirect: userDefined.room,
        name: 'room', // 下载专区
        props: true,
        meta: {
          icon: 'app:tw-icon-meeting',
          label: i18n.t('room.module'),
          index: sort.room,
          group: group.get('oa')
        }
      })
    userDefined.equipment &&
      route.push({
        path: '/equipment',
        redirect: userDefined.equipment,
        name: 'equipment',
        props: true,
        meta: {
          icon: 'app:tw-icon-meeting',
          label: i18n.t('equipment.module'),
          index: sort.downloadArea,
          group: group.get('oa')
        }
      })
    userDefined.guobiao &&
      route.push({
        path: '/guobiao',
        redirect: userDefined.guobiao,
        name: 'guobiao',
        props: true,
        meta: {
          icon: 'app:tw-icon-guobiao',
          label: i18n.t('document.guobiao'),
          index: sort.guobiao,
          group: group.get('oa')
        }
      })
  }
  return route
}

/** 用户自建应用 */
export default route()
