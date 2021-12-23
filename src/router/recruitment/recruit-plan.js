// 面试官管理模块
import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/recruit-plan',
    name: 'recruitPlanIndex',
    hideInMenu: true,
    meta: {
      icon: 'face',
      label: i18n.t('recruitment.module'),
      index: sort.job,
      requiresAuth: true,
      group: group.get('job')
    },
    component: () => import(/* webpackChunkName: "recruitment" */ 'pages/recruitment/Index.vue'),
    children: [
      {
        path: '/recruit-plan',
        name: 'recruitPlan',
        hideInMenu: true,
        meta: {
          goBack: 'jobHome',
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruit-plan" */ 'components/recruitment/recruit-plan/RecruitPlan.vue')
      },
      {
        path: '/recruit-plan/archived',
        name: 'ArchiveRecruitPlans',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/recruit-plan/RecruitPlan.vue')
      },
      {
        path: ':id(\\d+)',
        name: 'recruitPlanDetail',
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
        component: () => import(/* webpackChunkName: "recruit-plan" */ 'components/recruitment/recruit-plan/RecruitPlanDetail.vue')
      },
      {
        path: 'add',
        name: 'recruitPlanAdd',
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
        component: () => import(/* webpackChunkName: "recruit-plan" */ 'components/recruitment/recruit-plan/RecruitPlanForm.vue')
      },
      {
        path: ':id(\\d+)/edit',
        name: 'recruitPlanEdit',
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
        component: () => import(/* webpackChunkName: "recruit-plan" */ 'components/recruitment/recruit-plan/RecruitPlanForm.vue')
      }
    ]
  }
]
