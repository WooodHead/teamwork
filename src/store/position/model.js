/**
 * 职位职级model
 */
import { date } from 'quasar'
const init = {
  id: 0,
  PsonName: '',
  RecordNum: '',
  OrganizeName: '',
  Value: '',
  Rank: '',
  Blessing: '',
  IsRead: 0,
  PsonId: 0,
  SendStatus: 0,
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
  createBy: '',
  createByID: 0

}
function fromOne (end) {
  return {
    id: end.Id,
    psonName: end.PsonName,
    recordNum: end.RecordNum,
    organizeName: end.OrganizeName,
    value: end.Value || end.AdminPosition,
    rank: end.Rank || end.AdminRank,
    blessing: end.Blessing || end.AdminBlessing,
    isRead: end.IsRead,
    psonId: end.PsonId,
    sendStatus: end.SendStatus,
    createTime: end.CreateTime,
    createBy: end.CreateBy,
    createByID: end.CreateByID
  }
}

function toOne (front) {
  return {
    ID: front.id,
    PsonName: front.psonName,
    RecordNum: front.recordNum,
    OrganizeName: front.organizeName,
    AdminPosition: front.value,
    AdminRank: front.rank,
    AdminBlessing: front.blessing,
    StaffPosition: front.value,
    StaffRank: front.rank,
    StaffBlessing: front.blessing,
    IsRead: front.isRead,
    PsonId: front.psonId,
    SendStatus: front.sendStatus,
    CreateTime: front.createTime,
    CreateBy: front.createBy,
    CreateByID: front.createByID
  }
}
/**
 * 职位职级对象
 *
 * @export
 * @class Notice
 */
export default class Position {
  constructor (position) {
    Object.assign(this, init, position)
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
