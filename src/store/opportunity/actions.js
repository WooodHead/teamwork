import { LocalStorage, date } from 'quasar'
const { formatDate } = date
import request from '@/boot/axios'
import Opportunity from './model'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import Message from '../message/model'

const url = {
  getList: '/opportunitys/getList',
  getModel: '/opportunitys/getModel',
  getCount: '/opportunitys/getCount',
  getDeletedList: 'opportunitys/getDeletedList',
  add: '/opportunitys/add',
  update: '/opportunitys/update',
  updateFields: '/opportunitys/updateFields',
  updateState: '/opportunitys/updateState',
  closeLostOrActive: '/opportunitys/closeLostOrActive',
  assignCustomerManager: '/opportunitys/assignCustomerManager',
  delete: '/opportunitys/delete',
  undelete: 'opportunitys/undelete'
}
export default {
  /**
   *获取当前商机对象
   *
   * @param {*} { state, commit }
   * @param {*} id 商机ID
   * @returns
   */
  loadOpportunity ({ state, commit }, id) {
    let opportunity = _.find(state.opportunitys, { 'id': id })
    if (opportunity) {
      return opportunity
    } else {
      return request.get(url.getModel, { id: id }).then(res => {
        if (res.data) {
          opportunity = Opportunity.from(res.data)
          commit('updateOpportunity', opportunity)
          return opportunity
        } else {
          return null
        }
      })
    }
  },
  /**
   *刷新商机
   *
   * @param {*} { state, commit }
   * @param {*} id 商机ID
   * @returns
   */
  refreshOpportunity ({ state, commit }, id) {
    return request.get(url.getModel, { id: id }).then(res => {
      if (res.data) {
        let opportunity = Opportunity.from(res.data)
        commit('updateOpportunity', opportunity)
        return opportunity
      }
    })
  },
  /**
   *
   *获取商机所有信息
   *
   * @param {*} { state, commit }
     * @param {string} [query] 查询条件
     * @param {string} [filter] 模糊查询对象
     * @param {string} [sort] 排序
     * @param {string} [search] 搜索
     * @param {string} [fields] 查询字段
   * @returns
   */
  loadOpportunitys ({ commit, state }, { query, filter, byPage = state.byPage } = {}) {
    const page = state.page
    let condition = {
        query: JSON.stringify(query),
        filter: JSON.stringify(filter),
        sort: state.sort,
        search: state.search,
        fields: 'List'
      }, url = ''
    if (byPage) {
      Object.assign(condition, {
        limit: state.page.limit,
        offset: state.page.offset
      })
      url = '/opportunitys/getpagelist'
    } else {
      url = '/opportunitys/getlist'
    }
    return request.get(url, condition).then(res => {
      let opportunitys = Opportunity.from(res.data)
      if (byPage) {
        const nextPageToken = res.nextPageToken
        commit('updatePage', { offset: Math.min(page.offset + page.limit), nextPageToken })
      }
      commit('addOpportunitys', opportunitys)
      return opportunitys
    })
  },
  /**
   * 获取供选择的客户信息
   * @returns
   */
  loadSelectOpportunitys ({ state, commit }, { query, filter } = {}) {
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: state.sort,
      search: state.search,
      fields: 'Select'
    }
    if (_.isEmpty(state.selectOpportunitys) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request
        .get(url.getList, condition)
        .then(res => {
          const customers = Opportunity.from(res.data)
          commit('updateSelectOpportunitys', customers)
          return customers
        })
    } else {
      return _.values(state.selectOpportunitys)
    }
  },
  /**
   *添加商机信息
   *
   * @param {*} { state, commit }
   * @param {*} opportunity
   * @returns
   */
  addOpportunity ({ commit }, opportunity) {
    let model = Opportunity.to(opportunity)
    return request.post(url.add, model).then(res => {
      if (res.data) {
        let opportunity = Opportunity.from(res.data)
        commit('addOpportunitys', [opportunity])
        return opportunity
      } else {
        return null
      }
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
      return false
    })
  },
  /**
  *编辑商机信息
  *
  * @param {*} { state, commit }
  * @param {*} customer
  * @returns
  */
  updateOpportunity ({ commit }, opportunity) {
    let model = Opportunity.to(opportunity)
    return request.put(url.update, model)
      .then(res => {
        let opportunity = Opportunity.from(res.data)
        commit('updateOpportunity', opportunity)
        return opportunity
      })
  },
  /**
   *  更新商机字段
   * @param {*} param0
   * @param {*} param1
   */
  updateOpportunityField ({ commit }, fields) {
    let opportunity = Opportunity.to(fields)
    !_.has(fields, 'requestFrom') && delete opportunity['RequestFrom']
    !_.has(fields, 'classification') && delete opportunity['Classification']
    !_.has(fields, 'status') && delete opportunity['Status']
    !_.has(fields, 'isLost') && delete opportunity['IsLost']
    !_.has(fields, 'statusFlow') && delete opportunity['StatusFlow']
    !_.has(fields, 'processType') && delete opportunity['ProcessType']
    !_.has(fields, 'expectedDeliveryDate') && delete opportunity['ExpectedDeliveryDate']
    !_.has(fields, 'leaderID') && delete opportunity['LeaderID']
    !_.has(fields, 'organizeID') && delete opportunity['OrganizeID']
    !_.has(fields, 'acl') && delete opportunity['Acl']
    !_.has(fields, 'whiteList') && delete opportunity['WhiteList']
    !_.has(fields, 'widgets') && delete opportunity['Widgets']
    !_.has(fields, 'members') && delete opportunity['Members']
    !_.has(fields, 'source') && delete opportunity['Source']
    return request.put('opportunitys/updatefields', opportunity)
      .then(res => {
        opportunity = Opportunity.from(res.data)
        commit('updateOpportunity', opportunity)
        return opportunity
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`order.error.${error.userMessage}`))
        return null
      })
  },
  /**
 *删除商机信息
 *
 * @param {*} { state, commit }
 * @param {*} id 客户ID
 * @returns
 */
  deleteOpportunity ({ commit }, { id, notes = '' }) {
    request.delete(url.delete, { id, notes })
      .then(res => {
        commit('deleteOpportunity', id)
        this.$router.push({ name: 'opportunityHome' })
        return res.data
      })
  },
  // 解删除商机
  undeleteOpportunity ({ state, commit }, id) {
    return request.get(url.undelete, { id })
      .then(res => {
        let opportunity = state.opportunitysInTrash.find(item => item.id === id)
        let opportunitys = Opportunity.from(res.data)
        commit('addOpportunitys', opportunitys)
        commit('undeleteOpportunityInTrash', id)
        return opportunity
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 输单或激活操作
   * @param {*} id  商机ID
   * @param {*} active  动作
   * @param {*} status  商机结果
   */
  closeLostOrActive ({ commit }, { id, active, activeType, notes = '' }) {
    let params = {
      Id: id,
      Active: active,
      ActiveType: activeType,
      Notes: notes
    }
    return request.put(url.closeLostOrActive, params)
      .then(res => {
        const model = Opportunity.from(res.data)
        commit('updateOpportunity', model)
        // 状态改变发送消息通知用户
        dispatch('sendMessage', { Opportunity: model, eventType: params.Active, notes })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  async sendMessage ({ dispatch }, { oportunity, eventType, notes }) {
    // 获取当前用户信息
    const my = LocalStorage.getItem('myself') || {}
    // 定义消息标题
    let title = my.name + i18n.t(`oportunity.messageTitle.${eventType}`)
    // 获取消息接收人
    let receiveBy = [oportunity.Members]
    // 消息对应路由
    let route = {
      name: 'oportunityDetail',
      params: { id: oportunity.id },
      path: `/oportunity/${oportunity.id}(\\d+)`
    }
    // 组装消息对象
    let message = {
      type: 'oportunity',
      title: title,
      module: {
        id: oportunity.id,
        type: 'oportunity',
        title: oportunity.title
      },
      route,
      senderID: my.id,
      senderName: my.name,
      senderImg: my.img,
      receiveBy: receiveBy,
      extra: { Content: notes || oportunity.CustomerName + '客户的商机' }
    }
    // 发送消息
    let model = Message.to(message)
    return request.post('messages/add', model)
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  },

  /**
  * 指派客户经理
  * @param {*} param0
  * @param {*} payload
  */
  assignCustomerManager ({ commit }, payload) {
    return request.put(url.assignCustomerManager, payload)
      .then(res => {
        const model = Opportunity.from(res.data)
        commit('updateOpportunity', model)
        return model
      })
  },
  /**
   * 更新商机成员
   * @param {*} id:商机ID
   * @param {*} newMemberIds： 目前商机成员的IDs的集合
   * @param {*} oldMemberIds： 原商机成员的IDs的集合
   * @param {*} identify 成员职位
   */
  updateOpportunityMembers ({ state, commit }, { id, newMemberIds, oldMemberIds, identify }) {
    return request
      .put('opportunitys/updatemember', {
        id,
        newMemberIds: _.join(newMemberIds),
        oldMemberIds: _.join(oldMemberIds),
        identify: identify
      })
      .then(res => {
        const model = Opportunity.from(res.data)
        commit('updateOpportunity', model)
        return model
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 加载归档数量
   * @param {*} param0
   */
  loadArchivedCount ({ state, commit }) {
    const _query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    if (state.listPageType === 'myList') {
      _query.push(
        ...['and',
          {
            Key: 'Members',
            Value: LocalStorage.getItem('myself').id,
            Oper: 'inset'
          }
        ]
      )
    }
    let condition = { query: JSON.stringify(_query) }
    state.search && Object.assign(condition, { search: state.search })
    request.get('opportunitys/getcount', condition)
      .then((res) => {
        let count = res.data
        commit('setArchivedCount', count)
        return count
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return 0
      })
  },
  /**
  * 归档商机
  * @param {*} ID 商机ID
  */
  archiveOpportunity ({ commit }, id) {
    return request.get(`opportunitys/archive`, { id })
      .then(res => {
        const opportunity = Opportunity.from(res.data)
        commit('updateOpportunity', opportunity)
        return opportunity
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return null
      })
  },
  /**
* 解档一个商机
* @param {*} ID 商机ID
*/
  unarchiveOpportunity ({ commit }, id) {
    request.get(`opportunitys/unarchive`, { id })
      .then(res => {
        const opportunity = Opportunity.from(res.data)
        commit('updateOpportunity', opportunity)
        return opportunity
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`opportunity.error.${error.userMessage}`))
        return null
      })
  },
  // 获取与我相关的已删除的商机
  loadOpportunitysInMyTrash ({ state, commit }) {
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
        let list = Opportunity.from(res.data)
        commit('addOpportunitysInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除商机
  loadOpportunitysInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
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
        let list = Opportunity.from(res.data)
        commit('addOpportunitysInTrash', list)
        return list
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  processDataOfExportExcel ({ state, rootState }, { list }) {
    let data = []
    const modellist = _.cloneDeep(list)
    modellist.forEach(item => {
      let name = item
      name.LeaderID = item.LeaderID ? rootState.person.selectPersons[item.LeaderID].name : ''
      name.Status = item.Status ? state.status[item.Status].title : ''
      name.ProcessType = item.ProcessType ? item.ProcessType.split(':')[1] : ''
      name.TransactionPrice = item.TransactionPrice ? item.TransactionPrice : ''
      data.push(name)
    })
    return data
  }
}
