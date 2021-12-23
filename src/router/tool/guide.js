// import { i18n } from '../../boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)/guide',
    name: 'guide',
    hideInMenu: true,
    meta: {
      group: group.get('tool'),
      label: '创建项目引导步骤'
    },
    component: () => import(/* webpackChunkName: "guide" */ 'pages/PageGuide.vue'),
    children: [
      {
        path: ':step',
        name: 'guideStep',
        props: route => ({
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '创建项目引导步骤',
          label: '创建项目引导步骤'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/GuideStep.vue')
      },
      {
        path: 'member/add',
        name: 'memberGuide',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '添加项目成员',
          label: '添加项目成员'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/MemberGuide.vue')
      },
      {
        path: 'schedule/add',
        name: 'scheduleGuide',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '新建日程',
          label: '新建日程安排'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/ScheduleGuide.vue')
      },
      {
        path: 'document/add',
        name: 'documentGuide',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '新建文档',
          label: '新建文档'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/DocumentGuide.vue')
      },
      {
        path: 'task/add',
        name: 'taskGuide',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '新建待办任务',
          label: '新建待办任务'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/TaskGuide.vue')
      },
      {
        path: 'notice/add',
        name: 'noticeGuide',
        props: route => ({
          openType: 'add',
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '新建公告',
          label: '新建公告'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/NoticeGuide.vue')
      },
      {
        path: 'approval/add',
        name: 'approvalGuide',
        props: route => ({
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '立项',
          label: '立项'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/ApprovalGuide.vue')
      },
      {
        path: 'settings/add',
        name: 'settingsGuide',
        props: route => ({
          category: route.params.category,
          objectID: route.params.objectID
        }),
        hideInMenu: true,
        meta: {
          group: group.get('tool'),
          description: '设置工具包',
          label: '设置工具包'
        },
        component: () => import(/* webpackChunkName: "guide" */ 'components/guide/SettingsGuide.vue')
      }
    ]
  }
]
