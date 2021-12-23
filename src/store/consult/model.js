/**
 @Name：咨询转换器
 @Author：曾盼盼
 @date：2020/09/09
 @Copyright：西安精雕软件科技有限公司
 */
import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date
// 咨询何事
const consultItemInit = {
  id: 0,
  type: '',
  title: '',
  psonIDs: [],
  notes: ''
}
function consultItemFromOne (end) {
  return {
    id: end.Id,
    type: end.Type,
    title: end.Title,
    psonIDs: end.PsonIDs && end.PsonIDs.split(',').map(e => +e),
    notes: end.Notes,
    ...commomFields.from(end)
  }
}
function consultItemToOne (front) {
  return {
    Id: front.id,
    Type: front.type,
    Title: front.title && front.title.trim(),
    PsonIDs: front.psonIDs && front.psonIDs.join(),
    Notes: front.notes,
    ...commomFields.to(front)
  }
}
class ConsultItem {
  constructor (consultItem) {
    Object.assign(this, consultItemInit, consultItem)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => consultItemFromOne(e))
    } else {
      return consultItemFromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => consultItemToOne(f))
    } else {
      return consultItemToOne(front)
    }
  }
}

// 向谁咨询
const transactorInit = {
  id: 0,
  psonID: 0,
  items: []
}
function transactorFromOne (end) {
  return {
    id: end.Id,
    psonID: end.PsonID,
    items: end.Items && JSON.parse(end.Items)
  }
}

class Transactor {
  constructor (transactor) {
    Object.assign(this, transactorInit, transactor)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => transactorFromOne(e))
    } else {
      return transactorFromOne(end)
    }
  }
}

// 咨询事项
const consultInit = {
  id: 0,
  code: '',
  itemID: 0,
  content: '',
  status: 0,
  exceptFinishTime: '',
  submitTime: '',
  startTime: '',
  endTime: '',
  consultantID: 0,
  transactorID: 0,
  Communication: '',
  progress: ''
}
function consultFromOne (end) {
  const Communication =
    _.has(end, 'Communication')
      ? (_.isObject(end.Communication) ? end.Communication : JSON.parse(end.Communication)) : {},
    listCommunication = Communication && _.map(Communication, lod => {
      return {
        senderID: lod.SenderID,
        receiverID: lod.ReceiverID,
        senderTime: formatDate(lod.SenderTime.replace(/T/g, ' ').replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'),
        content: lod.Content,
        roleName: lod.RoleName,
        type: lod.Type
      }
    }),
    Progress =
      _.has(end, 'Progress')
        ? (_.isObject(end.Progress) ? end.Progress : JSON.parse(end.Progress)) : {},
    listProgress = Progress && _.map(Progress, lod => {
      return {
        status: lod.Status,
        createTime: formatDate(lod.CreateTime.replace(/-/g, '/'), 'YYYY-MM-DD') === '1000-01-01' ? '' : formatDate(lod.CreateTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'),
        psonID: lod.PsonID,
        timeConsuming: lod.TimeConsuming
      }
    })
  return {
    id: end.Id,
    code: end.Code,
    itemID: end.ItemID,
    content: end.Content,
    status: end.Status,
    exceptFinishTime: formatDate(end.ExceptFinishTime.replace(/-/g, '/'), 'YYYY-MM-DD') === '1000-01-01' ? '' : formatDate(end.ExceptFinishTime.replace(/-/g, '/'), 'YYYY-MM-DD'),
    submitTime: formatDate(end.SubmitTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'),
    startTime: formatDate(end.StartTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm'),
    endTime: end.EndTime,
    consultantID: end.ConsultantID,
    transactorID: end.TransactorID,
    communication: listCommunication,
    progress: listProgress,
    ...commomFields.from(end)
  }
}
function consultToOne (front) {
  const listCommunication = front.communication && _.map(front.communication, front => {
      return {
        SenderID: front.senderID,
        ReceiverID: front.receiverID,
        SenderTime: front.senderTime ? formatDate(front.senderTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm:ss') : '1000-01-01 00:00:00',
        Content: front.content,
        RoleName: front.roleName,
        Type: front.type
      }
    }),
    listProgress = front.progress && _.map(front.progress, front => {
      return {
        Status: front.Status,
        CreateTime: front.createTime ? formatDate(front.createTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm:ss') : '1000-01-01 00:00:00',
        PsonID: front.psonID,
        TimeConsuming: front.timeConsuming
      }
    })
  return {
    Id: front.id,
    Code: front.code,
    ItemID: front.itemID,
    Content: front.content,
    Status: front.status,
    ExceptFinishTime: front.exceptFinishTime ? formatDate(front.exceptFinishTime.replace(/-/g, '/'), 'YYYY-MM-DD') : '1000-01-01 00:00:00',
    SubmitTime: front.submitTime ? formatDate(front.submitTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm:ss') : '1000-01-01 00:00:00',
    StartTime: front.startTime ? formatDate(front.startTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm:ss') : '1000-01-01 00:00:00',
    EndTime: front.endTime ? formatDate(front.endTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm:ss') : '1000-01-01 00:00:00',
    ConsultantID: front.consultantID,
    TransactorID: front.transactorID,
    Communication: listCommunication,
    Progress: listProgress,
    CMessage: '',
    ...commomFields.to(front)
  }
}
class Consult {
  constructor (consult) {
    Object.assign(this, consultInit, consult)
  }
  static from (end) {
    if (_.isArray(end)) {
      return _.map(end, e => consultFromOne(e))
    } else {
      return consultFromOne(end)
    }
  }
  static to (front) {
    if (_.isArray(front)) {
      return _.map(front, f => consultToOne(f))
    } else {
      return consultToOne(front)
    }
  }
}
export default { ConsultItem, Transactor, Consult }
