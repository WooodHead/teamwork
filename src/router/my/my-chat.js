// import { i18n } from '../../boot/i18n'
// import sort from '../sort'
// import group from '../group'

export default [
  {
    path: 'my/chat',
    name: 'myChat',
    props: true,
    meta: {
      icon: 'chat',
      label: '聊天中心'
    },
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "chat" */'pages/chat/ChatCenter')
  }
]
