import { i18n } from '../../boot/i18n'
import sort from '../sort'
import group from '../group'

export default [
  {
    path: '/opportunity',
    name: 'opportunityHome',
    hideInMenu: false,
    meta: {
      goBack: 'home',
      icon: 'app:tw-icon-opportunity-manage',
      label: i18n.t('opportunity.module'),
      index: sort.opportunity,
      requiresAuth: true,
      group: group.get('crm')
    },
    component: () =>
      import(
        /* webpackChunkName: "opportunity" */ 'pages/opportunity/PageOpportunity.vue'
      )
  },
  {
    path: '/opportunity',
    name: 'opportunityIndex',
    hideInMenu: true,
    meta: {
      icon: 'app:tw-icon-opportunity-manage',
      group: group.get('crm'),
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "opportunity" */ 'pages/resource/ResourceIndex.vue'
      ),
    children: [
      {
        path: ':id/:openType(add|edit)',
        name: 'opportunityEdit',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'app:tw-icon-opportunity-manage',
          label: i18n.t('opportunity.update')
        },
        component: () =>
          import(
            /* webpackChunkName: "opportunity" */ 'components/opportunity/OpportunityEdit.vue'
          )
      },
      {
        path: ':id(\\d+)',
        name: 'opportunityDetail',
        props: true,
        hideInMenu: true,
        meta: {
          goBack: 'home',
          icon: 'app:tw-icon-opportunity-manage',
          label: i18n.t('opportunity.module')
        },
        component: () =>
          import(
            /* webpackChunkName: "opportunity" */ 'components/opportunity/OpportunityDetail.vue'
          )
      },
      {
        path: 'archived',
        name: 'opportunitysArchived',
        props: true,
        hideInMenu: true,
        component: () =>
          import(
            /* webpackChunkName: "opportunity" */ 'components/opportunity/OpportunitysArchived'
          )
      },
      {
        path: ':id/quotation',
        name: 'opportunityQuotation',
        props: true,
        hideInMenu: true,
        component: () =>
          import(
            /* webpackChunkName: "opportunity" */ 'components/opportunity/OpportunityQuotation'
          )
      },
      {
        path: ':id/quotation/approval',
        name: 'opportunityQuotationApproval',
        props: true,
        hideInMenu: true,
        meta: {
          icon: 'gavel',
          group: group.get('rd'),
          label: i18n.t('approval.applyFor')
        },
        component: () =>
          import(
            /* webpackChunkName: "approval" */ 'components/approval/OpportunityQuotationApproval'
          )
      }
    ]
  }
]
