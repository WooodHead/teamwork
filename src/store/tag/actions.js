import Tag from './model'
import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  GetList: 'tags/GetList',
  GetModel: 'tags/GetModel',
  Add: 'tags/Add',
  Update: 'tags/Update',
  Delete: 'tags/Delete'
}
// 获取任务列表
export default {
  // 获取单个任务列表
  loadTags ({ state, commit }, loaded = state.loaded) {
    if (loaded) {
      return state.tags
    }
    return request.get(url.GetList)
      .then(res => {
        let tags = Tag.from(res.data)
        commit('setLoaded', true)
        commit('addTags', tags)
        return tags
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return state.tags
      })
  },
  loadTag ({ state, commit }, Id) {
    return request.get(url.GetModel, { id: Id })
      .then(res => {
        let tag = Tag.from(res.data)
        commit('addTag', tag)
        return [tag]
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建任务
  addTag ({ state, commit }, tag) {
    let model = Tag.to(tag)
    return request.post(url.Add, model)
      .then(res => {
        let tag = Tag.from(res.data)
        commit('addTag', tag)
        return tag
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新任务
  updateTag ({ commit }, tag) {
    let model = Tag.to(tag)
    return request.put(url.Update, model)
      .then(res => {
        let tag = Tag.from(res.data)
        commit('updateTag', tag)
        return tag
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除任务
  deleteTag ({ state, commit }, Id) {
    return request.delete(url.Delete, { id: Id })
      .then(res => {
        let tag = Tag.from(res.data)
        commit('deleteTag', Id)
        return tag
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
}
