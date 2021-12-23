
import { defaultsDeep } from 'lodash'
import { logo } from './app'
import copywriting from './copywriting/copywriting.js'
const config = require('app/app.config.js')
const jobNumber = '工号'
const auth = {
  login: '登录',
  register: '注册',
  logout: '退出',
  useVerificationCode: '用短信验证码',
  usePassword: '用密码',
  havingTrouble: '遇到麻烦',
  forgotPassword: '忘记密码？',
  resetPassword: '重置密码',
  getVerificationCode: '获取验证码',
  gettingVerificationCode: '{second} 秒后重获',
  createAccount: '创建账户',
  contactInformation: '联系方式',
  moreInfomation: '更多信息',
  emailMeResetInstructions: '发送重置密码邮件',
  enterYourEmailAddress: '请输入您在系统中记录的电子邮件',
  ifYouDontSeeYourResetEmail: '如果您没有收到重置密码的邮件，',
  beSureToCheckYourSpamFilter: '请检查垃圾邮件过滤器是否有来自 {email} 的电子邮件。',
  signInAgain: '去登录',
  dontSignInYet: '先不登录',
  fields: {
    userName: '用户名',
    password: '密码',
    email: '邮箱',
    telephone: '手机号',
    verificationCode: '验证码',
    jobNumber,
    organize: '机构',
    duty: '职位'
  },
  hint: {
    userName: '请填写真实姓名，以便管理员进行核对',
    email: `请输入${(config.extranet ? 'jingdiao.com或个人' : 'jingdiao.local')}邮箱，邮箱用于找回密码，订阅系统消息等`,
    telephone: '手机号将用于接收验证码，系统重要通知等',
    jobNumber: `${jobNumber}是你的唯一识别码，请正确填写`,
    organize: '推荐填写工牌上的机构或分支机构名称',
    duty: '推荐填写工牌上的职位'
  },
  banner: {
    login: `欢迎登录 ${logo}`,
    register: `欢迎注册 ${logo}`,
    forgotPassword: `通过邮件重置 ${logo} 密码`
  },
  resetYourPassword: '重置您的密码',
  enterANewPassword: '输入新的密码',
  confirmYourPassword: '确认您的密码',
  atLeastEightCharactersWithAlphabetCharacterNumber: '请输入至少6个字符，可包含字母和数字。',
  yourPasswordMustBeAtLeastEightCharactersLong: '您的密码至少需要6个字符。',
  youNeedToChooseAPassword: '稍等-您需要输入一个密码！',
  thisDoesntMatchYourPassword: '这与您的密码不匹配。注意，密码区分大小写。',
  saveMyPassword: '保存密码',
  hiThere: '{name} 你好',
  cantRememberYourPassword: '忘记密码了吗？不用担心，点击下面的按钮，然后按照说明设置一个新的。',
  setANewPasswordNow: '设置一个新密码',
  theValidityTimeIs15Minutes: '邮件有效期为15分钟，请尽快设置，有何疑问，',
  contactoOurSupportTeam: '联系我们的支持团队',
  wellGetBackToYou: '我们会尽快回复。',
  error: {
    TokenHasExpired: '登录状态已过期，是否重新登录？',
    theUserNameAlreadyExists: '用户名已被注册',
    theTelephoneAlreadyExists: '该手机号已被注册',
    theEmailAlreadyExists: '该邮箱已被注册',
    weCouldntFindThatOne: '没有找到该用户',
    weDidntRecognizeThatPassword: '密码错误，请重新填写',
    verificationCodeError: '验证码错误，稍后可重新获取',
    verificationCodeExpired: '验证码已过期，请重新获取',
    thatUserIsNotActivated: '该用户未被激活，可联系管理员激活账户。',
    theMobilePhoneNumberOfTheCurrentUserWasNotFound: '未查到当前用户手机号',
    wedidntRecognizeThatEmailaddress: '抱歉，我们无法识别该电子邮件地址，换一个邮箱试试。',
    YouHaveNotYetJoinedEnterpriseWeChat: '您尚未加入企业微信',
    FailedToObtainEnterpriseWeChatInformation: '获取企业微信信息失败',
    YourEnterpriseWeChatIsNotYetAssociatedWithTheSystem: '您的企业微信尚未与系统关联',
    YouHaveResignedGoodLuckToSeeYouAgain: '您已离职，有缘再会'
  },
  success: {
    registerSuccessfully: '你的注册信息已发给管理员审核，审核通过后，系统会给你发送邮件，请注意查收。',
    sentSuccessfully: '已发送，请注意查收',
    resetPasswordSuccessfully: '密码重置成功，请登录'
  },
  acl: {
    acl: '访问权限',
    public: '公开：所有人都可访问',
    restrict: '限制：本机构及上级机构的人员可访问',
    secret: '保密：仅{category}内人员可访问',
    templateSecret: '保密：仅白名单内人员可访问',
    secretSelectPson: '保密：设置保密白名单'
  },
  YouCan: '您可以',
  TryRecontactingYourSystemAdministrator: '与系统管理员联系',
  TryAgain: '重新尝试',
  or: '或',
  NormalLogin: '普通登录',
  support: '问题反馈',
  email: '您的邮箱',
  type: '问题类型',
  content: '问题内容',
  file: '附件',
  questionRegister: '注册失败',
  questionLogin: '登录失败',
  questionEmail: '无法收到邮件',
  questionRequire: '新的功能需求',
  quetionOther: '其他',
  myProfile: '我的资料',
  myNotificationSettings: '通知设置'
}

export default defaultsDeep(copywriting.auth, auth)
