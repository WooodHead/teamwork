export default [
  {
    path: '/:category?/:objectID(\\d+)?/evaluation',
    name: 'evaluation',
    props: true,
    meta: {
      label: '服务评价'
    },
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "evaluation" */'pages/evaluation/Index')
  }
]
