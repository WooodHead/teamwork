import commomFields from '@/utils/model-common-fields'
import File from '@/store/file/model'
import { tableToArray } from '@/utils/table-to-array'

// 初始模型对象
const init = {
  id: 0,
  parentId: 0,
  level: 0,
  path: '',
  classification: '', // 产品系列【机床产品、附件产品、软件产品等】
  title: '',
  notes: '', // 备注，可以是机床特点等
  brand: '精雕',
  specModel: '',
  productCode: '',
  materialCode: '',
  configType: 1, // 0选配；1标配；2定制
  maturity: 2, // 默认是成熟产品
  tplCode: 'Default',
  imgUrl: '',
  params: {}, // 由level、tplCode决定结构
  customParams: {}, // 自定义参数
  isPublish: 1, // 【草稿、已发布】默认已发布
  orderNo: 0,
  history: []
}

function fromOne (end) {
  return {
    id: end.Id,
    parentId: end.ParentID,
    level: end.Level,
    path: end.Path,
    classification: end.Classification,
    title: end.Title,
    notes: end.Notes,
    brand: end.Brand,
    specModel: end.SpecModel,
    productCode: end.ProductCode,
    materialCode: end.MaterialCode,
    configType: end.ConfigType,
    maturity: end.Maturity,
    tplCode: end.TplCode,
    imgUrl: end.ImgUrl,
    params: JSON.parse(end.Params),
    customParams: JSON.parse(end.CustomParams || '{}'),
    isPublish: end.IsPublish,
    orderNo: end.OrderNo,
    history: JSON.parse(end.History || '[]'),
    ...(commomFields.from(end)),
    // 表外字段
    parents: end.Parents ? Product.from(end.Parents) : [],
    docId: end.DocID,
    targetDocId: end.TargetDocID,
    proportion: end.Proportion
  }
}

function toOne (front) {
  if (front.classification === 'sample') {
    front.params.Test = tableToArray(front.params.TestText)
  }
  return {
    Id: front.id,
    ParentID: front.parentId,
    Level: front.level,
    Path: front.path,
    Classification: front.classification,
    Title: front.title,
    Notes: front.notes,
    Brand: front.brand,
    SpecModel: front.specModel,
    ProductCode: front.productCode,
    MaterialCode: front.materialCode,
    ConfigType: front.configType,
    Maturity: front.maturity,
    TplCode: front.tplCode,
    ImgUrl: front.imgUrl,
    Params: JSON.stringify(front.params),
    CustomParams: JSON.stringify(front.customParams),
    IsPublish: front.isPublish,
    OrderNo: front.orderNo,
    History: JSON.stringify(front.history),
    Files: front.files ? File.to(front.files) : [],
    ...(commomFields.to(front))
  }
}

/**
 * 依据tplId补全params对象结构
 * 当是具体产品tplId=tplCode；当是型号tplId=classification的首字母大写
 * @export
 * @param {*} tplId 模板id
 * @param {*} product 产品对象
 * @returns
 */
