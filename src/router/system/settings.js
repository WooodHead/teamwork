import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/settings',
    redirect: '/settings/index',
    name: 'settings',
    meta: {
      icon: 'settings',
      label: i18n.t('settings.module'),
      index: sort.settings,
      requiresAuth: true,
      group: group.get('system')
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ 'pages/settings/Index.vue'),
    children: [
      {
        path: 'index',
        name: 'settingsIndex',
        hideInMenu: true,
        meta: {
          icon: 'settings',
          label: i18n.t('settings.module'),
          index: 10,
          requiresAuth: true,
          group: group.get('system')
        },
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettings.vue')
      },
      {
        path: 'dev-system',
        name: 'devSystem',
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsDevSystem.vue')
      },
      {
        path: 'editor-template',
        name: 'editorTemplate',
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsEditorTemplate.vue')
      },
      {
        path: 'tag',
        name: 'tag',
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsTag.vue')
      },
      {
        path: 'contacts',
        name: 'settingsContacts',
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsContacts.vue')
      },
      {
        path: ':category/widget',
        name: 'settingsWidget',
        props: true,
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsWidget.vue')
      },
      {
        path: ':category/widget/select',
        name: 'settingsWidgetSelect',
        props: true,
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsWidgetSelect.vue')
      },
      {
        path: ':category/defaultQuestion',
        name: 'settingsDefaultQuestion',
        props: true,
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "settings" */ 'pages/settings/PageDefaultQuestion.vue')
      },
      {
        path: ':category/addDefaultQuestion',
        name: 'addDefaultQuestion',
        props: true,
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "settings" */ 'components/checkins/QuestionForm.vue')
      },
      {
        path: 'position',
        name: 'position',
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsPosition.vue')
      },
      {
        path: 'dashboard/:category',
        name: 'dashboard',
        props: true,
        hideInMenu: true,
        component: () =>
          import(/* webpackChunkName: "settings" */ 'pages/settings/PageSettingsDashboard.vue')
      }
    ]
  }
]
