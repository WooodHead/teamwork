import { i18n } from '@/boot/i18n'
import { modelEmptyPrettier } from '@/utils/struct-model'
export default {
  productSelection: state => id => {
    return _.find(state.selections, { id }) || {}
  },
  getMyList: state => currentRouteName => {
    return _.filter(state.selections, selection => {
      return currentRouteName.includes('archived') ? selection.archived : !selection.archived
    })
  },
  selectionWorkpieceInfoFlat: state => selection => {
    // 空值美化，深复制，以免修改源数据
    let cloneProcessJson = _.cloneDeep(selection.processJson)
    let processJsonPrettier = modelEmptyPrettier(cloneProcessJson, ' - ')

    let workpieceMessure = {
      3: `${processJsonPrettier.Length}/${processJsonPrettier.Width}/${processJsonPrettier.Heigh} mm`,
      5: `${processJsonPrettier.MaxDiameter}/${processJsonPrettier.MaxHeight} mm`
    }

    let res = [
      { id: 1, name: '工件信息', isHeader: true },
      { id: 2, name: '工件尺寸', value: workpieceMessure[processJsonPrettier.AxisCount] },
      { id: 3, name: '工装尺寸', value: `${processJsonPrettier.ToolingLength}/${processJsonPrettier.ToolingWidth}/${processJsonPrettier.ToolingHeight} mm` },
      { id: 4, name: '机床需求', isHeader: true },
      { id: 5, name: '轴数', value: i18n.t(`product.fields.axisCount${processJsonPrettier.AxisCount}`) },
      { id: 6, name: '承重需求(工件+治具最大重量)', value: `${processJsonPrettier.BearingWeight} kg` },
      { id: 7, name: '主轴需求', isHeader: true },
      { id: 8, name: '是否需要定向', value: processJsonPrettier.MotorForm === '1' ? '不需要' : '需要' },
      { id: 9, name: '刀柄要求', value: processJsonPrettier.Shank },
      { id: 10, name: '刀具最大夹持直径', value: `${processJsonPrettier.ClampingToolMax} mm` },
      { id: 11, name: '最大转速', value: `${processJsonPrettier.SpeedMax} npm` },
      { id: 12, name: '扭矩需求', value: `${processJsonPrettier.Torque} N·m` },
      { id: 13, name: '刀具需求', isHeader: true },
      { id: 14, name: '刀具长度', value: `${processJsonPrettier.ToolMinLength}~${processJsonPrettier.ToolMaxLength} mm` },
      { id: 15, name: '刀具最大直径', value: `${processJsonPrettier.ToolMaxDiameter} mm` },
      { id: 16, name: '刀具数量', value: `${processJsonPrettier.ToolCount} 把` },
      { id: 17, name: '单把刀具最大重量', value: `${processJsonPrettier.SingleToolMaxWeight} kg` },
      { id: 18, name: '换刀时间需求', value: `${processJsonPrettier.ToolChangeTime} s` },
      { id: 19, name: '其它需求', isHeader: true },
      { id: 20, name: '冷却润滑方式', value: processJsonPrettier.CoolingMethod },
      { id: 21, name: '测头选型', value: `${processJsonPrettier.Probe === 1 ? '需要' : '不需要'}` },
      { id: 22, name: '加工材质', value: processJsonPrettier.Material },
      { id: 23, name: '切削形态', value: processJsonPrettier.ApplicableChipTypes }
    ]

    return res
  }
}