function initAdditional (tplId, product) {
  let initClone = Object.assign({}, _.cloneDeep(init), product)
  switch (tplId) {
    // 机床
    case 'machinetool':
      initClone.classification = 'machinetool'
      // 机床产品目前保持第4级是产品的约定
      product && product.level === 3 && (initClone.tplCode = 'FiveAxis')
      break
    case 'FiveAxis':
      initClone.classification = 'machinetool'
      initClone.tplCode = ''
      initClone.params = {
        axisCount: 5,
        TplCode: 'FiveAxis',
        Accuracy: { Position: { AAxis: '', BAxis: '', CAxis: '', XAxis: '', YAxis: '', ZAxis: '' }, Repeated: { AAxis: '', BAxis: '', CAxis: '', XAxis: '', YAxis: '', ZAxis: '' } },
        FeedSpeed: { CuttingSpeed: { AAxis: '', BAxis: '', CAxis: '', XAxis: '', YAxis: '', ZAxis: '' }, PositionSpeed: { AAxis: '', BAxis: '', CAxis: '', XAxis: '', YAxis: '', ZAxis: '' } },
        Turntable: { Form: '', AAxis: { SafetyBrake: '', PositionBrake: '' }, CAxis: { PositionBrake: '' } },
        EnergyConsume: { Voltage: '', AirSourcePressure: '', FuelTankCapacity: '', TotalPower: '' },
        MachineToolSize: { Area: '', Width: '', Height: '', Length: '', Weight: '', Foundation: '' },
        ProcessingRange: { FeedHeight: '', WorkStroke: { XAxis: '', YAxis: '', ZAxis: '' }, RotationAngle: { AAxis: '', BAxis: '', CAxis: '' }, MaxBearingWeight: '', MaxWorkpieceSize: { Height: '', Diameter: '' }, WorkbenchDiameter: '', ProcessingAreaSpace: '' }
      }
      break
    case 'ThreeAxis':
      initClone.classification = 'machinetool'
      initClone.tplCode = ''
      initClone.params = {
        axisCount: 3,
        TplCode: 'ThreeAxis',
        Accuracy: { Position: { XAxis: '', YAxis: '', ZAxis: '' }, Repeated: { XAxis: '', YAxis: '', ZAxis: '' } },
        FeedSpeed: { CuttingSpeed: { XAxis: '', YAxis: '', ZAxis: '' }, FastForwardSpeed: { XAxis: '', YAxis: '', ZAxis: '' } },
        EnergyConsume: { Voltage: '', TotalPower: '', FuelTankCapacity: '', AirSourcePressure: '' },
        MachineToolSize: { Area: '', Width: '', Height: '', Length: '', Weight: '', Foundation: '' },
        ProcessingRange: { WorkStroke: { XAxis: '', YAxis: '', ZAxis: '' }, WorkbenchSize: { Width: '', Length: '' }, MaxBearingWeight: '', MaxWorkpieceHeight: '', ProcessingAreaSpace: '', SpindleWorkbenchDistance: { Max: '', Min: '' } }
      }
      break

    // 主轴
    case 'spindle':
      initClone.classification = 'spindle'
      initClone.tplCode = 'Spindle'
      break
    case 'Spindle':
      initClone.classification = 'spindle'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'Spindle', Diameter: '', SpeedMax: '', MotorForm: '0', RatedPower: '', RatedTorque: '', RatedCurrent: '', ShankInterface: '', ClampingToolMax: '', IsHollow: 'off', RefrigerantFlow: '', RefrigerantTemperature: '', RefrigerantPressure: '', AirSourceQuality: '', AirSourcePressure: { Min: '', Max: '' }
      }
      break

    // 刀库
    case 'toolmagazine':
      initClone.classification = 'toolmagazine'
      initClone.tplCode = 'ToolMagazine'
      break
    case 'ToolMagazine':
      initClone.classification = 'toolmagazine'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'ToolMagazine', ToolChanger: '0', ToolCapacity: '', IsPrepareTool: 'off', MaxToolWeight: { Total: '', Single: '' }, ToolLengthMax: '', ToolChangeTime: '', ApplicableShank: [], MaxToolDiameter: { Full: '', Empty: '' }
      }
      break

    // 附件辅机
    case 'accessory':
      initClone.classification = 'accessory'
      break
    case 'ChipRemovalFilterSystem':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'ChipRemovalFilterSystem', Flow: { Max: '', Min: '' }, Volume: '', Pressure: { Max: '', Min: '' }, FiltrationAccuracy: '', ApplicableChipTypes: [], ChipRemovalCapacity: ''
      }
      break
    case 'CuttingFluidFiltrationSystem':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'CuttingFluidFiltrationSystem', MachineNum: '', TotalVolume: '', FeedPumpFlow: '', FeedingCycle: '', CycleInTerminus: '', FeedPumpPressure: '', SewageLiftPumpFlow: '', FiltrationPrecision: '', LiquidExchangeCycle: '', RefrigeratingCapacity: '', SewageLiftPumpPressure: ''
      }
      break
    case 'OilMistCollector':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'OilMistCollector', Size: { Width: '', Height: '', Length: '' }, Noise: '', Precision: '', RatedPower: '', TotalWeight: '', AirVolumeMax: '', Effectiveness: '', StaticPressure: '', FilterPrinciples: ''
      }
      break
    case 'Refrigerator':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'Refrigerator', Power: '', HasCasters: '无', HasBoxes: '无', PumpHead: '', NetWeight: '', OverallSize: { Width: '', Height: '', Length: '' }, OutletNumber: '', WindDirection: '顶出风', CompressorType: '变频', ControlPrecision: '', LanguageCategory: '中文', RefrigeratingCapacity: ''
      }
      break
    case 'CentralizedRefrigerationSystem':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'CentralizedRefrigerationSystem', FeedFlow: { Max: '', Min: '' }, InputPower: '', TankVolume: '', OverallSize: { Width: '', Height: '', Length: '' }, FeedPressure: { Max: '', Min: '' }, CoolingCapacity: '', FiltrationPrecision: '', OperatingAmbientTemperature: { Max: '', Min: '' }, TemperatureControlPrecision: '', RefrigerationSystemControlMode: '变频'
      }
      break
    case 'DustCollector':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'DustCollector', Size: { Width: '', Height: '', Length: '' }, Noise: '', Power: '', AirVolume: '', NoiseRange: '', StaticPressure: '', FilterPrinciples: '', FilterElementCount: '', FiltrationAccuracy: ''
      }
      break
    case 'MicroscaleOilMistLubrication':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'MicroscaleOilMistLubrication', OilBrand: '', OilGrade: '', OilAgent: '', AirPressure: { Max: '', Min: '' }, OilCupStorage: '', AmbientTemperature: { Max: '', Min: '' }, SinglePipingLength: '', AdjustableFrequency: { Max: '', Min: '' }, SingleAirConsumption: '', SingleFuelConsumptionMax: ''
      }
      break
    case 'HollowWaterFiltrationSystem':
      initClone.classification = 'accessory'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'HollowWaterFiltrationSystem', Power: '', FlowMax: '', Pressure: { Max: '', Min: '' }, ThirdFiltrationAccuracy: '', StructureType: '', ApplicableTool: '', LiquidViscosity: { Min: '', Max: '' }, Requirements: ''
      }
      break

    // 在机检测
    case 'measure':
      initClone.classification = 'measure'
      break
    case 'TouchingProbe':
      initClone.classification = 'measure'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'TouchingProbe', Repeatability: '', TouchingMethod: '', ProtectionLevel: '', ApproachingDirection: '', OperatingTemperature: { Max: '', Min: '' }, Z_DirectionTriggerForce: ''
      }
      break
    case 'LaserToolAligner':
      initClone.classification = 'measure'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'LaserToolAligner', Features: [], MeasureTime: '', Repeatability: '', ProtectionLevel: '', AbsolutePrecision: { Max: '', Min: '' }, MeasurableToolDiameter: { Max: '', Min: '' }
      }
      break
    case 'TouchingToolAligner':
      initClone.classification = 'measure'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'TouchingToolAligner', Features: [], FaceDiameter: '', Repeatability: '', ProtectionLevel: '', TriggerForceMin: '', CompressionStroke: '', MeasurableToolDiameterMin: ''
      }
      break

    // 自动化
    case 'automation':
      initClone.classification = 'automation'
      break
    case 'AutomaticFeedingSystem':
      initClone.classification = 'automation'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'AutomaticFeedingSystem', Chuck: [], IsCyclotron: 'off', PalletSize: { Width: '', Height: '', Length: '', Diameter: '' }, BinCapacity: '', OverallSize: { Width: '', Height: '', Length: '' }, TotalWeight: '', ManipulatorLoad: '', MaxWorkpieceSize: { Width: '', Height: '', Length: '', Diameter: '' }, ManipulatorZAxisStroke: ''
      }
      break
    case 'AutomaticFeedingSystemOther':
      initClone.classification = 'automation'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'AutomaticFeedingSystemOther', Chuck: [], IsCyclotron: 'off', PalletSize: { Width: '', Height: '', Length: '', Diameter: '' }, BinCapacity: '', OverallSize: { Width: '', Height: '', Length: '' }, TotalWeight: '', ManipulatorLoad: '', MaxWorkpieceSize: { Width: '', Height: '', Length: '', Diameter: '' }, ManipulatorZAxisStroke: ''
      }
      break
    case 'ZeroPointChangeClampingSystem':
      initClone.classification = 'automation'
      initClone.tplCode = ''
      initClone.params = {
        TplCode: 'ZeroPointChangeClampingSystem', IsRevolvingBody: 'off', Size: { Width: '', Height: '', Length: '', Diameter: '' }, ServiceLife: '', WorkPressure: { Max: '', Min: '' }, ExtendedFeatures: [], RepeatabilityMax: ''
      }
      break

    // 软件
    case 'software':
      initClone.classification = 'software'
      break

    // 样品库
    case 'sample':
      initClone.classification = 'sample'
      initClone.tplCode = 'Sample'
      break
    case 'Sample':
      initClone.classification = 'sample'
      initClone.tplCode = ''
      initClone.params = { TplCode: 'Sample', Name: '', Theme: '', Tool: '', Platform: '', Feature: [], Type: '', Machine: '', Spindle: '', Material: '', ParticleSize: '', Time: '', HighLights: '', TestText: '', Test: [], Step: [], Link: 0, Img: [], Video: '', isRecommend: false }
      break

    default:
      break
  }

  return initClone
}

export default class Product {
  // eslint-disable-next-line space-before-function-paren
  constructor(Product) {
    Object.assign(this, init, Product)
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

  static additional (tplId, product = {}) {
    return initAdditional(tplId, product)
  }
}
