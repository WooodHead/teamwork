import { i18n } from '@/boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)/notice',
    hideInMenu: true,
    props: true,
    meta: {
      icon: 'list',
      label: i18n.t('task.module'),
      index: 0,
      requiresAuth: true,
      group: group.get('tool'),
      keepAlive: false
    },
    component: () =>
      import(/* webpackChunkName: "task" */ 'pages/notice/Index.vue'),
    children: [
      {
        path: '',
        name: 'notice',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/notice/NoticeIndex.vue')
      },
      {
        path: 'draft',
        name: 'noticeDrafts',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'assignment',
          label: i18n.t('notice.title'),
          keepAlive: true, // 是否需要被缓存
          index: 0,
          group: group.get('tool')
        },
        component: () => import(/* webpackChunkName: "notice" */'components/notice/NoticeDrafts.vue')
      },
      {
        path: 'archived',
        name: 'archivedNotices',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'assignment',
          label: i18n.t('notice.title'),
          keepAlive: true, // 是否需要被缓存
          index: 0,
          group: group.get('tool')
        },
        component: () => import(/* webpackChunkName: "notice" */'components/notice/ArchivedNotices.vue')
      },
      {
        path: 'add',
        name: 'noticeAdd',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('rd'),
          description: '新建公告'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/doc/DocForm.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'noticeDetail',
        props: route => ({
          type: 'notice',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'assignment',
          label: i18n.t('notice.title'),
          index: 10,
          group: group.get('oa')
        },
        component: () => import(/* webpackChunkName: "notice" */ 'components/notice/NoticeDetail.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'noticeEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID,
          showUploadDialog: route.params.showUploadDialog
        }),
        hideInMenu: true,
        meta: {
          group: group.get('rd'),
          description: '编辑公告'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/doc/DocForm.vue')
      },
      {
        path: ':id(\\d+)/send',
        name: 'noticeSend',
        hideInMenu: true,
        props: route => ({
          id: route.params.id,
          type: 'notice',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'assignment',
          label: i18n.t('notice.title'),
          requiresAuth: true
        },
        component: () =>
          import(
                /* webpackChunkName: "notice" */ 'components/resource/ResourceSend.vue')
      },
      {
        path: ':id(\\d+)/history',
        name: 'noticeHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('notice.title'),
          index: 50,
          requiresAuth: true,
          group: group.get('oa')
        },
        component: () =>
          import(
                /* webpackChunkName: "notice" */ 'components/notice/NoticeHistory.vue')
      },
      {
        path: ':id(\\d+)/copy',
        name: 'noticeCopy',
        hideInMenu: true,
        props: route => ({
          action: 'copy',
          type: 'notice',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'content_copy',
          label: i18n.t('document.routerNotes.copy'),
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () => import(
              /* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: ':id(\\d+)/move',
        name: 'noticeMove',
        hideInMenu: true,
        props: route => ({
          action: 'move',
          type: 'notice',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'redo',
          label: i18n.t('document.routerNotes.move'),
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'upload',
        name: 'noticeUpload',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'file_upload',
          label: i18n.t('document.action.upload')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/doc/DocForm.vue')
      }
    ]
  }
]
