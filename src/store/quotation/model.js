/**
 @Name：商机报价转换器
 @Author：李建国
 @date：2021/02/01
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage } from 'quasar'
const init = {
  id: 0,
  opportunityID: 0, // 商机ID
  title: '', // 商机名称
  customerID: 0, // 客户ID
  customerName: '', // 客户名称
  processTypeName: '', // 加工类别名称
  quotationNo: '', // 报价编号
  organizeID: 0, // 报价机构ID
  organizeName: '', // 报价机构
  orgShortName: '', // 报价机构简称
  quoterID: 0, // 报价人ID
  quoter: '', // 报价人
  filePath: '', // 文件路径
  size: 0, // 文件大小
  extension: '', // 文件后缀
  downLoads: 0, // 文件下载次数
  downLoadIDs: [], // 文件下载者列表
  previewIDs: [], // 文件预览者列表
  amount: 0, // 报价总金额
  notes: '' // 报价说明
}
function fromOne (end) {
  return {
    id: end.Id,
    opportunityID: end.OpportunityID,
    quotationNo: end.QuotationNo,
    title: end.Title,
    customerID: end.CustomerID,
    customerName: end.CustomerName,
    processTypeName: end.ProcessTypeName,
    organizeID: end.OrganizeID,
    organizeName: end.OrganizeName,
    orgShortName: end.OrgShortName,
    quoterID: end.QuoterID,
    quoter: end.Quoter,
    filePath: end.FilePath,
    size: end.Size,
    extension: end.Extension,
    downLoads: end.DownLoads,
    previewIDs: end.PreviewIDs,
    amount: end.Amount,
    notes: end.Notes,
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    Id: front.id,
    OpportunityID: front.opportunityID,
    QuotationNo: front.quotationNo,
    Title: front.title,
    CustomerID: front.customerID,
    CustomerName: front.CcustomerName,
    ProcessTypeName: front.processTypeName,
    OrganizeID: front.organizeID,
    OrganizeName: front.organizeName,
    OrgShortName: front.orgShortName,
    QuoterID: front.quoterID,
    Quoter: front.quoter,
    FilePath: front.filePath,
    Size: front.size,
    Extension: front.extension,
    DownLoads: front.downLoads,
    PreviewIDs: front.previewIDs,
    Amount: front.amount,
    Notes: front.notes,
    ...(commomFields.to(front))
  }
}
export default class Quotation {
  constructor (quotation) {
    init.organizeID = LocalStorage.getItem('myself').organizeId
    Object.assign(this, init, quotation)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else if (end) {
      return fromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else if (front) {
      return toOne(front)
    }
  }
}
