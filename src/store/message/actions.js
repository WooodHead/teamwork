import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import { LocalStorage } from 'quasar'
import Message from './model'
export default {
  // 获取未读数据，全部获取
  loadMessagesUnread ({ state, commit }) {
    const query = [
      { 'Key': 'ReceiveBy', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' }, 'and',
      { 'Key': 'ReadBy', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'nesearch' }]
    return request.get('messages/getlist', { query: JSON.stringify(query), orderby: 'SendTime desc' })
      .then(res => {
        let messages = Message.from(res.data)
        commit('loadMessagesUnread', messages)
        return messages
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 获取已读数据，分页加载
  loadMessagesReadedMore ({ state, commit }, {
    query,
    filter,
    sort = 'SendTime',
    search,
    fields = 'List',
    limit = state.readPage.limit,
    offset = state.readPage.offset
  } = {}) {
    const querys = [
      { 'Key': 'ReceiveBy', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' }, 'and',
      { 'Key': 'ReadBy', 'Value': _.toString(LocalStorage.getItem('myself').id), 'Oper': 'search' }]
    if (query) {
      querys.push(...query)
    }
    let params = {
      limit: limit,
      offset: offset,
      filter: JSON.stringify(filter),
      query: JSON.stringify(querys),
      search: search,
      sort: sort,
      fields: fields
    }
    return request.get('messages/getpagelist', params)
      .then(res => {
        let messages = Message.from(res.data)
        commit('loadMessagesReadedMore', messages)
        commit('setReadPage', { offset: state.readPage.offset + res.data.length, nextPageToken: res.nextPageToken })
        return messages
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 获取一个我未读的消息
  loadMyOneUnread ({ commit }) {
    return request.get('messages/myoneunread')
      .then((res) => {
        // 该方法是获取消息列表的第一个方法，每次调用后需清空列表，以防切换账号登录后显示上个账号的数据
        commit('setEmptyMessages')
        commit('setReadPage', { offset: 0, nextPageToken: 0 })
        if (res.data) {
          let message = Message.from(res.data)
          commit('addMessage', message)
          return message
        } else {
          return true
        }
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 通过Id获取一个对象
  loadMessage ({ state, commit }, id) {
    let message = _.find(state.messages, { id })
    if (!message) {
      return request.get('messages/getmodel', { id: +id })
        .then((res) => {
          message = Message.from(res.data)
          commit('addMessage', message)
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
    return message
  },

  // 通过查询条件获取一个对象
  loadMessageBy ({ state, commit }, { query, fields = 'View' } = {}) {
    return request.get('messages/getmodelby', { query: JSON.stringify(query), fields })
      .then((res) => {
        let message = Message.from(res.data)
        commit('addMessage', message)
        return message
      })
      .catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 将一条消息标记为已读
  readMessage ({ commit }, id) {
    return request.put('messages/readmessage', { Id: id })
      .then(res => {
        let message = Message.from(res.data)
        commit('updateMessage', message)
        return message
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 标记为未读
  markAsUnread ({ commit }, id) {
    return request.put('messages/markasunread', { Id: id })
      .then(res => {
        let message = Message.from(res.data)
        commit('updateMessage', message)
        return message
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 全部标记为已读
  markAllRead ({ commit }) {
    return request.put('messages/markallread')
      .then(res => {
        if (res.data) {
          let message = Message.from(res.data)
          commit('markAllRead', message)
        }
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 新建一条消息
  addMessage ({ commit }, message) {
    let model = Message.to(message)
    return request.post('messages/add', model)
      .then(res => {
        let message = Message.from(res.data)
        // commit('addMessage', message)
        return message
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },

  // 更新指定属性
  updateMessageField ({ state, commit }, payload) {
    return request.put('messages/updatefields', payload)
      .then(res => {
        let message = Message.from(res.data)
        commit('updateMessage', message)
        return message
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
