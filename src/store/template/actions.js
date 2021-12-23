import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Template from './model'
import { i18n } from '@/boot/i18n'
export default {
  loadTemplate ({ state, commit }, { id, category }) {
    id = Number(id)
    const template = _.find(state.templates, { id })
    if (!template) {
      let url = `${category}s/getmodel`
      return request.get(url, { id }).then(res => {
        if (res.data) {
          let model = require(`src/store/${category === 'productDev' ? 'product-dev' : category}/model.js`).default
          let templates = model.from(res.data)
          templates.objectType = category
          commit('updateTemplate', templates)
          return templates
        } else {
          return false
        }
      })
    } else {
      return template
    }
  },
  loadCategoryTemplates (
    { state, commit, rootState },
    {
      category,
      search = state.search,
      sort = state.sort,
      byPage = true,
      fields = 'List',
      order = state.order,
      archived = 0
    } = {}
  ) {
    let limit, offset
    const query = [
      { Key: 'Archived', Value: archived, Oper: 'eq' },
      'and',
      { Key: 'IsTemplate', Value: 1, Oper: 'eq' }
    ]
    // 搜索条件转换为query条件
    if (search) {
      let okPersons = this.getters['person/getMatchList'](search)
      let okPersonsIds = _.map(okPersons, 'id').toString()
      query.push('And')
      let searchQuery = []
      // 拼人员条件
      okPersonsIds && searchQuery.push({ Key: 'LeaderID', Value: okPersonsIds, Oper: 'in' })

      // 拼机构条件
      let okOrganizes = this.getters['organize/getMatchList'](search)
      let okOrganizesIds = _.map(okOrganizes, 'id').toString()
      if (okOrganizesIds) {
        okPersonsIds && searchQuery.push('Or')
        searchQuery.push({ Key: 'OrganizeID', Value: okOrganizesIds, Oper: 'in' })
      }
      // 拼名称条件
      if (okPersonsIds || okOrganizesIds) { searchQuery.push('Or') }
      searchQuery.push({ Key: category === 'project' ? 'ProjName' : 'Title', Value: `%${search}%`, Oper: 'like' })
      searchQuery.push('Or', { Key: category === 'project' ? 'Description' : 'Notes', Value: `%${search}%`, Oper: 'like' })
      query.push(searchQuery)
      search = ''
    }
    const condition = {
      query: JSON.stringify(query),
      search,
      fields,
      sort
    }
    if (byPage) {
      limit = state.page[`${category}`] ? state.page[`${category}`].limit : 20
      offset = state.page[`${category}`] ? state.page[`${category}`].offset : 0
    }
    Object.assign(condition, byPage ? { limit, offset, order } : {})
    let url = byPage ? `${category}s/getpagelist` : `${category}s/getlist`
    return request
      .get(url, condition)
      .then(res => {
        let model = require(`src/store/${category === 'productDev' ? 'product-dev' : category}/model.js`).default
        let templates = model.from(res.data)
        templates = _.map(templates, m => {
          m.objectType = category
          return m
        })
        // templates = Template.from(templates)
        commit('updatePage', {
          offset: offset + templates.length,
          nextPageToken: res.nextPageToken,
          category
        })

        commit('setTemplates', templates)
        return templates
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  exist ({ state, commit }, category) {
    const query = [
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { Key: 'IsTemplate', Value: 1, Oper: 'eq' }
    ]
    return request.get(`${category}s/exists`, { query: JSON.stringify(query) })
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`project.error.${error.userMessage}`))
        return false
      })
  },

  loadArchivedCount ({ state, commit }, category) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'IsTemplate', Value: 1, Oper: 'eq' }]
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    return request
      .get(`${category}s/getcount`, condition)
      .then(res => {
        commit('setArchivedCount', { count: res.data, category })
        return res.data
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 添加
   * @param {*} template 需要提交的表单数据
   */
  addTemplate ({ state, commit }, { template, category }) {
    let model = require(`src/store/${category === 'productDev' ? 'product-dev' : category}/model.js`).default
    model = model.to(template)
    return request
      .post(`${category}s/add`, model)
      .then(res => {
        // 前台
        let model = require(`src/store/${category === 'productDev' ? 'product-dev' : category}/model.js`).default
        model = model.from(res.data)
        model.objectType = category
        commit('addTemplate', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   *更新
   * @param {*} template 更新后需要提交的model
   */
  updateTemplate ({ state, commit }, { template, category }) {
    let model = require(`src/store/${category === 'productDev' ? 'product-dev' : category}/model.js`).default
    let m = model.to(template)
    return request
      .put(`${category}s/update`, m)
      .then(res => {
        model = model.from(res.data)
        model.objectType = category
        commit('updateTemplate', model)
        commit(`${category === 'productDev' ? 'productDev' : category}/update${category === 'productDev' ? 'ProductDev' : _.capitalize(category)}`, model, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 归档
   * @param {*} ID ID
   */
  archiveTemplate ({ commit }, id) {
    return request
      .get(`templates/archive`, { id })
      .then(res => {
        const model = Template.from(res.data)
        commit('updateTemplate', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 解档
   * @param {*} ID ID
   */
  unarchiveProject ({ commit }, id) {
    request
      .get(`templates/unarchive`, { id })
      .then(res => {
        const model = Template.from(res.data)
        commit('updateTemplate', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  }
}
