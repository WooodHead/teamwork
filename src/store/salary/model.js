/**
 @Name：工资条转换器
 @Author：郭小乔
 @date：2020/04/23
 @Copyright：西安精雕软件科技有限公司
 */
const init = {
  id: 0,
  name: '',
  recordNum: '',
  organizeName: '',
  salaryYear: 2000,
  salaryMonth: 0,
  type: '',
  adminSalary: {},
  staffSalary: {},
  isRead: false
}
const toggle = {
  id: 'Id',
  name: 'PsonName',
  recordNum: 'RecordNum',
  organizeName: 'OrganizeName',
  salaryYear: 'SalaryYear',
  salaryMonth: 'SalaryMonth',
  type: 'Type',
  value: 'Value',
  isRead: 'IsRead',
  createByID: 'CreateByID',
  sendStatus: 'SendStatus',
  createBy: 'CreateBy',
  createTime: 'CreateTime',
  psonID: 'PsonID'
}
function fromOne (end, fromPick) {
  let fromModel = {
    id: end.Id,
    psonID: end.PsonID,
    name: end.PsonName,
    recordNum: end.RecordNum,
    organizeName: end.OrganizeName,
    salaryYear: +end.SalaryYear,
    salaryMonth: +end.SalaryMonth,
    type: end.Type,
    value: end.Value ? JSON.parse(end.Value) : {},
    isRead: end.IsRead,
    createByID: end.CreateByID,
    sendStatus: end.SendStatus
  }
  return _.pick(fromModel, _.values(fromPick))
}
function toOne (front) {
  return {
    Id: front.id,
    PsonID: front.psonID,
    PsonName: front.name,
    RecordNum: front.recordNum,
    OrganizeName: front.organizeName,
    SalaryYear: front.salaryYear,
    SalaryMonth: front.salaryMonth,
    Type: front.type,
    AdminSalary: JSON.stringify(front.value),
    StaffSalary: JSON.stringify(front.value),
    IsRead: front.isRead,
    CreateByID: front.createByID,
    SendStatus: front.sendStatus
  }
}

export default class Salary {
  // eslint-disable-next-line space-before-function-paren
  constructor(Salary) {
    Object.assign(this, init, Salary)
  }
  static from (end) {
    if (_.isArray(end)) {
      const arr = end[0]
      const fromFilds = _.invert(toggle)
      const keys = Object.keys(arr)
      const fromPick = _.pick(fromFilds, keys)
      return _.map(end, e => fromOne(e, fromPick))
    } else {
      const fromFilds = _.invert(toggle)
      const keys = Object.keys(end)
      const fromPick = _.pick(fromFilds, keys)
      return fromOne(end, fromPick)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else {
      return toOne(front)
    }
  }
}
