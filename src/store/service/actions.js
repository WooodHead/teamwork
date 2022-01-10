import { LocalStorage } from 'quasar'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
import Service from './model'
import Message from '../message/model'

const url = {
  model: 'services/getmodel',
  list: 'services/getlist',
  pageList: 'services/getpagelist',
  connectorinservicecount: 'services/getconnectorinservicecount',
  count: 'services/getcount',
  add: 'services/add',
  update: 'services/update',
  updateFields: 'services/updatefields',
  delete: 'services/delete',
  archive: 'services/archive',
  unarchive: 'services/unarchive',
  updatemember: 'services/updatemember',
  activity: 'services/activity'
}

export default {
  /**
   * load services
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {number} [limit] 每页记录条数
   */
  loadServices ({ state, commit }, {
    query,
    filter,
    search,
    fields = 'List',
    sort = state.sort,
    order = state.order,
    byPage = state.byPage,
    limit = state.page.limit } = {}) {
    const page = state.page
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields
    }
    byPage ? Object.assign(condition, {
      limit,
      offset: page.offset,
      order,
      sort
    }) : Object.assign(condition, {
      orderby: ` ${sort} ${order}`
    })
    let toUrl = byPage ? url.pageList : url.list
    return request.get(toUrl, condition)
      .then(res => {
        let services = Service.from(res.data)
        commit('setPage', { offset: page.offset + services.length, nextPageToken: res.nextPageToken })
        commit('setListServices', services)
        return services
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return []
      })
  },
  /**
   * 获取选择的工程服务
   * @param {*} param0
   */
  loadSelectServices ({ state, commit }) {
    if (_.isEmpty(state.selectServices) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request
        .get(url.list, { fields: 'Select' })
        .then(res => {
          const services = Service.from(res.data)
          // 初始化选择组件列表
          commit('updateSelectServices', services)
          return services
        })
    } else {
      return state.selectServices.all
    }
  },
  /**
   * 获取工程服务对象
   * @param {Object} param0 --
   * @param {Number} id 工程服务id
   */
  loadService ({ state, commit }, id) {
    let service = _.find(state.services, { id })
    if (!service) {
      return request.get(url.model, { id })
        .then(res => {
          if (res.data) {
            service = Service.from(res.data)
            commit('updateService', service)
          }
          return service
        })
    }
    return service
  },
  /**
   * 获取服务对接人正在服务的数量
   * @param {Object} { state, commit }
   */
  loadConnectorInServiceCount ({ state, commit }) {
    if (!state.connectorInServiceCount.length) {
      return request.get(url.connectorinservicecount)
        .then(res => {
          if (res.data) {
            commit('updateConnectorInServiceCount', res.data)
          }
          return res.data
        })
    } else {
      return state.connectorInServiceCount
    }
  },
  /**
   * 新建工程服务
   * @param {Object} param0 --
   * @param {Object} service 新建的工程服务对象
   */
  addService ({ state, commit, dispatch }, service) {
    // 自动生成title，格式【机构+类别+id】
    // 前台生成【机构+类别】，后半部分在后台追加
    let orgShortName = LocalStorage.getItem('myself').orgShortName
    service.title = `${orgShortName}-${service.type === '' ? '其它' : service.type}-`

    const endModel = Service.to(service)
    return request.post(url.add, endModel)
      .then(res => {
        const model = Service.from(res.data)
        // 前台数据缓存
        commit('addService', model)
        // 发送消息通知服务管理人员
        dispatch('sendMessage', { service: model, eventType: 'add' })
        // 返回添加后的service
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 编辑工程服务
   * @param {Object} param0 --
   * @param {Object} service 编辑后的工程服务对象
   */
  updateService ({ state, commit }, service) {
    const endModel = Service.to(service)
    return request.put(url.update, endModel)
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 更新工程服务某个字段
   * @param {Object} param0 --
   * @param {Number} payload 待更新对象（service的子集），包含工程服务id
   */
  updateServiceField ({ state, commit }, payload) {
    return request.put(url.updateFields, payload)
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   *变更对接人动态
   * @param {*} param0
   * @param {*} param1
   */
  updateActivity ({ state, commit }, { status, id }) {
    let params = {
      Status: status,
      Id: id
    }
    return request.put(url.activity, params)
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 删除一个工程服务
   * @param {Object} param0 --
   * @param {Number} id 工程服务id
   */
  deleteService ({ state, commit }, { id, notes }) {
    request.delete(url.delete, { id })
      .then(res => {
        commit('deleteService', id)
        this.$router.push({ name: 'serviceHome' })
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  loadArchivedCount ({ state, commit }) {
    const query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' }]
    if (state.listPageType === 'myList') {
      query.push(
        ...['and',
          {
            Key: 'Members',
            Value: LocalStorage.getItem('myself').id,
            Oper: 'inset'
          }
        ]
      )
    }
    let condition = { query: JSON.stringify(query) }
    state.search && Object.assign(condition, { search: state.search })
    request
      .get(url.count, condition)
      .then(res => {
        commit('setArchivedCount', res.data)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 归档
   * @param {*} ID ID
   */
  archiveService ({ commit }, id) {
    return request.get(url.archive, { id })
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  /**
   * 解档一个
   * @param {*} ID ID
   */
  unarchiveService ({ commit }, id) {
    request.get(url.unarchive, { id })
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
      })
  },
  /**
   * 改变当前服务状态
   * @param {*} ID ID
   */
  updateStatus ({ commit, dispatch }, { id, status, widgets, evaluation }) {
    let params = {
      Id: id,
      Status: status
    }
    widgets && Object.assign(params, {
      Widgets: JSON.stringify(widgets)
    })
    evaluation && Object.assign(params, {
      Evaluation: JSON.stringify(evaluation)
    })
    return request.put(url.updateFields, params)
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
        // 状态改变发送消息通知用户
        dispatch('sendMessage', { service: model, eventType: model.status })
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return {}
      })
  },
  updateServiceMembers ({ state, commit }, { id, newMemberIds, oldMemberIds, identify }) {
    return request.patch(url.updatemember, {
      id,
      newMemberIds: _.join(newMemberIds),
      oldMemberIds: _.join(oldMemberIds),
      identify: identify
    })
      .then(res => {
        const model = Service.from(res.data)
        commit('updateService', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`team.error.${error.userMessage}`))
        return false
      })
  },
  async sendMessage ({ dispatch, rootGetters }, { service, eventType, customNotes }) {
    // 获取当前用户信息
    const my = LocalStorage.getItem('myself') || {}
    // 定义消息标题
    let title = my.name + i18n.t(`service.messageTitle.${eventType}`)
    // 获取消息接收人
    let receiveBy = []
    // 消息对应路由
    let route = {
      name: 'serviceDetail',
      params: { id: service.id },
      path: `/service/${service.id}(\\d+)`
    }
    switch (eventType) {
      case 'add':
        receiveBy = _.map(rootGetters['person/selectPersonsOfRoleCode']('ServiceManager'), 'id')
        Object.assign(route, {
          name: 'serviceAssignTo',
          params: { id: service.id }
        })
        break
      case 'connectChange':
        receiveBy = [service.managerId]
        Object.assign(route, {
          name: 'serviceAssignTo',
          params: { id: service.id }
        })
        break
      case 'assignTo':
        receiveBy = [service.connectorId]
        break
      case 'doing':
        receiveBy = [service.managerId]
        break
      case 'done':
        receiveBy = [service.managerId]
        break
      default:
        receiveBy = [service.owner]
        break
    }
    // 组装消息对象
    let message = {
      type: 'service',
      title: title,
      module: {
        id: service.id,
        type: 'service',
        title: service.title
      },
      route,
      senderID: my.id,
      senderName: my.name,
      senderImg: my.img,
      receiveBy: receiveBy,
      extra: { Content: customNotes || service.notes }
    }
    // 发送消息
    let model = Message.to(message)
    return request.post('messages/add', model)
      .catch(error => {
        error.userMessage && showWarningMessage(error.userMessage)
        return false
      })
  }
}
