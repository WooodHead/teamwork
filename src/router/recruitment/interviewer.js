// 面试官管理模块
import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/interviewer',
    name: 'interviewerIndex',
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
        path: '/interviewer',
        name: 'interviewer',
        hideInMenu: true,
        meta: {
          goBack: 'jobHome',
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/interviewer/Interviewer.vue')
      },
      {
        path: 'add',
        name: 'interviewerAdd',
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
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/interviewer/InterviewerForm.vue')
      },
      {
        path: ':psonID(\\d+)/edit',
        name: 'interviewerEdit',
        hideInMenu: true,
        props: route => ({
          openType: 'edit',
          psonID: route.params.psonID
        }),
        meta: {
          icon: 'face',
          label: i18n.t('recruitment.module'),
          index: sort.job,
          requiresAuth: true,
          group: group.get('job')
        },
        component: () => import(/* webpackChunkName: "recruitment" */ 'components/recruitment/interviewer/InterviewerForm.vue')
      }
    ]
  }
]
