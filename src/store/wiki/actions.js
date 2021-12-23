import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Wiki from './model'
import { date } from 'quasar'
const { formatDate } = date
import { i18n } from '@/boot/i18n'
export default {
  /**
   * 获取ID指定知识空间
   * @param {*} id
   */
  loadWiki ({ state, commit }, id) {
    const wiki = _.find(state.wikis, { id })
    if (!wiki) {
      return request.get('wikis/getmodel', { id })
        .then((res) => {
          const model = Wiki.from(res.data)
          commit('addWiki', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return wiki
    }
  },
  /**
   *
   * 获取知识空间列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   */
  loadWikis ({ state, commit }, {
    query,
    filter,
    search = state.search,
    fields = 'List',
    sort = state.sort,
    order = state.order,
    byPage = state.byPage,
    limit = state.page.limit,
    offset = state.page.offset
  } = {}) {
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit,
        offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search,
        sort,
        order,
        fields
      }
      url = 'wikis/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search,
        fields
      }
      url = 'wikis/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let wikis = Wiki.from(res.data)
        commit('setPage', {
          offset: page.offset + wikis.length, nextPageToken: res.nextPageToken
        })
        commit('setListWikis', wikis)
        return wikis
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /***
   * 获取供选择的知识空间信息
   */
  loadSelectWikis ({ state, commit }) {
    if (_.isEmpty(state.selectWikis) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request.get('/wikis/getlist', { fields: 'Select' }).then(res => {
        const wikis = Wiki.from(res.data)
        commit('updateSelectWikis', wikis)
        return wikis
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
    } else {
      return state.selectWikis.all
    }
  },
  /**
   * 是否在知识空间成员里
   * @returns 
   */
  inMembers ({ state, commit }, id) {
    if (!state.inMembers.hasOwnProperty(id)) {
      return request.get('wikis/inmembers', { id })
        .then((res) => {
          commit('updateInMembers', { key: id, value: res.data })
          return res.data
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return state.inMembers[id]
    }
  },
  /**
   * 新建知识空间
   * @param {Object} wiki 新建的知识空间对象
   */
  addWiki ({ state, commit }, wiki) {
    return request.post('wikis/add', Wiki.to(wiki))
      .then(res => {
        const model = Wiki.from(res.data)
        commit('addWiki', model)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 编辑知识空间
   * @param {Object} wiki 编辑后的知识空间对象
   */
  updateWiki ({ state, commit }, wiki) {
    return request.put('wikis/update', Wiki.to(wiki))
      .then(res => {
        const model = Wiki.from(res.data)
        commit('updateWiki', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
 * 更新知识空间成员
 * @param {*} id:知识空间ID
 * @param {*} personIDs： 知识空间成员的IDs的集合
 */
  updateWikiMembers ({ state, commit }, { id, personIDs, identify }) {
    return request.put('wikis/updatemember', {
      id,
      personIDs: _.join(personIDs),
      identify: identify
    })
      .then(res => {
        const model = Wiki.from(res.data)
        commit('updateWiki', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *  更新知识空间字段
   * @param {*} param0
   * @param {*} param1
   */
  updateWikiField ({ state, commit }, fields) {
    let wiki = Wiki.to(fields)
    return request.put('wikis/updatefields', wiki)
      .then(res => {
        const model = Wiki.from(res.data)
        commit('updateWiki', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 删除一个知识空间
   * @param {Number} id 知识空间id
   */
  deleteWiki ({ state, commit }, id) {
    return request.delete('wikis/delete', { id })
      .then((res) => {
        commit('deleteWiki', id)
        // 如果是在卡片中删除，在哪删除就在哪呆着，如果是详情页删除，跳到home或archivedHome
        const route = this.$router.currentRoute
        if (route.name === 'wikiManage') {
          route.path.includes('archived')
            ? this.$router.push({ name: 'archivedWikis' })
            : this.$router.push({ name: 'wikiHome' })
        }
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 解删除一个知识空间
   * @param {Object} param0 --
   * @param {Number} id 知识空间id
   */
  undeleteWiki ({ state, commit }, id) {
    return request.get('wikis/undelete', { id })
      .then((res) => {
        let wiki = Wiki.from(res.data)
        commit('addWiki', wiki)
        commit('undeleteWikiInTrash', wiki)
        return wiki
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /**
   * 加载归档数量
   */
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request.get('wikis/getcount', condition)
      .then((res) => {
        commit('setArchivedCount', res.data)
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 归档知识空间
   * @param {*} ID 知识空间ID
   */
  archiveWiki ({ commit }, id) {
    return request.get(`wikis/archive`, { id })
      .then(res => {
        const model = Wiki.from(res.data)
        commit('updateWiki', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 解档一个知识空间
   * @param {*} ID 知识空间ID
   */
  unarchiveWiki ({ commit }, id) {
    request.get(`wikis/unarchive`, { id })
      .then(res => {
        const model = Wiki.from(res.data)
        commit('updateWiki', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  /** ------------------------------废纸篓 start------------------ */
  // 获取与我相关的已删除的知识空间
  loadWikisInMyTrash ({ state, commit }) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      { Key: 'DeleteTime', Value: time, Oper: 'ge' }
    ]
    return request.get('wikis/getdeletedlist', { query: JSON.stringify(query) })
      .then((res) => {
        let list = Wiki.from(res.data)
        commit('addWikisInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
