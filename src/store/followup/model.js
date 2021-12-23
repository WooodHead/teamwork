import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'

const init = {
  id: 0,
  objectID: 0,
  title: '',
  objectType: '',
  contactForm: '面谈',
  customerContacter: 0,
  leaderID: 0,
  followupDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  content: '',
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: '',
  createByID: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  modifyBy: '',
  deleteTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  deleteBy: '',
  deleted: 0,
  members: []
}
function fromOne (end) {
  return {
    id: end.Id,
    objectID: end.ObjectID,
    title: end.Title,
    objectType: end.ObjectType,
    contactForm: end.ContactForm,
    customerContacter: end.CustomerContacter,
    leaderID: end.LeaderID,
    followupDate: end.FollowupDate,
    content: end.Content,
    createByID: end.CreateByID,
    deleted: end.IsDelete,
    members: end.Members,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    Id: front.id,
    ObjectID: front.objectID,
    Title: front.title,
    ObjectType: front.objectType,
    ContactForm: front.contactForm,
    CustomerContacter: front.customerContacter,
    LeaderID: front.leaderID,
    FollowupDate: front.followupDate,
    Content: front.content,
    CreateByID: front.createByID,
    Deleted: front.deleted,
    Members: front.members,
    ...(commomFields.to(front))
  }
}
/**
 * 职位对象
 *
 * @export
 * @class Notice
 */
export default class Followup {
  constructor (followup) {
    Object.assign(this, init, followup)
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
