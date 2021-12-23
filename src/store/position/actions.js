/**
 *职位职级
 */
import Position from './model'
import request from '@/boot/axios'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '../../boot/i18n'
export default {
  /**
   * 管理员获取所有职位信息
   * @param {*} param0
   * @param {*} param1
   */
  loadPositions ({ commit, state }, {
    byPage = false,
    code,
    query,
    orderby,
    search,
    fields = 'List',
    limit,
    offset,
    isCommit = true } = {}) {
    let filter = { SecurityCode: code }
    let condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      orderby,
      limit: limit || state.page.limit,
      offset: offset || state.page.offset,
      sort: 'Id',
      order: 'asc'
    }
    return request.get(byPage ? 'positions/getpagelist' : 'positions/getlist', condition)
      .then(res => {
        if (res.data && res.data.length) {
          let positions = Position.from(res.data)
          isCommit && commit('pushPositions', positions)
          byPage && commit('updatePage',
            {
              offset: state.page.offset + positions.length,
              limit: state.page.limit
            })
          return positions
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 重置职级列表
   * @param {*} param0
   */
  resetPositions ({ commit, state }) {
    commit('setPositions', [])
    commit('updatePage',
      {
        offset: 0,
        limit: state.page.limit,
        total: 0
      })
  },
  /**
   * 员工code获取职级信息
   * @param {*} fields 验证码
   */
  getMyPosition ({ commit, state }, { code, field = 'View' }) {
    return request.get('positions/getmyposition', { code, field })
      .then(res => {
        if (res.data === null) {
          showWarningMessage(i18n.t(`position.codeDeleteErr`))
        } else {
          let position = Position.from(res.data)
          if (position.value && Object.keys(position.value).length) {
            return position
          } else {
            showWarningMessage(i18n.t(`position.codeErr`))
          }
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   *员工无需登录查看自己的职级
   */
  getMyPositionInWeChat ({ commit, state }, { recordNum, positionId, code, field = 'View' }) {
    return request.get('positions/getmypositioninwechat', { recordNum, positionId, code, field })
      .then(res => {
        if (res.data === null) {
          showWarningMessage(i18n.t(`position.codeDeleteErr`))
        } else {
          let position = Position.from(res.data)
          if (position.value && Object.keys(position.value).length) {
            return position
          } else {
            showWarningMessage(i18n.t(`position.codeErr`))
          }
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 获取各状态数量
   */
  getStatusCount ({ commit, state }) {
    return request.get('positions/getstatusCount')
      .then(res => {
        let data = res.data[0]
        commit('setPositionCountAndStatus', data)
        return data
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  /**
   * 更新已读状态
   */
  updateReadState ({ commit, state }, id) {
    return request.put('positions/updatefields', { ID: id, IsRead: 1 })
  },
  /**
   * 职位管理员导入数据
   * @param {*} param0
   * @param {*} list 模型数组
   * @param {*} isDone 全部数据导入完成
   * @param {*} send 已发送数量
   * @param {*} oldCode 旧动态码
   * @param {*} newCode 新动态码
   * @param {*} importFailed 导入失败的 index：第几批、offset：每批数量、recordNums：失败工号数组
   */
  importPosition ({ commit, state, dispatch },
    { list,
      isDone = false,
      send = 0,
      oldCode = '',
      newCode = '',
      importFailed = { index: [], offset: 0, recordNums: [] }
    }) {
    // 全部导入完成后返回
    if (isDone) {
      let countAndStatus = {
        all: list.length,
        error: 0,
        isRead: 0,
        mismatch: 0,
        newData: 0,
        unRead: 0,
        unSend: list.length,
        isSending: 1
      }
      commit('setPositionBatchCountAndStatus', countAndStatus)
      return importFailed
    }
    if (list.length) {
      // 规定每一批导入的数量
      let importNum = 1000
      importFailed.offset = importNum
      // 分批
      let sendList = _.slice(list, send, send + importNum)
      return request.post('positions/importposition', { listModel: sendList, oldCode, newCode })
        .then(res => {
          // 更新已导入数量
          send += sendList.length
          // 更新导入进度
          commit('setImportProgress', send / list.length)
          isDone = send >= list.length
          // 记录导入失败的批次
          if (!res.data) {
            importFailed.index.push(send - sendList.length)
            importFailed.recordNums.push(...sendList.map(i => i.RecordNum))
          }
          // 继续导入下一批
          return dispatch('importPosition', { list, isDone, send, oldCode: newCode, newCode: newCode, importFailed })
        })
        .catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        })
    } else {
      showWarningMessage('无数据')
    }
  },
  // 给管理员发送验证码
  adminSendCode ({ commit, state }, code) {
    return request.post('positions/adminSendCode', { code })
      .then(res => {
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  staffSendPosition ({ commit, state }, { query, code, search = '' }) {
    const condition = {
      query: JSON.stringify(query),
      code,
      search
    }
    return request.post('positions/sendPosition', condition)
      .then(res => {
        return true
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  },
  // 取消导入
  stopSend ({ commit, state, dispatch }) {
    return request.get('positions/stopthread')
      .then(res => {
        if (res.data) {
          commit('setPositionCountAndStatus', res.data[0])
        }
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      })
  }
}
