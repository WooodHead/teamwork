export default {
  module: '商机管理',
  title: '商机',
  notes: '暂无相关商机',
  field: {
    placeholder: {
      title: '请填写商机标题'
    }
  },
  add: '新建商机',
  addAssess: '新建评估',
  update: '编辑商机',
  organizeName: '请输入组织名称',
  customer: '客户',
  customerName: '客户名称',
  expectedDeliveryDate: '期望交期',
  delivery: '交期',
  applyIndustry: '行业',
  url: '请输入网址',
  address: '请输入详细地址',
  postcode: '请输入邮编',
  moreInfoNotes: '补充更多信息',
  infoSource: '来源',
  classification: '商机类型',
  processType: '加工类型',
  hiddenInfo: '隐藏',
  phase: '阶段',
  leaderID: '负责人',
  formCerifyRule: {
    selectCustomer: '请选择客户',
    leaderID: '请选择商机负责人'
  },
  pleaseGiveCloseLostNotes: '请填写输单原因',
  approval: '报价',
  quotationBills: '报价单',
  // 报价
  quotation: {
    approval: '报价申请',
    uploadPartsPic: '上传加工件图片',
    uploadQuotationBills: '请上传您的商务报价单',
    totalAmount: '报价总金额',
    inputAmountErrorNotes: '报价金额必须大于0',
    approvaNotes: '报价申请说明',

    pass: '审批通过',
    reject: '审批驳回',
    showWorkFlow: '查看工作流',
    approvalSuccess: '审批成功',
    applySuccess: '报价申请成功',
    applyFail: '报价申请失败',
    approvalFail: '审批失败',
    submitTitle: '是否提交申请'
  },
  messageTitle: {
    closedWon: '商机赢单',
    closeLost: '商机输单',
    active: '商机激活'
  },
  member: '成员',
  suspended: '挂起',
  activate: '激活',
  assessQuotationBill: '评估报价单',
  status: {
    assess: '评估',
    quotation: '报价',
    negotiation: '客户谈判',
    order: '下单',
    close: '关闭'
  },
  requirement: '客户要求',
  titlePlaceholder: '请输入商机名称',
  action: {
    showcards: '展示项目卡片',
    showlist: '展示项目列表'
  },
  header: {
    myOpportunity: '我的商机',
    allOpportunity: '所有商机'
  },
  error: {
    exist: '该商机已存在，请修改商机名称'
  },
  model: {
    Title: '商机名称',
    CustomerName: '客户',
    ProcessType: '加工类型',
    TransactionPrice: '成交价',
    Status: '状态',
    ExpectedDeliveryDate: '期望交付日期',
    LeaderID: '客户经理'
  }
}
