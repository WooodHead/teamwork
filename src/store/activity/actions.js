import Activity from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  GetList: 'actions/GetList',
  GetDeletedList: 'actions/GetDeletedList',
  GetPageList: 'actions/GetPageList',
  GetModel: 'actions/GetModel',
  Add: 'actions/Add',
  Update: 'actions/Update',
  Delete: 'actions/Delete'
}
// 获取动态列表
export default {
  loadLatestTimeActivity ({ state, commit }, { objectID, objectType }) {
    const query = JSON.stringify([
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
    ])
    return request.get(url.GetList, { query })
      .then(res => {
        let list = Activity.from(res.data)
        commit('addActivitys', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  upateCacheDataTokenFlag ({ commit }, { objectID, objectType, isNeedReadLocalStorage }) {
    commit('upateCacheDataTokenFlag', { objectType, objectID, isNeedReadLocalStorage })
  },
  /**
   *加载已删除的动态数据
   * @param {*} param0
   * @param {*} param1
   */
  loadDeletedActivitys ({ commit }, query) {
    return request.get(url.GetDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let activitys = Activity.from(res.data)
        commit('setDeletedLists', { objectType, objectID, activitys })
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 分页获取动态数据
   * @param {*} { state, commit }
   * @param {string} [objectType] 对象类型
   * @param {string} [objectID] 对象ID
   * @param {string} [pageIndex] 页码
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {boolean} [byPage] 是否分页查询
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数。前台页面不需要传递，函数内部已处理
   * 如果不分页，这不用传byPage
   */
  loadActivityPageList (
    { state, commit },
    {
      objectType,
      objectID,
      pageIndex,
      query,
      filter,
      sort,
      search,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset
    } = {}
  ) {
    // 首页请求，初始化offset和nextPageToken
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    Object.assign(condition, byPage ? { limit, offset } : {})
    let activitys = []
    // 是否需要从缓存读取
    if (state.isCache[objectType + objectID]) {
      // 从state中读取，直接返回
      commit('readDataToActivitysByPage', {
        objectType,
        objectID,
        limit,
        offset,
        pageIndex
      })
    } else {
      return request
        .get(byPage ? url.GetPageList : url.GetList, condition)
        .then(
          res => {
            // 分页获取res.data返回的数据是个对象，包括offset、data，要与不分页获取的数据分开判断
            let maxID = 0
            if (byPage) {
              commit('updatePage', {
                offset: state.page.offset + res.data.offset,
                nextPageToken: res.nextPageToken
              })
              activitys = Activity.from(res.data.data)
              maxID = res.data.data.length > 0 && res.data.data[0].Id
            } else {
              commit('updatePage', {
                offset: state.page.offset + res.data.length,
                nextPageToken: res.nextPageToken
              })
              activitys = Activity.from(res.data)
              maxID = res.data.length > 0 && res.data[0].Id
            }
            let localStorageObj = state.stateStorage[objectType + objectID]
            let isNeedReadCache = localStorageObj && _.includes(_.map(localStorageObj, 'id'), maxID)
            if (isNeedReadCache) {
              commit('updateCacheDataFlag', { objectType, objectID, value: true }) // 存在，则标记从缓存中可以读取数据
            }
            commit('addActivitysToStateStorage', { activitys, objectType, objectID })
            commit('readDataToActivitysByPage', { objectType, objectID, limit, pageIndex })
            return state.activitys
          },
          error => {
            commit('updatePage', { nextPageToken: -1 })
            return error
          }
        )
        .catch(error => {
          error.userMessage &&
            showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return []
        })
    }
  },
  loadActivity ({ state, commit }, activityID) {
    return request.get(url.GetModel, { id: activityID })
      .then(res => {
        let activity = Activity.from(res.data)
        commit('addActivitys', [activity])
        return activity
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建动态
  addActivity ({ state, commit }, activity) {
    let model = Activity.to(activity)
    return request.post(url.Add, model)
      .then(res => {
        let activity = Activity.from(res.data)
        commit('addActivitys', [activity])
        return activity
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新动态
  updateActivity ({ commit }, activity) {
    let model = Activity.to(activity)
    return request.put(url.Update, model)
      .then(res => {
        let activity = Activity.from(res.data)
        commit('updateActivity', activity)
        return activity
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除动态
  deleteActivity ({ commit }, activityID) {
    return request.delete(url.Delete, { id: activityID })
      .then(res => {
        let activity = Activity.from(res.data)
        commit('deleteActivity', activityID)
        return activity
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
