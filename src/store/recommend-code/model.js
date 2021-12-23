import commomFields from '@/utils/model-common-fields'
import { date } from 'quasar'
const { formatDate } = date,
  format = 'YYYY/MM/DD'
const init = {
  id: 0,
  type: 0, // 0是1-N类型，1是1-1类型
  owner: '', // 持有人姓名
  ownerTel: '', // 持有人电话
  code: '', // 推荐码
  count: '', // 内推码使用次数
  notes: '', // 备注
  recommendType: '', // 内推码类型
  disabledTime: formatDate((new Date()).setDate((new Date()).getDate() + 30), format), // 失效时间
  createTime: date.formatDate(new Date(), 'YYYY-MM-DD'),
  createBy: '',
  createByID: 0,
  modifyTime: date.formatDate(new Date(), 'YYYY-MM-DD'),
  modifyBy: '',
  jobNumber: 0
}
function fromOne (end) {
  return {
    id: end.Id,
    type: end.Type,
    owner: end.Owner,
    ownerTel: end.OwnerTel,
    code: end.Code,
    count: end.Count,
    notes: end.Notes,
    recommendType: end.RecommendType,
    disabledTime: end.DisabledTime && formatDate(end.DisabledTime, format),
    createByID: end.CreateByID,
    jobNumber: end.JobNumber,
    ...(commomFields.from(end))
  }
}

function toOne (front) {
  return {
    Id: front.id,
    Type: front.type,
    Owner: front.owner,
    OwnerTel: front.ownerTel,
    Code: front.code,
    Count: front.count,
    Notes: front.notes,
    RecommendType: front.recommendType,
    DisabledTime: front.disabledTime && formatDate(front.disabledTime, format),
    CreateByID: front.createByID,
    JobNumber: front.jobNumber,
    ...(commomFields.to(front))
  }
}
/**
 * 推荐码对象
 *
 * @export
 * @class RecommendCode
 */
export default class RecommendCode {
  constructor (RecommendCode) {
    Object.assign(this, init, RecommendCode)
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
