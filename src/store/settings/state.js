export default {
  settings: {
    company: { id: 0 },
    // 职级设置
    position: {
      // 允许查看职级信息的机构
      allowedOrganizeIDs: []
    },
    devSystem: {
      id: 0,
      forManagement: true,
      forDeclaration: false,
      excludeOrganizeIDs: [],
      excludeDutyIDs: []
    },
    defaultQuestion: {}, // 默认问题列表
    // 默认通讯录设置
    contacts: {
      id: 0,
      type: 'contacts',
      settings: { limit: { title: '', description: '', items: [] }, forbidden: { title: '', description: '', items: [] } }
    },
    addingQuestionEvent: false,
    editingQuestionEvent: false,
    currQuestion: {}, // 当前问题。用于问题编辑
    currQuestionCategory: '' // 当前问题所属类别
  } // 保存系统相关设置信息。例如，company（系统运营公司id），研发体系设置等
}
