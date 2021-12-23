// 后台状态定义
const endStatus = {
  unActivated: -10, // 未激活
  waitScreening: 0, // 待筛选
  waitTest: 10, // 待测评
  inTest: 15, // 测评中
  waitInviteFirstInterview: 20, // 待综面邀约
  waitFirstInterview: 30, // 待综面
  inFirstInterview: 40, // 综合面试中
  waitOffer: 90, // 待发offer
  waitSign: 100, // 待签约
  inService: 110 // 已入职
}
import { LocalStorage } from 'quasar'
export default function () {
  return {
    endStatus: endStatus,
    // 前台状态
    frontStatus: {
      waitScreening: [endStatus.waitScreening], // 待筛选
      waitTest: [endStatus.waitTest, endStatus.inTest], // 待测评
      waitInvite: [endStatus.waitInviteFirstInterview], // 待邀约
      waitInterview: [endStatus.waitFirstInterview, endStatus.inFirstInterview], // 待面试
      waitOffer: [endStatus.waitOffer], // 待offer
      waitSign: [endStatus.waitSign], // 待签约
      // 更多
      inService: [endStatus.inService], // 已入职
      inStorage: [endStatus.inStorage] // 已淘汰入库
    },
    // 常规状态
    normalStatus: ['waitScreening', 'waitTest', 'waitInvite', 'waitInterview', 'waitOffer', 'waitSign', 'inService', 'inStorage'],
    // 更多状态
    moreStatus: ['inService', 'inStorage'],
    // 模糊查询
    search: '',
    query: [],
    // 简历筛选列表条件-应聘地点
    commonCitys: [],
    inServiceCitys: [],
    inStorageCitys: [],
    // 多条件查询
    queryList: [
      {
        label: '应聘地点',
        value: []
      },
      {
        label: '最高学历',
        value: [
          { label: '中专', value: '中专', name: 'HighestEducation' },
          { label: '专科', value: '专科', name: 'HighestEducation' },
          { label: '本科', value: '本科', name: 'HighestEducation' },
          { label: '硕士研究生', value: '硕士研究生', name: 'HighestEducation' },
          { label: '博士研究生', value: '博士研究生', name: 'HighestEducation' }
        ]
      },
      {
        label: '期望月薪',
        value: [
          { label: '5-8k', value: '5-8k', name: 'ExpectedSalary' },
          { label: '8-10k', value: '8-10k', name: 'ExpectedSalary' },
          { label: '10-12k', value: '10-12k', name: 'ExpectedSalary' },
          { label: '12-15k', value: '12-15k', name: 'ExpectedSalary' },
          { label: '15-20k', value: '15-20k', name: 'ExpectedSalary' },
          { label: '20k以上', value: '20k以上', name: 'ExpectedSalary' }
        ]
      },
      // {
      //   label: '语言情况',
      //   value: [
      //     { label: '英语四级', value: '英语四级', name: 'Languages' },
      //     { label: '英语六级', value: '英语六级', name: 'Languages' },
      //     { label: '专业四级', value: '专业四级', name: 'Languages' },
      //     { label: '专业六级', value: '专业六级', name: 'Languages' }
      //   ]
      // },
      {
        label: '性别',
        value: [
          { label: '男', value: '男', name: 'Sex' },
          { label: '女', value: '女', name: 'Sex' }
        ]
      }
    ],
    // 是否分页
    byPage: false,
    page: {
      offset: 0,
      limit: 30,
      total: 0,
      nextPageToken: -1
    },
    // 进行中的招聘计划
    recruitingPlans: [],
    // 前台简历卡片数据
    resumeViews: [],
    // 登录人id，切换登录时刷新页面
    psonID: LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id,
    // 前台简历详情数据
    resumes: [],
    // 各状态的简历数量
    statusCount: {},
    // 当前选择的状态
    selectedStatus: 'waitScreening',
    // 面试记录模板
    hrInterviewTemplate: '<p class=""><strong><span style="color: #1890ff"><span style="background: #f5f5f5">总分评分标准</span></span></strong></p><div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col><col><col></colgroup><tbody><tr><th><p><span style="color: #d46b08">梯队</span></p></th><th><p><span style="color: #d46b08">得分区间</span></p></th><th><p><span style="color: #d46b08">含义</span></p></th></tr><tr><td><p><strong><span style="color: #8c8c8c">A</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">85~100</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">优秀：专业、综合能力突出。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">B</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">70~84</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">良好：专业、综合能力有一方面突出。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">C</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">60-69</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">匹配：符合岗位基本要求。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">D</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">＜60</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">不匹配：淘汰。</span></strong></p></td></tr></tbody></table></div><p class=""><strong><span style="color: #1890ff">人事评估表</span></strong></p><div class="tableWrapper has-focus"><table style="min-width: 50px;"><colgroup><col><col></colgroup><tbody><tr><td><p><strong><span style="color: #d46b08">考察项（得分区间）</span></strong></p></td><td><p><strong><span style="color: #d46b08">实际得分</span></strong></p></td></tr><tr class=""><td><p><strong><span style="color: #8c8c8c">仪表礼仪（0~15）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class=""><td><p><strong><span style="color: #8c8c8c">学习能力（0~20）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class=""><td><p><strong><span style="color: #8c8c8c">执行力（0~20）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class=""><td class=""><p class=""><strong><span style="color: #8c8c8c">逻辑思维、解决问题（0~15）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class=""><td><p><strong><span style="color: #8c8c8c">团队合作与发展（0~15）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class=""><td><p><strong><span style="color: #8c8c8c">求职动机及对企业认可度（0~15）</span></strong></p></td><td class=""><p class=""></p></td></tr><tr><td colspan="2"><p><strong><span style="color: #d46b08">简单记录（情况/行为/结果）</span></strong></p></td></tr><tr class=""><td colspan="2" class=""><p class=""><br class=""><br></p></td></tr><tr><td colspan="2"><p><strong><span style="color: #d46b08">其他需记录事项</span></strong></p></td></tr><tr class="has-focus"><td colspan="2" class="has-focus"><ol class=""><li class=""><p>硕士导师姓名</p><p class=""><br></p></li><li class=""><p>家庭情况、婚恋情况</p><p class=""><br></p></li><li class=""><p>目前已获offer情况</p><p class=""><br></p></li><li><p>其他（特此爱好）</p></li></ol><p class="has-focus"><br></p></td></tr></tbody></table></div><p><br><br></p>',
    techInterviewTemplate: '<p class=""><strong><span style="color: #1890ff"><span style="background: #f5f5f5">总分评分标准</span></span></strong></p><p class=""><span style="color: #1890ff">注意：请技术面试官只评估面试者的专业能力，无需考虑其他因素。</span></p><div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col><col><col></colgroup><tbody><tr><th><p><span style="color: #d46b08">梯队</span></p></th><th><p><span style="color: #d46b08">得分区间</span></p></th><th><p><span style="color: #d46b08">含义</span></p></th></tr><tr><td><p><strong><span style="color: #8c8c8c">A</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">85~100</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">优秀：专业、综合能力突出。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">B</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">70~84</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">良好：专业、综合能力有一方面突出。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">C</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">60-69</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">匹配：符合岗位基本要求。</span></strong></p></td></tr><tr><td><p><strong><span style="color: #8c8c8c">D</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">＜60</span></strong></p></td><td><p><strong><span style="color: #8c8c8c">不匹配：淘汰。</span></strong></p></td></tr></tbody></table></div><p class=""><strong><span style="color: #1890ff">专业评估表</span></strong></p><div class="tableWrapper has-focus"><table style="min-width: 50px;"><colgroup><col><col></colgroup><tbody><tr class=""><td class=""><p class=""><strong><span style="color: #d46b08">考察项（权重）</span></strong></p></td><td class=""><p class=""><strong><span style="color: #d46b08">简单记录（情况/行为/结果）</span></strong></p></td></tr><tr class=""><td class=""><p class=""><strong><span style="color: #8c8c8c">专业知识与岗位的匹配度</span></strong><span style="color: #8c8c8c">（可从学科成绩、科研、竞赛、获奖经历等方面着手）</span></p></td><td class=""><p class=""></p></td></tr><tr class=""><td class=""><p class=""><strong><span style="color: #8c8c8c">专业实践能力</span></strong><span style="color: #8c8c8c">（可从项目经理、实习经历、竞赛等方面着手）</span></p></td><td class=""><p class=""></p></td></tr><tr class=""><td class=""><p class=""><strong><span style="color: #8c8c8c">是否具备工作中需要的能力素质</span></strong></p></td><td class=""><p class=""></p></td></tr><tr class="has-focus"><td class=""><p class=""><strong><span style="color: #8c8c8c">不足</span></strong></p></td><td class="has-focus"><p class="has-focus"></p></td></tr><tr class=""><td colspan="2" class=""><p class=""><strong><span style="color: #d46b08">说明</span></strong></p></td></tr><tr class=""><td colspan="2" class=""><p class=""><br class=""><br></p></td></tr></tbody></table></div><p><br><br></p>',
    // hrInterviewTemplate: '<table><tbody><tr><td><p><code>考察项（权重）</code></p></td><td><p><code>得分（0-10）</code></p></td></tr><tr><td><p>仪表礼仪（15%）</p></td><td><p></p></td></tr><tr><td><p>学习能力（20%）</p></td><td><p></p></td></tr><tr><td><p>执行力（15%）</p></td><td><p></p></td></tr><tr><td><p>团队合作与发展（15%）</p></td><td><p></p></td></tr><tr><td><p>解决问题（15%）</p></td><td><p></p></td></tr><tr><td><p>求职动机及对企业的认可（20%）</p></td><td><p></p></td></tr><tr><td colspan="2"><p><code>说明</code></p></td></tr><tr><td colspan="2"><ol><li><p>硕士导师姓名</p><p></p></li><li><p>父母的工作单位、职业</p><p></p></li><li><p>对象/配偶的工作单位、职业</p><p></p></li><li><p>目前已获offer情况</p><p></p></li><li><p>其他</p><p></p></li></ol><p></p></td></tr></tbody></table>',
    // techInterviewTemplate: '<table><tbody><tr><td><p><code>考察项（权重）</code></p></td><td><p><code>得分（0-10）</code></p></td></tr><tr><td><p>专业基础（30%）</p></td><td><p></p></td></tr><tr><td><p>专业技能（30%）</p></td><td><p></p></td></tr><tr><td><p>项目&amp;实习经历（30%）</p></td><td><p></p></td></tr><tr><td><p>科研/专业成果（10%）</p></td><td><p></p></td></tr><tr><td colspan="2"><p><code>说明</code></p></td></tr><tr><td colspan="2"><p></p><p></p></td></tr></tbody></table>',
    // 面试评分标准
    hrInterviewTemplateTip: '<table><tbody><tr><td><p><code>考察项（权重）</code></p></td><td><p><code>得分（0-10）</code></p></td></tr><tr><td><p>仪表礼仪（15%）</p></td><td><p><strong>8-10分</strong>：仪表正式，谦虚有礼。</p><p><strong>6-7分</strong>：仪表干净整洁，见面礼貌。</p><p><strong>6分以下</strong>：仪表学生气，较为邋遢，面试姿态、言语随意（翘腿、随意靠背）。</p></td></tr><tr><td><p>学习能力（20%）</p></td><td><p><strong>8-10分</strong>：有主动学习的意识，成果显著且与岗位需求契合。</p><p><strong>6-7</strong>分：有学习意识，但更多是追随大众，学习成果一般。</p><p><strong>6分以下</strong>：成绩一般，没有主动学习想法。</p></td></tr><tr><td><p>执行力（15%）</p></td><td><p><strong>8-10分</strong>：能按计划完成任务，并反思提升。</p><p><strong>6-7分</strong>：被动执行，需他人监督。</p><p><strong>6分以下</strong>：无意识和想法。</p></td></tr><tr><td><p>团队合作与发展（15%）</p></td><td><p><strong>8-10分</strong>：团队合作能力突出，曾有效解决难题等。</p><p><strong>6-7分</strong>：有团队合作经历，对如何处理问题有认知。</p><p><strong>6分以下</strong>：较少参加团队活动。</p></td></tr><tr><td><p>解决问题（15%）</p></td><td><p></p></td></tr><tr><td><p>求职动机及对企业的认可（20%）</p></td><td><p><strong>8-10分</strong>：个人未来发展、认知</p><p><strong>6-7分</strong>：对行业、公司、岗位有认同感。</p><p><strong>6分以下</strong>：不看好机械行业。对岗位无认知。</p></td></tr></tbody></table>',
    techInterviewTemplateTip: '<table><tbody><tr><td><p><code>考察项（权重）</code></p></td><td><p><code>得分（0-10）</code></p></td></tr><tr><td><p>专业基础（30%）</p></td><td><p><strong>9-10分</strong>：与岗位匹配度高，能快速上手。</p><p><strong>6-8分</strong>：与岗位需求较为匹配。</p><p><strong>6分以下</strong>：与岗位需求不匹配。</p></td></tr><tr><td><p>专业技能（30%）</p></td><td><p><strong>同上</strong></p></td></tr><tr><td><p>项目&amp;实习经历（30%）</p></td><td><p><strong>同上</strong></p></td></tr><tr><td><p>科研/专业成果（10%）</p></td><td><p><strong>同上</strong></p></td></tr></tbody></table>',
    // -----start 仪表盘数据-------
    dashProcessData: {}, // 招聘流程漏斗图
    dashSourceData: {}, // 所有应聘者学历分布
    dashDayData: {}, // 每日简历投递量趋势图
    dashFlowData: {}, // "院校类型、学历、岗位类别流向图
    dashboardResumeViews: [],
    dashboardPage: {
      offset: 0,
      limit: 12,
      total: 0,
      nextPageToken: -1
    },
    dashboardProcessViews: [],
    dashboardSourceViews: [],
    dashboardFlowViews: [],
    dashboardDetailListStyle: 'showcards',
    dashboardDetailSort: 'deliveryTime',
    dashboardDetailOrder: 'desc',
    // -----end 仪表盘数据-------
    // 列表页操作权限
    authListMenus: {
      // hr、系统管理员
      'hrOrAdmin': {
        'waitScreening': ['recruitListExport', { group: ['recruitListStorageAll'] }],
        'waitTest': ['recruitListExport', 'recruitListImportTestResult', { group: ['recruitListStorageAll'] }],
        'waitInvite': ['recruitListExport', 'recruitListStartInvite', { group: ['recruitListStorageAll'] }],
        'waitInterview': ['recruitListExport', { group: ['recruitListStorageAll'] }],
        'waitOffer': ['recruitListExport', 'recruitListSendOffer', { group: ['recruitListStorageAll'] }],
        'waitSign': ['recruitListExport', { group: ['recruitListStorageAll'] }],
        'inService': [],
        'inStorage': []
      },
      // 面试官
      'interviewer': {
        'waitScreening': ['recruitListExport', { group: ['recruitListStorageAll'] }],
        'waitTest': ['recruitListExport'],
        'waitInvite': ['recruitListExport', 'recruitListStartInvite'],
        'waitInterview': ['recruitListExport', { group: ['recruitListStorageAll'] }],
        'waitOffer': ['recruitListExport'],
        'waitSign': ['recruitListExport'],
        'inService': [],
        'inStorage': []
      }
    }
  }
}
