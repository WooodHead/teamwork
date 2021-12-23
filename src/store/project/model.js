/**
 @Name：项目转换器
 @Author：陆欢
 @date：2020/06/04
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { LocalStorage, date } from 'quasar'
const { formatDate } = date,
  dateFormat = 'YYYY-MM-DD',
  nullDate = '1000-01-01'
function fromOne (model) {
  const ApprovalNotes =
    _.has(model, 'ApprovalNotes')
      ? (_.isObject(model.ApprovalNotes) ? model.ApprovalNotes : JSON.parse(model.ApprovalNotes)) : {}
  let membersAll =
    _.has(model, 'Members')
      ? (_.isObject(model.Members) ? (model.Members && model.Members.all) || [] : (JSON.parse(model.Members) && JSON.parse(model.Members).all) || []) : []
  const front = {
    id: model.ProjectID,
    title: model.ProjName,
    projNum: model.ProjNum,
    projLevel: model.ProjLevel,
    type: model.ProjType,
    status: model.Status,
    organizeID: model.OrganizeID,
    leaderID: model.LeaderID,
    membersObject: _.has(model, 'Members')
      ? (_.isObject(model.Members)
        ? model.Members
        : JSON.parse(model.Members))
      : {},
    members: membersAll || [],
    beginDate: formatDate(model.BeginDate, dateFormat),
    endDate: formatDate(model.EndDate, dateFormat),
    notes: model.Description,
    orderNo: model.OrderNo,
    projClassify: model.ProjClassify,
    declareTime: formatDate(model.DeclareTime, dateFormat),
    predictEndDate: formatDate(model.PredictEndDate, dateFormat),
    widgets: model.Widgets ? JSON.parse(model.Widgets) : {},
    acl: model.Acl,
    relates: model.Relates,
    approvalNotes: {
      startNotes: ApprovalNotes ? ApprovalNotes.StartNotes || '' : '',
      finishNotes: ApprovalNotes ? ApprovalNotes.FinishNotes || '' : ''
    },
    classify: model.Classify || '',
    saled: !!model.Saled,
    isTemplate: !!model.IsTemplate,
    whiteList: formatEndArray(model.WhiteList),
    createByID: model.CreateByID,
    projSource: model.ProjSource ? JSON.parse(model.ProjSource) : {},
    ...(commomFields.from(model))
  }
  front.predictEndDate === nullDate && (front.predictEndDate = '')
  front.beginDate === nullDate && (front.beginDate = '')
  front.endDate === nullDate && (front.endDate = '')
  front.declareTime === nullDate && (front.declareTime = '')
  return front
}
function toOne (model) {
  return {
    ProjectID: model.id,
    ProjName: model.title,
    ProjNum: model.projNum,
    ProjLevel: model.projLevel,
    ProjType: model.type,
    Status: model.status,
    OrganizeID: model.organizeID,
    LeaderID: model.leaderID,
    Members: model.membersObject,
    BeginDate: model.beginDate || nullDate,
    EndDate: model.endDate || nullDate,
    Description: model.notes,
    OrderNo: model.orderNo,
    ProjClassify: model.projClassify,
    DeclareTime: model.declareTime || nullDate,
    PredictEndDate: model.predictEndDate || nullDate,
    Widgets: model.widgets && JSON.stringify(model.widgets),
    Acl: model.acl,
    ApprovalNotes: _.has(model, 'approvalNotes')
      ? {
        StartNotes: model.approvalNotes.startNotes,
        FinishNotes: model.approvalNotes.finishNotes
      }
      : undefined,
    Classify: model.classify,
    Saled: model.saled ? 1 : 0,
    IsTemplate: model.isTemplate ? 1 : 0,
    WhiteList: model.whiteList ? model.whiteList.join(',') : '',
    TemplateID: model.templateID,
    ProjSource: model.projSource && JSON.stringify(model.projSource),
    ...(commomFields.to(model))
  }
}
export default class Project {
  // eslint-disable-next-line space-before-function-paren
  constructor(p) {
    // let addDate = date.addToDate(new Date(), { month: 12 })
    // let initDate = date.formatDate(addDate, 'YYYY/MM/DD').toString()
    const model = {
      title: '',
      notes: '',
      leaderID: LocalStorage.getItem('myself').id,
      organizeID: LocalStorage.getItem('myself').organizeId,
      projLevel: '',
      type: undefined,
      predictEndDate: '',
      widgets: {},
      acl: 1,
      whiteList: [LocalStorage.getItem('myself').id],
      isTemplate: false,
      //   projSource: {}
      projSource: {
        organize: '',
        customer: ''
      }
    }
    Object.assign(this, model, p)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromOne(e))
    } else {
      return fromOne(end)
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
function formatEndArray (array) {
  if (array) {
    let newArray = array.split(',').map(e => +e)
    return Array.from(new Set(newArray))
  } else {
    return []
  }
}
