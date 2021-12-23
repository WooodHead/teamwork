import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import request from '@/boot/axios'
import Customer from './model'
import { searchToPersonIds, searchToOrganizeIds } from '@/utils/search-convert-helper'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  getList: '/customers/getlist',
  getPageList: '/customers/getpagelist',
  getModel: '/customers/getModel',
  getModelNoAcl: '/customers/GetModelNoAcl',
  getCount: '/customers/getCount',
  getDeletedList: 'customers/getDeletedList',
  Add: '/customers/Add',
  Update: '/customers/Update',
  UpdateFields: '/customers/UpdateFields',
  Delete: '/customers/Delete',
  Undelete: 'customers/undelete',
  UpdateMember: '/customers/UpdateMember',
  getEnterprisesList: 'customers/findallenterprises',
  getEnterpriseInfo: 'customers/findoneenterprise'
}
export default {
  /**
   *获取客户所有信息
   *
   * @param {*} { state, commit }
     * @param {string} [query] 查询条件
     * @param {string} [filter] 模糊查询对象
     * @param {string} [sort] 排序
     * @param {string} [search] 搜索
     * @param {string} [fields] 查询字段
   * @returns
   */
  loadCustomers ({ commit, state }, { query, filter, byPage = state.byPage } = {}) {
    const page = state.page
    let sort = state.sort
    if (sort === 'CustomerName') { sort = 'CONVERT(' + sort + ' USING gbk)' }
    // 搜索条件转换为query条件
    if (state.search) {
      let personIds = searchToPersonIds(this.getters, state.search)
      query.push('And')
      let searchQuery = []
      // 拼人员条件
      personIds && searchQuery.push({ Key: 'LeaderID', Value: personIds, Oper: 'in' })
      // 拼部门条件
      let organizesIds = searchToOrganizeIds(this.getters, state.search)
      if (organizesIds) {
        personIds && searchQuery.push('Or')
        searchQuery.push({ Key: 'OrganizeID', Value: organizesIds, Oper: 'in' })
      }
      // 拼名称条件
      if (personIds || organizesIds) { searchQuery.push('Or') }
      searchQuery.push({ Key: 'CustomerName', Value: `%${state.search}%`, Oper: 'like' })
      query.push(searchQuery)
    }
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: sort,
      search: state.search,
      fields: 'List'
    }
    let reqUrl = url.getList
    if (byPage) {
      Object.assign(condition, {
        limit: state.page.limit,
        offset: state.page.offset
      })
      reqUrl = url.getPageList
    }
    if (!state.loadedAll) {
      return request.get(reqUrl, condition).then(res => {
        let customers = Customer.from(res.data)
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('updatePage', { offset: Math.min(page.offset + page.limit), nextPageToken })
          if (nextPageToken === -1) {
            commit('setLoadedAll', true)
          }
        } else {
          commit('setLoadedAll', true)
        }
        commit('updateCustomers', customers)
        return customers
      })
    } else {
      return state.customers
    }
  },
  /**
   *获取当前客户对象
   *
   * @param {*} { state, commit }
   * @param {*} id 客户ID
   * @returns
   */
  loadCustomer ({ state, commit }, id) {
    let customer = _.find(state.customers, { 'id': id })
    if (customer) {
      return customer
    } else {
      return request.get(url.getModel, { id: id }).then(res => {
        if (res.data) {
          customer = Customer.from(res.data)
          commit('updateCustomers', [customer])
          return customer
        } else {
          return null
        }
      })
    }
  },
  /**
   *获取当前不受权限控制的客户对象
   *
   * @param {*} { state, commit }
   * @param {*} id 客户ID
   * @returns
   */
  loadCustomerNoAcl ({ state, commit }, id) {
    let customer = _.find(state.customers, { 'id': id })
    if (customer) {
      return customer
    } else {
      return request.get(url.getModelNoAcl, { id: id }).then(res => {
        if (res.data) {
          customer = Customer.from(res.data)
          commit('updateCustomers', [customer])
          return customer
        } else {
          return null
        }
      })
    }
  },
  /**
   * 获取供选择的客户信息
   * @returns
   */
  loadSelectCustomers ({ state, commit }) {
    if (_.isEmpty(state.selectCustomers) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request
        .get(url.getList, { fields: 'Select' })
        .then(res => {
          const customers = Customer.from(res.data)
          commit('updateSelectCustomers', customers)
          return customers
        })
    } else {
      return _.values(state.selectCustomers)
    }
  },
  /**
   *添加客户信息
   *
   * @param {*} { state, commit }
   * @param {*} customer
   * @returns
   */
  addCustomer ({ commit }, customer) {
    let model = Customer.to(customer)
    return request.post(url.Add, model).then(res => {
      if (res.data) {
        let customer = Customer.from(res.data)
        commit('updateCustomers', [customer])
        return customer
      } else {
        return null
      }
    })
  },
  /**
  *编辑客户信息
  *
  * @param {*} { state, commit }
  * @param {*} customer
  * @returns
  */
  editCustomer ({ commit }, customer) {
    let model = Customer.to(customer)
    return request.put(url.Update, model)
      .then(res => {
        let customer = Customer.from(res.data)
        commit('editCustomer', customer)
        return customer
      })
  },
  /**
 *删除客户信息
 *
 * @param {*} { state, commit }
 * @param {*} id 客户ID
 * @returns
 */
  deleteCustomer ({ commit }, id) {
    request.delete(url.Delete, { id: id })
      .then(res => {
        commit('deleteCustomer', id)
        this.$router.push({ name: 'customerHome' })
        return res.data
      })
  },
  // 解删除客户
  undeleteCustomer ({ state, commit }, id) {
    return request.get(url.Undelete, { id })
      .then(res => {
        let customer = state.customersInTrash.find(item => item.id === id)
        let customers = Customer.from(res.data)
        commit('updateCustomers', customers)
        commit('undeleteCustomerInTrash', id)
        return customer
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
  * 设置客户管理卡片
  * @param {*} param0
  * @param {*} payload
  */
  updateCustomerField ({ commit }, payload) {
    const model = Customer.to(payload)
    !_.has(payload, 'classify') && delete model['Classify']
    !_.has(payload, 'organizeType') && delete model['OrganizeType']
    !_.has(payload, 'localTaxNo') && delete model['LocalTaxNo']
    !_.has(payload, 'foundDate') && delete model['FoundDate']
    !_.has(payload, 'members') && delete model['Members']
    !_.has(payload, 'widgets') && delete model['Widgets']
    return request.put(url.UpdateFields, model)
      .then(res => {
        const model = Customer.from(res.data)
        commit('editCustomer', model)
        return model
      })
  },
  /**
   * 加载归档的客户数
   * @param {*} param0
   */
  loadArchivedCount ({ commit }) {
    request.get(url.getCount)
      .then((res) => {
        commit('setArchivedCount', res.data)
      })
  },
  /**
   * 更新客户成员
   * @param {*} id:客户ID
   * @param {*} personIDs： 客户的IDs的集合
   * @param {*} identify 成员职位
   */
  updateCustomerMembers ({ commit }, { id, personIDs, identify }) {
    debugger
    return request
      .put(url.UpdateMember, {
        id,
        psonIDs: _.join(personIDs),
        identify: identify
      })
      .then(res => {
        const model = Customer.from(res.data)
        commit('editCustomer', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`customer.error.${error.userMessage}`))
        return false
      })
  },
  // 获取与我相关的已删除的客户
  loadCustomersInMyTrash ({ state, commit }) {
    const my = LocalStorage.getItem('myself') || {}
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'Members', Value: my.name, Oper: 'inset' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.getDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Customer.from(res.data)
        commit('addCustomersInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除客户
  loadCustomersInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.getDeletedList, { query: JSON.stringify(query) })
      .then(res => {
        let list = Customer.from(res.data)
        commit('addCustomersInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *获取当前客户对象
   *
   * @param {*} { state, commit }
   * @param {*} id 客户ID
   * @returns
   */
  findAllEnterprises ({ state }, search) {
    return request.get(url.getEnterprisesList, { search }).then(res => {
      if (res.data) {
        return JSON.parse(res.data)
      }
    })
  },
  /**
   *获取当前客户对象
   *
   * @param {*} { state, commit }
   * @param {*} id 客户ID
   * @returns
   */
  findOneEnterprise ({ state }, search) {
    return request.get(url.getEnterpriseInfo, { search }).then(res => {
      if (res.data) {
        return JSON.parse(res.data)
      }
    })
  }
}
