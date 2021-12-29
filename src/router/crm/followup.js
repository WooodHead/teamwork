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
      },
      {
        path: ':id(\\d+)',
        name: 'followupDetail',
        props: route => ({
          type: 'followup',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('crm'),
          description: '跟进列表'
        },
        component: () =>
          import(
            /* webpackChunkName: "followup" */ 'src/components/followup/FollowupDetail.vue'
          )
      },
      {
        path: ':id(\\d+)/edit',
        name: 'followupEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID,
          showUploadDialog: route.params.showUploadDialog
        }),
        hideInMenu: true,
        meta: {
          group: group.get('crm'),
          description: '编辑跟进'
        },
        component: () => import(/* webpackChunkName: "followup" */ 'components/followup/FollowupEdit.vue')
      }
    ]
  }
]
