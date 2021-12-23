import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/approval',
    name: 'approvalHome',
    meta: {
      icon: 'card_membership',
      label: i18n.t('approval.module'),
      group: group.get('oa'),
      index: sort.approval
    },
    component: () => import(/* webpackChunkName: "approval" */'pages/approval/Index'),
    children: [
      {
        path: ':type(waitDeal|doneDeal|subDeal|getDeal)',
        name: 'approvalList',
        props: true,
        meta: {
          icon: 'card_membership',
          label: i18n.t('approval.module')
        },
        component: () => import(/* webpackChunkName: "approval" */'components/approval/ApprovalList')
      },
      {
        path: ':type(leave|overtime|chapter)/:templateId',
        name: 'approvalForm',
        props: true,
        meta: {
          icon: 'card_membership',
          label: i18n.t('approval.module')
        },
        component: () => import(/* webpackChunkName: "approval" */'components/approval/approvalForm')
      }
    ]
  }
]
