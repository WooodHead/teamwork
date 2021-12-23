import Model from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  add: 'boosts/add',
  getList: 'boosts/getList',
  getPlate: 'boosts/getModel',
  getPlates: 'boostsPlates/getList',
  deleteBoost: 'boosts/delete',
  deleteBoostPlate: 'boostsPlates/delete'
}
export default {
  loadBoosts ({ commit }, { query } = {}) {
    const params = { query: JSON.stringify(query) }
    return request.get(url.getList, params).then(res => {
      let list = Model.Boost.from(res.data)
      commit('addBoosts', list)
      if (query) {
        const keys = query.map(r => { return r.Key })
        if (keys.includes('ObjectType') && keys.includes('ObjectID')) {
          const objType = _.find(query, r => r.Key === 'ObjectType')['Value']
          const oper = _.find(query, r => r.Key === 'ObjectID')['Oper']
          const objValue = _.find(query, r => r.Key === 'ObjectID')['Value']
          if (oper === 'in') {
            const load = objValue.split(',').map(r => { return objType + r })
            commit('setLoaded', load)
          } else if (oper === 'eq') {
            commit('setLoaded', objType + objValue)
          }
        }
      }
      return list
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  // 加载资源收获的赞
  loadBoostsByObject ({ state, commit }, { objectID = 0, objectType = '' }) {
    // 如果该资源的点赞数据已经被获取过，则从缓存中获取
    const type = objectType + objectID
    if (state.loaded.includes(type)) {
      return _.find(state.boosts, item => item.objectID === +objectID && item.objectType === objectType)
    } else {
      const query = [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }]
      return request.get(url.getList, { query: JSON.stringify(query) })
        .then(res => {
          let list = Model.Boost.from(res.data)
          commit('addBoosts', list)
          if (list.length === 0) {
            commit('filterBoostPlate', { objectID: objectID, objectType: objectType })
          }
          commit('setLoaded', type)
          return list
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
  },
  // 加载当前用户所有点赞面板
  loadBoostsPlates ({ commit }) {
    return request.get(url.getPlates)
      .then(res => {
        let list = Model.BoostPlate.from(res.data)
        commit('addBoostsPlates', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 加载一条点赞面板
  loadBoostPlate ({ commit }, id) {
    return request.get(url.getPlate, { id: id })
      .then(res => {
        let boostPlate = Model.BoostPlate.from(res.data)
        commit('addBoostsPlates', [boostPlate])
      })
  },
  // 新建一条点赞
  addBoost ({ state, commit }, boost) {
    let toBoost = Model.Boost.to(boost)
    return request.post(url.add, toBoost)
      .then(res => {
        let boost = Model.Boost.from(res.data)
        commit('addBoosts', [boost])
        let plate = state.boostsPlates.find(p => p.objectID === boost.objectID && p.objectType === boost.objectType)
        plate.modifyTime = boost.modifyTime
        commit('updateBoostPlate', plate)
        return boost
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  deleteBoost ({ state, commit }, id) {
    return request.delete(url.deleteBoost, { id: id })
      .then(res => {
        let boost = state.boosts.find(a => a.id === id)
        commit('deleteBoost', id)
        commit('filterBoostPlate', { objectID: boost.objectID, objectType: boost.objectType })
        return boost
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  deleteBoostPlate ({ state, commit }, id) {
    return request.delete(url.deleteBoostPlate, { id: id })
      .then(res => {
        commit('deleteBoostPlate', id)
        return state.boostsPlates.find(a => a.id === id)
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
