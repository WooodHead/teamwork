import { i18n } from '@/boot/i18n'
export default {
  consultSort: 'submitTime',
  consultSearch: '',
  selectedStatus: '0',
  consults: [],
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  // 咨询何事
  consultItemSearch: '',
  consultItems: [],
  // 向谁咨询
  transactorSearch: '',
  transactors: [],
  // 咨询的各种状态
  consultStatus: {
    1: {
      label: i18n.t('consult.consultDetail.toAccept'), // 待处理
      color: 'auxiliary4',
      value: '1'
    },
    2: {
      label: i18n.t('consult.consultDetail.doing'), // 处理中
      color: 'auxiliary1',
      value: '2'
    },
    3: {
      label: i18n.t('consult.consultDetail.toConfirm'), // 待结单（已处理）
      color: 'negative',
      value: '3'
    },
    4: {
      label: i18n.t('consult.consultDetail.toAppraise'), // 待评价
      color: 'suspended',
      value: '4'
    },
    5: {
      label: i18n.t('consult.consultDetail.appraised'), // 已完成
      color: 'auxiliary5',
      value: '5'
    }
  },
  consultFormAction: {
    reply: [{ label: i18n.t('consult.consultDetail.reply'), action: 'reply' }],
    send: [{ label: i18n.t('consult.consultDetail.send'), action: 'reply' }],
    startDeal: [{ label: i18n.t('consult.consultDetail.startDeal'), action: 'startDeal' },
      { label: i18n.t('consult.consultDetail.or') + i18n.t('consult.consultDetail.doneDeal'), action: 'doneDeal' },
      { label: i18n.t('consult.consultDetail.or') + i18n.t('consult.consultDetail.transmit'), action: 'transmit' }],
    doneDeal: [{ label: i18n.t('consult.consultDetail.doneDeal'), action: 'doneDeal' },
      { label: i18n.t('consult.consultDetail.or') + i18n.t('consult.consultDetail.continueDeal'), action: 'reply' },
      { label: i18n.t('consult.consultDetail.or') + i18n.t('consult.consultDetail.transmit'), action: 'transmit' }],
    afterDoneDealByTransactor: [{ label: i18n.t('consult.consultDetail.reply'), action: 'reply' },
      { label: i18n.t('consult.consultDetail.or') + i18n.t('consult.consultDetail.transmit'), action: 'transmit' }]
  }
}
