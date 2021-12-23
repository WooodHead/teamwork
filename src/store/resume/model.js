import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date

/** ------------------------- Resume ------------------------- */
const initResume = {
  id: 0,
  name: '', // 姓名
  photo: '', // 个人照片
  sex: '', // 性别
  birthday: formatDate(new Date(), 'YYYY-MM-DD HH:mm'), // 生日
  country: '', // 国籍
  nation: '', // 民族
  nativeplace: '', // 户籍所在地
  email: '', // 邮箱
  tel: '', // 电话号码
  identityNumber: '', // 身份证号码
  politics: '', // 政治面貌
  highestEducation: '', // 最高学历
  mailingAddress: '', // 通讯地址
  expectedWorkPlace: '', // 期望工作地
  workingYears: '', // 工作年限
  presentAddress: '', // 居住地
  maritalStatus: '', // 婚姻状况
  postTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'), // 到岗时间
  expectedSalary: '', // 期望月薪
  skills: '', // 专业技能
  educations: [], // 教育经历
  languages: [], // 语言情况
  entertainments: [], // 文娱情况
  projects: [], // 项目经历
  workExperiences: [], // 工作经历
  certificates: [], // 证书情况
  hobbies: '', // 特长爱好
  selfEvaluation: '', // 自我评价
  honors: '', // 个人荣誉
  personalWorks: '', // 个人作品
  createTime: '', // 创建时间
  createBy: '', // 创建人员
  createByID: '', // 创建人ID
  modifyTime: '', // 最近修改时间
  modifyBy: '', // 最近更新人员
  history: [], // 历史记录
  // 页面需要的字段
  status: 0, // 招聘状态
  jobID: 1,
  jobTitle: ''// 岗位名称
}
function fromResume (end) {
  let educations = end.Educations.length ? Education.from(_.isObject(end.Educations) ? end.Educations : JSON.parse(end.Educations)) : []
  let languages = end.Languages.length ? Language.from(_.isObject(end.Languages) ? end.Languages : JSON.parse(end.Languages)) : []
  let entertainments = end.Entertainments.length ? Entertainment.from(_.isObject(end.Entertainments) ? end.Entertainments : JSON.parse(end.Entertainments)) : []
  let projects = end.Projects.length ? Project.from(_.isObject(end.Projects) ? end.Projects : JSON.parse(end.Projects)) : []
  let workExperiences = end.WorkExperiences.length ? WorkExperience.from(_.isObject(end.WorkExperiences) ? end.WorkExperiences : JSON.parse(end.WorkExperiences)) : []
  let certificates = end.Certificates.length ? Certificate.from(_.isObject(end.Certificates) ? end.Certificates : JSON.parse(end.Certificates)) : []
  return {
    id: end.ID,
    name: end.Name,
    photo: end.Photo,
    sex: end.Sex,
    birthday: end.Birthday,
    country: end.Country,
    nation: end.Nation,
    nativeplace: end.Nativeplace,
    email: end.Email,
    tel: end.Tel,
    identityNumber: end.IdentityNumber,
    politics: end.Politics,
    highestEducation: end.HighestEducation,
    mailingAddress: end.MailingAddress,
    expectedWorkPlace: end.ExpectedWorkPlace,
    workingYears: end.WorkingYears,
    presentAddress: end.PresentAddress,
    maritalStatus: end.MaritalStatus,
    postTime: end.PostTime,
    expectedSalary: end.ExpectedSalary,
    skills: end.Skills,
    educations: educations,
    languages: languages,
    entertainments: entertainments,
    projects: projects,
    workExperiences: workExperiences,
    certificates: certificates,
    hobbies: end.Hobbies,
    selfEvaluation: end.SelfEvaluation,
    honors: end.Honors,
    personalWorks: end.PersonalWorks,
    createByID: end.CreateByID,
    ...(commomFields.from(end)),
    history: end.History.length ? JSON.parse(end.History) : [],
    // 页面需要的字段
    status: end.Status,
    jobID: end.JobID,
    jobTitle: end.JobTitle
  }
}

