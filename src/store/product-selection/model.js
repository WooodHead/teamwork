import { date } from 'quasar'
import commomFields from '@/utils/model-common-fields'

const init = {
  id: 0,
  title: '',
  processJson: {
    AxisCount: '5',
    Length: '',
    Width: '',
    Height: '',
    MaxDiameter: '',
    MaxHeight: '',
    ToolingLength: '',
    ToolingWidth: '',
    ToolingHeight: '',
    BearingWeight: '',
    MotorForm: '1',
    Shank: '',
    ClampingToolMax: '',
    SpeedMax: '',
    Torque: '',
    ToolMinLength: '',
    ToolMaxLength: '',
    ToolMaxDiameter: '',
    ToolCount: '',
    SingleToolMaxWeight: '',
    ToolChangeTime: '',
    CoolingMethod: '',
    Probe: 0,
    Material: '',
    ApplicableChipTypes: ''
  }, // 工艺参数
  selectionJson: {
    machinetoolId: 0,
    accessoryIds: []
  }, // 选型结果
  archived: 0, // 是否归档
  archiveTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'), // 归档时间
  archiveBy: '' // 归档人
}

function fromOne (end) {
  return {
    id: end.SelectionID,
    title: end.SelectionName,
    processJson: JSON.parse(end.ProcessJson),
    selectionJson: JSON.parse(end.SelectionJson),
    ...(commomFields.from(end))
  }
}
function toOne (front) {
  return {
    SelectionID: front.id,
    SelectionName: front.title,
    ProcessJson: JSON.stringify(front.processJson),
    SelectionJson: JSON.stringify(front.selectionJson),
    ...(commomFields.to(front))
  }
}
/**
   * 选型对象
   *
   * @export
   * @class Selection
   */
export default class Selection {
  // eslint-disable-next-line space-before-function-paren
  constructor(selection) {
    Object.assign(this, _.cloneDeep(init), selection)
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
}
