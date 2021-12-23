// import { i18n } from '../../boot/i18n'
// import sort from '../sort'
// import group from '../group'

export default [
  {
    path: '/:category?/:objectID(\\d+)?/chat',
    props: true,
    meta: {
      icon: 'chat',
      label: '聊天室'
    },
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "chat" */'pages/chat/Index'),
    children: [
      {
        path: '',
        name: 'chat',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'chat',
          label: '聊天室'
        },
        component: () => import(/* webpackChunkName: "chat" */ 'components/chat/ChatRoom.vue')
      },
      {
        path: 'files',
        name: 'chatFiles',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'chat',
          label: '文件'
        },
        component: () => import(/* webpackChunkName: "chat" */ 'components/chat/ChatFiles.vue')
      },
      {
        path: 'members',
        name: 'chatMembers',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'chat',
          label: '成员'
        },
        component: () => import(/* webpackChunkName: "chat" */ 'components/chat/ChatMembers.vue')
      }
    ]
  }
]
