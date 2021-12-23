import request from '@/boot/axios'
import { i18n } from '@/boot/i18n'
import { showWarningMessage } from '@/utils/show-message'
import Manufacturer from './model'
import Person from '../person/model'

const url = {
  getList: '/manufacturers/GetList',
  getPageList: '/manufacturers/GetPageList',
  getModel: '/manufacturers/GetModel',
  Add: '/manufacturers/Add',
  Update: '/manufacturers/Update',
  UpdateFields: '/manufacturers/UpdateFields',
  Delete: '/manufacturers/Delete',
  UpdateMemberPerson: '/manufacturers/UpdateMemberPerson',
  UpdateMember: '/manufacturers/UpdateMember'
}
export default {
  /**
   *获取生产单位所有信息
   *
   * @param {*} { state, commit }
     * @param {string} [query] 查询条件
     * @param {string} [filter] 模糊查询对象
     * @param {string} [sort] 排序
     * @param {string} [search] 搜索
     * @param {string} [fields] 查询字段
   * @returns
   */
  loadManufacturers ({ commit, state }, { query, filter, byPage = state.byPage } = {}) {
    const page = state.page
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      sort: state.sort,
      search: state.search,
      fields: 'List'
    }
    byPage && Object.assign(condition, {
      order: state.order,
      limit: state.page.limit,
      offset: state.page.offset
    })
    if (!state.loadedAll) {
      const requestUrl = byPage ? url.getPageList : url.getList
      return request.get(requestUrl, condition).then(res => {
        let manufacturers = Manufacturer.from(res.data)
        if (byPage) {
          const nextPageToken = res.nextPageToken
          commit('updatePage', { offset: Math.min(page.offset + page.limit), nextPageToken })
          if (nextPageToken === -1) {
            commit('setLoadedAll', true)
          }
        } else {
          commit('setLoadedAll', true)
        }
        commit('updateManufacturers', manufacturers)
        return manufacturers
      })
    } else {
      return state.manufacturers
    }
  },
  /**
   *获取当前生产单位对象
   *
   * @param {*} { state, commit }
   * @param {*} id 生产单位ID
   * @returns
   */
  loadManufacturer ({ state, commit }, id) {
    let manufacturer = _.find(state.manufacturers, { 'id': id })
    if (manufacturer) {
      return manufacturer
    } else {
      return request.get(url.getModel, { id: id }).then(res => {
        if (res.data) {
          manufacturer = Manufacturer.from(res.data)
          commit('updateManufacturers', [manufacturer])
          return manufacturer
        } else {
          return null
        }
      })
    }
  },
  /**
   * 获取供选择的生产单位信息
   * @returns
   */
  loadSelectManufacturers ({ state, commit }) {
    if (_.isEmpty(state.selectManufacturers) || !state.loadedSelect) {
      commit('setLoadedSelect', true)
      return request
        .get(url.getList, { fields: 'Select' })
        .then(res => {
          const manufacturers = Manufacturer.from(res.data)
          commit('updateSelectManufacturers', manufacturers)
          return manufacturers
        })
    } else {
      return _.values(state.selectManufacturers)
    }
  },
  loadArchivedCount ({ state, commit }) { },
  /**
   *添加生产单位信息
   *
   * @param {*} { state, commit }
   * @param {*} manufacturer
   * @returns
   */
  addManufacturer ({ commit }, manufacturer) {
    let model = Manufacturer.to(manufacturer)
    return request.post(url.Add, model)
      .then(res => {
        let newManufacturer = Manufacturer.from(res.data)
        commit('updateManufacturers', [newManufacturer])
        commit('person/updateSelectPersons', _.keyBy([newManufacturer.leader], 'id'), { root: true })
        return newManufacturer
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`manufacturer.error.${error.userMessage}`))
        return false
      })
  },
  /**
  *编辑生产单位信息
  *
  * @param {*} { state, commit }
  * @param {*} manufacturer
  * @returns
  */
  updateManufacturer ({ state, commit }, manufacturer) {
    let model = Manufacturer.to(manufacturer)
    return request.put(url.Update, model)
      .then(res => {
        let newManufacturer = Manufacturer.from(res.data)
        if (newManufacturer.classification === 'outsource') {
          commit('person/updateSelectPersons', _.keyBy([newManufacturer.leader], 'id'), { root: true })
        }
        commit('updateManufacturer', newManufacturer)
        return newManufacturer
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`manufacturer.error.${error.userMessage}`))
        return false
      })
  },
  /**
 *删除生产单位信息
 *
 * @param {*} { state, commit }
 * @param {*} id 生产单位ID
 * @returns
 */
  deleteManufacturer ({ commit }, id) {
    request.delete(url.Delete, { id: id })
      .then(res => {
        commit('deleteManufacturer', id)
        this.$router.push({ name: 'manufacturerHome' })
        return res.data
      })
  },
  /**
  * 设置生产单位管理卡片
  * @param {*} param0
  * @param {*} payload
  */
  updateManufacturerField ({ commit }, payload) {
    return request.put(url.UpdateFields, payload)
      .then(res => {
        const model = Manufacturer.from(res.data)
        commit('updateManufacturer', model)
        return model
      })
  },
  /**
 * 更新生产单位人员信息
 * @param {*} id:生产单位ID
 * @param {*} personIDs： 生产单位成员的IDs的集合
 */
  updateManufacturerMemberPerson ({ commit, dispatch }, payload) {
    var model = Person.to(payload)
    return request.put(url.UpdateMemberPerson, model)
      .then(res => {
        const model = Manufacturer.from(res.data)
        dispatch('member/loadMembers', { category: 'manufacturer', objectID: model.id }, { root: true })
        dispatch('person/loadSelectPersons', {}, { root: true })
        commit('updateManufacturer', model)
        return model
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`manufacturer.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 更新生产单位成员
   * @param {*} id:生产单位ID
   * @param {*} personIDs： 生产单位的IDs的集合
   * @param {*} identify 成员职位
   */
  updateManufacturerMembers ({ dispatch, commit }, { id, personIDs, identify }) {
    // just assignto one person
    if (personIDs.length > 1) {
      showWarningMessage('仅能指定一名负责人')
    } else if (personIDs.length === 1) {
      dispatch('updateManufacturerField', { Id: id, LeaderID: personIDs[0] })
    } else {
      showWarningMessage('请指定一名负责人')
    }

    // return request
    //   .patch(url.UpdateMember, {
    //     id,
    //     psonIDs: _.join(personIDs),
    //     identify: identify
    //   })
    //   .then(res => {
    //     const model = Manufacturer.from(res.data)
    //     commit('updateManufacturer', model)
    //     return model
    //   })
    //   .catch(error => {
    //     error.userMessage &&
    //       showWarningMessage(i18n.t(`manufacturer.error.${error.userMessage}`))
    //     return false
    //   })
  }
}
