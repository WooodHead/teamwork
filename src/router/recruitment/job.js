// 岗位管理模块
import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/job/home',
    name: 'jobHome',
    hideInMenu: false,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-recruitment',
      label: i18n.t('recruitment.module'),
      index: sort.job,
      requiresAuth: true,
      group: group.get('hr')
    },
    component: () => import(/* webpackChunkName: "recruitment" */'pages/recruitment/Home.vue')
  },
  {
    path: '/job',
    name: 'jobIndex',
    hideInMenu: true,
    meta: {
      icon: 'face',
      label: i18n.t('recruitment.module'),
      index: sort.job,
      requiresAuth: true,
      group: group.get('job')
    },
    component: () => import(/* webpackChunkName: "recruitment" */'pages/recruitment/Index.vue'),
    children: [
      {
        path: '/job',
        name: 'job',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/TwJob.vue')
      },
      {
        path: '/job/draft',
        name: 'draftJobs',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/TwJob.vue')
      },
      {
        path: '/job/archived',
        name: 'archivedJobs',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/TwJob.vue')
      },
      {
        path: '/job/dashboard/detail',
        name: 'dashboardDetail',
        props: route => ({
          chart: route.params.chart,
          clickedChart: route.params.clickedChart
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/dashboard/ResumeDashBoardDetail.vue')
      },
      {
        path: 'add',
        name: 'jobAdd',
        props: route => ({
          openType: 'add'
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/JobForm.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'jobDetail',
        props: route => ({
          id: route.params.id
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/JobDetail.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'jobEdit',
        hideInMenu: true,
        props: route => ({
          openType: 'edit',
          id: route.params.id
        }),
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/job/JobForm.vue')
      }
    ]
  }
]
