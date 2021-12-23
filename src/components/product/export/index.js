import { i18n } from '@/boot/i18n'
import { jsonToExcel } from '@/utils/json-to-excel'

export function exportExcel (product, techParamsFlat, configs) {
  const isMachinetool = product.classification === 'machinetool'

  // 基础参数
  let baseInfo = {
    machinetool: [
      { name: i18n.t('product.fields.axisCount'), value: product.params.axisCount }
    ],
    accessory: [
      { name: i18n.t('product.fields.specModel'), value: product.specModel },
      { name: i18n.t('product.fields.materialCode'), value: product.materialCode },
      { name: i18n.t('product.fields.brand'), value: product.brand }
    ]
  }

  // 技术参数
  techParamsFlat = _.map(techParamsFlat, i => {
    return {
      name: i.name,
      value: i.value || ''
    }
  })

  // 配置
  let configInfo = {
    machinetool: [],
    accessory: []
  }
  configs.forEach(config => {
    isMachinetool
      ? configInfo.machinetool.push({ name: config.title, value: config.specModel })
      : configInfo.accessory.push({ name: config.title, value: '' })
  })

  // assemble data
  let groupHeaderStyle = 'text-align:center;font-size:1em;font-weight:bold;background-color:#BDD7EE;'
  let data = [
    ...(baseInfo[isMachinetool ? 'machinetool' : 'accessory']),
    { name: `<td colspan=2 style="${groupHeaderStyle}">技术参数</td>`, value: '' },
    ...techParamsFlat,
    { name: `<td colspan=2 style="${groupHeaderStyle}">${isMachinetool ? '附件配置' : '关联机床'}</td>`, value: '' },
    ...(configInfo[isMachinetool ? 'machinetool' : 'accessory'])
  ]

  let options = {
    name: product.title,
    data,
    keyMap: {
      name: '名称',
      value: '参数'
    },
    filters: [],
    title: [
      { name: product.title, colspan: 2, style: groupHeaderStyle }
    ],
    footer: [
      { name: new Date().toLocaleDateString(), colspan: 2 }
    ]
  }
  jsonToExcel(options)
}
