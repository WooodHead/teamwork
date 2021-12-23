import { i18n } from '@/boot/i18n'
// import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/:category/:objectID(\\d+)/checkins',
    props: true,
    hideInMenu: true,
    meta: {
      group: group.get('tool')
    },
    component: () =>
      import(/* webpackChunkName: "checkins" */ 'pages/checkins/Index.vue'),
    children: [
      {
        path: '/:category/:objectID(\\d+)/checkins',
        name: 'checkins',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () => import(/* webpackChunkName: "checkins" */ 'components/checkins/CheckinsIndex.vue')
      },
      {
        path: 'archived',
        name: 'archivedQuestions',
        hideInMenu: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 20,
          requiresAuth: true,
          group: group.get('tool')
        },
        props: true,
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/ArchivedQuestions'
          )
      },
      {
        path: 'question/add',
        name: 'questionAdd',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionForm.vue'
          )
      },
      {
        path: 'question/:id',
        name: 'questionDetail',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionDetail.vue'
          )
      },
      {
        path: 'question/:id/answerPersons',
        name: 'selectAnswerPersons',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () => import('components/checkins/AnswerPersons.vue')
      },
      {
        path: 'question/:id/edit',
        name: 'questionEdit',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionForm.vue'
          )
      },
      {
        path: 'question/:id/share/:code',
        name: 'pQuestion',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionDetail.vue'
          )
      },
      {
        path: 'question/:id/copy',
        name: 'questionCopy',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionMoveCopy.vue'
          )
      },
      {
        path: 'question/:id/move',
        name: 'questionMove',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/QuestionMoveCopy.vue'
          )
      },
      {
        path: 'question/:id/history',
        name: 'questionHistory',
        hideInMenu: true,
        props: route => ({
          category: route.params.category,
          objectID: Number(route.params.objectID),
          id: Number(route.params.id),
          type: 'question'
        }),
        meta: {
          icon: 'help',
          label: i18n.t('question.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "history" */ 'components/base/TwHistory.vue'
          )
      },
      {
        path: 'question/:questionID/answer/:answerID',
        name: 'answer',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/AnswerDetail.vue'
          )
      },
      {
        path: 'question/:questionID/answer/:answerID/edit',
        name: 'answerEdit',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/AnswerEdit.vue'
          )
      },
      {
        path: 'question/:questionID/person/:personID',
        name: 'allAnswers',
        hideInMenu: true,
        props: true,
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "checkins" */ 'components/checkins/AllAnswers.vue'
          )
      },
      {
        path: 'question/:questionID/answer/:id/history',
        name: 'answerHistory',
        hideInMenu: true,
        props: route => ({
          id: Number(route.params.id),
          category: route.params.category,
          objectID: Number(route.params.objectID),
          questionID: Number(route.params.questionID),
          type: 'answer'
        }),
        meta: {
          icon: 'help',
          label: i18n.t('checkins.module'),
          index: 0,
          requiresAuth: true,
          group: group.get('tool')
        },
        component: () =>
          import(
                /* webpackChunkName: "history" */ 'components/base/TwHistory.vue'
          )
      }
    ]
  }
]