function toResume (front) {
  return {
    ID: front.id,
    Name: front.name,
    Photo: front.photo,
    Sex: front.sex,
    Birthday: front.birthday,
    Country: front.country,
    Nation: front.nation,
    Nativeplace: front.nativeplace,
    Email: front.email,
    Tel: front.tel,
    IdentityNumber: front.identityNumber,
    Politics: front.politics,
    HighestEducation: front.highestEducation,
    MailingAddress: front.mailingAddress,
    ExpectedWorkPlace: front.expectedWorkPlace,
    WorkingYears: front.workingYears,
    PresentAddress: front.presentAddress,
    MaritalStatus: front.maritalStatus,
    PostTime: front.postTime,
    ExpectedSalary: front.expectedSalary,
    Skills: front.skills,
    Educations: front.educations,
    Languages: front.languages,
    Entertainments: front.entertainments,
    Projects: front.projects,
    WorkExperiences: front.workExperiences,
    Certificates: front.certificates,
    Hobbies: front.hobbies,
    SelfEvaluation: front.selfEvaluation,
    Honors: front.honors,
    PersonalWorks: front.personalWorks,
    CreateByID: front.createByID,
    ...(commomFields.from(front)),
    History: front.history,
    // 页面需要的字段
    Status: front.status,
    JobID: front.jobID,
    JobTitle: front.jobTitle
  }
}
/**
 * 简历对象
 */
class Resume {
  constructor (resume) {
    Object.assign(this, initResume, resume)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromResume(e))
    } else {
      return fromResume(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toResume(f))
    } else {
      return toResume(front)
    }
  }
}
/** ------------------------- ResumeView ------------------------- */
const initResumeView = {
  resumeDeliveryID: 0,
  resumeID: 0,
  planID: 0,
  jobID: 0,
  interviewee: '',
  tel: '',
  email: '',
  interviewerID: 0,
  city: '',
  pushCode: '',
  deliveryTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  status: 0,
  interviewCount: 0,
  isPush: 0,
  historyInterviewers: '',
  interviewTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  interviewPlace: '',
  interviewExtra: '',
  retult: 0,
  refused: 0,
  inStorage: 0,
  history: '',
  modifyTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  photo: '',
  sex: '',
  highestEducation: '',
  workingYears: '',
  postTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  expectedSalary: '',
  skills: '',
  educations: '',
  languages: '',
  entertainments: '',
  projects: '',
  workExperiences: '',
  jobTitle: ''
}
function fromResumeView (end) {
  let educations = _.isEmpty(end.Educations) ? [] : Education.from(_.isObject(end.Educations) ? end.Educations : JSON.parse(end.Educations))
  let languages = _.isEmpty(end.Languages) ? [] : Language.from(_.isObject(end.Languages) ? end.Languages : JSON.parse(end.Languages))
  let entertainments = _.isEmpty(end.Entertainments) ? [] : Entertainment.from(_.isObject(end.Entertainments) ? end.Entertainments : JSON.parse(end.Entertainments))
  let projects = _.isEmpty(end.Projects) ? [] : Project.from(_.isObject(end.Projects) ? end.Projects : JSON.parse(end.Projects))
  let workExperiences = _.isEmpty(end.WorkExperiences) ? [] : WorkExperience.from(_.isObject(end.WorkExperiences) ? end.WorkExperiences : JSON.parse(end.WorkExperiences))
  return {
    resumeDeliveryID: end.ResumeDeliveryID,
    resumeID: end.ResumeID,
    planID: end.PlanID,
    jobID: end.JobID,
    interviewee: end.Interviewee,
    tel: end.Tel,
    email: end.Email,
    interviewerID: end.InterviewerID,
    city: end.City,
    pushCode: end.PushCode,
    deliveryTime: end.DeliveryTime,
    status: end.Status,
    isPush: end.IsPush,
    interviewCount: end.InterviewCount,
    historyInterviewers: end.HistoryInterviewers,
    interviewTime: end.InterviewTime,
    interviewPlace: end.InterviewPlace,
    interviewExtra: end.InterviewExtra,
    interviewType: end.InterviewType,
    result: +end.Result,
    refused: end.Refused,
    inStorage: end.InStorage,
    history: end.History,
    modifyTime: end.ModifyTime,
    photo: end.Photo,
    sex: end.Sex,
    highestEducation: end.HighestEducation,
    workingYears: end.WorkingYears,
    postTime: end.PostTime,
    expectedSalary: end.ExpectedSalary,
    skills: end.Skills,
    educations: educations,
    languages: languages,
    entertainments: entertainments,
    projects: projects,
    workExperiences: workExperiences,
    jobTitle: end.JobTitle
  }
}

