import { i18n } from '@/boot/i18n'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import Discuss from './model'
import Message from '@/store/message/model'
import { LocalStorage } from 'quasar'
export default {
  // 新建一条讨论
  addComment ({ commit }, { comment, msgProps } = {}) {
    let model = Discuss.to(comment)
    if (msgProps) {
      model.CMessage = Message.to(newMessage(msgProps))
    }
    request.post('discuss/add', model)
      .then(res => {
        commit('addComment', Discuss.from(res.data))
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新一条讨论
  updateComment ({ commit }, { id, content, msgProps }) {
    let messageModel = null
    if (msgProps) {
      messageModel = Message.to(newMessage(msgProps))
    }
    request.put('discuss/updatefields', { Id: id, 'Content': content, CMessage: messageModel })
      .then(res => {
        commit('updateComment', Discuss.from(res.data))
        return true
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除一条讨论
  deleteComment ({ commit }, id) {
    request
      .delete('discuss/delete', { id: id })
      .then(res => {
        commit('deleteComment', id)
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取讨论数据
  loadComents ({ state, commit }, { objectID, objectType }) {
    // 如果该资源的讨论数据已经被获取过，则从缓存中显示
    const type = objectType + objectID
    if (
      _.isEmpty(state.loaded) ||
      (!_.isEmpty(state.loaded) && !state.loaded[type])
    ) {
      const query = [
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' }
      ]
      return request
        .get('discuss/getlist', { query: JSON.stringify(query) })
        .then(res => {
          let discuss = Discuss.from(res.data)
          commit('addComments', discuss)
          // 记录哪些资源的数据被获取
          if (discuss != null && discuss.length > 0) {
            commit('updateLoaded', type)
          }
          return discuss
        })
        .catch(error => {
          error.userMessage &&
            showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    } else {
      return state.comments
    }
  },
  // 获取讨论对象
  loadComment ({ state, commit }, id) {
    let comment = _.find(state.comments, e => e.id === +id)
    if (!comment) {
      request
        .get('discuss/getmodel', { id: +id })
        .then(res => {
          comment = Discuss.from(res.data)
          if (!comment.deleted) {
            commit('addComments', comment)
          }
        })
        .catch(error => {
          error.userMessage &&
            showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
    return comment
  }
}

// 定义一个消息model
function newMessage (msgProps) {
  const my = LocalStorage.getItem('myself') || {}
  return {
    id: 0,
    type: 'discuss',
    title: msgProps.title,
    module: {
      id: msgProps.route.params.objectID,
      type: msgProps.route.params.category,
      title: ''
    },
    route: {
      name: msgProps.route.name,
      params: msgProps.route.params,
      path: msgProps.route.path
    },
    senderID: my.id,
    senderName: my.name,
    senderImg: my.img,
    sendTime: '',
    tag: 'Re',
    receiveBy: msgProps.subscribers,
    extra: { Content: msgProps.content }
  }
}
