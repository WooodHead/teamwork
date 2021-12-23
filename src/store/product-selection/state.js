export default {
  // 全局数据
  selections: [],
  // 模糊查询
  search: '',
  // 是否分页
  byPage: true,
  page: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  listPageType: 'myList',
  archivedCount: 0, // 已归档数量
  listStyle: 'showcards',
  // 工艺参数
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
  }
}
