import Vue from 'vue'
export default {
  setByPage (state, value) {
    state.byPage = value
  },
  initPage (state) {
    state.page = {
      offset: 0,
      limit: 10,
      nextPageToken: 0
    }
  },
  updatePage (state, page) {
    Object.assign(state.page, page)
  },
  // 新建多个任务
  addActivitys (state, activitys) {
    const newActivitys = _.differenceBy(activitys, state.activitys, 'id')
    state.activitys.push(...newActivitys)
  },
  // 设置已删除的动态数据
  setDeletedLists (state, { objectType, objectID, activitys }) {
    let newActivitys = _.differenceBy(state.stateStorage[objectType + objectID], activitys, 'id')
    state.stateStorage[objectType + objectID] = newActivitys
  },
  // 添加动态数据到本地缓存
  addActivitysToStateStorage (state, { activitys, objectType, objectID }) {
    let localStorageObj = state.stateStorage[objectType + objectID]
    if (localStorageObj) {
      // 去重处理
      let newActivitys = _.differenceBy(activitys, localStorageObj, 'id')
      localStorageObj.push(...newActivitys)
      // 将数据全部保存到localStorage对象中，作为本地数据源来使用
      state.stateStorage[objectType + objectID] = localStorageObj
    } else {
      state.stateStorage[objectType + objectID] = activitys
    }
    localStorageObj = state.stateStorage[objectType + objectID]
    // 读取所有已删除的动态
    let activitysDelete = state.deletedActivitys[objectType + objectID]
    if (activitysDelete && activitysDelete.length > 0 && localStorageObj && localStorageObj.length > 0) {
      // 取出未被删除的动态
      let activitysNotDeleted = _.filter(localStorageObj, activity => {
        return _.indexOf(_.map(activitysDelete, 'id'), activity.id) === -1
      })
      state.stateStorage[objectType + objectID] = activitysNotDeleted
    }
    state.stateStorage[objectType + objectID] = _.orderBy(localStorageObj, ['actTime'], ['desc']) // 最后，需要重新做数据排序，防止有最新的动态数据插入
  },
  // 分页读取动态数据，加入到activitys中
  readDataToActivitysByPage (state, { objectType, objectID, limit, pageIndex }) {
    let localStorageObj = state.stateStorage[objectType + objectID]
    if (localStorageObj && localStorageObj.length > 0) {
      let begin = (pageIndex - 1) * limit
      let end = pageIndex * limit
      if (pageIndex !== 1 && !state.isCache[objectType + objectID] && pageIndex > Math.ceil(localStorageObj.length / limit)) {
        begin = (pageIndex - 2) * limit
        end = (pageIndex - 1) * limit
      }
      let currentPageData = localStorageObj.slice(begin, end)
      // 读取到的数量，小于每页的总数量。标记下次需要从后台读取数据
      if (currentPageData.length < limit) {
        Vue.set(state.isCache, objectType + objectID, false)
        state.page.offset = begin + limit // 需要改变offset
      }
      let newActivitys = _.differenceBy(currentPageData, state.activitys, 'id')
      state.activitys.push(...newActivitys)
    }
  },
  clearActivitys (state) {
    state.activitys = []
  },
  // 更新缓存标记。ture 从缓存读取; false从后台DB读取
  updateCacheDataFlag (state, { objectType, objectID, value }) {
    Vue.set(state.isCache, objectType + objectID, value)
  },
  // 更新一条任务
  updateActivity (state, activity) {
    const index = state.activitys.findIndex(t => t.id === activity.id)
    state.activitys.splice(index, 1, activity)
  },
  deleteActivity (state, id) {
    Vue.delete(state.activitys, state.activitys.findIndex(a => a.id === id))
  },
  setObjectID (state, objectID) {
    state.objectID = objectID
  },
  setObjectType (state, objectType) {
    state.objectType = objectType
  }
}
