import { defaultsDeep } from 'lodash'
import copywriting from './copywriting/copywriting.js'
const person = {
  module: '人员管理',
  title: '人员',
  notes: '这是你的个人空间，由你自己做主',
  leaveOffice: '离职',
  onJob: '在职',
  leaveOfficeOrOnJob: '离职/在职',
  confirmDelete: '确定要删除该联系人吗?',
  deleteSuccess: '删除成功',
  SearchForNamesPositionsDepartmentsEtc: '人名、职位、机构等搜索...',
  error: {
    thePsonAlreadyExists: '姓名已被注册',
    theMobilePhoneAlreadyExists: '手机号已被注册',
    theEmailAlreadyExists: '邮箱已被注册',
    theRecordNumAlreadyExists: '工号已被注册'
  }
}

export default defaultsDeep(copywriting.person, person)
