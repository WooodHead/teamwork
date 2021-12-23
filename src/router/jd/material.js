import { i18n } from '@/boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/material',
    name: 'materialHome',
    hideInMenu: false,
    meta: {
      icon: 'graphic_eq',
      label: i18n.t('material.module'),
      index: sort.material,
      group: group.get('jd')
    },
    component: () => import(/* webpackChunkName: "material" */'pages/material/Home')
  },
  {
    path: '/material',
    name: 'materialIndex',
    hideInMenu: true,
    meta: {
      icon: 'graphic_eq',
      label: i18n.t('material.module')
    },
    component: () =>
      import(/* webpackChunkName: "material" */ 'pages/material/Index'),
    children: [
      {
        path: 'import',
        name: 'importMaterial',
        hideInMenu: true,
        meta: {
          icon: 'graphic_eq',
          label: i18n.t('material.importMaterial')
        },
        component: () => import(/* webpackChunkName: "material" */ 'components/material/import/ImportMaterial')
      },
      {
        path: 'MatFiles',
        name: 'MaterialFiles',
        hideInMenu: true,
        meta: {
          icon: 'graphic_eq',
          label: i18n.t('material.importMaterial')
        },
        component: () => import(/* webpackChunkName: "material" */ 'components/material/file/MaterialFiles')
      },
      {
        path: 'BomPK',
        name: 'MaterialPK',
        hideInMenu: true,
        meta: {
          icon: 'graphic_eq',
          label: i18n.t('material.importMaterial')
        },
        component: () => import(/* webpackChunkName: "material" */ 'components/material/pk/MaterialPK')
      }
    ]
  }
]