function toResumeView (front) {
  return {
    ResumeDeliveryID: front.resumeDeliveryID,
    ResumeID: front.resumeID,
    PlanID: front.planID,
    JobID: front.jobID,
    Interviewee: front.interviewee,
    Tel: front.tel,
    Email: front.email,
    InterviewerID: front.interviewerID,
    City: front.city,
    PushCode: front.pushCode,
    DeliveryTime: front.deliveryTime,
    Status: front.status,
    IsPush: front.isPush,
    InterviewCount: front.interviewCount,
    HistoryInterviewers: front.historyInterviewers,
    InterviewTime: front.interviewTime,
    InterviewPlace: front.interviewPlace,
    InterviewType: front.interviewType,
    InterviewExtra: front.interviewExtra,
    Result: front.result,
    Refused: front.refused,
    InStorage: front.inStorage,
    History: front.history,
    ModifyTime: front.modifyTime,
    Photo: front.photo,
    Sex: front.sex,
    HighestEducation: front.highestEducation,
    WorkingYears: front.workingYears,
    PostTime: front.postTime,
    ExpectedSalary: front.expectedSalary,
    Skills: front.skills,
    Educations: front.educations,
    Languages: front.languages,
    Entertainments: front.entertainments,
    Projects: front.projects,
    WorkExperiences: front.workExperiences,
    JobTitle: front.jobTitle
  }
}
/**
 * 简历投递对象
 */
