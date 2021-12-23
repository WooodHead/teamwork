import PublicLink from './model'
import request from '@/boot/axios'
import { i18n } from '../../boot/i18n'
import { showWarningMessage } from '@/utils/show-message'

const url = {
  getpubliclink: 'publiclinks/getpubliclink',
  getpubliclinkbycode: 'publiclinks/getpubliclinkbycode',
  add: 'publiclinks/add',
  update: 'publiclinks/update'
}

export default {
  /**
   * 加载当前共享链接
   * 优先从前端状态库中获取
   */
  loadPublicLink ({ state, commit }, { category, param }) {
    // 先从前台state列表缓存获取
    let link = _.find(state.publicLinks, link => {
      return link.category === category && _.isEqual(param, link.param)
    })
    if (link) {
      return link
    } else {
      // 否则从后台数据库获取,并放入列表缓存
      return request.get(url.getpubliclink, {
        category: category,
        param: JSON.stringify(param)
      }).then(res => {
        let link = null
        if (res.data) {
          link = PublicLink.from(res.data)
          commit('pushPublicLinks', [link])
        }
        return link
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`publicLink.error.${error.userMessage}`))
        return null
      })
    }
  },
  /**
   * 加载当前共享链接
   * 优先从前端状态库中获取
   */
  loadPublicLinkByCode ({ state, commit }, code) {
    // 先从前台state列表缓存获取
    let link = _.find(state.publicLinks, { code: code })
    if (link) {
      return link
    } else {
      // 否则从后台数据库获取,并放入列表缓存
      return request.get(url.getpubliclinkbycode, {
        code: code
      }).then(res => {
        let link = null
        if (res.data) {
          link = PublicLink.from(res.data)
          commit('pushPublicLinks', [link])
        }
        return link
      }).catch((error) => {
        error.userMessage && showWarningMessage(i18n.t(`publicLink.error.${error.userMessage}`))
        return null
      })
    }
  },
  /**
   * 新建共享链接
   */
  addOrUpdatePublicLink ({ commit }, payload) {
    let link = PublicLink.to(payload)
    return request.post(payload.id ? url.update : url.add, link).then(res => {
      link = null
      if (res.data) {
        link = PublicLink.from(res.data)
        if (payload.id) {
          commit('updatePublicLink', link)
        } else {
          commit('pushPublicLinks', [link])
        }
      }
      return link
    }).catch((error) => {
      error.userMessage && showWarningMessage(i18n.t(`publicLink.error.${error.userMessage}`))
      return null
    })
  }
}
