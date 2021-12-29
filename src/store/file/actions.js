import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/document',
    meta: {
      label: i18n.t('document.center'),
      index: sort.documentCenter,
      group: group.get('oa'),
      requiresAuth: true,
      description: '文档中心',
      icon: 'app:tw-icon-document'
    },
    component: () => import(/* webpackChunkName: "document" */ 'pages/document/DocumentIndex.vue'),
    children: [
      {
        path: '/document',
        name: 'documentCenter',
        meta: {
          label: i18n.t('document.center'),
          group: group.get('oa'),
          requiresAuth: true,
          description: '文件夹详情页',
          icon: 'app:tw-icon-document'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/folder/FolderIndex.vue')
      }
    ]
  },
  {
    path: '/:category?/:objectID?/document',
    props: true,
    hideInMenu: true,
    meta: {
      group: group.get('tool'),
      icon: 'description',
      label: i18n.t('document.center')
    },
    component: () => import(/* webpackChunkName: "document" */ 'pages/document/DocumentIndex.vue'),
    children: [
      {
        path: '',
        name: 'document',
        hideInMenu: true,
        props: true,
        meta: {
          label: i18n.t('document.folder'),
          group: group.get('rd'),
          requiresAuth: true,
          description: '文件夹详情页',
          icon: 'app:tw-icon-document'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/folder/FolderIndex.vue')
      },
      {
        path: 'folder/:id',
        name: 'folder',
        hideInMenu: true,
        props: true,
        meta: {
          label: i18n.t('document.folder'),
          group: group.get('rd'),
          requiresAuth: true,
          description: '文件夹详情页',
          icon: 'app:tw-icon-document'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/folder/FolderIndex.vue')
      },
      {
        path: 'folder/:id/copy',
        name: 'folderCopy',
        hideInMenu: true,
        props: route => ({
          action: 'copy',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'content_copy',
          label: i18n.t('document.routerNotes.folderCopy'),
          group: group.get('rd'),
          description: '文件夹复制'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'folder/:id/move',
        name: 'folderMove',
        hideInMenu: true,
        props: route => ({
          action: 'move',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'redo',
          label: i18n.t('document.routerNotes.move'),
          group: group.get('rd'),
          description: '文件夹移动'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'folder/:id/draft',
        name: 'draftDocuments',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'drafts',
          label: i18n.t('document.routerNotes.draftDocuments'),
          group: group.get('rd'),
          description: '草稿文件列表'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/draft/DraftDocuments.vue')
      },
      {
        path: 'folder/:id/archived',
        name: 'archivedDocuments',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'archive',
          label: i18n.t('document.routerNotes.archivedDocuments'),
          group: group.get('rd'),
          description: '归档文件列表'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/ArchivedDocuments.vue')
      },
      {
        path: 'folder/:id/add',
        name: 'docAdd',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'add',
          label: i18n.t('document.routerNotes.addDoc'),
          group: group.get('rd'),
          description: '新建文档'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/doc/DocForm.vue')
      },
      {
        path: 'folder/:id/add/markmap',
        name: 'markmapAdd',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'add',
          label: i18n.t('document.routerNotes.addMarkMap'),
          group: group.get('rd'),
          description: '新建思维导图'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/markmap/MarkMapForm.vue')
      },
      {
        path: 'folder/:id/upload/:fileTag?',
        name: 'fileUpload',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'file_upload',
          label: i18n.t('document.action.upload'),
          description: '上传文档'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/file/FileUpload.vue')
      },
      {
        path: 'folder/:id/link',
        name: 'linkAdd',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'add',
          label: i18n.t('document.routerNotes.addLink'),
          group: group.get('rd'),
          description: '创建链接文档'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/link/LinkForm.vue')
      },
      {
        path: 'doc/:id',
        name: 'docDetail',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'insert_drive_file',
          label: i18n.t('document.routerNotes.detail'),
          group: group.get('rd'),
          description: '文档详情页(在线编辑文档)'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentDetail.vue')
      },
      {
        path: 'file/:id',
        name: 'fileDetail',
        hideInMenu: true,
        props: route => ({
          id: route.params.id,
          category: route.params.category === 'select-product-case' ? 'productCase' : route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'insert_drive_file',
          label: i18n.t('document.routerNotes.fileDetail'),
          index: 10,
          group: group.get('rd'),
          description: '文档详情页(上传的文档)'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/file/FileDetail.vue')
      },
      {
        path: 'link/:id',
        name: 'linkDetail',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'link',
          label: i18n.t('document.routerNotes.fileDetail'),
          index: 10,
          group: group.get('rd'),
          description: '链接文档详情页'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/link/LinkDetail.vue')
      },
      {
        path: 'doc/:id/edit',
        name: 'docEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'insert_drive_file',
          label: i18n.t('document.routerNotes.edit'),
          group: group.get('rd'),
          description: '编辑文档'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/doc/DocForm.vue')
      },
      {
        path: 'doc/:id/edit/markmap',
        name: 'markmapEdit',
        props: route => ({
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'add',
          label: i18n.t('document.routerNotes.editMarkMap'),
          group: group.get('rd'),
          description: '编辑思维导图'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/markmap/MarkMapForm.vue')
      },
      {
        path: 'file/:id/edit',
        name: 'fileEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category === 'select-product-case' ? 'productCase' : route.params.category,
          objectID: +route.params.objectID,
          showUploadDialog: route.params.showUploadDialog
        }),
        hideInMenu: true,
        meta: {
          group: group.get('rd'),
          description: '编辑上传文档',
          icon: 'insert_drive_file',
          label: i18n.t('document.routerNotes.edit')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/file/FileUpload.vue')
      },
      {
        path: 'link/:id/edit',
        name: 'linkEdit',
        props: route => ({
          openType: 'edit',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'link',
          label: i18n.t('document.routerNotes.editLink'),
          group: group.get('rd'),
          description: '编辑链接文档'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/link/LinkForm.vue')
      },
      {
        path: 'doc/:id/copy',
        name: 'docCopy',
        hideInMenu: true,
        props: route => ({
          action: 'copy',
          id: route.params.id,
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'content_copy',
          label: i18n.t('document.routerNotes.copy'),
          group: group.get('rd'),
          description: '文档复制(在线填写文档)'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'file/:id/copy',
        name: 'fileCopy',
        hideInMenu: true,
        props: route => ({
          action: 'copy',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        meta: {
          group: group.get('rd'),
          description: '文档复制(上传的文档)',
          icon: 'content_copy',
          label: i18n.t('document.routerNotes.fileCopy')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'link/:id/copy',
        name: 'linkCopy',
        hideInMenu: true,
        props: route => ({
          action: 'copy',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        meta: {
          icon: 'content_copy',
          label: i18n.t('document.routerNotes.copy'),
          group: group.get('rd'),
          description: '链接文档复制'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'doc/:id/move',
        name: 'docMove',
        hideInMenu: true,
        props: route => ({
          action: 'move',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        meta: {
          icon: 'redo',
          label: i18n.t('document.routerNotes.move'),
          group: group.get('rd'),
          description: '文档移动(在线的文档)'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'file/:id/move',
        name: 'fileMove',
        hideInMenu: true,
        props: route => ({
          action: 'move',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        meta: {
          group: group.get('rd'),
          description: '文档移动(上传的文档)',
          icon: 'redo',
          label: i18n.t('document.routerNotes.move')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: 'link/:id/move',
        name: 'linkMove',
        hideInMenu: true,
        props: route => ({
          action: 'move',
          id: route.params.id,
          category: route.params.category,
          objectID: +route.params.objectID
        }),
        meta: {
          icon: 'redo',
          label: i18n.t('document.routerNotes.move'),
          group: group.get('rd'),
          description: '链接文档移动'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/DocumentMoveCopy.vue')
      },
      {
        path: ':classify(file|link|doc)/:id(\\d+)/send',
        name: 'documentSend',
        hideInMenu: true,
        props: route => ({
          id: route.params.id,
          type: 'document',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        meta: {
          icon: 'person_add',
          label: i18n.t('document.routerNotes.send'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/resource/ResourceSend.vue')
      },
      {
        path: 'doc/:id/history',
        name: 'docHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档历史记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档历史记录'
        },
        component: () => import('components/document/DocumentHistory')
      },
      {
        path: 'markmap/:id/history',
        name: 'markmapHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档历史记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档历史记录'
        },
        component: () => import('components/document/DocumentHistory')
      },
      {
        path: 'file/:id/history',
        name: 'fileHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档历史记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档历史记录'
        },
        component: () => import('components/document/DocumentHistory')
      },
      {
        path: 'link/:id/history',
        name: 'linkHistory',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '链接历史记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '链接历史记录'
        },
        component: () => import('components/document/DocumentHistory')
      },
      // 查看访问下载记录 
      {
        path: 'doc/:id/count',
        name: 'docCount',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档访问下载记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档访问下载记录'
        },
        component: () => import('components/document/DocumentOrNoticeCount')
      },
      {
        path: 'markmap/:id/count',
        name: 'markmapCount',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档访问下载记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档访问下载记录'
        },
        component: () => import('components/document/DocumentOrNoticeCount')
      },
      {
        path: 'file/:id/count',
        name: 'fileCount',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '文档访问下载记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '文档访问下载记录'
        },
        component: () => import('components/document/DocumentOrNoticeCount')
      },

      {
        path: 'link/:id/count',
        name: 'linkCount',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: '链接访问下载记录',
          group: group.get('rd'),
          index: 80,
          requiresAuth: true,
          description: '链接访问下载记录'
        },
        component: () => import('components/document/DocumentOrNoticeCount')
      },
      {
        path: 'file/:id/versions',
        name: 'fileVersion',
        hideInMenu: true,
        props: true,
        meta: {
          group: group.get('rd'),
          description: '文档历史版本',
          icon: 'insert_drive_file',
          label: '文档历史版本'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/file/FileVersion.vue')
      },
      {
        path: 'folder/:id/trash',
        name: 'documentTrash',
        hideInMenu: true,
        props: true,
        meta: {
          label: i18n.t('document.trash'),
          group: group.get('rd'),
          requiresAuth: true,
          description: '文档废纸篓',
          icon: 'app:tw-icon-document'
        },
        component: () => import(/* webpackChunkName: "document" */ 'components/document/TrashList.vue')
      }
    ]
  },
  {
    path: '/download',
    name: 'download',
    hideInMenu: true,
    meta: {
      icon: 'file_download',
      label: i18n.t('document.download'),
      index: 0,
      requiresAuth: false,
      group: group.get('index')
    },
    component: () =>
      import(/* webpackChunkName: "file" */'pages/PageDownload.vue'),
    props: (route) => ({ file: route.query.file, size: route.query.size })
  }
]