class ResumeView {
  constructor (resumeDelivery) {
    Object.assign(this, initResumeView, resumeDelivery)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromResumeView(e))
    } else {
      return fromResumeView(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toResumeView(f))
    } else {
      return toResumeView(front)
    }
  }
  static FieldsConvertToFront () {
    return {
      ResumeDeliveryID: 'resumeDeliveryID',
      ResumeID: 'resumeID',
      PlanID: 'planID',
      JobID: 'jobID',
      Interviewee: 'interviewee',
      Tel: 'tel',
      Email: 'email',
      InterviewerID: 'interviewerID',
      City: 'city',
      PushCode: 'pushCode',
      DeliveryTime: 'deliveryTime',
      Status: 'status',
      InterviewCount: 'interviewCount',
      HistoryInterviewers: 'historyInterviewers',
      InterviewTime: 'interviewTime',
      InterviewPlace: 'interviewPlace',
      InterviewType: 'interviewType',
      Result: 'result',
      Refused: 'refused',
      InStorage: 'inStorage',
      History: 'history',
      ModifyTime: 'modifyTime',
      Photo: 'photo',
      Sex: 'sex',
      HighestEducation: 'highestEducation',
      WorkingYears: 'workingYears',
      PostTime: 'postTime',
      ExpectedSalary: 'expectedSalary',
      Skills: 'skills',
      Educations: 'educations',
      Languages: 'languages',
      Entertainments: 'entertainments',
      Projects: 'projects',
      WorkExperiences: 'workExperiences',
      JobTitle: 'jobTitle'
    }
  }
  static FieldsConvertToEnd () {
    return {
      resumeDeliveryID: 'ResumeDeliveryID',
      resumeID: 'ResumeID',
      planID: 'PlanID',
      jobID: 'JobID',
      interviewee: 'Interviewee',
      tel: 'Tel',
      email: 'Email',
      interviewerID: 'InterviewerID',
      city: 'City',
      pushCode: 'PushCode',
      deliveryTime: 'DeliveryTime',
      status: 'Status',
      interviewCount: 'InterviewCount',
      historyInterviewers: 'HistoryInterviewers',
      interviewTime: 'InterviewTime',
      interviewPlace: 'InterviewPlace',
      interviewType: 'InterviewType',
      result: 'Result',
      refused: 'Refused',
      inStorage: 'InStorage',
      history: 'History',
      modifyTime: 'ModifyTime',
      photo: 'Photo',
      sex: 'Sex',
      highestEducation: 'HighestEducation',
      workingYears: 'WorkingYears',
      postTime: 'PostTime',
      expectedSalary: 'ExpectedSalary',
      skills: 'Skills',
      educations: 'Educations',
      languages: 'Languages',
      entertainments: 'Entertainments',
      projects: 'Projects',
      workExperiences: 'WorkExperiences',
      jobTitle: 'JobTitle'
    }
  }
}
/** ------------------------- 教育经历 ------------------------- */
const initEducation = {
  resumeID: 0,
  startTime: '',
  endTime: '',
  country: '',
  province: '',
  college: '',
  department: '',
  major: '',
  admissionsCategory: '',
  background: '',
  degree: '',
  collegeStyle: '',
  degreeCategory: '',
  paperTitle: ''
}
function fromEducation (end) {
  return {
    startTime: end.StartTime,
    endTime: end.EndTime,
    country: end.Country,
    province: end.Province,
    college: end.College,
    department: end.Department,
    major: end.Major,
    admissionsCategory: end.AdmissionsCategory,
    background: end.Background,
    degree: end.Degree,
    collegeStyle: end.CollegeStyle,
    degreeCategory: end.DegreeCategory,
    paperTitle: end.PaperTitle
  }
}

function toEducation (front) {
  return {
    StartTime: front.startTime,
    EndTime: front.endTime,
    Country: front.country,
    Province: front.province,
    College: front.college,
    Department: front.department,
    Major: front.major,
    AdmissionsCategory: front.admissionsCategory,
    Background: front.background,
    Degree: front.degree,
    CollegeStyle: front.collegeStyle,
    DegreeCategory: front.degreeCategory,
    PaperTitle: front.paperTitle
  }
}
/**
 * 教育经历对象
 */
export class Education {
  constructor (education) {
    Object.assign(this, initEducation, education)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromEducation(e))
    } else {
      return fromEducation(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toEducation(f))
    } else {
      return toEducation(front)
    }
  }
}
/** ------------------------- 证书情况 ------------------------- */
const initCertificate = {
  name: '',
  startTime: ''
}
function fromCertificate (end) {
  return {
    name: end.Name,
    startTime: end.StartTime
  }
}

function toCertificate (front) {
  return {
    Name: front.name,
    StartTime: front.startTime
  }
}
/**
 * 证书对象
 */
export class Certificate {
  constructor (certificate) {
    Object.assign(this, initCertificate, certificate)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromCertificate(e))
    } else {
      return fromCertificate(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toCertificate(f))
    } else {
      return toCertificate(front)
    }
  }
}
/** ------------------------- 娱乐活动 ------------------------- */
const initEntertainment = {
  name: '',
  startTime: '',
  description: ''
}
function fromEntertainment (end) {
  return {
    resumeID: end.ResumeID,
    name: end.Name,
    startTime: end.StartTime,
    description: end.Description
  }
}

function toEntertainment (front) {
  return {
    Name: front.name,
    StartTime: front.startTime,
    Description: front.description
  }
}
/**
 * 活动对象
 */
