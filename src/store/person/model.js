import { date } from 'quasar'
import { roleAuthorize, routeAuthorize } from '@/store/auth/authorize'
const { wechat } = require('app/app.config.js')
const { formatDate } = date,
  endFormat = 'YYYY-MM-DD',
  frontFormat = 'YYYY-MM-DD'
const init = {
  id: 0,
  name: '',
  pinyin: '',
  userId: 0,
  activated: 1,
  img: '',
  sex: '男',
  birthday: '',
  phone: '',
  tel: '',
  email: '',
  jobNumber: '',
  address: '',
  description: '',
  isOutStaff: 0,
  isInService: 1,
  entryoffice: '',
  leaveoffice: '',
  dutyId: 0,
  dutyName: '',
  dutyLevel: 0,
  organizeId: 0,
  orgShortName: '',
  organizeName: '',
  organizeNum: '',
  opentype: '',
  roleIds: [],
  roleCodes: [],
  roleNames: [],
  roles: [],
  listOrganizeDuty: [{ organizeId: null, dutyId: null }],
  organizeIds: '',
  auth: { role: {}, route: { allMenus: [], roleMenus: [] } },
  status: 0,
  settings: {
    status: '',
    // 关闭所有通知
    notificationsOff: false,
    // 通知类型 everything/ping/custom...
    whatToNotify: {
      type: 'everything',
      selection: []
    },
    // 通知方式
    howToNotify: wechat ? ['email', 'popup', 'wechat'] : ['email', 'popup'],
    // 通知时机
    whenToNotify: {
      // always/workHours...
      type: 'always',
      startTime: '08:30',
      endTime: '17:30',
      days: 'mon,tue,wed,thu,fri'
    },
    setWorkSpace: {
      workplateHowToShow: [],
      quickLinksHowToShow: []
    },
    // 常用应用
    commonUseApps: []
  }
}
const endSettings = {
  Status: '',
  NotificationsOff: false,
  WhatToNotify: {
    Type: 'everything',
    Selection: []
  },
  HowToNotify: wechat ? ['email', 'popup', 'wechat'] : ['email', 'popup'],
  WhenToNotify: {
    Type: 'always',
    StartTime: '08:30',
    EndTime: '17:30',
    Days: 'mon,tue,wed,thu,fri'
  },
  CommonUseApps: []
}
function fromOne (end) {
  // 机构职业对象数组转换
  var listOrganizeDuty = []
  listOrganizeDuty = end.OrgDutyList && !_.isEmpty(JSON.parse(end.OrgDutyList)) ? _.map(JSON.parse(end.OrgDutyList), lod => {
    return { organizeId: Number(lod.OrganizeID), dutyId: Number(lod.DutyID) }
  }) : [{ organizeId: null, dutyId: null }]
  // 角色数组转换
  var roles = []
  end.RoleIDs && end.RoleIDs.split(',').forEach((r, index) => {
    roles.push({ id: Number(r), code: end.RoleCodes && end.RoleCodes.split(',')[index], name: end.RoleNames && end.RoleNames.split(',')[index] })
  })
  end.Settings = end.Settings && (_.isObject(end.Settings) ? end.Settings : JSON.parse(end.Settings))
  let settings = end.Settings ? {
    status: end.Settings.Status,
    notificationsOff: end.Settings.NotificationsOff,
    whatToNotify: {
      type: end.Settings.WhatToNotify && end.Settings.WhatToNotify.Type,
      selection: end.Settings.WhatToNotify && end.Settings.WhatToNotify.Selection
    },
    howToNotify: end.Settings.HowToNotify,
    whenToNotify: {
      type: end.Settings.WhenToNotify && end.Settings.WhenToNotify.Type,
      startTime: end.Settings.WhenToNotify && end.Settings.WhenToNotify.StartTime,
      endTime: end.Settings.WhenToNotify && end.Settings.WhenToNotify.EndTime,
      days: end.Settings.WhenToNotify && end.Settings.WhenToNotify.Days
    },
    setWorkSpace: {
      workplateHowToShow: (end.Settings.SetWorkSpace && end.Settings.SetWorkSpace.WorkplateHowToShow) || [],
      quickLinksHowToShow: (end.Settings.SetWorkSpace && end.Settings.SetWorkSpace.QuickLinksHowToShow) || []
    },
    commonUseApps: end.Settings.CommonUseApps
  } : init.settings
  return {
    id: end.PsonID,
    name: end.PsonName,
    pinyin: end.NamePinyin,
    userId: end.UserID,
    activated: end.Activated === 1,
    img: end.Icon,
    sex: end.Sex,
    birthday: end.Birthday && formatDate(end.Birthday, frontFormat),
    phone: end.MobilePhone,
    tel: end.Tel,
    email: end.Email,
    jobNumber: end.RecordNum,
    address: end.Address,
    description: end.Description,
    isOutStaff: end.IsOutStaff,
    isInService: end.IsInService,
    inService: end.IsInService === 1,
    entryoffice: end.EntryOffice && formatDate(end.EntryOffice, frontFormat),
    leaveoffice: end.LeaveOffice && formatDate(end.LeaveOffice, frontFormat),
    dutyId: end.DutyID,
    dutyName: end.DutyName,
    dutyLevel: end.DutyLevel,
    organizeId: end.OrganizeID,
    orgShortName: end.OrgShortName,
    organizeName: end.OrganizeName,
    organizeNum: end.OrganizeNum,
    opentype: end.OpenType,
    roleIds: end.RoleIDs,
    roleCodes: end.RoleCodes,
    roleNames: end.RoleNames,
    roles: roles,
    weChat: end.WeChat,
    listOrganizeDuty: listOrganizeDuty,
    organizeIds: end.OrganizeIDs,
    auth: {
      role: end.RoleCodes && roleAuthorize(end.RoleCodes && (end.RoleCodes === '' ? [] : end.RoleCodes.split(','))),
      route: end.RoleCodes && routeAuthorize(end.RoleCodes && (end.RoleCodes === '' ? [] : end.RoleCodes.split(',')))
    },
    status: 0,
    settings: settings
  }
}
function toOne (front) {
  // 机构职业对象数组转换
  var orgDutyList = []
  orgDutyList = front.listOrganizeDuty && _.map(front.listOrganizeDuty, lod => {
    return { OrganizeID: lod.organizeId, DutyID: lod.dutyId }
  })
  // 角色转化
  var roleIds = _.map(front.roles, 'id').join(',')
  var roleCodes = _.map(front.roles, 'code').join(',')
  var roleNames = _.map(front.roles, 'name').join(',')
  // 取orgDutyList第一个对象中的DutyID作为主职、OrganizeID作为主机构
  var dutyId = orgDutyList.length ? orgDutyList[0].DutyID : 0
  var organizeId = orgDutyList.length ? orgDutyList[0].OrganizeID : 0
  // 个人设置
  let settings = endSettings
  if (front.settings) {
    settings = {
      Status: front.settings.status,
      NotificationsOff: front.settings.notificationsOff,
      WhatToNotify: {
        Type: front.settings.whatToNotify.type,
        Selection: front.settings.whatToNotify.selection
      },
      HowToNotify: front.settings.howToNotify,
      WhenToNotify: {
        Type: front.settings.whenToNotify.type,
        StartTime: front.settings.whenToNotify.startTime,
        EndTime: front.settings.whenToNotify.endTime,
        Days: front.settings.whenToNotify.days
      },
      SetWorkSpace: {
        WorkplateHowToShow: (front.settings.setWorkSpace && front.settings.setWorkSpace.workplateHowToShow) || [],
        QuickLinksHowToShow: (front.settings.setWorkSpace && front.settings.setWorkSpace.quickLinksHowToShow) || []
      },
      CommonUseApps: front.settings.commonUseApps
    }
  }
  return {
    PsonID: front.id,
    PsonName: front.name,
    NamePinyin: front.pinyin,
    UserID: front.userId,
    Activated: front.activated ? 1 : 0,
    Icon: front.img,
    Sex: front.sex,
    Birthday: formatDate(front.birthday, endFormat),
    MobilePhone: front.phone,
    Tel: front.tel,
    Email: front.email,
    RecordNum: front.jobNumber,
    Address: front.address,
    Description: front.description,
    IsOutStaff: front.isOutStaff,
    IsInService: front.isInService,
    EntryOffice: formatDate(front.entryoffice, endFormat),
    LeaveOffice: formatDate(front.leaveoffice, endFormat),
    DutyID: dutyId,
    DutyLevel: front.dutyLevel,
    Opentype: front.opentype,
    OrganizeID: organizeId,
    RoleIDs: roleIds,
    RoleCodes: roleCodes,
    RoleNames: roleNames,
    WeChat: front.weChat,
    OrgDutyList: JSON.stringify(orgDutyList),
    Settings: settings
  }
}
/**
 * 人员对象
 *
 * @export
 * @class Person
 */
