import { i18n } from '@/boot/i18n'

export default {
  curPsonId: 0,

  listServices: [],
  services: [],

  connectorInServiceCount: [],

  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    total: 0,
    nextPageToken: 0
  },
  curTab: 'selfService',

  search: '',
  sort: 'Status',
  order: 'desc',
  listStyle: 'showcards',
  listPageType: 'allList',
  archivedCount: 0, // 已归档数量
  selectServices: { all: [] }, // 包含all，存储后台返回的原始数组，排序和后台一致
  loadedSelect: false,
  // 状态(id和name使用在步进器中)
  statusItems: {
    wait: { id: 10, color: 'auxiliary4', label: i18n.t('service.status.wait') },
    start: { id: 20, color: 'auxiliary3', label: i18n.t('service.status.start') },
    doing: { id: 30, color: 'auxiliary1', label: i18n.t('service.status.doing') },
    done: { id: 40, color: 'auxiliary5', label: i18n.t('service.status.done') },
    confirmed: { id: 50, color: 'auxiliary6', label: i18n.t('service.status.confirmed') }
  }
}
