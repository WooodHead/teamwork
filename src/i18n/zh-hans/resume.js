export default {
  module: '简历筛选',
  title: '简历',
  basic: {
    info: '基本信息',
    education: '教育经历',
    language: '语言情况',
    workExperience: '工作/实践经历',
    project: '项目情况',
    certificate: '证书情况',
    entertainment: '文娱情况',
    displaywork: '作品展示'
  },
  HighestCollege: '最高学历院校',
  City: '应聘地点',
  // jd_resume 的字段及翻译
  model: {
    ResumeDeliveryID: '简历ID（必选字段）',
    Name: '姓名',
    Photo: '个人照片',
    Sex: '性别',
    Birthday: '生日',
    Country: '国籍',
    Nation: '民族',
    Nativeplace: '户籍',
    Email: '邮箱',
    Tel: '电话号码',
    IdentityNumber: '身份证号码',
    Politics: '政治面貌',
    HighestEducation: '最高学历',
    MailingAddress: '通讯地址',
    ExpectedWorkPlace: '期望工作地',
    WorkingYears: '工作年限',
    PresentAddress: '居住地',
    MaritalStatus: '婚姻状况',
    PostTime: '到岗时间',
    ExpectedSalary: '期望月薪',
    Skills: '专业技能',
    Educations: '教育经历',
    Languages: '语言情况',
    Entertainments: '文娱情况',
    Projects: '项目经历',
    WorkExperiences: '工作经历',
    Certificates: '证书情况',
    Hobbies: '特长爱好',
    SelfEvaluation: '自我评价',
    Honors: '个人荣誉',
    PersonalWorks: '个人作品',
    // jd_resume_delivery
    JobTitle: '投递岗位',
    City: '投递城市',
    // vi_resume
    Interviewee: '姓名',
    // json数据
    EducationsCollege: '毕业院校',
    EducationsMajor: '专业',
    LanguagesLevel: '语言情况',
    InterviewCount: '面试轮次',
    InterviewTime: '面试时间',
    InterviewPlace: '面试地点',
    InterviewExtra: '面试要求',
    InterviewType: '面试类型',
    Status: '测评结果'
  },
  education: {
    major: '专业',
    degree: '学位',
    college: '毕业院校',
    startAndEndTime: '起止日期',
    startTime: '开始时间',
    endTime: '结束时间',
    upToNow: '至今',
    province: '省份',
    background: '学历',
    department: '院系',
    collegeStyle: '学校类别',
    admissionsCategory: '招生类别',
    degreeCategory: '学位类别',
    paperTitle: '最高学历论文'
  },
  language: {
    kind: '语种',
    level: '读写能力',
    listen: '听说能力',
    certificate: '获得证书',
    score: '成绩'
  },
  workExperience: {
    startTime: '开始时间',
    endTime: '结束时间',
    company: '就职公司',
    position: '职位',
    content: '工作内容',
    industry: '所属行业'
  },
  project: {
    startTime: '开始时间',
    endTime: '结束时间',
    name: '项目名称',
    source: '项目来源',
    personNumber: '项目人数',
    introduction: '项目简介',
    role: '项目角色',
    duty: '职责和业绩'
  },
  certificate: {
    name: '证书名称',
    startTime: '获得时间'
  },
  entertainment: {
    name: '活动名称',
    startTime: '活动时间',
    description: '活动描述'
  },
  status: {
    unActivated: '未激活',
    waitScreening: '待筛选',
    waitTest: '待测评',
    waitInviteFirstInterview: '待综合面试邀约',
    waitFirstInterview: '待面试',
    inFirstInterview: '面试中',
    waitOffer: '待发offer',
    waitSign: '待签约',
    inService: '已入职',
    // 页面特有
    waitInvite: '待邀约',
    waitInterview: '待面试',
    inStorage: '已入库'
  },
  actions: {
    notMatch: '淘汰/推荐',
    notMatchAll: '全部淘汰入库',
    next: '下一份',
    prev: '上一份',
    nextStep: {
      waitScreening: '通过筛选',
      waitTest: '转为测评中',
      inTest: '测评通过',
      waitInvite: '发起邀约',
      waitInterview: '通过',
      waitOffer: '发放offer',
      waitSign: '已入职',
      inStorage: '',
      inService: ''
    },
    stepper: {
      import: '导入结果',
      check: '核对上传'
    },
    addInterviewRecord: '添加记录',
    recommend: '通过筛选',
    exportResumeInfo: '导出信息',
    testPass: '测评通过',
    selectInvite: '选择邀约',
    batchInvite: '批量邀约',
    selectOffer: '选择发送offer',
    batchOffer: '批量发放offer',
    signSucceed: '可使用其招聘网站账户和简历信息创建TeamWork账户，是否创建？',
    inStorageConfirm: '确认淘汰该应聘者吗？',
    inStorageDetail: '淘汰后将进入人才库',
    ChooseInterviewer: '请选择面试官',
    nextInterview: '转为待邀约'

  },
  stepLabel: {
    nextStep: '确认并上传',
    back: '返回上一步'
  },
  selectCity: '请选择应聘城市',
  actionSucceed: '操作成功！',
  actionFail: '操作失败，可重新尝试！',
  historys: {
    'StorageResume': '淘汰入库了 {name}',
    'StorageResumeByPlan': '关闭了招聘计划：',
    'PassFilter': '通过了 {name} 的筛选',
    'PassTest': '通过了 {name} 的测评',
    'SendInterviewInvite': '向 {name} 发起了面试邀约',
    'AddInterviewRecord': '添加了 {name} 的面试记录',
    'PassInterview': '通过了 {name} 的面试',
    'SendOffer': '给 {name} 发放了offer ',
    'Sign': '签约了 {name}',
    'NextInterview': '将 {name} 转为了待邀约',
    'PushResume': ' 将 {name} 推荐给了 {InterviewerName}',
    'AddResumeDelivery': ' 将 {name} 复活了',
    'UpdateInterviewInvite': '修改了 {name} 的邀约记录',
    'Testing': '将 {name} 转为测评中'
  }
}