export default class Person {
  constructor (person) {
    Object.assign(this, init, person)
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
  static toEndFields (fields) {
    var newFields = []
    _.forEach(fields, f => {
      newFields.push(_.findKey(Person.FieldsConvert(), (value) => {
        return value === f
      }))
    })
    return newFields
  }
  static toFrontFields (fields) {
    var newFields = []
    _.forEach(fields, f => {
      newFields.push(Person.FieldsConvert()[f])
    })
    return newFields
  }
  static FieldsConvert () {
    return {
      PsonID: 'id',
      PsonName: 'name',
      NamePinyin: 'pinyin',
      UserID: 'userId',
      Icon: 'img',
      Sex: 'sex',
      Birthday: 'birthday',
      MobilePhone: 'phone',
      Tel: 'tel',
      Email: 'email',
      RecordNum: 'jobNumber',
      Address: 'address',
      Description: 'description',
      IsOutStaff: 'isOutStaff',
      IsInService: 'isInService',
      EntryOffice: 'entryoffice',
      LeaveOffice: 'leaveoffice',
      DutyID: 'dutyId',
      DutyName: 'dutyName',
      DutyLevel: 'dutyLevel',
      OrganizeID: 'organizeId',
      OrganizeName: 'organizeName',
      OrgShortName: 'orgShortName',
      RoleIDs: 'roleIds',
      RoleCodes: 'roleCodes',
      RoleNames: 'roleNames',
      User: 'user',
      OrgDutyList: 'orgDutyList',
      Settings: 'settings'
    }
  }
  // static formRequiredFields () {
  //   // return ['name', 'roleIds', 'listOrganizeDuty', 'jobNumber', 'phone']
  //   return []
  // }
  // static excelCheckFormFieldsType () {
  //   return [
  //     { birthday: { rules: 'string(xxxx.xx.xx)', errorTips: '【请按照格式正确输入生日(例如：2021.04.05)】' } },
  //     { phone: { rules: 'number', errorTips: '【请填入正确的手机号码】' } },
  //     {
  //       listOrganizeDuty: { rules: (value) => { }, errorTips: '【请按照格式输入机构职位】' }
  //     }
  //   ]
  // }
}
