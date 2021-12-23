import Interviewer from '@/store/interviewer/model'
import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
const url = {
  getModel: 'interviewers/getmodel',
  add: 'interviewers/add',
  update: 'interviewers/update',
  updatefields: 'interviewers/updatefields',
  delete: 'interviewers/delete',
  getList: 'interviewers/getlist',
  getPageList: 'interviewers/getpagelist',
  byPosnIdDelete: 'interviewers/byPosnIdDelete',
  syncInterviewerRoleByPsonID: 'interviewers/syncinterviewerrolebypsonid'
}
export default {
  // 获取面试官列表信息
  loadInterviewers ({ commit, state }, { byPage = false, query = [] }) {
    return request.get(byPage ? url.getPageList : url.getList, {
      query: JSON.stringify(query),
      limit: state.page.limit,
      offset: state.page.offset,
      sort: ''
    }).then(res => {
      let interviewers = Interviewer.from(res.data)
      commit('pushInterviewers', interviewers)
      byPage && commit('updatePage',
        {
          offset: state.page.offset + interviewers.length,
          limit: state.page.limit
        })
      return interviewers
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
      return false
    })
  },
  /**
   *获取指定面试官信息
   * @param {*} param0
   * @param {*} id
   */
  loadInterviewer ({ state, commit }, id) {
    // 先从前台state列表缓存获取
    let interviewer = _.find(state.interviewers, { 'id': +id })
    if (interviewer) {
      return interviewer
    } else {
      // 否则从后台数据库获取,并放入state列表缓存
      return request.get(url.getModel, {
        id: id
      }).then(res => {
        let interviewer = Interviewer.from(res.data)
        commit('pushInterviewers', [interviewer])
        return interviewer
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
        return new Interviewer()
      })
    }
  },
  /**
   *新增一个面试官
   * @param {*} param0
   * @param {*} payload
   */
  addInterviewer ({ commit }, payload) {
    let interviewer = Interviewer.to(payload)
    return request.post(url.add, interviewer).then(res => {
      if (res.data) {
        let interviewer = Interviewer.from(res.data)
        // 更新缓存列表
        commit('pushInterviewers', [interviewer])
        return interviewer
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
    })
  },
  /**
   *更新面试官
   * @param {*} param0
   * @param {*} payload
   */
  updateInterviewer ({ commit, dispatch }, payload) {
    let interviewer = Interviewer.to(payload)
    return request.put(url.update, interviewer).then(res => {
      if (res.data) {
        let interviewer = Interviewer.from(res.data)
        commit('updateInterviewer', interviewer)
        return interviewer
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
    })
  },
  /**
   *删除指定面试官下面试信息
   * @param {*} param0
   * @param {*} id
   */
  deleteInterviewer ({ state, commit, dispatch }, id) {
    return request.delete(url.delete, {
      id: id
    }).then(res => {
      if (res.data) {
        commit('deleteInterviewer', id)
        return true
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
      return false
    })
  },

  /**
   *根据面试官的psonId删除面试官下的信息
   * @param {*} param0
   * @param {*} psonId
   */
  byIdDeleteInterviewer ({ state, commit }, psonId) {
    return request.delete(url.byPosnIdDelete, { psonId: psonId }).then(res => {
      if (res) {
        commit('byIdDeleteInterviewer', psonId)
        return true
      }
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
      return false
    })
  },
  /**
   * 授权/移除面试官角色
   * @param {*} param0 
   * @param {*} type:授权grant 移除 remove
   * @returns 
   */
  syncInterviewerRoleByPsonID ({ state, commit }, { psonId, type }) {
    return request.post(url.syncInterviewerRoleByPsonID, { psonId, type }).then((res) => {
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`interviewer.error.${error.userMessage}`))
    })
  }
}
