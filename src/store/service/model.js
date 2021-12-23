import { date, LocalStorage } from 'quasar'
import commomFields from '@/utils/model-common-fields'
import Document from '../document/model'
const { formatDate } = date

// 初始模型对象
const init = {
  id: 0,
  title: '',
  type: '',
  acl: 2,
  organizeId: 0,
  owner: 0,
  connectorId: 0,
  connectTime: formatDate('1000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
  connectChange: { changed: false, reason: '' },
  evaluation: { rating: 0, feedback: '' },
  managerId: 0,
  members: [],
  status: 'wait',
  orderNumber: '',
  widgets: {},
  notes: '',
  files: []
}

function fromOne (end) {
  return {
    id: end.Id,
    title: end.Title,
    type: end.Type,
    acl: end.Acl,
    organizeId: end.OrganizeID,
    owner: end.Owner,
    connectorId: end.ConnectorID,
    connectTime: end.ConnectTime,
    connectChange: JSON.parse(end.ConnectChange || '{}'),
    evaluation: JSON.parse(end.Evaluation || '{}'),
    managerId: end.ManagerID,
    members: end.Members.split(',').map(Number),
    status: end.Status,
    step: end.Status === 'doing' ? 2 : end.Status === 'done' ? 3 : end.Status === 'confirmed' ? 4 : 1,
    orderNumber: end.OrderNumber,
    widgets: end.Widgets ? JSON.parse(end.Widgets) : {},
    notes: end.Notes,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    Id: front.id,
    Title: front.title,
    Type: front.type,
    Acl: front.acl,
    OrganizeID: front.organizeId,
    Owner: front.owner,
    ConnectorID: front.connectorId,
    ConnectTime: front.connectTime,
    ConnectChange: JSON.stringify(front.connectChange),
    Evaluation: JSON.stringify(front.evaluation),
    ManagerID: front.managerId,
    Members: front.members.join(','),
    Status: front.status,
    OrderNumber: front.orderNumber,
    Widgets: front.widgets && JSON.stringify(front.widgets),
    Notes: front.notes,
    Files: front.files ? JSON.stringify(Document.to(front.files)) : '',
    ...(commomFields.to(front))
  }
}

export default class Service {
  // eslint-disable-next-line space-before-function-paren
  constructor(service) {
    const myself = LocalStorage.getItem('myself')
    init.organizeId = myself.organizeId
    init.owner = myself.id
    init.members = [myself.id]
    Object.assign(this, init, service)
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
