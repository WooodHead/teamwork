import { i18n } from '@/boot/i18n'
const state = {
  layout: {
    leftDrawerOpen: false,
    rightDrawerOpen: false
  },
  footerVisible: true,
  // nowActivateTab: 'home',
  lastActivateTab: 'home',
  // navLastRoute: {},
  navs: {
    message: {
      label: i18n.t('message.module'),
      name: 'message',
      icon: 'notifications',
      to: { name: 'message' },
      alert: false
    },
    contacts: {
      label: i18n.t('contacts.module'),
      name: 'contacts',
      icon: 'contacts', // app:tw-icon-
      to: { name: 'contactsHome' },
      alert: false
    },
    home: {
      label: '工作台',
      name: 'home',
      icon: 'home',
      to: { name: 'home' },
      alert: false
    },
    find: {
      label: '发现',
      name: 'find',
      icon: 'search',
      to: { name: 'SearchPanel' },
      alert: false
    },
    me: {
      label: '我的',
      name: 'me',
      icon: 'person',
      to: { name: 'me' },
      alert: false
    }
  },
  productNavs: {
    productCategory: {
      label: '产品树',
      name: 'productTree',
      icon: 'menu',
      alert: false
    },
    productHome: {
      label: '选型主页',
      name: 'productHome',
      icon: 'home',
      to: { name: 'productHome' },
      alert: false
    },
    configList: {
      label: '产品PK',
      name: 'productPK',
      icon: 'input',
      to: { name: 'productSelection' },
      alert: false
    }
  }
}

const mutations = {
  setLeftDrawerOpen (state) {
    state.layout.leftDrawerOpen = !state.layout.leftDrawerOpen
  },
  setRightDrawerOpen (state) {
    state.layout.rightDrawerOpen = !state.layout.rightDrawerOpen
  },
  setFooterVisible (state, value) {
    state.footerVisible = value
  },
  setLastActivateTab (state, value) {
    state.lastActivateTab = value
  },
  setNavs (state, payload) {
    state.navs = payload
  }
}

const actions = {
  setLeftDrawerOpen ({ commit }) {
    commit('setLeftDrawerOpen')
  },
  setRightDrawerOpen ({ commit }) {
    commit('setRightDrawerOpen')
  }
}

const getters = {
  layout: state => {
    return state.layout
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
