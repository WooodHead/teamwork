import { LocalStorage } from 'quasar'
import Store from '@/store/index.js'

const store = Store()

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (from.path !== '/login') {
      const historyData = {
        icon: from.meta.icon || 'history',
        name: from.name || '',
        params: from.params,
        title: from.meta.label,
        subTitle: ''
      }
      // 保证objectID、id都是数字，避免同样的页面被存储两次
      if (historyData.params.objectID) {
        historyData.params.objectID = +historyData.params.objectID
      } else if (historyData.params.id) {
        historyData.params.id = +historyData.params.id
      }
      let breadcrumbs = store.getters['breadcrumbs/breadcrumbs']
      if (breadcrumbs[1] && ['team', 'organize', 'project', 'product', 'productDev', 'service'].includes(from.path.split('/')[1])) {
        historyData.subTitle = breadcrumbs[1].title || ''
        addHistory(historyData)
      } else {
        addHistory(historyData)
      }
    }
    next()
  })
}

function addHistory (history) {
  let my = LocalStorage.getItem('myself') || {}
  let recentHistory = LocalStorage.getItem('recent-history/' + my.id) ? JSON.parse(LocalStorage.getItem('recent-history/' + my.id)) : []
  if (history.title) {
    if (_.findIndex(recentHistory, item => JSON.stringify(item) === JSON.stringify(history)) === -1) {
      if (recentHistory.length < 20) {
        recentHistory.unshift(history)
      } else {
        recentHistory.pop()
        recentHistory.unshift(history)
      }
    } else {
      _.remove(recentHistory, item => JSON.stringify(item) === JSON.stringify(history))
      recentHistory.unshift(history)
    }
    LocalStorage.set('recent-history/' + my.id, JSON.stringify(recentHistory))
  }
}
