import { defaultsDeep } from 'lodash'
import copywriting from './copywriting/copywriting.js'
const title = '会议室'
const room = {
  module: `${title}预约`,
  title: title,
  notes: `查看${title}的使用日程，并添加自己的预约，系统可提前提醒。`
}
export default defaultsDeep(copywriting.room, room)
