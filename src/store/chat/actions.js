import request from '@/boot/axios'
import Chat from './model'
import { getUrl } from '@/boot/file'
import { format } from 'quasar' // 格式化工具
const { capitalize } = format // 字符串首字母大写
import fileState from '@/store/file/state'
export default {
  /**
   * 分页加载聊天
   * @param {*} param0
   * @param {Object} byPage 是否分页加载
   */
  loadMessages ({
    state,
    commit
  }, {
    msgToId = 0,
    roomType = 'person',
    sort,
    search,
    fields = 'List',
    limit = state.page.limit,
    offset = state.page.offset,
    byPage = state.byPage
  }) {
    let params = {}, url = ''
    const _filter = []
    const _query = { RoomID: msgToId, RoomType: roomType === 'person' ? 'friend' : roomType }
    if (byPage) {
      params = {
        limit: limit,
        offset: offset,
        filter: JSON.stringify(_filter),
        query: JSON.stringify(_query),
        search: search,
        sort: sort,
        fields: fields
      }
      url = 'ims/getpagelist'
    } else {
      params = {
        filter: JSON.stringify(filter),
        query: JSON.stringify(query),
        search: search,
        fields: fields
      }
      url = 'ims/getlist'
    }
    if (offset === 0) {
      commit('initPage')
      state.messages = []
      state.fileMessages = []
      state.isScrollBottom = true
    }
    return request.get(url, params).then(res => {
      let messages = Chat.from(res.data)
      if (byPage) {
        const nextPageToken = res.nextPageToken
        commit('setPage', { offset: offset + messages.length, nextPageToken })
      } else {
        commit('setPage', { nextPageToken: -1 })
      }
      state.isScrollBottom = false
      commit('addMessages', messages)
      return messages
    })
  },

  /**
   * 分页加载聊天文件
   * @param {*} param0
   * @param {Object} byPage 是否分页加载
   */
  loadFilesMessages ({
    state,
    commit
  }, {
    msgToId = 0,
    roomType = 'person',
    sort,
    search,
    fields = 'List',
    limit = state.page.limit,
    offset = state.fileMessages.length
  }) {
    let params = {}, url = ''
    const _filter = []
    const _query = { RoomID: msgToId, RoomType: roomType === 'person' ? 'friend' : roomType }
    params = {
      limit: limit,
      offset: offset,
      filter: JSON.stringify(_filter),
      query: JSON.stringify(_query),
      search: search,
      sort: sort,
      fields: fields
    }
    url = 'ims/getFilesPageList'
    return request.get(url, params).then(res => {
      let messages = Chat.from(res.data)
      const nextPageToken = res.nextPageToken
      commit('setFilesPage', { offset: offset + messages.length, nextPageToken })
      commit('addFilesMessages', messages)
      return messages
    })
  },
  /**
   * 即时通讯发送消息
   * @param {*} param0
   * @param {Object} data 发送的消息对象
   */
  async sendMessage ({
    state,
    commit,
    dispatch,
    rootState
  }, message) {
    message = Chat.to(message)
    message.CMessage = await getMessage(rootState, dispatch, message, this.$router.currentRoute)
    if (message.RoomType !== 'friend') {
      var item = await dispatch(`${message.RoomType}/load${capitalize(message.RoomType)}`, message.RoomID, { root: true })
      if (item.widgets && item.widgets.chat && item.widgets.chat.onlyLeaderAndMember) message.IsOnlyToNoticeLeaderAndMember = item.widgets.chat.onlyLeaderAndMember
      else message.IsOnlyToNoticeLeaderAndMember = false
    }
    return request.post('ims/sendmessage', message).then(res => {
      if (res.data) {
        let model = Chat.from(res.data)
        state.isScrollBottom = true
        commit('addMessage', model)
      }
      return res.data
    })
  }
}

// 定义一个消息model
async function getMessage (rootState, dispatch, message, route) {
  var text = JSON.parse(message.MsgText)
  var moduleType = message.RoomType === 'friend' ? 'person' : message.RoomType
  var moduleId = message.RoomType === 'friend' ? message.MsgFromID : message.MsgToID
  var item = await dispatch(`${moduleType}/load${capitalize(moduleType)}`, moduleId, { root: true })
  var type = 'chat' // 消息类型
  const messageType = rootState.message.messageType[type]
  var tag = message.RoomType === 'friend' ? 'Talk' : messageType.tag
  var content = ''
  if (_.isArray(text)) {
    _.forEach(text, t => {
      const filePath = getUrl(t.Path)
      if (fileState.imgExts.includes(t.Extension.toLowerCase())) {
        content = `${content}<img src="${filePath}" alt="${t.Title}"><br>' + '<a href="${filePath}" >${t.Title}</a>`
      } else {
        content = `${content}<a href="${filePath}" >${t.Title}</a>`
      }
    })
  } else {
    content = text
  }
  route.params.objectID = message.RoomType === 'friend' ? message.MsgFromID : message.MsgToID
  return {
    Module: {
      Id: message.RoomType === 'friend' ? message.MsgFromID : message.MsgToID,
      Title: item.title || item.name,
      Type: message.RoomType === 'friend' ? 'person' : message.RoomType
    },
    Route: {
      Name: route.name,
      Params: JSON.stringify(route.params),
      Path: message.RoomType === 'friend' ? `/person/${message.MsgFromID}/chat` : route.path
    },
    SenderID: message.MsgFromID,
    SenderName: message.FromName,
    SenderImg: message.FromAvatar,
    SendTime: message.MsgSendTime,
    Title: message.RoomType === 'friend' ? '正在和你聊天' : '刚刚在聊天室发起了聊天',
    Tag: tag,
    Type: 'chat',
    Extra: {
      Content: content
    }
  }
}
