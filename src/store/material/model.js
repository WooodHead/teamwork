import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
import File from '@/store/file/model'
// 物料库表
const initMat = {
  ID: 0,
  Name: '',
  Graphics: '',
  Code: '',
  DeployCode: '',
  Specification: '',
  SpecModel: '',
  Materials: '',
  Classification: '',
  Color: '',
  Version: 0,
  SysVersion: 0,
  Notes: '',
  CreateTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  CreateBy: '',
  CreateByID: 0,
  ModifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  ModifyBy: '',
  DeleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  DeleteBy: '',
  IsDelete: 0
}
function fromMatOne (end) {
  return {
    ID: end.ID,
    Name: end.Name,
    Graphics: end.Graphics,
    Code: end.Code,
    DeployCode: end.DeployCode,
    Specification: end.Specification,
    SpecModel: end.SpecModel,
    Materials: end.Materials,
    Classification: end.Classification,
    Color: end.Color,
    Version: end.Version,
    SysVersion: end.SysVersion,
    Notes: end.Notes,
    IsDelete: end.IsDelete,
    ...(commomFields.from(end))
  }
}
function toMatOne (front) {
  return {
    ID: front.ID,
    Name: front.Name,
    Graphics: front.Graphics,
    Code: front.Code,
    DeployCode: front.DeployCode,
    Specification: front.Specification,
    SpecModel: front.SpecModel,
    Materials: front.Materials,
    Classification: front.Classification,
    Color: front.Color,
    Version: front.Version,
    SysVersion: front.SysVersion,
    Notes: front.Notes,
    IsDelete: front.IsDelete,
    ...(commomFields.to(front))
  }
}
class Mat {
  constructor (MatMain) {
    Object.assign(this, initMat, MatMain)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
      return fromMatOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else {
      return toMatOne(front)
    }
  }
}
// 物料导入主表
const initMatMain = {
  ID: 0,
  Name: '',
  Code: '',
  DeployCode: '',
  BomType: 1,
  ProductType: '',
  ProductID: 0,
  MaterialID: 0,
  MaterialType: 0,
  PrepareByID: 0,
  PrepareBy: '',
  PrepareTime: '',
  CheckByID: 0,
  CheckBy: '',
  CheckTime: '',
  BuditByID: 0,
  BuditBy: '',
  BuditTime: '',
  ApprovalByID: 0,
  ApprovalBy: '',
  ApprovalTime: '',
  FileName: '',
  AutoFileName: '',
  Version: 0.0,
  Mark: '',
  PlacesNo: '',
  ChangeFileNo: '',
  CreateTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  CreateBy: '',
  CreateByID: 0,
  ModifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  ModifyBy: '',
  DeleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  DeleteBy: '',
  IsDelete: 0,
  FileInfo: new File()
}
function fromMatMainOne (end) {
  return {
    ID: end.ID,
    BomType: end.BomType,
    ProductType: end.ProductType,
    ProductID: end.ProductID,
    MaterialID: end.MaterialID,
    MaterialType: end.MaterialType,
    PrepareByID: end.PrepareByID,
    PrepareBy: end.PrepareBy,
    PrepareTime: end.PrepareTime,
    CheckByID: end.CheckByID,
    CheckBy: end.CheckBy,
    CheckTime: end.CheckTime,
    BuditByID: end.BuditByID,
    BuditBy: end.BuditBy,
    BuditTime: end.BuditTime,
    ApprovalByID: end.ApprovalByID,
    ApprovalBy: end.ApprovalBy,
    ApprovalTime: end.ApprovalTime,
    FileName: end.FileName,
    AutoFileName: end.AutoFileName,
    Version: end.Version,
    Mark: end.Mark,
    PlacesNo: end.PlacesNo,
    ChangeFileNo: end.ChangeFileNo,
    CreateByID: end.CreateByID,
    IsDelete: end.IsDelete,
    ...(commomFields.from(end))
  }
}
function toMatMainOne (front) {
  return {
    ID: front.ID,
    BomType: front.BomType,
    ProductType: front.ProductType,
    ProductID: front.ProductID,
    MaterialID: front.MaterialID,
    MaterialType: front.MaterialType,
    PrepareByID: front.PrepareByID,
    PrepareBy: front.PrepareBy,
    PrepareTime: front.PrepareTime,
    CheckByID: front.CheckByID,
    CheckBy: front.CheckBy,
    CheckTime: front.CheckTime,
    BuditByID: front.BuditByID,
    BuditBy: front.BuditBy,
    BuditTime: front.BuditTime,
    ApprovalByID: front.ApprovalByID,
    ApprovalBy: front.ApprovalBy,
    ApprovalTime: front.ApprovalTime,
    FileName: front.FileName,
    AutoFileName: front.AutoFileName,
    Version: front.Version,
    Mark: front.Mark,
    PlacesNo: front.PlacesNo,
    ChangeFileNo: front.ChangeFileNo,
    CreateByID: front.CreateByID,
    IsDelete: front.IsDelete,
    FileInfo: JSON.stringify(front.FileInfo),
    ...(commomFields.to(front))
  }
}
class MatMain {
  constructor (MatMain) {
    Object.assign(this, initMatMain, MatMain)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
      return fromMatMainOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else {
      return toMatMainOne(front)
    }
  }
}
// 导入子表
const initMatDetails = {
  ID: 0,
  BomID: 0,
  MaterialID: 0,
  OrderNo: 0,
  Amount: 0.0,
  Name: '',
  Code: '',
  Graphics: '',
  Version: 0.0,
  Notes: '',
  Materials: '',
  CreateTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  CreateBy: '',
  CreateByID: 0,
  ModifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  ModifyBy: '',
  DeleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  DeleteBy: '',
  IsDelete: 0
}
function fromMatDetailsOne (end) {
  return {
    ID: end.ID,
    BomID: end.BomID,
    MaterialID: end.MaterialID,
    OrderNo: end.OrderNo,
    Amount: end.Amount,
    Name: end.Name,
    Graphics: end.Graphics,
    Code: end.Code,
    Version: end.Version,
    Materials: end.Materials,
    Notes: end.Notes,
    IsDelete: end.IsDelete,
    ...(commomFields.from(end))
  }
}
function toMatDetailsOne (front) {
  return {
    ID: front.ID,
    BomID: front.BomID,
    MaterialID: front.MaterialID,
    OrderNo: front.OrderNo,
    Amount: front.Amount,
    Name: front.Name,
    Graphics: front.Graphics,
    Code: front.Code,
    Version: front.Version,
    Materials: front.Materials,
    Notes: front.Notes,
    IsDelete: front.IsDelete,
    CreateByID: front.CreateByID,
    ...(commomFields.to(front))
  }
}
class MatDetails {
  constructor (MatDetails) {
    Object.assign(this, initMatDetails, MatDetails)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
      return fromMatDetailsOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toOne(f))
    } else {
      return toMatDetailsOne(front)
    }
  }
}
export default { Mat, MatMain, MatDetails }
