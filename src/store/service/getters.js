import { i18n } from '@/boot/i18n'
import { LocalStorage } from 'quasar'

export default {
  menus: (state) => (isBookmark) => {
    const menus = ['edit', 'setWidgets', 'archive', 'delete', 'trash']
    menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
    return menus
  },
  service: (state) => (id) => {
    return _.find(state.listServices, { id: id }) || {}
  },
  services: (state, getters) => {
    return getters.servicesSorted
  },
  connectorInServiceCount: state => {
    return state.connectorInServiceCount
  },
  servicesSorted: (state, getters) => {
    return getters.servicesFiltered.sort((a, b) => {
      if (a[state.sort] < b[state.sort]) return -1
      return 1
    })
  },
  servicesFiltered: (state) => {
    let services = state.listServices
    const search = state.search
    if (search) {
      services = _.filter(services, item =>
        item.title.toLowerCase().includes(search.toLowerCase()))
    }
    return services
  },
  currentListPageParams: state => {
    const allListQuery = [
      { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
      'and',
      { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }
    ]
    const myListQuery = [
      { 'Key': 'Members', 'Value': LocalStorage.getItem('myself').id, 'Oper': 'inset' },
      'and',
      { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
      'and',
      { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }
    ]
    const typePayload = [
      {
        key: 'myList',
        title: i18n.t('service.cardTitle.myList'),
        selectCondition: {
          query: myListQuery,
          sort: state.sort,
          order: state.order,
          search: state.search
        }
      },
      {
        key: 'allList',
        title: i18n.t('service.cardTitle.allList'),
        selectCondition: {
          query: allListQuery,
          sort: state.sort,
          order: state.order,
          search: state.search
        }
      }
    ]
    return _.find(typePayload, { key: state.listPageType })
  }
}
