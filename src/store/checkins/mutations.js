import Vue from 'vue'
export default {
  updatePage (state, page) {
    if (page.nextPageToken === -1) {
      page.offset = 0
    }
    Object.assign(state.page, page)
  },
  setAddingEvent (state, adding) {
    state.addingEvent = adding
  },
  setSearch (state, value) {
    state.search = value
  },
  // 归档数量
  setArchivedCount (state, value) {
    state.archivedCount = value
  },
  // 设置问题类型
  setObjectType (state, objectType) {
    state.objectType = objectType
  },
  // 设置问题类型id
  setObjectID (state, objectID) {
    state.objectId = objectID
  },
  // 设置questionID
  setQuestionID (state, questionID) {
    state.questionID = questionID
  },
  // 设置AnswerID
  setAnswerID (state, answerID) {
    state.answerID = answerID
  },
  // 设置PersonID
  setPersonID (state, personID) {
    state.personID = personID
  },
  // 新建多个问题
  addQuestions (state, questions) {
    const newQuestions = _.differenceBy(questions, state.questions, 'id')
    state.questions.push(...newQuestions)
  },
  // 添加一条question）
  addQuestion (state, payload) {
    state.questions.push(payload)
  },
  // 更新一条question
  updateQuestion (state, payload) {
    const index = state.questions.findIndex(item => item.id === payload.id)
    Vue.set(state.questions, index, payload)
  },
  // 复制一条question
  copyQuestion (state, payload) {
    state.questions.push(payload)
  },
  // 移动一条question
  moveQuestion (state, payload) {
    const index = state.questions.findIndex(item => item.id === payload.id)
    Vue.set(state.questions, index, payload)
  },
  // 删除一条question
  deleteQuestion (state, id) {
    Vue.delete(state.questions, state.questions.findIndex(de => de.id === id))
  },
  // 归档一条question
  archiveQuestion (state, id) {
    let index = state.questions.findIndex(item => item.id === id)
    state.questions[index].isArchive = 1
  },
  // 解档一条question
  unarchiveQuestion (state, id) {
    let index = state.questions.findIndex(item => item.id === id)
    state.questions[index].isArchive = 0
  },
  // 添加多条回答
  addAnswers (state, answers) {
    const newAnswers = _.differenceBy(answers, state.answers, 'id')
    state.answers.push(...newAnswers)
  },
  // 添加一条回答
  addAnswer (state, payload) {
    // state.answers.push(payload)
    const newAnswer = _.differenceBy(payload, state.answers, 'id')
    state.answers.push(newAnswer)
  },
  // 更新一条回答
  updateAnswer (state, payload) {
    const index = state.answers.findIndex(answer => answer.id === payload.id)
    Vue.set(state.answers, index, payload)
  },
  // 删除一条回答
  deleteAnswer (state, id) {
    Vue.delete(state.answers, state.answers.findIndex(de => de.id === id))
  },
  // 根据questionID获取所有回答
  getAnswers (state, questionID) {
    const answers = {}
    Object.keys(state.answers).forEach(key => {
      const answer = state.answers[key]
      if (answer.questionID === questionID) {
        answers[key] = answer
      }
    })
    return answers
  },
  // 废纸篓（问题）
  addQeustionsInTrash (state, questions) {
    const newQuestions = _.differenceBy(questions, state.questionsInTrash, 'id')
    state.questionsInTrash.push(...newQuestions)
  },
  undeleteQeustionInTrash (state, id) {
    Vue.delete(state.questionsInTrash, state.questionsInTrash.findIndex(de => de.id === id))
  },
  // 废纸篓（回答）
  addAnswersInTrash (state, answers) {
    const newAnswers = _.differenceBy(answers, state.answersInTrash, 'id')
    state.answersInTrash.push(...newAnswers)
  },
  undeleteAnswerInTrash (state, id) {
    Vue.delete(state.answersInTrash, state.answersInTrash.findIndex(de => de.id === id))
  }
}
