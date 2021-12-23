import Members from './model'
import request from '@/boot/axios'
import { LocalStorage } from 'quasar'
export default {
  loadMembers ({ state, commit, dispatch, rootGetters }, { category, objectID, types = 'leader,member' }) {
    if (category !== 'organize') {
      let _query = [
        { Key: 'ObjectType', Value: category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ]
      if (types) {
        _query.push('and')
        _query.push({ Key: 'Duty', Value: types, Oper: 'in' })
      }
      const condition = {
        query: JSON.stringify(_query)
      }
      return request.get('members/getlist', condition)
        .then(res => {
          const members = Members.from(res.data)
          commit('initMembers', members)
          return _.map(members, 'psonID')
        })
        .catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return []
        })
    } else {
      return _.map(rootGetters['person/selectPersonsOfOrganize'](objectID), 'id')
    }
  },
  /**
   * 获取负责人下的所有Members
   * @param {*} param0
   * @param {*} id
   * @returns
   */
  loadMembersByLeader ({ commit }, { psonID = 0 }) {
    const condition = {
      query: JSON.stringify([
        { Key: 'PsonID', Value: psonID, Oper: 'eq' },
        'and',
        { Key: 'Duty', Value: 'leader', Oper: 'eq' }
      ])
    }
    return request.get('members/getlist', condition)
      .then(res => {
        const members = Members.from(res.data)
        commit('initMembers', members)
        return members
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return []
      })
  },
  /**
   *获取一个成员信息
   *
   * @param {*} { commit }
   * @param {*} id
   * @returns
   */
  loadMember ({ commit }, id) {
    return request.get('members/GetModel', { id: id })
      .then(res => {
        const member = Members.from(res.data)
        commit('updateMembers', [member])
        return member
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return null
      })
  },
  /**
   *更新Member
   *
   * @param {*} { state, commit }
   * @param {*} { member }
   */
  updateMemberField ({ commit }, { Id, fieldName, fieldValue }) {
    return request.put('members/UpdateFields', { Id, [fieldName]: fieldValue })
      .then(res => {
        const member = Members.from(res.data)
        commit('updateMembers', [member])
        return member
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return null
      })
  },
  /**
   * 邀请成员根据提供的访问链接访问相关项目
   *
   * @param {*} _context
   * @param {*} { psonId, module }
   * @returns
   */
  inviteToJoin ({ dispatch }, { psonId, module }) {
    var message = newMessage(psonId, this.$router.currentRoute, module)
    return dispatch('message/addMessage', message, { root: true })
  }

}

// 定义一个消息model
function newMessage (psonId, route, module) {
  const my = LocalStorage.getItem('myself') || {}
  return {
    id: 0,
    type: 'inviteToJoin',
    title: my.name + ' 邀请你加入' + (module.title || module.name),
    module: {
      id: route.params.objectID,
      type: route.params.category,
      title: module.title || module.name
    },
    route: {
      name: route.params.category + 'Detail',
      params: { id: Number(route.params.objectID) },
      path: route.path.substring(0, route.path.lastIndexOf('/member'))
    },
    senderID: my.id,
    senderName: my.name,
    senderImg: my.img,
    sendTime: '',
    tag: '',
    receiveBy: [psonId],
    extra: {}
  }
}
