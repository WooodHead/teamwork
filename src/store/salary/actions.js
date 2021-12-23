import { LocalStorage } from 'quasar'
import request from '@/boot/axios'
import Salary from './model'// import request from '@/boot/axios'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import { i18n } from '../../boot/i18n'
const url = {
  updateFields: '' // 聊天记录
}
export default {
  /**
   *加载工资日期和类型
   */
  loadSalaryDateAndType ({ commit, state }) {
    if (!state.allSalaryDateAndType.length) {
      return request.get('salarys/getallsalarydateandtype')
        .then(res => {
          let list
          if (res.data.length) {
            list = Salary.from(res.data)
          } else {
            list = []
          }
          commit('setSalarydateAndtype', list)
        }).catch(error => {
          error.userMessage && i18n.t(`auth.error.${error.userMessage}`)
        })
    }
  },
  /**
   * 更新问题反馈中feedback字段
   * @param {*} {commit }
   * @param {array} feedback 问题反馈的内容
   */
  async updateFeedbackField ({ rootState, state, commit }, payload) {
    if (payload === undefined) {
      return false
    }
    let salary = Salary.to(payload)
    salary.CMessage = await getMessage(rootState, salary, this.$router.currentRoute)
    return request.put(url.updateFields, salary)
      .then(res => {
        let from = Salary.from(res.data)
        // commit('updateFeedback', from)
        return from
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
   * 根据年月类型获取当前工资
   * @param {*} securityCode 验证码
   */
  getCurrentDateAndTypeSalary ({ commit, state },
    {
      sort,
      fields = 'List',
      byPage = state.byPage,
      status = 'all' } = {}) {
    const myinfo = LocalStorage.getItem('myself')
    const year = state.currentDateAndType.salaryYear
    const month = state.currentDateAndType.salaryMonth
    const type = state.currentDateAndType.type
    let limit, offset
    let query = [
      { Key: 'SalaryYear', Value: year, Oper: 'eq' },
      'and',
      { Key: 'SalaryMonth', Value: month, Oper: 'eq' },
      'and',
      { Key: 'Type', Value: type, Oper: 'eq' },
      'and',
      { Key: 'CreateByID', Value: +myinfo.id, Oper: 'eq' }
    ]
    if (status === 'isRead') {
      query.push(
        'and',
        { Key: 'IsRead', Value: 1, Oper: 'in' }

      )
    } else if (status === 'unRead') {
      query.push(
        'and',
        { Key: 'IsRead', Value: 0, Oper: 'in' },
        'and',
        { Key: 'SendStatus', Value: 1, Oper: 'in' }
      )
    } else if (status === 'error') {
      query.push(
        'and',
        { Key: 'SendStatus', Value: 4, Oper: 'in' }

      )
    } else if (status === 'unSend') {
      query.push(
        'and',
        { Key: 'SendStatus', Value: 0, Oper: 'eq' }

      )
    } else if (status === 'newData') {
      query.push(
        'and',
        { Key: 'SendStatus', Value: 3, Oper: 'eq' }

      )
    } else if (status === 'mismatch') {
      query.push(
        'and',
        { Key: 'SendStatus', Value: 2, Oper: 'eq' }

      )
    }
    const condition = {
      query: JSON.stringify(query),
      fields,
      sort,
      search: state.search
    }
    if (byPage) {
      limit = state.page[`${year}-${month}-${type}`] ? state.page[`${year}-${month}-${type}`].limit : 20
      offset = state.page[`${year}-${month}-${type}`] ? state.page[`${year}-${month}-${type}`].offset : 0
    }
    Object.assign(condition, byPage ? { limit, offset, order: state.order } : {})
    let url = byPage ? 'salarys/getpagelist' : 'salarys/getlist'
    return request
      .get(url, condition)
      .then(res => {
        let salarys = []
        if (res.data.length) {
          salarys = Salary.from(res.data)
          commit('setAdminSalarys', salarys)
        }
        commit('updatePage', {
          offset: offset + res.data.length,
          nextPageToken: res.nextPageToken,
          year,
          month,
          type
        })

        return salarys
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  loadSalarys (
    { state, commit },
    {
      query,
      code,
      sort,
      search,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset,
      order = state.order
    } = {}
  ) {
    let filter = { SecurityCode: code }
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    Object.assign(condition, byPage ? { limit, offset, order } : {})
    let url = byPage ? 'salarys/getpagelist' : 'salarys/getlist'
    return request.get(url, condition)
      .then(res => {
        const salarys = Salary.from(res.data)
        commit('setAdminSalarys', salarys)
        commit('setAdminSecurityCode', code)
        return salarys
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 管理员根据id、code获取工资
   * @param {*} fields 验证码
   */
  getSalary ({ commit, state }, { id, code, recordNum, isUpdateIsRead = false, field = 'View' }) {
    return request.get('salarys/getmodel', { id, code, recordNum, isUpdateIsRead, field })
      .then(res => {
        if (res.data === null) {
          showWarningMessage(i18n.t(`salary.codeDeleteErr`))
        } else {
          const salarys = Salary.from(res.data)
          if (salarys.value && Object.keys(salarys.value).length) {
            if (isUpdateIsRead) {
              commit('setSalaryModel', salarys)
            } else {
              commit('setAdminSalarys', [salarys])
              commit('setAdminSalaryModel', salarys)
              commit('setAdminSecurityCode', code)
            }
            return salarys
          } else {
            showWarningMessage(i18n.t(`salary.codeErr`))
          }
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 员工根据年、月、类型、code获取工资
   * @param {*} fields 验证码
   */
  getMySalary ({ commit, state }, { year, month, type, code, field = 'View' }) {
    return request.get('salarys/getmysalary', { year, month, type, code, field })
      .then(res => {
        if (res.data === null) {
          showWarningMessage(i18n.t(`salary.codeDeleteErr`))
        } else {
          const salarys = Salary.from(res.data)
          if (salarys.value && Object.keys(salarys.value).length) {
            commit('setSalaryModel', salarys)
            return salarys
          } else {
            showWarningMessage(i18n.t(`salary.codeErr`))
          }
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 管理员导入工资条
   * @param {*} list 列表界面,只需要传入此参数，其余参数无需传
  */
  importSalary ({ commit, state, dispatch }, { list, code, total }) {
    if (!list || list.length === 0) {
      return true
    }
    const count = 1000
    // 取出list的前1000个
    const sendList = list.slice(0, count)
    return request.post('salarys/importsalary', { listModel: Salary.to(sendList), code })
      .then(res => {
        // 更新已发送数量
        // 更新state中发送进度
        if (res.data) {
          commit('setImportProgress', (total - list.slice(count).length) / total)
          return dispatch('importSalary', { list: list.slice(count), code, total })
        } else {
          return false
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 管理员重新导入工资条
   * @param {*} list 列表界面,只需要传入此参数，其余参数无需传
   */
  reImportSalary ({ commit, state, dispatch }, { list, code, total, salaryYear, salaryMonth, type }) {
    if (!list || list.length === 0) {
      return true
    }
    const count = 1000
    // 取出list的前1000个
    const sendList = list.slice(0, count)
    return request.post('salarys/resendsalary', { listModel: Salary.to(sendList), code, salaryYear, salaryMonth, type })
      .then(res => {
        // 更新已发送数量
        // 更新state中发送进度
        if (res.data) {
          commit('setImportProgress', (total - list.slice(count).length) / total)
          return dispatch('reImportSalary', { list: list.slice(count), code, total, salaryYear, salaryMonth, type })
        } else {
          return false
        }
      })
      .catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  sendMessage ({ commit, state }, { query, code, search = '', salaryYear, salaryMonth, type }) {
    const condition = {
      query: JSON.stringify(query),
      code,
      search,
      salaryYear,
      salaryMonth,
      type
    }
    // 将前台该月数据删除
    commit('deleteAdminSalarys', { salaryYear, salaryMonth, type })
    commit('initTypePage', { salaryYear, salaryMonth, type })
    return request.post('salarys/sendsalary', condition)
      .then(res => {
        if (res.data.isOk) {
          return true
        } else {
          showWarningMessage(res.data.message)
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 给管理员发送验证码
  adminSendCode ({ commit, state }, { code, salaryYear, salaryMonth, type }) {
    return request.post('salarys/adminsendcode', { code, salaryYear, salaryMonth, type })
      .then(res => {
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 删除某时间某类型下的所有工资条
  deleteSalarys ({ commit, state, dispatch }, deleteParams) {
    return request.post('salarys/delete', deleteParams)
      .then(res => {
        if (!res.data.isOk) {
          showWarningMessage(res.data.message)
        } else {
          // 删除当前年月类型，页面跳转至最近的工资条中
          commit('deleteSalarydateAndtype', deleteParams)
          commit('deleteAdminSalarys', deleteParams)
          commit('deleteSalaryCountAndStatus', deleteParams)
          commit('deleteSalaryFilterStatus', deleteParams)
          if (state.allSalaryDateAndType.length > 0) {
            const myinfo = LocalStorage.getItem('myself')
            commit('setCurrentDateAndType', state.allSalaryDateAndType[0])
            // 如果当前年月类型下没有工资条，则需要调用接口获取一遍
            let salarys = _.filter(state.adminSalarys, item => {
              return state.currentDateAndType.salaryYear === item.salaryYear && state.currentDateAndType.salaryMonth === item.salaryMonth && state.currentDateAndType.type === item.type
            })
            if (!salarys.length) {
              dispatch('getCurrentDateAndTypeSalary')
            }
            if (!state.salaryFilterStatus[`${state.currentDateAndType.salaryYear}-${state.currentDateAndType.salaryMonth}-${state.currentDateAndType.type}`]) {
              dispatch('getCount', { year: state.currentDateAndType.salaryYear, month: state.currentDateAndType.salaryMonth, type: state.currentDateAndType.type, psonID: myinfo.id })
            }
          }
          showSuccessMessage(i18n.t(`salary.deleteSuccess`))
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 删除一个工资条
  deleteSalary ({ commit, state, dispatch }, id) {
    return request.delete('salarys/delete', { id })
      .then(res => {
        if (!res.data) {
          showWarningMessage(i18n.t(`salary.deleteErr`))
          return false
        } else {
          commit('deleteAdminSalary', id)
          showSuccessMessage(i18n.t(`salary.deleteSuccess`))
          return true
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 申请工资条验证码
  applyMyCode ({ commit, state, dispatch }, { year, month, type }) {
    return request.get('salarys/applymycode', { year, month, type })
      .then(res => {
        if (res.data === 1) {
          return true
        } else {
          return false
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 获取状态数量
   */
  getCount ({ commit, state, dispatch }, { year, month, type, psonID, isToggle = true }) {
    // 如果state中有所需的值，则不走后台接口
    if (!(year && month && type) || (isToggle && state.salaryFilterStatus[`${year}-${month}-${type}`])) return
    return request.get('salarys/getcount', { year, month, type, psonID })
      .then(res => {
        let data = res.data[0]
        let dateAndType = {
          salaryYear: year,
          salaryMonth: month,
          type
        }
        commit('setSalaryFilterStatus', Object.assign(data, dateAndType))
        return data
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  stopSend ({ commit, state, dispatch }) {
    const year = state.currentDateAndType.salaryYear
    const month = state.currentDateAndType.salaryMonth
    const type = state.currentDateAndType.type
    const myinfo = LocalStorage.getItem('myself')
    return request.get('salarys/stopthread', { year, month, type, psonID: +myinfo.id })
      .then(res => {
        if (res.data) {
          commit('setSalaryFilterStatus', res.data[0])
          commit('deleteSalaryCountAndStatus', { salaryYear: year, salaryMonth: month, type })
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  codeIsRight ({ commit, state }, { code, salaryYear, salaryMonth, type }) {
    return request.get('salarys/codeisright', { code, salaryYear, salaryMonth, type })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && i18n.t(`auth.error.${error.userMessage}`)
      })
  }
}

// 定义一个消息model
async function getMessage (rootState, message, route) {
  const myinfo = LocalStorage.getItem('myself')
  // var text = JSON.parse(message.Message.content)
  var text = message
  var type = 'salaryfeedback' // 消息类型
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
  route.params.objectID = message.SalaryID || 0
  return {
    Module: {
      Id: message.SalaryID,
      Title: '工资条问题反馈',
      Type: type
    },
    Route: {
      Name: '', // 待办
      Params: {}, // 待办
      Path: '' // 待办
    },
    SenderID: text.fromId,
    SenderName: text.fromName,
    SenderImg: myinfo.img,
    SendTime: text.sendTime,
    Title: text.fromName + '给您发送了一条工资条反馈消息',
    Tag: '',
    Type: type,
    Extra: {
      Content: content
    }
  }
}
