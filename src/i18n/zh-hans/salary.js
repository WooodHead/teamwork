export default {
  module: '工资条管理',
  title: '工资条',
  add: '下发工资',
  view: {
    verifyTips: '请输入动态码进行验证',
    sendDateTips: '{sendDate}{type}'
  },
  adminSecurityCodeRules: '验证码不能为空',
  adminSecurityCodeRemind: '请输入{salaryYear}年{salaryMonth}月{type}验证码',
  filterOptions: {
    all: '全部',
    isRead: '已读',
    unRead: '未读',
    error: '发送异常',
    unSend: '未发送',
    newData: '新数据',
    mismatch: '未绑定'
  },
  salaryType: {
    salary: '薪资',
    reward: '奖金',
    subsidy: '补贴',
    reimburse: '报销',
    resalary: '薪资补发'
  },
  viewDetail: '查看详情',
  send: '发送',
  resend: '重发',
  recall: '撤回',
  salaryStep: {
    uploadSalary: '上传工资表',
    checkData: '核对数据',
    previewAndSend: '预览并发送'
  },
  stepLabel: {
    uploadExcel: '上传工资表',
    nextStep: '下一步',
    back: '返回上一步'
  },
  salaryTypeSelect: '发薪类型',
  salaryCode: '验证码',
  salaryTimeSelect: '发薪时间',
  pleaseUploadRightTemplate: '请上传正确的Excel模板数据！',
  colunmConnotLess: '工资条模板中必须包含【{columns}】列，请确认无误后重新上传！',
  alreySend: '{salaryYear}年{salaryMonth}月类型为{type}的电子工资条已经发放',
  sendNow: '立即发送',
  sendnowTip: '注：默认使用微信接收，员工需关注“TeamWork”企业号，否则将无法接收到工资条相关信息。',
  previewTip: '员工 <span class="text-green">{name}</span> 将看到以上内容',
  listTip: '共 <span class="text-green">{length}</span> 条，已过滤掉工号缺失数据',
  applyTip: '注：申请时请保证TeamWork已绑定微信，否则将无法收到验证码',
  finishApplyTip: '已申请{year}年{month}月的{type}<br />请留意TeamWork企业号相关消息',
  none: '暂无数据',
  codeErr: '验证码错误',
  codeDeleteErr: '该链接已失效',
  inputCode: '请输入动态码',
  applyBtnLabel: '申请当前工资条动态码',
  downloadTemplate: '下载【{type}】工资条模板',
  dataCannotEmpty: '可下发数据为空不能下发',
  deleteDesc: '如验证码正确，则删除{year}年{month}月{type}下所有员工的工资条且不可恢复，届时员工将无法查看，确认删除？',
  deleteSuccess: '删除成功',
  deleteErr: '删除失败',
  uploadTips: '注意事项：<br />一、某年某月某类型的工资条原则上只能发送一次，所以请保证数据的完整性。<br />      如需重新发送，请选择以下渠道：<br />      1. 在工资条管理页面删除该年该月该类型的全部工资条，然后重新下发工资；<br />      2. 更换发送人，重新下发工资。<br />二、工资条模板支持多sheet页上传。',
  codeError: '验证码错误，请重新输入'

}
