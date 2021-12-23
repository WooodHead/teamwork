import request from '@/boot/axios'
import Guide from './model'
import { i18n } from '@/boot/i18n'
// import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
export default {
  // 新建项目后添加一条引导记录
  addGuide ({ state, commit }, model) {
    return request.post('guides/add', Guide.to(model))
      .then(res => {
        const model = Guide.from(res.data)
        return model
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`guide.error.${error.userMessage}`))
        return false
      })
  },

  // 判断当前项目是否需要引导
  loadGuide ({ state, commit }, query) {
    return request.get('guides/getmodel', { query: JSON.stringify(query) })
      .then(res => {
        const model = Guide.from(res.data)
        commit('setGuideModule', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`guide.error.${error.userMessage}`))
        return false
      })
  },

  // 更改引导状态
  updateGuide ({ state, commit }, query) {
    return request.put('guides/updatefields', JSON.stringify(query))
      .then(res => {
        const model = Guide.from(res.data)
        commit('setGuideModule', model)
        return model
      })
  }
}