export class Entertainment {
  constructor (entertainment) {
    Object.assign(this, initEntertainment, entertainment)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromEntertainment(e))
    } else {
      return fromEntertainment(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toEntertainment(f))
    } else {
      return toEntertainment(front)
    }
  }
}
/** ------------------------- 语言情况 ------------------------- */
const initLanguage = {
  kind: '',
  level: '',
  listen: '',
  certificate: '',
  score: ''
}
function fromLanguage (end) {
  return {
    kind: end.Kind,
    level: end.Level,
    listen: end.Listen,
    certificate: end.Certificate,
    score: end.Score
  }
}

function toLanguage (front) {
  return {
    Kind: front.kind,
    Level: front.level,
    Listen: front.listen,
    Certificate: front.certificate,
    Score: front.score
  }
}
/**
 * 语言对象
 */
export class Language {
  constructor (language) {
    Object.assign(this, initLanguage, language)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromLanguage(e))
    } else {
      return fromLanguage(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toLanguage(f))
    } else {
      return toLanguage(front)
    }
  }
}
/** ------------------------- 项目经历 ------------------------- */
const initProject = {
  startTime: '',
  endTime: '',
  name: '',
  source: '',
  personNumber: '',
  introduction: '',
  role: '',
  duty: ''
}
function fromProject (end) {
  return {
    startTime: end.StartTime,
    endTime: end.EndTime,
    name: end.Name,
    source: end.Source,
    personNumber: end.PersonNumber,
    introduction: end.Introduction,
    role: end.Role,
    duty: end.Duty
  }
}

function toProject (front) {
  return {
    StartTime: front.startTime,
    EndTime: front.endTime,
    Name: front.name,
    Source: front.source,
    PersonNumber: front.personNumber,
    Introduction: front.introduction,
    Role: front.role,
    Duty: front.duty
  }
}
/**
 * 项目对象
 */
export class Project {
  constructor (project) {
    Object.assign(this, initProject, project)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromProject(e))
    } else {
      return fromProject(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toProject(f))
    } else {
      return toProject(front)
    }
  }
}
/** ------------------------- 工作经历 ------------------------- */
const initWorkExperience = {
  startTime: '',
  endTime: '',
  company: '',
  department: '',
  position: '',
  industry: '',
  content: ''
}
function fromWorkExperience (end) {
  return {
    startTime: end.StartTime,
    endTime: end.EndTime,
    company: end.Company,
    department: end.Department,
    position: end.Position,
    industry: end.Industry,
    content: end.Content
  }
}

function toWorkExperience (front) {
  return {
    StartTime: front.startTime,
    EndTime: front.endTime,
    Company: front.company,
    Department: front.department,
    Position: front.position,
    Industry: front.industry,
    Content: front.content
  }
}
/**
 * 职位对象
 */
export class WorkExperience {
  constructor (work) {
    Object.assign(this, initWorkExperience, work)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromWorkExperience(e))
    } else {
      return fromWorkExperience(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => toWorkExperience(f))
    } else {
      return toWorkExperience(front)
    }
  }
}
/**
 * 邀约记录
 */
const initResumeInvite = {
  id: 0,
  planID: 0,
  planTitle: '',
  jobID: 0,
  jobTitle: '',
  count: 0,
  countPerHour: 5,
  resumeDeliveryIDs: 0,
  detail: '',
  status: '',
  interviewRound: 2,
  createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: ''
}
function fromResumeInvite (end) {
  return {
    id: end.Id,
    planID: end.PlanID,
    planTitle: end.PlanTitle,
    jobID: end.JobID,
    jobTitle: end.JobTitle,
    count: end.Count,
    countPerHour: end.CountPerHour,
    resumeDeliveryIDs: JSON.parse(end.ResumeDeliveryIDs),
    detail: JSON.parse(end.Detail),
    status: end.Status,
    interviewRound: end.InterviewRound,
    createTime: end.CreateTime,
    createBy: end.CreateBy
  }
}
class ResumeInvite {
  constructor (ResumeInvite) {
    Object.assign(this, initResumeInvite, ResumeInvite)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => fromResumeInvite(e))
    } else {
      return fromResumeInvite(end)
    }
  }
}
export default {
  Resume,
  ResumeView,
  ResumeInvite
}
