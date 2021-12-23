import { date, LocalStorage } from 'quasar'
import { i18n } from '@/boot/i18n'
export default {
  // 根据objectID和objectType获取未删除和未归档的问题列表
  questions: (state, getters) => {
    const questions = state.questions.filter(a => a.objectType === state.objectType && a.objectId === state.objectId)
    return questions
  },
  // 获取一个问题对象
  question: (state, getters) => questionID => {
    return _.find(state.questions, p => { return p.id === questionID }) || { cron: {} }
  },
  // 获取问题questioList
  questionList: (state, getters) => {
    const search = state.search
    const questions = getters.questionsSorted.filter(a => !a.archived)
    if (search) {
      return _.filter(_.cloneDeep(questions), question =>
        question.content.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return questions
    }
  },
  // 根据objectID和objectType获取未删除的已归档问题列表
  archiveList: (state, getters) => {
    const search = state.search
    const questions = getters.questionsSorted.filter(a => a.archived)
    if (search) {
      return _.filter(_.cloneDeep(questions), question =>
        question.content.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return questions
    }
  },
  // 获取某条回答
  answer: (state, getters) => answerID => {
    return state.answers.find(a => a.id === answerID) || {}
  },
  // 获取某问题的所有回答
  answers: (state, getters) => (questionID) => {
    return getters.answersSorted.filter(a => a.questionID === questionID)
  },
  answersGroup: (state, getters) => (questionID, type) => {
    const answers = getters.answersSorted.filter(a => a.questionID === questionID)
    return groupedAnswers(answers, type)
  },
  // 获取某人对某问题的所有未删除回答
  answersOfPerson: (state, getters) => (questionID, createByID) => {
    return getters.answersSorted.filter(a => a.createByID === createByID && a.questionID === questionID)
  },
  answersOfPersonGroup: (state, getters) => (questionID, createByID, type) => {
    const answers = getters.answersSorted.filter(a => a.createByID === createByID && a.questionID === questionID)
    return groupedAnswers(answers, type)
  },
  // 获取排序后的某问题的回答
  answersSorted: (state, getters) => {
    return state.answers.sort((a, b) => {
      if (a[state.sort] > b[state.sort]) return -1
      return 1
    })
  },
  // 获取排序后的问题
  questionsSorted: (state, getters) => {
    return getters.questions.sort((a, b) => {
      if (a[state.sort] > b[state.sort]) return -1
      return 1
    })
  },
  cron: (state, getters) => id => {
    let question = _.find(state.questions, p => { return p.id === id }) || { cron: {} }
    if (question.cron.type === 'month') {
      if (question.cron.monthtype === 'firstweek') {
        return i18n.t('question.header.cron.firstweek', { days: getters.days(id) })
      } else if (question.cron.monthtype === 'lastweek') {
        return i18n.t('question.header.cron.lastweek', { days: getters.days(id) })
      } else if (question.cron.monthtype === 'lastday') {
        return i18n.t('question.header.cron.lastday')
      } else {
        return i18n.t('question.header.month', { days: getters.days(id) })
      }
    } else if (question.cron.type === 'week') {
      return i18n.t('question.header.week', { days: getters.days(id) })
    } else {
      return i18n.t('question.header.day')
    }
  },
  days: (state, getters) => id => {
    let days = []
    let question = _.find(state.questions, p => { return p.id === id }) || { cron: {} }
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
  },
  // 废纸篓（问题）
  QuestionsInMyTrash: (state) => {
    const my = LocalStorage.getItem('myself')
    let list = state.questionsInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  QuestionsInTrash: (state) => (objectType, objectID) => {
    let list = state.questionsInTrash.filter(item => item.objectType === objectType && item.objectId === +objectID)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  // 废纸篓（回答）
  AnswersInMyTrash: (state) => {
    const my = LocalStorage.getItem('myself')
    let list = state.answersInTrash.filter(item => item.createBy === my.name || item.deleteBy === my.name)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  },
  AnswersInTrash: (state) => (objectType, objectID) => {
    let list = state.answersInTrash.filter(item => item.objectType === objectType && item.objectId === +objectID)
    return _.sortBy(list, ['deleteTime'], ['desc'])
  }
}
function groupedAnswers (answers, type) {
  const answersGroup = _.groupBy(
    _.orderBy(answers, ['postDate', 'modifyTime'], ['desc', 'desc']),
    function (item) {
      let plyPostDate = item.postDate.replace(/-/g, '/')
      if (type === 'day') {
        return plyPostDate
      } else if (type === 'week') {
        let number = 7 - new Date(plyPostDate).getDay()
        let end = ''
        let start = ''
        if (number === 7) {
          end = new Date(plyPostDate).setDate(new Date(plyPostDate).getDate())
          start = new Date(plyPostDate).setDate(new Date(plyPostDate).getDate() - 6)
        } else {
          end = new Date(plyPostDate).setDate(new Date(plyPostDate).getDate() + number)
          start = new Date(plyPostDate).setDate(new Date(plyPostDate).getDate() + number - 6)
        }
        let weekDate = '(' + date.formatDate(start, 'MM-DD') + '~' + date.formatDate(end, 'MM-DD') + ')'
        return '第' + date.formatDate(plyPostDate, 'w') + '周' + weekDate
      } else if (type === 'month') {
        return date.formatDate(plyPostDate, 'M') + '月'
      }
    })
  return answersGroup
}
