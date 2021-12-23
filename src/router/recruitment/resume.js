// 简历管理模块
import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/resume',
    name: 'resumeIndex',
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
        path: '/resume',
        name: 'resume',
        hideInMenu: true,
        meta: {
          goBack: 'jobHome',
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/resume/Index.vue')
      },
      {
        path: ':resumeDeliveryID(\\d+)',
        name: 'resumeDetail',
        props: route => ({
          resumeDeliveryID: route.params.resumeDeliveryID,
          searchText: route.params.searchText
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/resume/ResumeTabDetail.vue')
      },
      {
        path: 'test-result',
        name: 'resumeTestResult',
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/resume/ResumeImportTestResult.vue')
      },
      {
        path: 'invite/:resumeDeliveryID',
        name: 'resumeInvite',
        props: route => ({
          resumeDeliveryID: route.params.resumeDeliveryID
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/resume/ResumeInvite.vue')
      },
      {
        path: 'offer/:resumeDeliveryID',
        name: 'resumeSendOffer',
        props: route => ({
          resumeDeliveryID: route.params.resumeDeliveryID
        }),
        hideInMenu: true,
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/resume/ResumeSendOffer.vue')
      }
    ]
  }
]
