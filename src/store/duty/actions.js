import request from '@/boot/axios'
import Duty from './model'
export default {
  /**
   * 获取所有职位信息
   *
   * @param {*} { state, commit }
   */
  loadDutys ({ state, commit }) {
    if (!state.loadedAll) {
      return request.get('/dutys/getlist').then(res => {
        let dutys = Duty.from(res.data)
        commit('updateDutys', _.keyBy(_.cloneDeep(dutys), 'id'))
        commit('setLoadedAll', true)
        return dutys
      })
    } else {
      return _.values(state.dutys)
    }
  },
  /**
  * 提供给选择控件的职位数据
  * @param {*} { state, commit }
  * @returns
  */
  loadSelectDutys ({ commit }) {
    return request.get('/dutys/getlist', { fields: 'Select' }).then(res => {
      if (res.data) {
        const dutys = Duty.from(res.data)
        commit('updateSelectDutys', _.keyBy(dutys, 'id'))
        return dutys
      }
    })
  },
  /**
   * 获取一个职位信息
   *
   * @param {*} { state, commit }
   */
  loadDuty ({ state, commit }, id) {
    let duty = state.dutys[id]
    if (!duty) {
      return request.get('/dutys/GetModel', { id: id }).then(res => {
        if (res.data) {
          duty = Duty.from(res.data)
          commit('updateDutys', _.keyBy([_.cloneDeep(duty)], 'id'))
          return duty
        }
      })
    } else {
      return duty
    }
  },
  /**
   * 维护职位信息
   * @param {*} { commit }
   * @param {*} duty
   * @returns
   */
  updateDuty ({ commit }, duty) {
    var model = Duty.to(duty)
    if (duty.id === 0) {
      // 后台数据库中添加数据
      return request.post('/dutys/Add', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var duty = Duty.from(res.data)
          commit('updateDutys', _.keyBy([_.cloneDeep(duty)], 'id'))
          return duty
        }
      })
    } else {
      // 后台数据库中更新数据
      return request.put('/dutys/Update', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var duty = Duty.from(res.data)
          commit('updateDutys', _.keyBy([_.cloneDeep(duty)], 'id'))
          return duty
        }
      })
    }
  },
  /**
   * 删除职位信息
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  deleteDuty ({ commit }, id) {
    return request.delete('/dutys/Delete', { id: id }).then(res => {
      // 更新前台数据
      if (res.data) {
        commit('deleteDuty', [id])
        return res.data
      }
    })
  }
}
