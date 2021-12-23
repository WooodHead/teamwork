import { i18n } from '../../boot/i18n'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)/task',
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
      import(/* webpackChunkName: "task" */ 'pages/task/Index.vue'),
    children: [
      {
        path: '',
        name: 'task',
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
          import(/* webpackChunkName: "task" */ 'components/task/TaskIndex.vue')
      },
      {
        path: 'archived',
        name: 'archivedTaskLists',
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/ArchivedTaskLists')
      },
      {
        path: 'tags',
        name: 'TaskTagCount',
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskTagCount')
      },
      {
        path: 'tags/:tag',
        name: 'TasksIncludesTag',
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TasksIncludesTag')
      },
      {
        path: ':id(\\d+)/archived',
        name: 'archivedTasks',
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/ArchivedTasks')
      },
      {
        path: ':id(\\d+)',
        name: 'taskDetail',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskDetail.vue')
      },
      {
        path: ':id/send',
        name: 'sendToSomeone',
        props: route => ({
          id: route.params.id,
          type: 'task',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/resource/ResourceSend.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'taskItemEdit',
        props: route => ({
          id: route.params.id,
          category: route.params.category,
          objectID: Number(route.params.objectID),
          action: 'edit',
          focus: route.params.focus
        }),
        hideInMenu: true,
        meta: {
          icon: 'edit',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/form/TaskFormItem.vue')
      },
      {
        path: ':id(\\d+)/move',
        name: 'taskMove',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskMoveCopy.vue')
      },
      {
        path: ':id(\\d+)/copy',
        name: 'taskCopy',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskMoveCopy.vue')
      },
      {
        path: ':ids/batch/move',
        name: 'taskBatchMove',
        hideInMenu: true,
        props: route => ({
          ids: route.params.ids,
          category: route.params.category,
          objectID: Number(route.params.objectID),
          actionType: 'move'
        }),
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskMoveCopyBatch.vue')
      },
      {
        path: ':ids/batch/copy',
        name: 'taskBatchCopy',
        hideInMenu: true,
        props: route => ({
          ids: route.params.ids,
          category: route.params.category,
          objectID: Number(route.params.objectID),
          actionType: 'copy'
        }),
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskMoveCopyBatch.vue')
      },
      {
        path: ':ids/batch/assigned',
        name: 'taskBatchAssigned',
        hideInMenu: true,
        props: route => ({
          ids: route.params.ids,
          category: route.params.category,
          objectID: Number(route.params.objectID),
          actionType: 'assigned'
        }),
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/TaskAssignedBatch.vue')
      },
      {
        path: ':id/history',
        name: 'taskHistory',
        hideInMenu: true,
        props: route => ({
          id: Number(route.params.id),
          category: route.params.category,
          objectID: Number(route.params.objectID),
          type: 'task'
        }),
        meta: {
          icon: 'history',
          label: i18n.t('task.module'),
          requiresAuth: true
        },
        component: () =>
          import(/* webpackChunkName: "history" */ 'components/base/TwHistory.vue')
      },
      {
        path: 'chart',
        name: 'taskChart',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'list',
          label: i18n.t('task.module'),
          index: 30,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(/* webpackChunkName: "task" */ 'components/task/dashboard/TaskChart.vue')
      }
    ]
  }
]
