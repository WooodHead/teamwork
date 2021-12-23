export default {
  setSettings (state, settings) {
    let company = _.find(settings, item => item.type === 'company')
    let devSystem = _.find(settings, item => item.type === 'devSystem')
    let defaultQuestion = _.find(settings, item => item.type === 'defaultQuestion')
    let position = _.find(settings, item => item.type === 'position')
    let contacts = _.find(settings, item => item.type === 'contacts')
    // 系统运营公司设置
    if (company) {
      state.settings.company = company && { id: company.settings.id }
    }
    // 研发体系设置
    if (devSystem) {
      state.settings.devSystem = {
        id: devSystem.id,
        forManagement: devSystem.settings.forManagement,
        forDeclaration: devSystem.settings.forDeclaration,
        excludeOrganizeIDs: devSystem.settings.excludeOrganizeIDs,
        excludeDutyIDs: devSystem.settings.excludeDutyIDs
      }
    }
    // 默认问题
    if (defaultQuestion) {
      state.settings.defaultQuestion = {
        id: defaultQuestion.id,
        team: defaultQuestion.settings.team,
        project: defaultQuestion.settings.project,
        organize: defaultQuestion.settings.organize,
        productDev: defaultQuestion.settings.productDev,
        customer: defaultQuestion.settings.customer,
        wiki: defaultQuestion.settings.wiki
      }
    }
    // 职级设置
    if (position) {
      state.settings.position = {
        id: position.id,
        allowedOrganizeIDs: position.settings.allowedOrganizeIDs
      }
    }
    // 通讯录设置
    state.settings.contacts = contacts ||
    {
      id: 0,
      type: 'contacts',
      settings: { limit: { title: '', description: '', items: [] }, forbidden: { title: '', description: '', items: [] } }
    }
  },
  setCompany (state, company) {
    if (company) {
      state.settings.company = company
    }
  },
  setDevSystem (state, devSystem) {
    if (devSystem) {
      state.settings.devSystem = devSystem
    }
  },
  setAddQuestionEvent (state, adding) {
    state.settings.addingQuestionEvent = adding
  },
  setEditQuestionEvent (state, editing) {
    state.settings.editingQuestionEvent = editing
  },
  setQuestion (state, questionObj) {
    if (questionObj) {
      state.settings.currQuestion = questionObj.question
      state.settings.currQuestionCategory = questionObj.category
    }
  }
}
