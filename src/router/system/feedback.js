import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'
export default [
  {
    path: '/feedback',
    name: 'adminFeedbackHome',
    meta: {
      icon: 'description',
      label: i18n.t('feedback.module'),
      index: sort.feedback,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "feedback" */ 'pages/feedback/AdminFeedback.vue')
  },
  {
    path: '/feedback',
    name: 'adminFeedbackIndex',
    hideInMenu: true,
    meta: {
      group: group.get('system'),
      label: i18n.t('feedback.module')
    },
    component: () => import(/* webpackChunkName: "feedback" */ 'pages/feedback/Index.vue'),
    children: [
      {
        path: '/feedback/chat-room/:id',
        name: 'chatRoom',
        props: route => ({
          id: Number(route.params.id)
        }),
        hideInMenu: true,
        meta: {
          icon: 'local_post_office',
          label: i18n.t('feedback.module'),
          index: 10,
          group: group.get('system')
        },
        component: () =>
          import(/* webpackChunkName: "feedback" */ 'pages/feedback/ChatRoom.vue')
      }
    ]
  }
]
