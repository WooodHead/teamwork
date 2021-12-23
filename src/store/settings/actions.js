import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import Setting from './model'

const url = {
  root: 'settings',
  model: 'settings/getmodel',
  add: 'settings/add',
  update: 'settings/update'
}

export default {
  /**
   * load settings
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   */
  loadSettings ({ state, commit }, { query, filter, sort = '', search, fields = 'List' } = {}) {
    if (state.settings.devSystem.id === 0) {
      let condition = {
        query: JSON.stringify(query),
        filter: JSON.stringify(filter),
        sort,
        search,
        fields
      }
      return request.get(url.root, condition)
        .then(res => {
          commit('setSettings', Setting.from(res.data))
          return state.settings
        })
        .catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`setting.error.${error.userMessage}`))
          return []
        })
    } else {
      return state.settings
    }
  },
  /**
   * 获取设置对象
   * @param {Object} param0 --
   * @param {Number} id 产品id
   */
  loadSetting ({ state, commit }, id) {
    let setting = _.find(state.settings, { id })
    if (!setting) {
      return request.get(url.model, { id })
        .then(res => {
          if (res.data) {
            setting = Setting.from(res.data)
            commit('setSettings', [setting])
          }
          return setting
        })
    }
    return setting
  },
  /**
     * 新建首页机构设置
     * @param {Object} param0 --
     * @param {Object} setting 新建的首页机构设置对象
     */
  addSetting ({ state, commit }, setting) {
    const endModel = Setting.to(setting)
    return request.post(url.add, endModel)
      .then(res => {
        const model = Setting.from(res.data)
        commit('addSetting', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`setting.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 编辑首页机构设置
   * @param {Object} param0 --
   * @param {Object} setting 编辑后的首页机构设置对象
   */
  updateSetting ({ state, commit }, setting) {
    const endModel = Setting.to(setting)
    return request.put(url.update, endModel)
      .then(res => {
        const model = Setting.from(res.data)
        commit('setSettings', [model])
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`setting.error.${error.userMessage}`))
        return {}
      })
  }
}
