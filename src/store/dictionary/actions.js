import Dictionary from './model'
import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  add: 'dictionarys/add',
  update: 'dictionarys/update',
  delete: 'dictionarys/delete',
  getList: 'dictionarys/getlist',
  getModel: 'dictionarys/getModel',
  dragDictionaryOrder: 'dictionarys/dragorder'
}
// todo 防止后台多次调用相同接口，后面会改为统一的处理方案
const visitedApi = []
export default {
  loadDictionarys ({ state, commit }, module) {
    if (state.dictionary[module]) return state.dictionary[module]
    const api = url.getList + module
    if (visitedApi.includes(api)) return state.dictionary[module]
    visitedApi.push(api)
    return request.get(url.getList, {
      query: JSON.stringify([
        { Key: 'Module', Value: module, Oper: 'eq' }
      ])

    }).then(res => {
      let dictionarys = Dictionary.from(res.data)
      commit('setDictionary', { module: module, value: dictionarys })
      return state.dictionary[module]
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
    })
  },
  loadDictionary ({ state, commit }, id) {
    return request.get(url.getModel, {
      id: id
    }).then(res => {
      let dictionary = Dictionary.from(res.data)
      return dictionary
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
    })
  },
  /**
   * 新建或编辑字典项
   */
  editDictionary ({ state, commit }, payload) {
    if (payload.id) {
      // 编辑
      let dictionary = Dictionary.to(payload)
      return request.put(url.update, dictionary).then(res => {
        let dictionary = Dictionary.from(res.data)
        commit('editDictionary', dictionary)
        return dictionary
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
        return null
      })
    } else {
      // 新建
      let dictionary = Dictionary.to(payload)
      return request.post(url.add, dictionary).then(res => {
        let dictionary = Dictionary.from(res.data)
        // 更新缓存列表
        commit('addDictionary', dictionary)
        return dictionary
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
        return null
      })
    }
  },
  /**
   * 删除字典项
   * @param {*} param0
   * @param {*} id
   */
  deleteDictionary ({ state, commit }, payload) {
    return request.delete(url.delete, {
      id: payload.id
    }).then(res => {
      commit('deleteDictionary', payload)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
    })
  },
  /**
   * 拖拽排序
   * @param {*} param0
   * @param {*} param1
   */
  dragDictionaryOrder ({ state, commit }, { module, field, orderData }) {
    request.put(url.dragDictionaryOrder, {
      module, field, orderData
    }).then(res => {
      let dictionarys = Dictionary.from(res.data)
      commit('dragDictionaryOrder', dictionarys)
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`dictionary.error.${error.userMessage}`))
    })
  }
}
