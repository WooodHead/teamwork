import Vue from 'vue'
export default {
  /**
   * 更新前台缓存数组
   * @param {*} state
   * @param {*} payload
   */
  setDictionary (state, { module, value }) {
    const dictionary = {}
    Object.keys(_.keyBy(value, 'field')).forEach(field => {
      dictionary[field] = []
    })
    for (const dict of value) {
      dictionary[dict.field].push(dict)
    }
    Vue.set(state.dictionary, module, dictionary)
  },
  /**
   * 前台数据编辑更新
   * @param {*} state
   * @param {*} payload
   */
  editDictionary (state, dictionary) {
    const value = _.find(state.dictionary[dictionary.module][dictionary.field], { id: dictionary.id })
    Object.assign(value, dictionary)
  },
  /**
   * 前台数据新建更新
   * @param {*} state
   * @param {*} payload
   */
  addDictionary (state, dictionary) {
    if (!state.dictionary[dictionary.module]) {
      Vue.set(state.dictionary, dictionary.module, {})
      Vue.set(state.dictionary[dictionary.module], dictionary.field, [])
    } else if (!state.dictionary[dictionary.module][dictionary.field]) {
      Vue.set(state.dictionary[dictionary.module], dictionary.field, [])
    }
    state.dictionary[dictionary.module][dictionary.field].push(dictionary)
  },
  /**
   * 前台数据删除
   * @param {*} state
   * @param {*} id
   */
  deleteDictionary (state, dictionary) {
    const dictionarys = state.dictionary[dictionary.module][dictionary.field]
    Vue.delete(dictionarys, _.findIndex(dictionarys, { id: dictionary.id }))
  },
  /**
   * 更新前台缓存数组
   * @param {*} state
   * @param {*} payload
   */
  dragDictionaryOrder (state, payload) {
    state.dictionary[payload[0].module][payload[0].field] = payload
  }
}
