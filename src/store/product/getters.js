import { LocalStorage } from 'quasar'
import { modelEmptyPrettier } from '@/utils/struct-model'
import { customOrderBy } from './custom-compare'
export default {
  /** 前端筛选模式 */
  productsFiltered: state => parentId => {
    let products = parentId ? state.products.filter(p => p.parentId === parentId) : state.products
    // 非产品维护人员，只能看到发布产品
    const myinfo = LocalStorage.getItem('myself')
    if (!myinfo.auth.role.isProductManager) {
      products = products.filter(p => p.isPublish === 1)
    }
    const search = state.search
    if (search) {
      products = _.filter(products, item =>
        item.title.toLowerCase().includes(search.toLowerCase()))
    }
    return products
  },
  productsSorted: (state, getters) => parentId => {
    return customOrderBy(getters.productsFiltered(parentId))
  },
  productTree: (state) => {
    return state.productTree[state.currentProductClassification]
      .map(p => {
        p.title = p.specModel || p.title
        return p
      })
  },
  productChildren: (state, getters) => id => {
    return getters.productsSorted(id)
  },
  // 获取一个资源列表
  products: (state, getters) => {
    return getters.productsSorted()
  },
  quickLinks: (state, getters) => {
    const rootProducts = state.products.filter(p => p.level === 1)
    let cloneRootProducts = _.orderBy(_.cloneDeep(rootProducts), ['orderNo'])
    cloneRootProducts.push({ id: 0, title: '成熟案例库', level: 1, classification: 'usecase', orderNo: 8 })
    cloneRootProducts = _.orderBy(cloneRootProducts, ['orderNo'])
    _.forEach(cloneRootProducts, cp => {
      const { icon, color } = state.classifications.find(classification => classification.name === cp.classification) || {}
      Object.assign(cp, { icon, color })
    })
    return cloneRootProducts
  },
  product: state => id => {
    return _.find(state.products, { id })
  },
  productAccessoryRelations: (state, getters, rootState, rootGetters) => id => {
    return rootGetters['resource/resourceRelations']({
      category1: 'product',
      id1: id,
      category2: 'product'
    })
  },
  productAccessoryIds: (state, getters) => id => {
    return _.map(getters.productAccessoryRelations(id), 'selectId')
  },
  // 扁平化产品参数
  productTechParamsFlat: (state, getters) => product => {
    // 空值美化，深复制，以免修改源数据
    let cloneProduct = _.cloneDeep(product)
    let productPrettier = modelEmptyPrettier(cloneProduct, ' - ')
    let paramsPrettier = productPrettier.params
    let res = []
    switch (product.params.TplCode) {
      case 'FiveAxis':
      case 5:
        res = [
          { id: 1, name: '机床尺寸', isHeader: true },
          { id: 2, name: '长宽高', value: `${paramsPrettier.MachineToolSize.Length}mm×${paramsPrettier.MachineToolSize.Width}mm×${paramsPrettier.MachineToolSize.Height}mm` },
          { id: 3, name: '重量', value: `${paramsPrettier.MachineToolSize.Weight} kg` },
          { id: 4, name: '占地面积', value: paramsPrettier.MachineToolSize.Area },
          { id: 5, name: '地基要求', value: paramsPrettier.MachineToolSize.Foundation },
          { id: 6, name: '加工范围', isHeader: true },
          { id: 7, name: 'X/Y/Z轴工作行程', value: `${paramsPrettier.ProcessingRange.WorkStroke.XAxis}/${paramsPrettier.ProcessingRange.WorkStroke.YAxis}/${paramsPrettier.ProcessingRange.WorkStroke.ZAxis} mm` },
          { id: 8, name: 'A/B/C轴回转角度', value: `${paramsPrettier.ProcessingRange.RotationAngle.AAxis}/${paramsPrettier.ProcessingRange.RotationAngle.BAxis}/${paramsPrettier.ProcessingRange.RotationAngle.CAxis}` },
          { id: 9, name: '进料高度', value: `${paramsPrettier.ProcessingRange.FeedHeight} mm` },
          { id: 10, name: '台面直径', value: `φ${paramsPrettier.ProcessingRange.WorkbenchDiameter} mm` },
          { id: 11, name: '最大工件尺寸', value: `φ${paramsPrettier.ProcessingRange.MaxWorkpieceSize.Diameter}×${paramsPrettier.ProcessingRange.MaxWorkpieceSize.Height} mm` },
          { id: 12, name: '最大承重', value: `${paramsPrettier.ProcessingRange.MaxBearingWeight} kg` },
          { id: 13, name: '加工区空间大小', value: `${paramsPrettier.ProcessingRange.ProcessingAreaSpace} m³` },
          { id: 14, name: '机床精度', isHeader: true },
          { id: 15, name: '定位精度X/Y/Z', value: `${paramsPrettier.Accuracy.Position.XAxis}/${paramsPrettier.Accuracy.Position.YAxis}/${paramsPrettier.Accuracy.Position.ZAxis} mm` },
          { id: 16, name: '定位精度A/B/C', value: `${paramsPrettier.Accuracy.Position.AAxis}/${paramsPrettier.Accuracy.Position.BAxis}/${paramsPrettier.Accuracy.Position.CAxis}''` },
          { id: 17, name: '重复定位精度X/Y/Z', value: `${paramsPrettier.Accuracy.Repeated.XAxis}/${paramsPrettier.Accuracy.Repeated.YAxis}/${paramsPrettier.Accuracy.Repeated.ZAxis} mm` },
          { id: 18, name: '重复定位精度A/B/C', value: `${paramsPrettier.Accuracy.Repeated.AAxis}/${paramsPrettier.Accuracy.Repeated.BAxis}/${paramsPrettier.Accuracy.Repeated.CAxis}''` },
          { id: 19, name: '进给速度', isHeader: true },
          { id: 20, name: '定位速度X/Y/Z', value: `${paramsPrettier.FeedSpeed.PositionSpeed.XAxis}/${paramsPrettier.FeedSpeed.PositionSpeed.YAxis}/${paramsPrettier.FeedSpeed.PositionSpeed.ZAxis} m/min` },
          { id: 21, name: '定位速度A/B/C', value: `${paramsPrettier.FeedSpeed.PositionSpeed.AAxis}/${paramsPrettier.FeedSpeed.PositionSpeed.BAxis}/${paramsPrettier.FeedSpeed.PositionSpeed.CAxis} rpm` },
          { id: 22, name: '切削速度X/Y/Z', value: `${paramsPrettier.FeedSpeed.CuttingSpeed.XAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.YAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.ZAxis} m/min` },
          { id: 23, name: '切削速度A/B/C', value: `${paramsPrettier.FeedSpeed.CuttingSpeed.AAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.BAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.CAxis} rpm` },
          { id: 24, name: '转台', isHeader: true },
          { id: 25, name: '转台形式', value: paramsPrettier.Turntable.Form },
          { id: 26, name: 'A/B轴定位抱闸', value: paramsPrettier.Turntable.AAxis.PositionBrake },
          { id: 27, name: 'A/B轴安全抱闸', value: paramsPrettier.Turntable.AAxis.SafetyBrake },
          { id: 28, name: 'C轴定位抱闸', value: paramsPrettier.Turntable.CAxis.PositionBrake },
          { id: 29, name: '使用条件', isHeader: true },
          { id: 30, name: '电源电压', value: paramsPrettier.EnergyConsume.Voltage },
          { id: 31, name: '气压源', value: `≥${paramsPrettier.EnergyConsume.AirSourcePressure} Mpa` },
          // { id: 32, name: '油箱容积', value: `${paramsPrettier.EnergyConsume.FuelTankCapacity} L` },
          { id: 33, name: '总电源容量', value: `${paramsPrettier.EnergyConsume.TotalPower} kVA` }
        ]
        break
      case 'ThreeAxis':
      case 3:
        res = [
          { id: 1, name: '机床尺寸', isHeader: true },
          { id: 2, name: '长宽高', value: `${paramsPrettier.MachineToolSize.Length}mm×${paramsPrettier.MachineToolSize.Width}mm×${paramsPrettier.MachineToolSize.Height}mm` },
          { id: 3, name: '重量', value: `${paramsPrettier.MachineToolSize.Weight} kg` },
          { id: 4, name: '占地面积', value: paramsPrettier.MachineToolSize.Area },
          { id: 5, name: '地基要求', value: paramsPrettier.MachineToolSize.Foundation },
          { id: 6, name: '加工范围', isHeader: true },
          { id: 7, name: 'X/Y/Z轴工作行程', value: `${paramsPrettier.ProcessingRange.WorkStroke.XAxis}/${paramsPrettier.ProcessingRange.WorkStroke.YAxis}/${paramsPrettier.ProcessingRange.WorkStroke.ZAxis} mm` },
          { id: 8, name: '主轴端面到工作台面距离', value: `${paramsPrettier.ProcessingRange.SpindleWorkbenchDistance.Min}~${paramsPrettier.ProcessingRange.SpindleWorkbenchDistance.Max} mm` },
          { id: 9, name: '最大承重', value: `${paramsPrettier.ProcessingRange.MaxBearingWeight} kg` },
          { id: 10, name: '台面尺寸', value: `${paramsPrettier.ProcessingRange.WorkbenchSize.Length}mm×${paramsPrettier.ProcessingRange.WorkbenchSize.Width}mm` },
          { id: 11, name: '最大工件高度', value: `${paramsPrettier.ProcessingRange.MaxWorkpieceHeight} mm` },
          { id: 12, name: '加工区空间大小', value: `${paramsPrettier.ProcessingRange.ProcessingAreaSpace} m³` },
          { id: 13, name: '机床精度', isHeader: true },
          { id: 14, name: '定位精度X/Y/Z', value: `${paramsPrettier.Accuracy.Position.XAxis}/${paramsPrettier.Accuracy.Position.YAxis}/${paramsPrettier.Accuracy.Position.ZAxis} mm` },
          { id: 15, name: '重复定位精度X/Y/Z', value: `${paramsPrettier.Accuracy.Repeated.XAxis}/${paramsPrettier.Accuracy.Repeated.YAxis}/${paramsPrettier.Accuracy.Repeated.ZAxis} mm` },
          { id: 16, name: '进给速度', isHeader: true },
          { id: 17, name: '快进速度X/Y/Z', value: `${paramsPrettier.FeedSpeed.FastForwardSpeed.XAxis}/${paramsPrettier.FeedSpeed.FastForwardSpeed.YAxis}/${paramsPrettier.FeedSpeed.FastForwardSpeed.ZAxis} m/min` },
          { id: 18, name: '切削速度X/Y/Z', value: `${paramsPrettier.FeedSpeed.CuttingSpeed.XAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.YAxis}/${paramsPrettier.FeedSpeed.CuttingSpeed.ZAxis} m/min` },
          { id: 19, name: '使用条件', isHeader: true },
          { id: 20, name: '电源电压', value: paramsPrettier.EnergyConsume.Voltage },
          { id: 21, name: '气压源', value: `≥${paramsPrettier.EnergyConsume.AirSourcePressure} Mpa` },
          // { id: 22, name: '油箱容积', value: `${paramsPrettier.EnergyConsume.FuelTankCapacity} L` },
          { id: 23, name: '总电源容量', value: `${paramsPrettier.EnergyConsume.TotalPower} kVA` }
        ]
        break
      case 'AutomaticFeedingSystem':
      case 'AutomaticFeedingSystemOther':
        let diffText = product.tplCode === 'AutomaticFeedingSystem' ? '含机床' : '仅供料系统'
        res = [
          { id: 1, name: '机械手负载', value: `${paramsPrettier.ManipulatorLoad} kg` },
          { id: 2, name: '机械手Z轴行程', value: `${paramsPrettier.ManipulatorZAxisStroke} mm` },
          { id: 3, name: '料仓容量', value: `${paramsPrettier.BinCapacity} 料位` },
          { id: 4, name: `总重量（${diffText}）`, value: `${paramsPrettier.TotalWeight} kg` }]
        paramsPrettier.Chuck !== ' - ' && res.push({ id: 5, name: '配套卡盘', value: `${paramsPrettier.Chuck}` })
        if (paramsPrettier.IsCyclotron === 'on') {
          res.push({ id: 6, name: '最大工件尺寸', value: `φ${paramsPrettier.MaxWorkpieceSize.Diameter}mm×${paramsPrettier.MaxWorkpieceSize.Height}mm` })
          paramsPrettier.PalletSize.Diameter !== ' - ' && res.push({ id: 7, name: '托盘尺寸', value: `φ${paramsPrettier.PalletSize.Diameter} mm` })
        } else {
          res.push({ id: 6, name: '最大工件尺寸', value: `${paramsPrettier.MaxWorkpieceSize.Length}mm×${paramsPrettier.MaxWorkpieceSize.Width}mm×${paramsPrettier.MaxWorkpieceSize.Height}mm` })
          if (paramsPrettier.PalletSize.Length !== ' - ' || paramsPrettier.PalletSize.Width !== ' - ' || paramsPrettier.PalletSize.Height !== ' - ') {
            res.push({ id: 7, name: '托盘尺寸', value: `${paramsPrettier.PalletSize.Length}mm×${paramsPrettier.PalletSize.Width}mm×${paramsPrettier.PalletSize.Height}mm` })
          }
        }
        res.push({ id: 8, name: `外形尺寸（${diffText}）`, value: `${paramsPrettier.OverallSize.Length}mm×${paramsPrettier.OverallSize.Width}mm×${paramsPrettier.OverallSize.Height}mm` })
        break
      case 'CentralizedRefrigerationSystem':
        res = [
          { id: 1, name: '制冷量', value: `${paramsPrettier.CoolingCapacity} kW` },
          { id: 2, name: '输入功率', value: `${paramsPrettier.InputPower} kW` },
          { id: 3, name: '液箱容积', value: `${paramsPrettier.TankVolume} L` },
          { id: 4, name: '过滤精度', value: `${paramsPrettier.FiltrationPrecision} μm` },
          { id: 5, name: '制冷系统控制方式', value: paramsPrettier.RefrigerationSystemControlMode },
          { id: 6, name: '温度调节精度', value: `±${paramsPrettier.TemperatureControlPrecision} ℃` },
          { id: 7, name: '供液流量', value: `${paramsPrettier.FeedFlow.Min}~${paramsPrettier.FeedFlow.Max} L/min` },
          { id: 8, name: '供液压力', value: `(${paramsPrettier.FeedPressure.Min}~${paramsPrettier.FeedPressure.Max}) MPa` },
          { id: 9, name: '使用环境温度', value: `${paramsPrettier.OperatingAmbientTemperature.Min}~${paramsPrettier.OperatingAmbientTemperature.Max} ℃` },
          { id: 10, name: '外形尺寸', value: `${paramsPrettier.OverallSize.Length}mm×${paramsPrettier.OverallSize.Width}mm×${paramsPrettier.OverallSize.Height}mm` }
        ]
        break
      case 'ChipRemovalFilterSystem':
        res = [
          { id: 1, name: '容积', value: `${paramsPrettier.Volume} L` },
          { id: 2, name: '压力', value: `(${paramsPrettier.Pressure.Min}~${paramsPrettier.Pressure.Max}) MPa` },
          { id: 3, name: '流量', value: `${paramsPrettier.Flow.Min}~${paramsPrettier.Flow.Max} L/min` },
          { id: 4, name: '排屑能力', value: `≤${paramsPrettier.ChipRemovalCapacity} kg/h` },
          { id: 5, name: '过滤精度', value: `${paramsPrettier.FiltrationAccuracy} μm` },
          { id: 6, name: '适用类型', value: _.isArray(paramsPrettier.ApplicableChipTypes) ? paramsPrettier.ApplicableChipTypes.join(',') : paramsPrettier.ApplicableChipTypes }
        ]
        break
      case 'CuttingFluidFiltrationSystem':
        res = [
          { id: 1, name: '总容积', value: `${paramsPrettier.TotalVolume} L` },
          { id: 2, name: '供应机床数量', value: `${paramsPrettier.MachineNum} 台` },
          { id: 3, name: '供液泵扬程', value: `${paramsPrettier.FeedPumpPressure} m` },
          { id: 4, name: '供液泵流量', value: `${paramsPrettier.FeedPumpFlow} L/min` },
          { id: 5, name: '污液提升泵扬程', value: `${paramsPrettier.SewageLiftPumpPressure === ' - ' ? '根据实际工况设置' : paramsPrettier.SewageLiftPumpPressure + ' m'}` },
          { id: 6, name: '污液提升泵流量', value: `${paramsPrettier.SewageLiftPumpFlow === ' - ' ? '根据实际工况设置' : paramsPrettier.SewageLiftPumpFlow + ' L/min'}` },
          { id: 7, name: '过滤精度', value: `${paramsPrettier.FiltrationPrecision} μm` },
          { id: 8, name: '制冷机制冷量', value: `${paramsPrettier.RefrigeratingCapacity} kW` },
          { id: 9, name: '供液循环周期', value: paramsPrettier.FeedingCycle },
          { id: 10, name: '换液循环周期', value: paramsPrettier.LiquidExchangeCycle },
          { id: 11, name: '总站内循环周期', value: paramsPrettier.CycleInTerminus }
        ]
        break
      case 'DustCollector':
        res = [
          { id: 1, name: '风量', value: `${paramsPrettier.AirVolume} m³/h` },
          { id: 2, name: '静压', value: `${paramsPrettier.StaticPressure} Pa` },
          { id: 3, name: '功率', value: `${paramsPrettier.Power} kW` },
          { id: 4, name: '过滤精度', value: `${paramsPrettier.FiltrationAccuracy} μm` },
          { id: 5, name: '过滤原理', value: paramsPrettier.FilterPrinciples },
          { id: 6, name: '滤芯数量', value: `${paramsPrettier.FilterElementCount} 个` },
          { id: 7, name: '噪声', value: `${paramsPrettier.Noise}±${paramsPrettier.NoiseRange} dB` },
          { id: 8, name: '尺寸', value: `${paramsPrettier.Size.Length}mm×${paramsPrettier.Size.Width}mm×${paramsPrettier.Size.Height}mm` }
        ]
        break
      case 'HollowWaterFiltrationSystem':
        res = [
          { id: 1, name: '压力范围', value: `(${paramsPrettier.Pressure.Min}~${paramsPrettier.Pressure.Max}) MPa` },
          { id: 2, name: '最大流量', value: `${paramsPrettier.FlowMax} L/min` },
          { id: 3, name: '功率', value: `${paramsPrettier.Power} kW` },
          { id: 4, name: '过滤精度', value: `${paramsPrettier.ThirdFiltrationAccuracy} μm` },
          { id: 5, name: '结构形式', value: paramsPrettier.StructureType },
          { id: 6, name: '适用刀具', value: paramsPrettier.ApplicableTool },
          { id: 7, name: '液体粘度', value: `${paramsPrettier.LiquidViscosity.Min}~${paramsPrettier.LiquidViscosity.Max} cSt` },
          { id: 8, name: '使用要求', value: paramsPrettier.Requirements }
        ]
        break
      case 'LaserToolAligner':
        res = [
          { id: 1, name: '重复精度2σ', value: `${paramsPrettier.Repeatability} μm` },
          { id: 2, name: '防护等级', value: paramsPrettier.ProtectionLevel },
          { id: 3, name: '可测刀具直径范围', value: `${paramsPrettier.MeasurableToolDiameter.Min}~${paramsPrettier.MeasurableToolDiameter.Max} mm` },
          { id: 4, name: '绝对精度', value: `${paramsPrettier.AbsolutePrecision.Min}~${paramsPrettier.AbsolutePrecision.Max} μm` },
          { id: 5, name: '功能', value: paramsPrettier.Features }
        ]
        break
      case 'MicroscaleOilMistLubrication':
        res = [
          { id: 1, name: '油杯储油量', value: `${paramsPrettier.OilCupStorage} mL` },
          { id: 2, name: '润滑油品牌', value: paramsPrettier.OilBrand },
          { id: 3, name: '润滑油牌号', value: paramsPrettier.OilAgent },
          { id: 4, name: '单喷嘴耗油量', value: `${paramsPrettier.SingleFuelConsumptionMax} mL/h` },
          { id: 5, name: '单喷嘴正常工作耗气量', value: `${paramsPrettier.SingleAirConsumption} L/min` },
          { id: 6, name: '单个模块配管长', value: `${paramsPrettier.SinglePipingLength} m` },
          { id: 7, name: '气压', value: `(${paramsPrettier.AirPressure.Min}~${paramsPrettier.AirPressure.Max}) MPa` },
          { id: 8, name: '使用环境温度', value: `${paramsPrettier.AmbientTemperature.Min}~${paramsPrettier.AmbientTemperature.Max} ℃` },
          { id: 9, name: '可调频率', value: `${paramsPrettier.AdjustableFrequency.Min}~${paramsPrettier.AdjustableFrequency.Max}` }
        ]
        break
      case 'OilMistCollector':
        res = [
          { id: 1, name: '风量', value: `${paramsPrettier.AirVolumeMax} m³/h` },
          { id: 2, name: '静压', value: `${paramsPrettier.StaticPressure} Pa` },
          { id: 3, name: '额定功率', value: `${paramsPrettier.RatedPower} W` },
          { id: 4, name: '过滤原理', value: paramsPrettier.FilterPrinciples },
          { id: 5, name: '过滤精度', value: `${paramsPrettier.Precision} μm` },
          { id: 6, name: '过滤效率', value: `${paramsPrettier.Effectiveness}%` },
          { id: 7, name: '噪声', value: `${paramsPrettier.Noise} dB` },
          { id: 8, name: '外形尺寸', value: `${paramsPrettier.Size.Length}mm×${paramsPrettier.Size.Width}mm×${paramsPrettier.Size.Height}mm` },
          { id: 9, name: '总质量不带支架', value: `${paramsPrettier.TotalWeight} kg` }
        ]
        break
      case 'Refrigerator':
        res = [
          { id: 1, name: '出风口数量', value: `${paramsPrettier.OutletNumber} 个` },
          { id: 2, name: '出风方向', value: paramsPrettier.WindDirection },
          { id: 3, name: '电源类型', value: paramsPrettier.Power },
          { id: 4, name: '压缩机类型', value: paramsPrettier.CompressorType },
          { id: 5, name: '是否有脚轮', value: paramsPrettier.HasCasters },
          { id: 6, name: '是否有包装箱', value: paramsPrettier.HasBoxes },
          { id: 7, name: '控制精度', value: `±${paramsPrettier.ControlPrecision} ℃` },
          { id: 8, name: '制冷量', value: `${paramsPrettier.RefrigeratingCapacity} kW` },
          { id: 9, name: '水泵扬程', value: `${paramsPrettier.PumpHead} m` },
          { id: 10, name: '净重', value: `${paramsPrettier.NetWeight} kg` },
          { id: 11, name: '外形尺寸', value: `${paramsPrettier.OverallSize.Length}mm×${paramsPrettier.OverallSize.Width}mm×${paramsPrettier.OverallSize.Height}mm` },
          { id: 12, name: '语言种类', value: paramsPrettier.LanguageCategory }
        ]
        break
      case 'Spindle':
        res = [
          { id: 1, name: '刀柄接口', value: paramsPrettier.ShankInterface },
          { id: 2, name: '最高转速', value: `${paramsPrettier.SpeedMax} r/min` },
          { id: 3, name: '额定功率', value: `${paramsPrettier.RatedPower} kW` },
          { id: 4, name: '额定电流', value: `${paramsPrettier.RatedCurrent} A` },
          { id: 5, name: '额定扭矩', value: `${paramsPrettier.RatedTorque} N·m` },
          { id: 6, name: '最大夹持刀具直径', value: `≤φ${paramsPrettier.ClampingToolMax} mm` },
          { id: 7, name: '主轴外径', value: `φ${paramsPrettier.Diameter} mm` },
          { id: 8, name: '电机形式', value: `${['同步电机', '异步电机'][paramsPrettier.MotorForm]}` },
          { id: 9, name: '是否中空', value: `${paramsPrettier.IsHollow === 'on' ? '是' : '否'}` },
          { id: 10, name: '主轴制冷液流量', value: `≥ ${paramsPrettier.RefrigerantFlow} L/min` },
          { id: 11, name: '主轴制冷液温度', value: paramsPrettier.RefrigerantTemperature },
          { id: 12, name: '主轴制冷液压力', value: `${paramsPrettier.RefrigerantPressure} MPa` },
          { id: 13, name: '主轴正压密封气源质量', value: paramsPrettier.AirSourceQuality },
          { id: 14, name: '主轴正压密封气源压力', value: `(${paramsPrettier.AirSourcePressure.Min} ~ ${paramsPrettier.AirSourcePressure.Max}) MPa` }
        ]
        break
      case 'ToolMagazine':
        res = [
          { id: 1, name: '适用刀柄', value: paramsPrettier.ApplicableShank },
          { id: 2, name: '刀库容量', value: paramsPrettier.ToolCapacity },
          { id: 3, name: '临刀满刀最大直径', value: `${paramsPrettier.MaxToolDiameter.Full} mm` },
          { id: 4, name: '临刀空刀最大直径', value: `${paramsPrettier.MaxToolDiameter.Empty} mm` },
          { id: 5, name: '刀位最大配重', value: `${paramsPrettier.MaxToolWeight.Single} kg` },
          { id: 6, name: '刀库最大总配重', value: `${paramsPrettier.MaxToolWeight.Total} kg` },
          { id: 7, name: '允许最大刀具长度', value: `${paramsPrettier.ToolLengthMax} mm(主轴端面开始计算)` },
          { id: 8, name: '刀库换刀形式', value: `${['刀库换刀', '机械手换刀'][paramsPrettier.ToolChanger]}` },
          { id: 9, name: '刀对刀换刀时间', value: `${paramsPrettier.ToolChangeTime} s` },
          { id: 10, name: '备刀功能', value: `${paramsPrettier.IsPrepareTool === 'on' ? '有' : '无'}` }
        ]
        break
      case 'TouchingProbe':
        res = [
          { id: 1, name: '接触方式', value: paramsPrettier.TouchingMethod },
          { id: 2, name: 'Z向触发力', value: `${paramsPrettier.Z_DirectionTriggerForce} N` },
          { id: 3, name: '接近方向', value: paramsPrettier.ApproachingDirection },
          { id: 4, name: '重复精度2σ', value: `${paramsPrettier.Repeatability} μm` },
          { id: 5, name: '防护等级', value: paramsPrettier.ProtectionLevel },
          { id: 6, name: '工作温度', value: `${paramsPrettier.OperatingTemperature.Min}~${paramsPrettier.OperatingTemperature.Max} ℃` }
        ]
        break
      case 'TouchingToolAligner':
        res = [
          { id: 1, name: '对刀面直径', value: `${paramsPrettier.FaceDiameter} mm` },
          { id: 2, name: '触发压缩行程', value: `${paramsPrettier.CompressionStroke} mm` },
          { id: 3, name: '重复精度2σ', value: `${paramsPrettier.Repeatability} μm` },
          { id: 4, name: '触发力', value: `${paramsPrettier.TriggerForceMin} N` },
          { id: 5, name: '防护等级', value: paramsPrettier.ProtectionLevel },
          { id: 6, name: '可测最小刀具直径', value: `${paramsPrettier.MeasurableToolDiameterMin} mm` },
          { id: 7, name: '功能', value: paramsPrettier.Features }
        ]
        break
      case 'ZeroPointChangeClampingSystem':
        res = []
        if (paramsPrettier.IsRevolvingBody === 'on') {
          res.push({ id: 1, name: '外形尺寸', value: `φ${paramsPrettier.Size.Diameter}mm×${paramsPrettier.Size.Height}mm` })
        } else {
          res.push({ id: 1, name: '外形尺寸', value: `${paramsPrettier.Size.Length}mm×${paramsPrettier.Size.Width}mm×${paramsPrettier.Size.Height}mm` })
        }
        res = [
          ...res,
          { id: 2, name: '最大重复定位精度', value: `${paramsPrettier.RepeatabilityMax} mm` },
          { id: 3, name: '工作压力', value: `(${paramsPrettier.WorkPressure.Min}~${paramsPrettier.WorkPressure.Max}) MPa` },
          { id: 4, name: '使用寿命', value: `${paramsPrettier.ServiceLife} 万次` },
          { id: 5, name: '拓展功能', value: paramsPrettier.ExtendedFeatures }
        ]
        break
      case 'Sample':
        res = [
          { id: 1, name: '加工刀具', value: paramsPrettier.Tool },
          { id: 2, name: '转台配置', value: paramsPrettier.Platform },
          { id: 3, name: '加工特点', value: _.join(paramsPrettier.Feature, ',') },
          { id: 4, name: '加工类型', value: paramsPrettier.Type },
          { id: 5, name: '加工设备', value: paramsPrettier.Machine },
          { id: 6, name: '主轴配置', value: paramsPrettier.Spindle },
          { id: 7, name: '加工材料', value: paramsPrettier.Material },
          { id: 8, name: '工件尺寸', value: paramsPrettier.ParticleSize },
          { id: 9, name: '加工时间', value: paramsPrettier.Time },
          { id: 10, name: '检测报告', value: paramsPrettier.TestText }
        ]
        break
      default:
        break
    }

    return res
  },
  // 产品关键参数
  productKeyTechParamsFlat: () => product => {
    let cloneProduct = _.cloneDeep(product)
    let productPrettier = modelEmptyPrettier(cloneProduct, ' - ')
    let paramsPrettier = productPrettier.params

    let res = ''
    switch (product.tplCode || product.params.TplCode) {
      // 自动供料系统
      case 'AutomaticFeedingSystem':
      case 'AutomaticFeedingSystemOther':
        res += `机械手负载${paramsPrettier.ManipulatorLoad}kg、机械手Z轴行程${paramsPrettier.ManipulatorZAxisStroke}mm、料仓容量${paramsPrettier.BinCapacity}料位`
        break
      // 油雾收集器
      case 'OilMistCollector':
        res += `风量${paramsPrettier.AirVolumeMax}m³/h、过滤精度${paramsPrettier.Precision}μm、额定功率${paramsPrettier.RatedPower}W`
        break
      // 集尘器
      case 'DustCollector':
        res += `风量${paramsPrettier.AirVolume}m³/h、过滤精度${paramsPrettier.FiltrationAccuracy}μm、额定功率${paramsPrettier.Power}kW、${productPrettier.brand}品牌`
        break
      // 制冷机
      case 'Refrigerator':
        res += `制冷量${paramsPrettier.RefrigeratingCapacity}kW、控制精度±${paramsPrettier.ControlPrecision}℃`
        break
      // 集中制冷系统
      case 'CentralizedRefrigerationSystem':
        res += `制冷量${paramsPrettier.CoolingCapacity}kW、温度调节精度${paramsPrettier.TemperatureControlPrecision}℃`
        break
      // 中空过滤系统
      case 'HollowWaterFiltrationSystem':
        res += `压力(${paramsPrettier.Pressure.Min}~${paramsPrettier.Pressure.Max})MPa、精度${paramsPrettier.ThirdFiltrationAccuracy}`
        break
      // 排屑过滤系统
      case 'ChipRemovalFilterSystem':
        res += `排屑能力${paramsPrettier.ChipRemovalCapacity}kg/h、过滤精度${paramsPrettier.FiltrationAccuracy}μm、容积${paramsPrettier.Volume}L`
        break
      // 切削液集中过滤系统
      case 'CuttingFluidFiltrationSystem':
        res += `过滤精度${paramsPrettier.FiltrationPrecision}μm、供液循环周期${paramsPrettier.FeedingCycle}、供液泵流量${paramsPrettier.FeedPumpFlow}L/min`
        break
      // 微量油雾润滑
      case 'MicroscaleOilMistLubrication':
        res += `耗油量${paramsPrettier.SingleFuelConsumptionMax}mL/h、气压变化范围(${paramsPrettier.AirPressure.Min}~${paramsPrettier.AirPressure.Max})MPa、${productPrettier.brand}品牌`
        break
      // 接触式对刀仪
      case 'TouchingToolAligner':
        res += `重复精度${paramsPrettier.Repeatability}μm、触发力${paramsPrettier.TriggerForceMin}N、${productPrettier.brand}品牌`
        break
      // 激光对刀仪
      case 'LaserToolAligner':
        res += `重复精度${paramsPrettier.Repeatability}μm、可测量刀具直径范围${paramsPrettier.MeasurableToolDiameter.Min}~${paramsPrettier.MeasurableToolDiameter.Max}mm、${productPrettier.brand}品牌`
        break
      // 接触式测头
      case 'TouchingProbe':
        res += `重复精度${paramsPrettier.Repeatability}μm、Z向触发力${paramsPrettier.Z_DirectionTriggerForce}N、${productPrettier.brand}品牌`
        break
      // 零点快换
      case 'ZeroPointChangeClampingSystem':
        if (paramsPrettier.IsRevolvingBody === 'on') {
          res += `φ${paramsPrettier.Size.Diameter}mm×${paramsPrettier.Size.Height}mm`
        } else {
          res += `${paramsPrettier.Size.Length}mm×${paramsPrettier.Size.Width}mm×${paramsPrettier.Size.Height}mm`
        }
        res += `、重复定位精度${paramsPrettier.RepeatabilityMax}mm、工作压力(${paramsPrettier.WorkPressure.Min}~${paramsPrettier.WorkPressure.Max})MPa`
        break
      // 主轴
      case 'Spindle':
        res += `刀柄接口${paramsPrettier.ShankInterface}、最高转速${paramsPrettier.SpeedMax}r/min、额定功率${paramsPrettier.RatedPower}kW、额定扭矩${paramsPrettier.RatedTorque}N·m、最大夹持刀具直径≤φ${paramsPrettier.ClampingToolMax}mm`
        break
      // 刀库
      case 'ToolMagazine':
        res += `适用刀柄${paramsPrettier.ApplicableShank}、刀库容量${paramsPrettier.ToolCapacity}、临刀满刀最大直径${paramsPrettier.MaxToolDiameter.Full}mm、临刀空刀最大直径${paramsPrettier.MaxToolDiameter.Empty}mm、刀位最大配重${paramsPrettier.MaxToolWeight.Single}kg、刀库最大总配重${paramsPrettier.MaxToolWeight.Total}kg`
        break
      // 样品
      case 'Sample':
        res += `${paramsPrettier.Feature}、${paramsPrettier.Type}加工`
        break
      default:
        res += productPrettier.notes
        break
    }

    return res
  }
}
