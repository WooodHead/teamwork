const { wechat } = require('app/app.config.js')
export default {
  approvals: [],
  byPage: false,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  search: '',
  // 审批首页等不快捷方式
  quickLinks: [
    {
      name: 'waitDeal', // 需要我审批的
      to: { name: 'contactsHome' },
      icon: 'contacts',
      color: 'grey',
      label: '待处理'
    },
    {
      name: 'doneDeal', // 我审批过的
      to: { name: 'teamHome' },
      icon: 'group',
      color: 'grey',
      label: '已处理'
    },
    {
      name: 'subDeal', // 我提交的申请
      to: { name: 'projectHome' },
      icon: 'inbox',
      color: 'grey',
      label: '已发起'
    },
    {
      name: 'getDeal', // 抄送人是我
      to: { name: 'serviceHome' },
      icon: 'app:tw-icon-service',
      color: 'grey',
      label: '收到的'
    }
  ],
  // 内容区显示的审批栏目
  templates: [
    {
      name: 'leave',
      label: '请假',
      color: 'info',
      icon: 'schedule',
      templateId: (wechat && wechat.wx_approval_leave_templateId) ? wechat.wx_approval_leave_templateId : '1970325122023546_1688850915300868_999587701_1499158576',
      formFields: {
        template_names: [],
        template_content: {},
        vacation_list: {}
      }
    },
    {
      name: 'overtime',
      label: '加班',
      color: 'info',
      icon: 'highlight',
      templateId: (wechat && wechat.wx_approval_overtime_templateId) ? wechat.wx_approval_overtime_templateId : '1970325122023546_1688850915300868_1289800174_1497833746',
      formFields: {
        template_names: [],
        template_content: {},
        vacation_list: {}
      }
    }
    // {
    //   name: 'chapter',
    //   label: '用章',
    //   color: 'info',
    //   icon: 'adjust',
    //   templateId: 'BsAbvmV9wtfp66GBZbQhXEV8ffM74c7H2XNiRH3YB',
    //   formFields: {
    //     template_names: [],
    //     template_content: {},
    //     vacation_list: {}
    //   }
    // }
  ]
}
