
/**
 @Name：人员Action
 @Author：陈冬
 @date：2020/6/30
 @Copyright：西安精雕软件科技有限公司
 */
import { LocalStorage, date } from 'quasar'
import request from '@/boot/axios'
import indexedDB from '@/boot/indexed-db'
import setMyinfo from '@/utils/local-storage-myinfo'
import Person from './model'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
export default {
  /**
   * 获取一个人员的信息
   * 优先从前端状态库中获取
   * @param {*} { state, commit }
   * @param {*} id
   * @returns
   */
  loadPerson ({ state, commit }, id) {
    let person = state.persons[id]
    if (!person) {
      return request.get('/persons/GetModel', { id: id }).then(res => {
        if (res.data) {
          person = Person.from(res.data)
          commit('updatePersons', _.keyBy([_.cloneDeep(person)], 'id'))
          commit('updateSelectPersons', _.keyBy([_.cloneDeep(person)], 'id'))
          return person
        }
      }, error => {
        error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
      })
    } else {
      return person
    }
  },
  /**
   *加载（当前人员有权限查看）的所有人员信息
   *
   * @param {*} { state, commit }
   * @param {*} [{ byPage = false, byPage = true, moduleName }={}]
   * @returns
   */
  loadPersons ({ state, commit }, { byPage = state.byPage, moduleName } = {}) {
    // 前台筛选参数
    let search = state.search
    let sort = _.findKey(Person.FieldsConvert(), value => value === state.sort)
    if (sort === 'PsonName' || sort === 'DutyName' || sort === 'OrganizeName') sort = 'CONVERT(' + sort + ' USING gbk)'
    let page = state.page
    let query = JSON.stringify([{ 'Key': 'IsInService', 'Value': state.isInService, 'Oper': 'eq' }, 'and', { 'Key': 'IsOutStaff', 'Value': 0, 'Oper': 'eq' }])
    let filter = moduleName ? JSON.stringify({ [moduleName]: state[`${moduleName}Id`] }) : null
    let params = convertParams(byPage, page, filter, query, search, sort)
    // 请求后台接口
    return request.get(byPage ? '/persons/getpagelist' : 'persons/getlist', params).then(res => {
      // 转换人员数据
      let persons = Person.from(res.data)                   
      // 是否前端分页
      if (byPage) {
        const nextPageToken = res.nextPageToken
        commit('updatePage', { offset: Math.min(page.offset + persons.length), nextPageToken })
      }
      commit('updatePersons', _.keyBy(_.cloneDeep(persons), 'id'))
      commit('updateSelectPersons', _.keyBy(_.cloneDeep(persons), 'id'))
      return persons
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })                            
  },
  /**
   * 可申报的项目每次都单独获取，且不存入状态
   * 业务特有
   * @param {*} param0 { state, commit }
   * @param {*} param1 筛选参数
   */
  loadProductDevSelectPersons ({ state, commit }, productDevID) {
    const condition = { fields: 'Declaration', filter: JSON.stringify({ forManagement: false, productDevID }) }
    return request.get('/persons/getlist', condition).then(res => {
      const persons = Person.from(res.data)
      return persons
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },
  /**
  * 获取提供给选择组件初始化的人员信息
  * @param {*} { state,commit }
  * @returns
  */
  loadSelectPersons ({ commit, state }) {
    indexedDB.loadList('person').then(data => {
      data && data.length > 0 && commit('updateSelectPersons', data[0].persons)
      indexedDB.getLastUpdateTime().then(res => {
        let lastRecvTime = res || '1000-01-01 00:00:00'
        let fields = 'Select'
        let query = JSON.stringify([
          { Key: 'CreateTime', Value: lastRecvTime, Oper: 'gt' },
          'or',
          { Key: 'ModifyTime', Value: lastRecvTime, Oper: 'gt' }
        ])
        getAllPersonsByPage(state, commit, { fields, query })
      })
    })
  },
  /**
   * 维护人员信息
   * @param {*} { state, commit }
   * @param {*} person
   * @returns
   */
  updatePerson ({ commit }, person) {
    var model = Person.to(person)
    if (person.id === 0) {
      // 后台数据库中添加数据
      return request.post('/persons/Add', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var person = Person.from(res.data)
          commit('updatePersons', _.keyBy([_.cloneDeep(person)], 'id'))
          commit('updateSelectPersons', _.keyBy([_.cloneDeep(person)], 'id'))
          if (person.id === LocalStorage.getItem('myself').id) {
            let my = _.assign(LocalStorage.getItem('myself'), person)
            setMyinfo(my)
            LocalStorage.set('user', { userName: my.name, email: my.email, tel: my.phone, userId: my.userId })
          }
          return person
        }
      }, error => {
        error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
      })
    } else {
      // 后台数据库中更新数据
      return request.put('/persons/Update', model).then(res => {
        // 更新前台数据
        if (res.data) {
          var person = Person.from(res.data)
          commit('updatePersons', _.keyBy([_.cloneDeep(person)], 'id'))
          commit('updateSelectPersons', _.keyBy([_.cloneDeep(person)], 'id'))
          if (person.id === LocalStorage.getItem('myself').id) {
            let my = _.assign(LocalStorage.getItem('myself'), person)
            setMyinfo(my)
            LocalStorage.set('user', { userName: my.name, email: my.email, tel: my.phone, userId: my.userId })
          }
          return person
        }
      }, error => {
        error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
      })
    }
  },
  /**
   *  维护人员字段
   * @param {*} param0
   * @param {*} param1
   */
  updatePersonField ({ commit }, { id, fieldName, value }) {
    let endFieldName = _.findKey(Person.FieldsConvert(), f => f === fieldName)
    // 后台数据库中更新数据
    return request.put('/persons/UpdateFields', { PsonID: id, [endFieldName]: value }).then(res => {
      // 更新前台数据
      if (res.data) {
        var person = Person.from(res.data)
        commit('updatePersons', _.keyBy([_.cloneDeep(person)], 'id'))
        commit('updateSelectPersons', _.keyBy([_.cloneDeep(person)], 'id'))
        if (person.id === LocalStorage.getItem('myself').id) {
          let my = _.assign(LocalStorage.getItem('myself'), person)
          setMyinfo(my)
          LocalStorage.set('user', { userName: my.name, email: my.email, tel: my.phone, userId: my.userId })
        }
        return person
      }
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },
  /**
   * 删除人员信息
   * @param {*} { state, commit }
   * @param {*} ids
   * @returns
   */
  deletePersons ({ state, commit }, ids) {
    return request.delete('/persons/Delete', { id: _.isArray(ids) ? ids[0] : ids }).then(res => {
      // 更新前台数据
      if (res.data) {
        ids = _.isArray(ids) ? ids : [ids]
        commit('deletePersons', ids)
        indexedDB.update('person', { id: 1, persons: state.selectPersons })
        return res.data
      }
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },
  /**
   *激活/禁用人员
   *
   * @param {*} { commit }
   * @param {*} payload
   * @returns
   */
  activatedPerson ({ commit }, payload) {
    let { id, activated } = payload
    activated = activated ? 1 : 0
    return request.put('persons/Activate', { PsonID: id, Activated: activated }).then(res => {
      const data = res.data
      const person = Person.from(data)
      return person
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },
  /**
   *用户在职设定
   *
   * @param {*} { commit }
   * @param {*} { psonId = 0, userId = 0 }
   * @returns
   */
  updateEntryOffice ({ commit }, { psonId = 0, userId = 0 }) {
    return request.put('/persons/EntryOffice', { PsonID: psonId, UserID: userId }).then(res => {
      if (res.data) {
        commit('updatePersonField', { id: psonId, isInService: 'IsInService', value: 1 })
      }
      return true
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },
  /**
   *用户离职设定
   *
   * @param {*} { commit }
   * @param {*} { psonId = 0, userId = 0 }
   * @returns
   */
  updateLeaveOffice ({ commit }, { psonId = 0, userId = 0 }) {
    return request.put('/persons/LeaveOffice', { PsonID: psonId, UserID: userId }).then(res => {
      if (res.data) {
        commit('updatePersonField', { id: psonId, isInService: 'IsInService', value: 0 })
      }
      return true
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  },

  /**
   *更新所有用户在线状态
   *
   * @param {*} { commit, state }
   * @param {*} ids 在线用户PsonIDs字符串
   */
  updatePersonsOnlineStatus ({ state }, ids) {
    // 更改客户端用户的状态
    _.forEach(state.persons, p => {
      if (ids.includes(p.id)) {
        p.status = 1
      } else {
        p.status = 0
      }
    }, error => {
      error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
    })
  }
}
/**
  *分页获取人员数据
  *
  * @param {*} { commit }
  * @param {*} { psonId = 0, userId = 0 }
  * @returns
  */
function getAllPersonsByPage (state, commit, { fields, query }) {
  let selectPage = state.selectPage
  request.get('/persons/getpagelist', {
    fields,
    query,
    limit: selectPage.limit,
    offset: selectPage.offset
  }).then(res => {
    if (res.data) {
      let addPersons = Person.from(res.data)
      const nextPageToken = res.nextPageToken
      if (addPersons.length) {
        commit('updateSelectPersons', _.keyBy(addPersons, 'id'))
        commit('updateSelectPage', { offset: Math.min(selectPage.offset + addPersons.length), nextPageToken })
      }
      if (nextPageToken !== -1) {
        getAllPersonsByPage(state, commit, { fields, query })
      } else {
        indexedDB.update('person', { id: 1, persons: state.selectPersons }).then(() => {
          indexedDB.update('last_update_time', { id: 1, time: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') })
        })
      }
    }
  }, error => {
    error.userMessage && showWarningMessage(i18n.t(`person.error.${error.userMessage}`))
  })
}

/**
 * 动态拼接参数
 *
 * @param {*} byPage 是否分页
 * @param {*} page 分页对象 （byPage为true的时候必传）
 * @param {*} filter 后台参数过滤
 * @param {*} query 前台条件参数
 * @param {*} search 搜索
 * @param {*} sort 排序
 * @returns
 */
function convertParams (byPage, page, filter, query, search, sort) {
  var params = {}
  if (byPage) {
    params = {
      limit: page.limit,
      offset: page.offset,
      filter: filter,
      query: query,
      search: search,
      sort: sort
    }
  } else {
    params = {
      filter: filter,
      query: query,
      search: search,
      sort: sort
    }
  }
  return params
}
