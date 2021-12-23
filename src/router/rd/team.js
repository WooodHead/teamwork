import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/team',
    name: 'teamHome',
    hideInMenu: false,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-team-manage',
      label: i18n.t('team.module'),
      index: sort.team,
      requiresAuth: true,
      group: group.get('rd')
    },
    props: true,
    component: () =>
      import(/* webpackChunkName: "team" */ 'pages/PageTeam.vue')
  },
  {
    path: '/team',
    name: 'teamIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-team-manage',
      label: i18n.t('team.module'),
      requiresAuth: true,
      group: group.get('rd')
    },
    component: () =>
      import(
            /* webpackChunkName: "team" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: 'archived',
        name: 'archivedTeams',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-team-manage',
          label: i18n.t('team.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "team" */ 'components/team/ArchivedTeams'
          )
      },
      {
        path: 'add',
        name: 'teamAdd',
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-team-manage',
          label: i18n.t('team.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "team" */ 'components/team/TeamForm.vue'
          )
      },
      {
        path: 'addFromTemplate',
        name: 'teamAddFromTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'team',
          action: 'use'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('team.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: ':id(\\d+)',
        name: 'teamDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'teamHome',
          icon: 'app:tw-icon-team-manage',
          label: i18n.t('team.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "team" */ 'components/team/TeamDetail.vue'
          )
      },
      {
        path: ':id(\\d+)/:openType(edit)',
        name: 'teamEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-team-manage',
          label: i18n.t('team.module'),
          requiresAuth: true,
          group: group.get('rd')
        },
        component: () =>
          import(
                /* webpackChunkName: "team" */ 'components/team/TeamForm.vue'
          )
      },
      {
        path: 'template/index',
        name: 'teamTemplateManage',
        hideInMenu: true,
        props: route => ({
          category: 'team',
          action: 'manage'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('team.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateIndex')
      },
      {
        path: 'template/archived',
        name: 'archivedTeamTemplates',
        hideInMenu: true,
        props: route => ({
          category: 'team'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'archive',
          label: i18n.t('team.module')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/ArchivedTemplate'
          )
      },
      {
        path: 'template/add',
        name: 'teamAddTemplate',
        hideInMenu: true,
        props: route => ({
          category: 'team'
        }),
        meta: {
          group: group.get('rd'),
          requiresAuth: true,
          icon: 'add',
          label: i18n.t('team.add'),
          isCategoryTemplate: true
        },
        component: () => import(/* webpackChunkName: "project" */ 'components/template/TemplateForm')
      },
      {
        path: '/:category/template/:id/:openType',
        name: 'teamTemplateEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'mode_edit',
          group: group.get('rd'),
          label: i18n.t('team.update')
        },
        component: () =>
          import(
                /* webpackChunkName: "project" */ 'components/template/TemplateForm'
          )
      }
    ]
  }
]
