import { LocalStorage } from 'quasar'
const my = LocalStorage.getItem('myself') || {}
// 系统公告
export default {
  currentModel: (state, getters) => (id) => {
    return _.find(state.notices, { 'id': +id }) || {}
  },
  /**
   * 公告列表
   */
  notices: (state, getters) => ({ objectType, objectID = 0 }) => {
    return getters.noticesSorted({ objectType, objectID })
  },
  /**
    * 公告草稿列表
    */
  noticeDrafts: (state, getters) => ({ objectType, objectID = 0 }) => {
    return getters.noticesSorted({ objectType, objectID, draft: true })
  },
  /**
  * 归档公告列表
  */
  archivedNotices: (state, getters) => ({ objectType, objectID = 0 }) => {
    return getters.noticesSorted({ objectType, objectID, archived: true })
  },
  /** 草稿、发布、归档、类别过滤 */
  noticesFiltered: state => ({ objectType, objectID, draft, archived }) => {
    let notices = state.notices
    if (draft) {
      // 草稿不参与搜索
      notices = notices.filter(item => {
        return item.objectType === objectType &&
          item.objectID === +objectID &&
          item.isPublish === 0
      })
    } else {
      // 类别过滤
      if (state.type) {
        notices = notices.filter(item => {
          return state.type === item.noticeType
        })
      }
      // 模糊过滤
      if (state.search && state.search.trim() !== '') {
        notices = notices.filter(item => {
          return item.title.includes(state.search.trim()) ||
            item.content.includes(state.search.trim())
        })
      }
      if (archived) {
        // 归档列表
        notices = notices.filter(item => {
          return item.objectType === objectType &&
            item.objectID === +objectID &&
            item.archived
        })
      } else {
        // 发布列表
        notices = notices.filter(item => {
          return item.objectType === objectType &&
            item.objectID === +objectID &&
            item.isPublish === 1 &&
            !item.archived
        })
      }
    }
    return notices
  },
  /** 列表排序 */
  noticesSorted: (state, getters) => ({ objectType, objectID, draft, archived }) => {
    return _.orderBy(getters.noticesFiltered({ objectType, objectID, draft, archived }),
      ['orderNumber', state.sort],
      ['desc', 'desc'])
  },
  queryOfType (state) {
    return state.type
      ? ['and', { Key: 'NoticeType', Value: state.type, Oper: 'eq' }]
      : []
  },
  queryOfSearch (state) {
    return (state.search && state.search.trim() !== '')
      ? [
        'and',
        {
          Key: 'concat(IFNULL(Content,\'\'),IFNULL(Title,\'\'))',
          Value: '%' + state.search.trim() + '%',
          Oper: 'like'
        }
      ]
      : []
  },
  /** ------------------废纸篓相关---------------------- */
  // 我的废纸篓
  NoticesInMyTrash: (state) => {
    let list = state.noticesInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 资源废纸篓
  NoticesInTrash: (state) => (objectType, objectID) => {
    let list = state.noticesInTrash.filter(item => item.objectType === objectType && item.objectID === +objectID)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
