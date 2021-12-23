import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import request from '@/boot/axios'
import Model from './model'
import Message from '@/store/message/model'
import htmlToText from '@/utils/html-to-text'
import { LocalStorage } from 'quasar'
const ConsultItem = Model.ConsultItem, Transactor = Model.Transactor, Consult = Model.Consult
export default {
  // -----------咨询方法 start
  loadConsult ({ state, commit }, id) {
    let consult = _.find(state.consults, { id })
    if (!consult) {
      return request.get('consults/getmodel', { id })
        .then((res) => {
          let model = Consult.from(res.data)
          commit('addConsult', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
          return false
        })
    } else {
      return consult
    }
  },
  loadConsults ({ state, commit }, { query, filter, sort = state.consultSort, search = state.consultSearch, fields = 'List', limit = state.page.limit, offset = state.page.offset, byPage = state.byPage } = {}) {
    let params = {}, url = '', page = state.page
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        sort: sort,
        fields: fields,
        order: 'desc'
      }
      url = 'consults/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'consults/getlist'
    }
    return request.get(url, params).then(res => {
      let consults = Consult.from(res.data)
      commit('setPage', { offset: page.offset + consults.length, nextPageToken: res.nextPageToken })
      commit('setConsults', consults)
      return consults
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
      return false
    })
  },
  addConsult ({ state, commit }, { consult, msgProps } = {}) {
    let model = Consult.to(consult)
    if (msgProps) {
      model.CMessage = Message.to(newMessage(msgProps))
    }
    return request.post('consults/add', model)
      .then(res => {
        let item = Consult.from(res.data)
        commit('addConsult', item)
        return item
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  updateConsult ({ state, commit }, { consult, msgProps } = {}) {
    let model = Consult.to(consult)
    if (msgProps) {
      model.CMessage = Message.to(newMessage(msgProps))
    }
    return request.put('consults/update', model)
      .then(res => {
        const consult = Consult.from(res.data)
        commit('updateConsult', consult)
        return consult
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  updateConsultField ({ state, commit }, fields) {
    let model = Consult.to(fields)
    !fields['exceptFinishTime'] && delete model['ExceptFinishTime']
    !fields['submitTime'] && delete model['SubmitTime']
    !fields['startTime'] && delete model['StartTime']
    !fields['endTime'] && delete model['EndTime']
    if (fields.msgProps) {
      model.CMessage = Message.to(newMessage(fields.msgProps))
    }
    return request.put('consults/updatefields', model)
      .then(res => {
        const model = Consult.from(res.data)
        commit('updateConsult', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return {}
      })
  },
  deleteConsult ({ state, commit }, id) {
    return request.delete('consults/delete', { id })
      .then((res) => {
        commit('deleteConsult', id)
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  updateCommunication ({ state, commit }, { communication, msgProps }) {
    if (msgProps) {
      communication.CMessage = Message.to(newMessage(msgProps))
    }
    return request.put('consults/updatecommunication', communication)
      .then(res => {
        const model = Consult.from(res.data)
        commit('updateConsult', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return {}
      })
  },
  // -----------咨询方法 end

  // -----------咨询何事方法 start
  loadConsultItem ({ state, commit }, id) {
    let item = _.find(state.consultItems, { id })
    if (!item) {
      return request.get('consultItems/getmodel', { id })
        .then((res) => {
          let model = ConsultItem.from(res.data)
          commit('addConsultItem', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
          return false
        })
    } else {
      return item
    }
  },
  loadConsultItems ({ state, commit }, { query, filter, search, fields = 'List' } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields,
      orderby: 'title'
    }
    return request.get('consultItems/getlist', params).then(res => {
      let items = ConsultItem.from(res.data)
      commit('setConsultItems', items)
      return items
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
      return false
    })
  },
  addConsultItem ({ state, commit }, item) {
    let model = ConsultItem.to(item)
    return request.post('consultItems/add', model)
      .then(res => {
        let item = ConsultItem.from(res.data)
        commit('addConsultItem', item)
        return item
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  updateConsultItem ({ state, commit }, item) {
    return request.put('consultItems/update', ConsultItem.to(item))
      .then(res => {
        const model = ConsultItem.from(res.data)
        commit('updateConsultItem', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  deleteConsultItem ({ state, commit }, id) {
    return request.delete('consultItems/delete', { id })
      .then((res) => {
        commit('deleteConsultItem', id)
        return true
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
  },
  // -----------咨询何事方法 end

  // -----------向谁咨询方法 start
  loadTransactors ({ state, commit }, { query, filter, search, fields = 'List' } = {}) {
    const params = {
      filter: JSON.stringify(filter),
      query: JSON.stringify(query),
      search: search,
      fields: fields
    }
    if (_.isEmpty(state.transactors)) {
      return request.get('transactors/getlist', params).then(res => {
        let transactors = Transactor.from(res.data)
        commit('setTransactors', transactors)
        return transactors
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
        return false
      })
    } else {
      return state.transactors
    }
  },
  loadTransactor ({ state, commit }, id) {
    let transactor = _.find(state.transactors, { psonID: +id })
    if (!transactor) {
      return request.get('transactors/gettransactormodel', { id })
        .then((res) => {
          let model = Transactor.from(res.data)
          commit('setTransactors', model)
          return model
        })
        .catch((error) => {
          error.userMessage && showWarningMessage(i18n.t(`consult.error.${error.userMessage}`))
          return false
        })
    } else {
      return transactor
    }
  }
  // -----------向谁咨询方法 end
}

// 定义一个消息model
function newMessage (msgProps) {
  const my = LocalStorage.getItem('myself') || {}, showTitleLength = 200, content = htmlToText(msgProps.content)
  let msgTitle = ''
  if (content.length) {
    // 由于消息表title为varchar(255),当内容较长时，截取部分存储
    msgTitle = content.length > showTitleLength ? `${content.slice(0, showTitleLength)}...` : content
  } else {
    if (msgProps.action === 'submit') {
      msgTitle = i18n.t('consult.message.submitToConsult', { name: my.name })
    } else {
      let consult = `${htmlToText(msgProps.modelContent).slice(0, 10)}...`
      msgTitle = i18n.t('consult.message.reply', { name: my.name, consult: consult })
    }
  }
  return new Message({
    type: 'consult',
    title: msgTitle,
    module: {
      id: msgProps.id,
      type: 'consult',
      title: msgProps.title
    },
    route: {
      name: 'consultDetail',
      params: msgProps.route ? msgProps.route.params : '',
      path: msgProps.route ? msgProps.route.path : ''
    },
    senderID: my.id,
    senderName: my.name,
    senderImg: my.img,
    sendTime: '',
    tag: msgProps.action === 'submit' ? '' : 'Re',
    receiveBy: [msgProps.receiveBy],
    extra: { Content: msgProps.content, Action: msgProps.action }
  })
}
