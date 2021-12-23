import { i18n } from '@/boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/my/tasks',
    hideInMenu: true,
    meta: {
      group: group.get('rd')
    },
    component: () =>
      import(/* webpackChunkName: "mystuff" */ 'pages/my/MyTask.vue'),
    children: [
      {
        path: '',
        name: 'MyTasks',
        hideInMenu: true,
        meta: {
          icon: 'help',
          label: i18n.t('task.mystuff.title'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "mystuff" */ 'components/mystuff/tasks/Tasks.vue'
          )
      },
      {
        path: 'completed/:type',
        name: 'myTasksCompleted',
        hideInMenu: true,
        meta: {
          icon: 'help',
          label: i18n.t('task.mystuff.title'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "mystuff" */ 'components/mystuff/tasks/TasksCompleted.vue'
          )
      }
    ]
  }
]
