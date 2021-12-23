import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)/followup',
    props: true,
    hideInMenu: true,
    meta: {
      icon: 'business',
      label: i18n.t('followup.title'),
      keepAlive: true, // 是否需要被缓存
      index: 0,
      group: group.get('crm')
    },
    component: () => import(/* webpackChunkName: "followup" */ 'pages/followup/Index.vue'),
    children: [
      {
        path: '',
        name: 'followup',
        props: true,
        hideInMenu: true,
        meta: {
          group: group.get('crm'),
          description: '跟进列表'
        },
        component: () => import(/* webpackChunkName: "followup" */ 'components/followup/FollowupIndex.vue')
      }
    ]
  }
]
