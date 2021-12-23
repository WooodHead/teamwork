import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/contacts',
    name: 'contacts',
    meta: {
      icon: 'app:tw-icon-contacts',
      label: i18n.t('contacts.module'),
      index: sort.contacts,
      requiresAuth: true,
      group: group.get('oa')
    },
    component: () => import(/* webpackChunkName: "contacts" */'pages/contacts/Index'),
    children: [
      {
        path: '/contacts',
        name: 'contactsHome',
        meta: {
          icon: 'app:tw-icon-contacts',
          label: i18n.t('contacts.module'),
          index: sort.contacts,
          group: group.get('oa'),
          keepAlive: true
        },
        component: () => import(/* webpackChunkName: "contacts" */'components/contacts/ContactsHome')
      },
      {
        path: ':type/:id',
        name: 'contactsSub',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-contacts',
          label: i18n.t('contacts.module'),
          keepAlive: true
        },
        component: () => import(/* webpackChunkName: "contacts" */'components/contacts/ContactsSub.vue')
      },
      {
        path: ':category?/:objectID(\\d+)?/chat',
        name: 'groupChat',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'chat',
          label: '聊天室'
        },
        component: () => import(/* webpackChunkName: "chat" */ 'components/chat/ChatRoom.vue')
      },
      {
        path: ':category?/:objectID(\\d+)?/chat/files',
        name: 'groupChatFiles',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'chat',
          label: '文件'
        },
        component: () => import(/* webpackChunkName: "chat" */ 'components/chat/ChatFiles.vue')
      }
    ]
  }
]
