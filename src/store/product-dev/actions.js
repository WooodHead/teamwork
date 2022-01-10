import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import ProductDev from './model'
import TaskChart from '../taskchart/model'
import { LocalStorage, date } from 'quasar'
import { i18n } from '@/boot/i18n'
const { formatDate } = date
const visitedApi = []
export default {
  /**
   * 获取产品对象
   * @param {Number} id 产品id
   */
  loadProductDev ({ state, commit }, id) {
    id = Number(id)
    const productDev = _.find(state.productDevs, { id })
    const api = 'productDevs/getmodel/' + id
    if (!productDev && !visitedApi.includes(api)) {
      visitedApi.push(api)
      return request.get('productDevs/getmodel', { id })
        .then((res) => {
          const model = ProductDev.from(res.data)
          commit('addProductDev', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
          return false
        })
    } else {
      return productDev
    }
  },
  /**
  *
  * 获取产品列表
  * @param {*} { state, commit }
  * @param {string} [query] 查询条件
  * @param {string} [filter] 模糊查询对象
  * @param {string} [sort] 排序
  * @param {string} [search] 搜索
  * @param {string} [fields] 查询字段
  * @param {number} [limit] 每页记录条数
  * @param {number} [offset] 偏移记录条数
  */
  loadProductDevs ({ state, commit }, {
    query,
    filter,
    sort,
    order,
    search,
    fields = 'List',
    limit = state.page.limit,
    offset = state.page.offset,
    byPage = state.byPage
  } = {}) {
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
      searchQuery.push({ Key: 'Title', Value: `%${search}%`, Oper: 'like' })
      searchQuery.push('Or', { Key: 'Notes', Value: `%${search}%`, Oper: 'like' })
      query.push(searchQuery)
      search = ''
    }
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        sort: sort,
        order: order,
        fields: fields
      }
      url = 'productDevs/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'productDevs/getlist'
    }
    return request.get(url, params)
      .then(res => {
        let productDevs = ProductDev.from(res.data)
        commit('setPage', {
          offset: page.offset + productDevs.length,
          nextPageToken: res.nextPageToken
        })
        commit('setListProductDevs', productDevs)
        return productDevs
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
      })
  },

  /**
  * 获取供选择的产品信息
  */
  loadSelectProductDevs ({ state, commit }) {
    if (_.isEmpty(state.selectProductDevs) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      const _query =
        [
          { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }
        ]
      return request.get('/productDevs/getlist', { query: JSON.stringify(_query), fields: 'Select' }).then(res => {
        const productDevs = ProductDev.from(res.data)
        commit('updateSelectProductDevs', productDevs)
        return productDevs // 直接返回数组即可
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
    } else {
      return state.selectProductDevs.all
    }
  },
  /**
   * 新建产品
   * @param {Object} param0 --
   * @param {Object} productDev 新建的产品对象
   */
  addProductDev ({ state, commit }, productDev) {
    return request.post('productDevs/add', ProductDev.to(productDev))
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('addProductDev', model)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  /**
 * 添加一个产品从模板中
 * @param {*} productDev 需要提交的表单数据
 */
  addProductDevFromTemplate ({ state, commit }, productDev) {
    return request
      .post('productDevs/addfromtemplate', ProductDev.to(productDev))
      .then(res => {
        // 前台
        const model = ProductDev.from(res.data)
        commit('addProductDev', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 编辑产品
   * @param {Object} param0 --
   * @param {Object} productDev 编辑后的产品对象
   */
  updateProductDev ({ state, commit }, productDev) {
    return request.put('productDevs/update', ProductDev.to(productDev))
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 更新产品某个字段
   * @param {Object} fields --
   */
  updateProductDevField ({ state, commit }, fields) {
    let productDev = ProductDev.to(fields)
    !_.has(fields, 'BeginDate') && delete productDev['BeginDate']
    !_.has(fields, 'EndDate') && delete productDev['EndDate']
    !_.has(fields, 'DeclareTime') && delete productDev['DeclareTime']
    !_.has(fields, 'PredictEndDate') && delete productDev['PredictEndDate']
    !_.has(fields, 'ForDeclaration') && delete productDev['ForDeclaration']
    !_.has(fields, 'ForManagement') && delete productDev['ForManagement']
    // 删除AddTemplateID和IsTemplate字段
    productDev = _.omit(productDev, ['IsTemplate'])
    return request.put('productDevs/updatefields', productDev)
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 更新产品成员
   * @param {*} id 产品ID
   * @param {*} newMemberIds： 目前产品成员的IDs的集合
   * @param {*} oldMemberIds： 原产品成员的IDs的集合
   * @param {*} identify 需要保留的人员类型
   * @param {*} projIDs 项目IDs（科研产品成员合并时使用）
   */
  updateProductDevMembers ({ state, commit }, { id, newMemberIds, oldMemberIds, identify, projIDs }) {
    const productDev = _.find(state.productDevs, { id })
    return request.put('productDevs/updatemember', {
      id,
      newMemberIds: _.join(newMemberIds),
      oldMemberIds: _.join(oldMemberIds),
      identify: identify,
      forManagement: productDev.forManagement,
      projIDs: _.join(projIDs)
    })
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 更改状态
   * @param {*} payload 包括Id和属性（不同状态传的对象不一样）
   */
  updateStatus ({ state, commit }, payload) {
    return request.put('productDevs/updatestatus', payload)
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 删除一个产品
   * @param {Number} id 产品id
   */
  deleteProductDev ({ state, commit }, { id, notes = '' }) {
    return request.delete('productDevs/delete', { id, notes })
      .then((res) => {
        const deleteModel = _.find(state.listProductDevs, { id })
        commit('deleteProductDev', id)
        commit('template/deleteTemplate', { id, objectType: 'productDev' }, { 'root': true })
        // 如果是在卡片中删除，在哪删除就在哪呆着，如果是详情页删除，跳到home或archivedHome
        const route = this.$router.currentRoute
        if (route.name === 'productDevDetail') {
          route.path.includes('archived')
            ? this.$router.push({ name: 'archivedProductDevs' })
            : deleteModel.isTemplate
              ? this.$router.push({ name: 'productDevTemplateManage' })
              : this.$router.push({ name: 'productDevHome' })
        }
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
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
    request.get('productDevs/getcount', condition)
      .then((res) => {
        commit('setArchivedCount', res.data)
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
      })
  },
  /**
 * 归档产品
 * @param {*} ID 产品ID
 */
  archiveProductDev ({ commit, rootState }, id) {
    return request.get(`productDevs/archive`, { id })
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        let archivedCount = 0
        if (rootState.template.archivedCount['productDev']) {
          archivedCount = rootState.template.archivedCount['productDev'].count + 1
        }
        commit('template/updateTemplate', Object.assign(model, { objectType: 'productDev' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'productDev', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return {}
      })
  },
  /**
   * 解档一个产品研发
   * @param {*} ID 产品研发ID
   */
  unarchiveProductDev ({ commit, rootState }, id) {
    request.get(`productDevs/unarchive`, { id })
      .then(res => {
        const model = ProductDev.from(res.data)
        commit('updateProductDev', model)
        if (rootState.template.archivedCount['productDev']) {
          archivedCount = rootState.template.archivedCount['productDev'].count - 1
        }
        commit('template/updateTemplate', Object.assign(model, { objectType: 'productDev' }), { 'root': true })
        commit('template/setArchivedCount', { category: 'productDev', count: archivedCount }, { 'root': true })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  // 是否存在数据。首页判断是否存在我的数据，如果存在则显示，如果不存在，显示所有数据。
  existMyProductDev ({ state, commit }) {
    let myProductDevs = []
    if (!_.isEmpty(state.listProductDevs)) myProductDevs = state.listProductDevs.filter(a => !a.archived && _.indexOf(a.members.map(Number), LocalStorage.getItem('myself').id) >= 0)
    if (!_.isEmpty(myProductDevs)) return 1
    const query = [
      { 'Key': 'Members ->\'$.all\'', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' },
      'and',
      { Key: 'Archived', Value: 0, Oper: 'eq' },
      'and',
      { 'Key': 'IsTemplate', 'Value': 0, 'Oper': 'eq' }]
    return request.get('productDevs/exists', { query: JSON.stringify(query) })
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`productDev.error.${error.userMessage}`))
        return false
      })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（产品管理）start ***************************************/
  /** ************************************************************************************************/
  /**
 *取消删除
 * @param {*} param0
 * @param {*} id
 */
  undeleteProductDev ({ state, commit }, id) {
    return request.get('/productDevs/Undelete', { id })
      .then(res => {
        if (res.data) {
          let productDev = ProductDev.from(res.data)
          commit('updateProductDev', productDev)
          commit('undeleteProductDevInTrash', id)
          return productDev
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   *获取与我相关的已删除项目
   * @param {*} param0
   * @returns
   */
  loadProductDevsInMyTrash ({ state, commit }) {
    const my = LocalStorage.getItem('myself')
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'Members ->\'$.all\'', Value: _.toString(my.id), Oper: 'search' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get('/productDevs/GetDeletedList', { query: JSON.stringify(query) }).then(res => {
      let list = ProductDev.from(res.data)
      commit('addProductDevTrash', list)
      return list
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（产品研发）end *****************************************/
  /** ************************************************************************************************/
  /** ----------------------------导出工时，结算工时------------------------------------------------ */
  getMonthList ({ state, commit }, { organizeIds, year }) {
    return request.get('/productDevs/GetYearCounts', { organizeIds, year })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },
  countHour ({ state, commit }, { organizeIds, year, month, beginDate, endDate }) {
    return request.get('/productDevs/CountHour', { organizeIds, year, month, beginDate, endDate })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },
  exportHour ({ state, commit }, { organizeIds, year, month }) {
    return request.get('/productDevs/ExportHour', { organizeIds, year, month })
      .then(res => {
        const taskChart = TaskChart.from(res.data)
        return taskChart
      }).catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  }
}
