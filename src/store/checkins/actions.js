
import request from '@/boot/axios'
import { LocalStorage, date } from 'quasar'
import { i18n } from '@/boot/i18n'
import Checkin from './model'
import { showWarningMessage } from '@/utils/show-message'
const { formatDate } = date
const url = {
  GetQuestions: 'questions/GetList',
  GetQuestion: 'questions/GetModel',
  GetCount: 'questions/GetCount',
  GetQuestionHistory: 'questions/GetHistory',
  AddQuestion: 'questions/Add',
  UpdateQuestion: 'questions/Update',
  DeleteQuestion: 'questions/Delete',
  ArchiveQuestion: 'questions/Archive',
  UnarchiveQuestion: 'questions/Unarchive',
  MoveQuestion: 'questions/Move',
  CopyQuestion: 'questions/Copy',
  StartQuestion: 'questions/Start',
  StopQuestion: 'questions/Stop',
  GetAnswersOfQuestion: 'answers/GetModelList',
  GetAnswer: 'answers/GetModel',
  GetAnswerHistory: 'answers/GetHistory',
  AddAnswer: 'answers/Add',
  UpdateAnswer: 'answers/Update',
  UpdateAnswerCommentCount: 'answers/UpdateCommentCount',
  DeleteAnswer: 'answers/Delete',
  GetAnswersOfPerson: 'answers/GetListOfPerson',
  // 废纸篓（问题）
  UndeleteQuestion: 'questions/Undelete',
  GetDeletedQeustionList: 'questions/GetDeletedList',
  // 废纸篓（回答）
  UndeleteAnswer: 'answers/Undelete',
  GetDeletedAnswerList: 'answers/GetDeletedList',
  GetAnswererIds: 'questions/answererIds'
}
export default {
  // 获取所有问题列表
  loadQuestionList ({ state, commit }, { objectType, objectID }) {
    const query = queryList(objectID, objectType)
    return request.get(url.GetQuestions, { query })
      .then(res => {
        let questions = []
        let list = Checkin.Question.from(res.data)
        // 为question添加冗余字段cronName
        list.forEach(item => {
          item.cronName = getQuestionCronName(item)
          questions.push(item)
        })
        commit('setObjectType', objectType)
        commit('setObjectID', objectID)
        commit('addQuestions', questions)
        return questions
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取单个问题
  loadQuestion ({ state, commit }, questionID) {
    let question = _.find(state.questions, item => item.id === +questionID)
    if (!question) {
      return request.get(url.GetQuestion, { id: questionID })
        .then(res => {
          let question = Checkin.Question.from(res.data)
          // 前台question添加cronName冗余字段
          question.cronName = getQuestionCronName(question)
          commit('addQuestions', [question])
          return question
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
    return question
  },
  loadQuestionHistory ({ state, commit }, questionID) {
    return request.get(url.GetQuestionHistory, { id: questionID })
      .then(res => {
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          let model = JSON.parse(list[i])
          history.push(model)
        }
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建任务
  addQuestion ({ state, commit }, question) {
    let model = Checkin.Question.to(question)
    return request.post(url.AddQuestion, model)
      .then(res => {
        let question = Checkin.Question.from(res.data)
        // 前台question添加cronName冗余字段
        question.cronName = getQuestionCronName(question)
        commit('addQuestions', [question])
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建一条回答
  updateQuestion ({ commit }, question) {
    let model = Checkin.Question.to(question)
    return request.put(url.UpdateQuestion, model)
      .then(res => {
        let question = Checkin.Question.from(res.data)
        // 前台question添加cronName冗余字段
        question.cronName = getQuestionCronName(question)
        commit('updateQuestion', question)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除一条回答
  deleteQuestion ({ state, commit }, questionID) {
    return request.delete(url.DeleteQuestion, { id: questionID })
      .then(res => {
        let question = Checkin.Question.from(res.data)
        commit('deleteQuestion', questionID)
        if (question.archived) {
          // 如果删除的是已归档的事项，则归档数量-1
          commit('setArchivedCount', state.archivedCount - 1)
        }
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 归档问题一条回答
  archiveQuestion ({ state, commit }, questionID) {
    return request.get(url.ArchiveQuestion, { id: questionID })
      .then(res => {
        let question = Checkin.Question.from(res.data)
        commit('updateQuestion', question)
        commit('setArchivedCount', state.archivedCount + 1)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 解档问题一条回答
  unarchiveQuestion ({ state, commit }, questionID) {
    return request.get(url.UnarchiveQuestion, { id: questionID })
      .then(res => {
        let question = Checkin.Question.from(res.data)
        question.cronName = getQuestionCronName(question)
        commit('updateQuestion', question)
        commit('setArchivedCount', state.archivedCount - 1)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 移动任务
  moveQuestion ({ state, commit }, data) {
    return request.put(url.MoveQuestion, data)
      .then(res => {
        let question = Checkin.Question.from(res.data)
        question.cronName = getQuestionCronName(question)
        commit('updateQuestion', question)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 复制问题
  copyQuestion ({ state, commit }, data) {
    return request.put(url.CopyQuestion, data)
      .then(res => {
        let question = Checkin.Question.from(res.data)
        commit('addQuestion', question)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 开始提问
  startQuestion ({ state, commit }, questionID) {
    return request.get(url.StartQuestion, { id: questionID })
      .then(res => {
        let question = Checkin.Question.from(res.data)
        question.cronName = getQuestionCronName(question)
        commit('updateQuestion', question)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 停止提问
  stopQuestion ({ state, commit }, questionID) {
    return request.get(url.StopQuestion, { id: questionID })
      .then(res => {
        let question = Checkin.Question.from(res.data)
        question.cronName = getQuestionCronName(question)
        commit('updateQuestion', question)
        return question
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某问题的所有回答
  loadAnswersOfQuestion ({ state, commit }, questionID) {
    return request.get(url.GetAnswersOfQuestion, { id: questionID })
      .then(res => {
        let answers = Checkin.Answer.from(res.data)
        // 向state.answers添加answers
        commit('addAnswers', answers)
        return answers
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（问题）start ***************************************/
  /** ************************************************************************************************/
  // 取消删除问题
  undeleteQuestion ({ state, commit }, id) {
    return request.get(url.UndeleteQuestion, { id })
      .then(res => {
        if (res.data) {
          let list = Checkin.Question.from(res.data)
          commit('addQuestions', list)
          commit('undeleteQeustionInTrash', id)
          return list
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取与我相关的已删除问题
  loadQuestionsInMyTrash ({ state, commit }) {
    const my = LocalStorage.getItem('myself')
    // 90天内，new Date() 返回的是毫秒
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.GetDeletedQeustionList, { query: JSON.stringify(query) })
      .then(res => {
        if (res.data) {
          let questions = []
          let list = Checkin.Question.from(res.data)
          list.forEach(item => {
            item.cronName = getQuestionCronName(item)
            questions.push(item)
          })
          commit('addQeustionsInTrash', questions)
          return list[0]
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除问题
  loadQuestionsInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
    // 90天内，new Date() 返回的是毫秒
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'And',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.GetDeletedQeustionList, { query: JSON.stringify(query) })
      .then(res => {
        if (res.data) {
          let questions = []
          let list = Checkin.Question.from(res.data)
          list.forEach(item => {
            item.cronName = getQuestionCronName(item)
            questions.push(item)
          })
          commit('addQeustionsInTrash', questions)
          return questions
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（问题）end *****************************************/
  /** ************************************************************************************************/
  /**
   *
   * 获取项目列表
   * @param {*} { state, commit }
   * @param {string} [query] 查询条件
   * @param {string} [filter] 模糊查询对象
   * @param {string} [sort] 排序
   * @param {string} [search] 搜索
   * @param {string} [fields] 查询字段
   * @param {boolean} [byPage] 是否分页查询
   * @param {number} [limit] 每页记录条数
   * @param {number} [offset] 偏移记录条数
   * 如果不分页，这不用传byPage
   */
  loadAnswers (
    { state, commit },
    {
      query,
      filter,
      sort,
      search,
      fields = 'List',
      byPage = state.byPage,
      limit = state.page.limit,
      offset = state.page.offset
    } = {}
  ) {
    const page = state.page
    // const byPage = state.byPage
    const condition = {
      query: JSON.stringify(query),
      filter: JSON.stringify(filter),
      search,
      fields,
      sort
    }
    Object.assign(condition, byPage ? { limit, offset } : {})
    let answers = []
    let url = byPage ? 'answers/getpagelist' : 'answers/getlist'
    return request
      .get(url, condition)
      .then(res => {
        answers = Checkin.Answer.from(res.data)
        commit('updatePage', {
          offset: page.offset + answers.length,
          nextPageToken: res.nextPageToken
        })
        commit('addAnswers', answers)
        return answers
      })
      .catch(error => {
        error.userMessage &&
          showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return []
      })
  },
  // 获取某人对某问题的所有回答
  loadAnswersOfPerson ({ state, commit }, { questionID, personID }) {
    return request.get(url.GetAnswersOfPerson, { questionID: questionID, personID: personID })
      .then(res => {
        let answers = Checkin.Answer.from(res.data)
        // 向state.answers添加answers
        commit('addAnswers', answers)
        return answers
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 根据ID获取某条回答
  loadAnswer ({ state, commit }, answerID) {
    let answer = _.find(state.answers, item => item.id === +answerID)
    if (!answer) {
      return request.get(url.GetAnswer, { Id: answerID })
        .then(res => {
          let answer = Checkin.Answer.from(res.data)
          // 向state.answers添加answers
          commit('addAnswers', [answer])
          return answer
        }).catch(error => {
          error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
          return false
        })
    }
    return answer
  },
  // 根据问题ID获取所有回答者Ids
  loadAnswererIds ({ state, commit }, questionID) {
    return request.get(url.GetAnswererIds, { Id: questionID })
      .then(res => {
        return res.data
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadAnswerHistory ({ state, commit }, answerID) {
    return request.get(url.GetAnswerHistory, { id: answerID })
      .then(res => {
        let history = []
        let list = JSON.parse(res.data.History)
        for (let i = 0; i < list.length; i++) {
          history.push(JSON.parse(list[i]))
        }
        return history
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 更新一条回答
  updateAnswer ({ commit }, model) {
    let answer = Checkin.Answer.to(model)
    return request.put(url.UpdateAnswer, answer)
      .then(res => {
        let answer = Checkin.Answer.from(res.data)
        // 向state.answers添加answers
        commit('updateAnswer', answer)
        return answer
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  /**
* 更新任务评论数量
* @param {*} param0 id 任务id
* @param {*} param1 isAdd true：新建评论；false：删除评论
*/
  updateAnswerCommentCount ({ commit }, { id, isAdd }) {
    return request.put(url.UpdateAnswerCommentCount, { id, isAdd })
      .then(res => {
        let answer = Checkin.Answer.from(res.data)
        commit('updateAnswer', answer)
        return answer
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 新建一条回答
  addAnswer ({ commit }, model) {
    let answer = Checkin.Answer.to(model)
    return request.post(url.AddAnswer, answer)
      .then(res => {
        let answer = Checkin.Answer.from(res.data)
        commit('addAnswers', [answer])
        return answer
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 删除一条回答
  deleteAnswer ({ commit }, answerID) {
    return request.delete(url.DeleteAnswer, { id: answerID })
      .then(res => {
        let answer = Checkin.Answer.from(res.data)
        commit('deleteAnswer', answerID)
        return answer
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  loadArchivedCount ({ commit }, { objectType, objectID }) {
    let query = [
      { Key: 'Archived', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
    ]
    return request.get(url.GetCount, {
      query: JSON.stringify(query)
    }).then(res => {
      commit('setArchivedCount', res.data)
      return res.data
    }).catch(error => {
      error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
      return false
    })
  },
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（回答）start ***************************************/
  /** ************************************************************************************************/
  // 取消删除回答
  undeleteAnswer ({ state, commit }, id) {
    return request.get(url.UndeleteAnswer, { id })
      .then(res => {
        if (res.data) {
          let list = Checkin.Answer.from(res.data)
          commit('addAnswers', list)
          commit('undeleteAnswerInTrash', id)
          return list
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取与我相关的已删除回答
  loadAnswersInMyTrash ({ state, commit }) {
    const my = LocalStorage.getItem('myself')
    // 90天内，new Date() 返回的是毫秒
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'DeleteBy', Value: my.name, Oper: 'eq' },
        'Or',
        { Key: 'CreateBy', Value: my.name, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.GetDeletedAnswerList, { query: JSON.stringify(query) })
      .then(res => {
        if (res.data) {
          let list = Checkin.Answer.from(res.data)
          commit('addAnswersInTrash', list)
          return list
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  },
  // 获取某个资源的已删除回答
  loadAnswersInTrash ({ state, commit }, { objectType = state.objectType, objectID = state.objectID } = {}) {
    // 90天内，new Date() 返回的是毫秒
    const time = formatDate(new Date() - 3600 * 1000 * 24 * 90, 'YYYY-MM-DD HH:mm:ss')
    const query = [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'And',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ],
      'And',
      [
        { Key: 'DeleteTime', Value: time, Oper: 'ge' }
      ]
    ]
    return request.get(url.GetDeletedAnswerList, { query: JSON.stringify(query) })
      .then(res => {
        if (res.data) {
          let list = Checkin.Answer.from(res.data)
          commit('addAnswersInTrash', list)
          return list
        } else {
          return false
        }
      }).catch(error => {
        error.userMessage && showWarningMessage(i18n.t(`auth.error.${error.userMessage}`))
        return false
      })
  }
  /** ************************************************************************************************/
  /** ************************************* 废纸篓（回答）end *****************************************/
  /** ************************************************************************************************/
}

function queryList (objectID, objectType) {
  let queryCondition =
    [
      [
        { Key: 'ObjectType', Value: objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: objectID, Oper: 'eq' }
      ]
    ]
  return JSON.stringify(queryCondition)
}
function getQuestionCronName (question) {
  if (question.isStop) {
    return i18n.t('checkins.ask.stopTitle')
  } else {
    let Cron = ''
    let days = getCronDays(question)
    if (question.cron.type === 'month') {
      if (question.cron.monthtype === 'firstweek') {
        Cron = i18n.t(`question.header.cron.firstweek`, { days: days })
      } else if (question.cron.monthtype === 'lastweek') {
        Cron = i18n.t('question.header.cron.lastweek', { days: days })
      } else if (question.cron.monthtype === 'lastday') {
        Cron = i18n.t('question.header.cron.lastday')
      } else {
        Cron = i18n.t('question.header.month', { days: days })
      }
    } else if (question.cron.type === 'week') {
      Cron = i18n.t('question.header.week', { days: days })
    } else {
      Cron = i18n.t('question.header.day')
    }
    return i18n.t(`question.header.title`, { Cron: Cron, time: question.cron.time, number: question.assignedTo ? question.assignedTo.length : 0 })
  }
}
function getCronDays (question) {
  let days = []
  if (question.cron.days) {
    if (question.cron.days.includes('sun')) {
      days.push(i18n.t('checkins.sunday'))
    }
    if (question.cron.days.includes('mon')) {
      days.push(i18n.t('checkins.monday'))
    }
    if (question.cron.days.includes('tue')) {
      days.push(i18n.t('checkins.tuesday'))
    }
    if (question.cron.days.includes('wed')) {
      days.push(i18n.t('checkins.wednesday'))
    }
    if (question.cron.days.includes('thu')) {
      days.push(i18n.t('checkins.thursday'))
    }
    if (question.cron.days.includes('fri')) {
      days.push(i18n.t('checkins.friday'))
    }
    if (question.cron.days.includes('sat')) {
      days.push(i18n.t('checkins.saturday'))
    }
  }
  if (question.cron.monthtype === 'day') {
    days.push(question.cron.days)
  }
  return days.join(' ')
}
