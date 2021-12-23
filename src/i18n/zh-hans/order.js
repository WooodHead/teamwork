export default {
  module: '订单管理',
  title: '订单',
  notes: '在这里管理所有订单',
  field: {
    label: {
      opportunityID: '选择商机',
      notes: '订单描述'
    }
  },
  add: '新建订单',
  customer: '对接客户',
  leader: '客户经理',
  classification: '业务类型',
  expectedDeliveryDate: '预计交期',
  amount: '订单金额',
  status: '订单状态',
  organize: '所属机构',
  addProDemand: '下发生产需求',
  moreInfoNotes: '补充更多信息',
  noOrders: '暂无相关订单',
  messageTitle: '{name}更新了订单[{title}]的状态为{status}',
  formCerifyRule: {
    title: '请选择商机',
    leader: '请选择客户经理',
    customer: '请选择客户',
    classification: '请选择订单类型',
    organize: '请选择所属机构',
    amount: '请输入客户预算',
    expectedDeliveryDate: '请选择预计交期'
  },
  header: {
    myOrder: '我的订单',
    allOrder: '所有订单'
  },
  error: {
    exist: '该订单已存在'
  },
  model: {
    OrderNo: '订单编号',
    OpportunityName: '商机',
    CustomerName: '客户名称',
    ExpectedDeliveryDate: '预计交期',
    Status: '订单状态',
    LeaderID: '客户经理'
  }
}
