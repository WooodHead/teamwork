import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import ProductUser from './model'
import { i18n } from '@/boot/i18n'
const visitedApi = []
export default {
  /**
   * 获取产品关联的用户
   * @param {Number} id 产品用户id
   */
  loadProductUser ({ state, commit }, id) {
    id = Number(id)
    const productUser = _.find(state.productUsers, { id })
    const api = 'productUser/getmodel/' + id
    if (!productUser && !visitedApi.includes(api)) {
      visitedApi.push(api)
      return request.get('productUser/getmodel', { id })
        .then((res) => {
          const model = ProductUser.from(res.data)
          commit('addProductUser', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`ProductUser.error.${error.userMessage}`))
          return false
        })
    } else {
      return productUser
    }
  },
  /**
   * 批量添加产品关联的用户
   * @param {Object} lstUsers
   */
  addBatchProductUser ({ state, commit }, lstUsers) {
    return request.post('productUser/addBatch', lstUsers)
      .then(res => {
        commit('setListProductUsers', res.data)
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`ProductUser.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 批量删除产品关联的用户
   * @param {Object} lstUsers
   */
  deleteBatchProductUser ({ state, commit }, { objectType, objectId, psonIds }) {
    return request.put('productUser/deleteBatch', { objectType, objectId, psonIds })
      .then(res => {
        // commit('setListProductUsers', res.data)
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`ProductUser.error.${error.userMessage}`))
        return false
      })
  },
  // 获取当前产品资源下的关联用户
  loadProductUsersByResource ({ state, commit }, { objectType, objectId }) {
    let productUsers = _.find(state.productUsers, { objectType, objectId })
    if (!productUsers) {
      return request.get('productUser/getAllUsersByResource', { objectType, objectId })
        .then(res => {
          commit('setListProductUsers', res.data)
          return res.data
        })
    }
    return productUsers
  },
  // 分页获取当前产品资源下的关联用户
  loadUsersInResourceByPage ({ state, commit }, { 
    objectType, 
    objectId, 
    limit = state.page.limit,
    offset = state.page.offset }) {
    return request.get('productUser/getAllUsersInResourceByPage', { objectType, objectId, limit, offset })
      .then(res => {
        commit('setPage', {
          offset: state.page.offset + res.data.length,
          nextPageToken: res.nextPageToken
        })
        commit('setListProductUsers', res.data)
        return res.data
      })
  },
  // 获取当前用户可以访问的产品资源
  loadResourcesByUser ({ state, commit }, { psonId, objectType }) {
    let productUsers = _.find(state.productUsers, { psonId, objectType })
    if (!productUsers) {
      return request.get('productUser/getResourceInfoByUser', { psonId, objectType })
        .then(res => {
          commit('setListProductUsers', res.data)
          return res.data
        })
    }
    return productUsers
  }
}
