import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'
import { Platform } from 'quasar'

function projectHome () {
  let projectHome = []
  if (Platform.is.mobile) {
    projectHome = [
      {
        path: '/project',
        name: 'projectHome',
        meta: {
          goBack: 'home',
          icon: 'inbox',
          label: i18n.t('project.module'),
          index: sort.project,
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'pages/project/ProjectHome')
      },
      {
        path: '/project/list',
        name: 'projectList',
        hideInMenu: true,
        meta: {
          goBack: 'projectHome',
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'inbox',
          label: i18n.t('project.dashboard.projectList')
        },
        component: () => import(/* webpackChunkName: "project" */ 'pages/project/ProjectList')
      },
      {
        path: '/project/dashboard',
        name: 'projectDashboard',
        meta: {
          goBack: 'projectHome',
          icon: 'inbox',
          label: i18n.t('project.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/project/ProjectDashboard')
      },
      {
        path: '/project/rank',
        name: 'projectRank',
        meta: {
          goBack: 'projectHome',
          icon: 'inbox',
          label: i18n.t('project.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/project/ProjectRankHome')
      },
      {
        path: '/project/dashboard/detail',
        name: 'projectDashboardDetail',
        props: true,
        meta: {
          goBack: 'projectDashboard',
          icon: 'inbox',
          label: i18n.t('project.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/project/dashboard/projectDashboardDetail')
      },
      {
        path: '/project/dashboard/severityDistributionDetail/:id(\\d+)',
        name: 'projectSeverityDistributionDetail',
        props: true,
        meta: {
          goBack: 'projectDashboard',
          icon: 'inbox',
          label: i18n.t('project.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/project/dashboard/projectSeverityDistributionDetail')
      }
    ]
  } else {
    projectHome = [
      {
        path: '/project',
        name: 'projectHome',
        redirect: { name: 'projectDashboard' },
        meta: {
          icon: 'inbox',
          label: i18n.t('project.module'),
          index: sort.project,
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () => import(/* webpackChunkName: "project" */ 'pages/project/ProjectHome'),
        children: [
          {
            path: 'list',
            name: 'projectList',
            hideInMenu: true,
            meta: {
              group: group.get('rd'),
              requiresAuth: true,
              icon: 'inbox',
              label: i18n.t('project.dashboard.projectList')
            },
            component: () => import(/* webpackChunkName: "project" */ 'components/project/ProjectList')
          },
          {
            path: 'dashboard',
            name: 'projectDashboard',
            props: route => ({
              isRank: false
            }),
            meta: {
              icon: 'inbox',
              label: i18n.t('project.module'),
              requiresAuth: true,
              group: group.get('rd')
            },
            component: () => import(/* webpackChunkName: "project" */ 'components/project/ProjectDashboard')
          },
          {
            path: 'rank',
            name: 'projectRank',
            props: route => ({
              isRank: true
            }),
            meta: {
              icon: 'inbox',
              label: i18n.t('project.module'),
              requiresAuth: true,
              group: group.get('rd')
            },
            component: () => import(/* webpackChunkName: "project" */ 'components/project/ProjectRankHome')
          },
          {
            path: '/project/dashboard/detail',
            name: 'projectDashboardDetail',
            props: true,
            meta: {
              goBack: 'projectDashboard',
              icon: 'inbox',
              label: i18n.t('project.module'),
              requiresAuth: true,
              group: group.get('rd')
            },
            component: () => import(/* webpackChunkName: "project" */ 'components/project/dashboard/projectDashboardDetail')
          },
          {
            path: '/project/dashboard/severityDistributionDetail/:id(\\d+)',
            name: 'projectSeverityDistributionDetail',
            props: true,
            meta: {
              goBack: 'projectDashboard',
              icon: 'inbox',
              label: i18n.t('project.module'),
              requiresAuth: true,
              group: group.get('rd')
            },
            component: () => import(/* webpackChunkName: "project" */ 'components/project/dashboard/projectSeverityDistributionDetail')
          }
        ]
      }
    ]
  }
  return projectHome
}

export default [
  ...projectHome(),
  {
    path: '/project',
    hideInMenu: true,
    props: route => ({
      category: 'project'
    }),
    meta: {
      group: group.get('rd'),
      icon: 'inbox',
      label: i18n.t('project.module')
    },
    component: () =>
      import(
            /* webpackChunkName: "project" */ 'pages/resource/ResourceIndexWithMenu'
      ),
    children: [
      {
        path: 'export-hour',
        name: 'projectExportHour',
        props: route => ({
        }),
        hideInMenu: true,
        meta: {
          icon: 'wb_incandescent',
          group: group.get('rd'),
          label: i18n.t('project.exportProjectHour')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ExportProjectHour'
          )
      },
      {
        path: 'archived',
        name: 'archivedProjects',
        hideInMenu: true,
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'archive',
          label: i18n.t('project.archive')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ArchivedProjects'
          )
      },
      {
        path: 'add',
        name: 'projectAdd',
        hideInMenu: true,
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('project.add')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectForm'
          )
      },
      {
        path: 'addFromTemplate',
        name: 'projectAddFromTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'project',
          action: 'use'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('project.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: ':id(\\d+)',
        name: 'projectDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'projectList',
          icon: 'assignment',
          group: group.get('rd'),
          label: i18n.t('project.detail')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectDetail'
          )
      },
      {
        path: ':id(\\d+)/suspended',
        name: 'projectSuspended',
        props: route => ({
          openType: 'suspended',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'drag_handle',
          group: group.get('rd'),
          label: i18n.t('project.suspended')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectStatus'
          )
      },
      {
        path: ':id(\\d+)/activate',
        name: 'projectActivate',
        props: route => ({
          openType: 'activate',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'wb_incandescent',
          group: group.get('rd'),
          label: i18n.t('project.activate')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectStatus'
          )
      },
      {
        path: ':id(\\d+)/start',
        name: 'projectStart',
        props: route => ({
          openType: 'start',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'play_arrow',
          group: group.get('rd'),
          label: i18n.t('approval.approval')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectApplyFor'
          )
      },
      {
        path: ':id(\\d+)/done',
        name: 'projectDone',
        props: route => ({
          openType: 'done',
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'stop',
          group: group.get('rd'),
          label: i18n.t('approval.finish')
        },
        component: () => import('components/project/ProjectApplyFor')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'projectEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'mode_edit',
          group: group.get('rd'),
          label: i18n.t('project.update')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/project/ProjectForm'
          )
      },
      {
        path: 'template/index',
        name: 'projectTemplateManage',
        hideInMenu: true,
        props: route => ({
          category: 'project',
          action: 'manage'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('project.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: 'template/archived',
        name: 'archivedProjectTemplates',
        hideInMenu: true,
        props: route => ({
          category: 'project'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'archive',
          label: i18n.t('project.archive')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/ArchivedTemplate'
          )
      },
      {
        path: 'template/add',
        name: 'projectAddTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'project'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('project.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateForm')
      },
      {
        path: '/:category/template/:id/:openType',
        name: 'projectTemplateEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'mode_edit',
          group: group.get('rd'),
          label: i18n.t('project.update')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/TemplateForm'
          )
      }
    ]
  }
]
