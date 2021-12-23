import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import recommendCode from '@/store/recommend-code/model'
const url = {
  getList: 'recommendCodes/getlist',
  getPageList: 'recommendCodes/getpagelist',
  getModel: 'recommendCodes/getmodel',
  add: 'recommendCodes/add',
  update: 'recommendCodes/update',
  updateFields: 'recommendCodes/UpdateFields'
}
export default {
  /**
 *获取推荐码列表信息
 * @param {*} param0
 * @param {*} param1
 */
  loadRecommendCodes ({ state, commit, dispatch }, { byPage = false, query = {}, orderby }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      limit: state.page.limit,
      offset: state.page.offset,
      sort: '',
      orderby: orderby,
      query: JSON.stringify(query)
    }).then(res => {
      let rCodes = _.cloneDeep(res.data)
      let code = recommendCode.from(rCodes)
      commit('pushCodes', code)
      commit('updatePage',
        {
          offset: state.page.offset + code.length,
          limit: state.page.limit
        })
      return code
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },

  /**
 *获取单个的推荐码信息
 * @param {*} param0
 * @param {*} id
 */
  loadRecommendCode ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let code = _.find(state.recommendCodes, { 'id': +id })
    if (code) {
      return code
    } else {
    // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let code = recommendCode.from(res.data)
        commit('pushCodes', code)
        return code
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
        return false
      })
    }
  },

  /**
 *新增推荐码
 * @param {*} param0c
 * @param {*} payload
 */
  addRecommendCode ({ state, commit }, payload) {
    let code = recommendCode.to(payload)
    return request.post(url.add, code).then(res => {
      let code = recommendCode.from(res.data)
      // 更新缓存列表
      commit('pushCodes', [code])
      return code
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },

  /**
 *编辑推荐码
 * @param {*} param0
 * @param {*} payload
 */
  updateRecommendCode ({ state, commit }, payload) {
    let code = recommendCode.to(payload)
    return request.put(url.update, code).then(res => {
      let code = recommendCode.from(res.data)
      // 更新缓存列表
      commit('updateCode', code)
      return code
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  },

  /**
 * 更新入职人数
 * @param {*} param0
 * @param {*} payload
 */
  updateJobNumber ({ state, commit }, payload) {
    return request.put(url.updateFields, payload).then(res => {
      let code = recommendCode.from(res.data)
      // 更新缓存列表
      commit('updateCode', code)
      return code
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`job.error.${error.userMessage}`))
      return false
    })
  }

}
