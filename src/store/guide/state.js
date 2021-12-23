export default {
  guideModule: { objectType: 'project', objectID: 1242, createBy: 636, needed: 0, finished: 0, step: 0 },
  guideCategoryStep: [{
    name: 'member',
    content: '好的！第一步，您需要添加一些成员吗？',
    desc: [],
    addContent: {
      title: '好的，请在下面添加您的成员。',
      subtitle: ''
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'schedule',
    content: '好的！接下来，您要安排一个启动会或者其他日程事项吗？',
    desc: [],
    addContent: {
      title: '好的，让我们添加一个日程安排吧。',
      subtitle: ''
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'document',
    content: '接下来，您是否有前期的需求调研报告或者其他文档需要上传？',
    desc: ['图片与视频 - 如产品图片，现场拍摄视频', '3D模型 - 如打样工件模型', 'PDF/WPS - 如需求调研报告,可行性报告等'],
    addContent: {
      title: '好的，请在下面添加您的文件。',
      subtitle: ''
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'task',
    content: '接下来，是否需要给成员安排一些任务？',
    desc: ['竞品分析', '需求调研', '产品功能设计'],
    addContent: {
      title: '好的，请在下面添加您的任务清单。',
      subtitle: ''
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'notice',
    content: '接下来，您可以添加一个公告通知相关人员。',
    desc: ['为帮助您入门，我们已经为您起草了一个示例消息。'],
    addContent: {
      title: '好的，下面是示例消息，可以帮助您入门。',
      subtitle: '只需调整此消息，然后单击“发布”，添加后它将通知所有人。'
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'settings',
    content: '接下来，您是否还需要添加其他工具，查阅下工具箱吧？',
    desc: [],
    addContent: {
      title: '好的，您可以点击下面卡片的开关进行配置。',
      subtitle: ''
    },
    category: ['project', 'team', 'organize']
  }, {
    name: 'approval',
    content: '最后一步，是否需要立项？',
    desc: [],
    addContent: {
      title: '好的，请在下面填写您的立项说明。',
      subtitle: ''
    },
    category: ['project']
  }]
}
