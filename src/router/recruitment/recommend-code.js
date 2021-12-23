// 推荐码管理模块
import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/recommend-code',
    name: 'recommendCodeIndex',
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
        path: '/recommend-code',
        name: 'recommendCode',
        hideInMenu: true,
        meta: {
          goBack: 'jobHome',
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recommend-code" */ 'components/recruitment/recommend-code/RecommendCode.vue')
      },

      {
        path: ':id(\\d+)',
        name: 'recommendCodeDetail',
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
        component: () => import(/* webpackChunkName: "recommend-code" */ 'components/recruitment/recommend-code/RecommendCodeDetail.vue')
      },

      {
        path: 'add',
        name: 'recommendCodeAdd',
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
        component: () => import(/* webpackChunkName: "recommend-code" */ 'components/recruitment/recommend-code/RecommendCodeForm.vue')
      },

      {
        path: ':id(\\d+)/edit',
        name: 'recommendCodeEdit',
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
        component: () => import(/* webpackChunkName: "recommend-code" */ 'components/recruitment/recommend-code/RecommendCodeForm.vue')
      },

      {
        path: 'rankingList',
        name: 'rankingList',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recommend-code" */ 'components/recruitment/recommend-code/RankingList.vue')
      }

    ]
  }
]
