// 例子，如果想行合并或者列合并
// data = [
//   {
//     name: '<td style="color:red;" rowspan=2>清单</td>',
//     age: '',
//     sex: '',
//     companyName: '',
//     companyAddress: ''
//   },
//   {
//     age: '2',
//     sex: '女',
//     companyName: '公司2',
//     companyAddress: '公司地址2'
//   },
//   {
//     name: '嘻嘻',
//     age: '3',
//     sex: '男',
//     companyName: '公司3',
//     companyAddress: '公司地址3'
//   },
//   {
//     name: '啦啦',
//     age: 4,
//     sex: '女',
//     companyName: '公司4',
//     companyAddress: '公司地址4'
//   }
// ]
// let keyMap = {
//   name: '姓名',
//   age: '年龄',
//   sex: '性别',
//   companyName: '公司名称',
//   companyAddress: '公司地址'
// }
/**
 * 由json导出excel
 * @param {*} options 配置选项，参考https://github.com/xxj95719/custom-json2excel
 */
export function jsonToExcel (options) {
  const json2excel = new Json2Excel(options)
  json2excel.generate()
}
// import download from "./utils/download.js";
class Json2Excel {
  // eslint-disable-next-line space-before-function-paren
  constructor({
    data = [],
    exportFields = false,
    fields = false,
    filters = [],
    footer = [],
    keyMap = {},
    name = 'excel',
    sheetName = 'sheet',
    title = [],
    headStyle = '',
    type = 'xls',
    onStart = () => { },
    onSuccess = () => { }
  }) {
    this.data = data
    this.exportFields = exportFields
    this.fields = fields
    this.filters = filters
    this.footer = footer
    this.keyMap = keyMap
    this.name = name
    this.sheetName = sheetName
    this.title = title
    this.headStyle = headStyle
    this.type = type
    this.onStart = onStart
    this.onSuccess = onSuccess
  }
  downloadFields () {
    if (this.fields !== undefined) return this.fields

    if (this.exportFields !== undefined) return this.exportFields
  }
  toChsKeys (json, keyMap) {
    return json.map(item => {
      if (this.filters.length === 0) {
        for (let key in item) {
          if (keyMap.hasOwnProperty(key)) {
            item[keyMap[key]] = item[key]
            delete item[key]
          }
        }
      } else {
        for (let filterItem of this.filters) {
          delete item[filterItem]
          for (let key in item) {
            if (keyMap.hasOwnProperty(key)) {
              item[keyMap[key]] = item[key]
              delete item[key]
            }
          }
        }
      }
      return item
    })
  }
  generate () {
    if (!this.data.length) {
      return
    }
    this.onStart()
    let json = this.getProcessedJson(this.data, this.downloadFields())
    if (
      Object.keys(this.keyMap).length !== 0 &&
      this.keyMap instanceof Object
    ) {
      json = this.toChsKeys(json, this.keyMap)
    }
    if (this.type === 'csv') {
      return this.export(
        this.jsonToCSV(json),
        `${this.name}.${this.type}`,
        'application/csv'
      )
    }
    return this.export(
      this.jsonToXLS(json),
      `${this.name}.${this.type}`,
      'application/vnd.ms-excel'
    )
  }
  download (blob, filename) {
    const anchor = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    anchor.href = url
    anchor.setAttribute('download', filename)
    anchor.innerHTML = 'downloading...'
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    setTimeout(() => {
      anchor.click()
      document.body.removeChild(anchor)
      setTimeout(() => { self.URL.revokeObjectURL(anchor.href) }, 250)
    }, 66)
  }
  /*
  使用 downloadjs 生成下载链接
  */
  export (data, filename, mime) {
    new Promise((resolve, reject) => {
      let blob = this.base64ToBlob(data, mime)
      resolve(this.download(blob, filename))
    })
      .then(res => {
        this.onSuccess()
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => { })
  }
  /*
  jsonToXLS
  ---------------
    将json数据转换为XLS文件
  */
  jsonToXLS (data) {
    let xlsTemp =
      // eslint-disable-next-line no-template-curly-in-string
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + this.sheetName + '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>'
    let xlsData = '<thead><tr>'
    // Header
    if (this.title.length !== 0) {
      for (let i of this.title) {
        xlsData += `<th colspan=${i.colspan} style="${i.style}"}}>${i.name}`
      }
      xlsData += '<th></tr>'
    }
    // Fields
    for (let key in data[0]) {
      xlsData += `<th style="font-size:17px;${this.headStyle}">` + key + '</th>'
    }
    xlsData += '</tr></thead>'
    xlsData += '<tbody>'
    // Data

    data.map(function (item, index) {
      xlsData += '<tbody><tr style="font-size:16px">'
      for (let key in item) {
        if (item[key].toString().includes('</td>') && item[key].toString().substr(0, 3) === '<td') {
          xlsData += item[key]
        } else {
          xlsData += '<td style="font-size:16px">' + item[key] || '' + '</td>'
        }
      }
      xlsData += '</tr></tbody>'
    })
    // Footer
    if (this.footer.length !== 0) {
      xlsData += '<tfooter><tr>'
      for (let i of this.footer) {
        xlsData += `<th colspan=${i.colspan}>${i.name}`
      }
      xlsData += '<th></tr></tr></tfooter>'
    }
    // eslint-disable-next-line no-template-curly-in-string
    return xlsTemp.replace('${table}', xlsData)
  }
  /*
  jsonToCSV
  ---------------
  将json数据转换为CSV文件
  */
  jsonToCSV (data) {
    var csvData = ''
    // Header
    if (this.title.length !== 0) {
      for (let i of this.title) {
        csvData += `${i.name}`
      }
      csvData += '\r\n'
    }
    // Fields
    for (let key in data[0]) {
      csvData += key + ','
    }
    csvData = csvData.slice(0, csvData.length - 1)
    csvData += '\r\n'
    // Data
    data.map(function (item) {
      for (let key in item) {
        let escapedCSV = item[key] + '' // cast Numbers to string
        if (escapedCSV.match(/[,"\n]/)) {
          // eslint-disable-next-line no-useless-escape
          escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"'
        }
        csvData += escapedCSV + ','
      }
      csvData = csvData.slice(0, csvData.length - 1)
      csvData += '\r\n'
    })
    // Footer
    if (this.footer.length !== 0) {
      for (let i of this.footer) {
        csvData += `${i.name}`
      }
      csvData += '\r\n'
    }
    return csvData
  }
  /*
  getProcessedJson
  ---------------
  仅获取要导出的数据，如果未设置任何字段则返回所有数据
  */
  getProcessedJson (data, header) {
    let keys = this.getKeys(data, header)
    let newData = []
    let _self = this
    data.map(function (item, index) {
      let newItem = {}
      for (let label in keys) {
        // var iii = item
        let property = keys[label]
        item.hasOwnProperty(label) && (newItem[label] = _self.getNestedData(property, item))
      }
      newData.push(newItem)
    })

    return newData
  }
  getKeys (data, header) {
    if (header) {
      return header
    }

    let keys = {}
    for (let key in data[0]) {
      keys[key] = key
    }
    return keys
  }
  /*
parseExtraData
---------------
将标题和页脚属性解析为csv格式
*/
  parseExtraData (extraData, format) {
    let parseData = ''
    if (Array.isArray(extraData)) {
      for (var i = 0; i < extraData.length; i++) {
        // eslint-disable-next-line no-template-curly-in-string
        parseData += format.replace('${data}', extraData[i])
      }
    } else {
      // eslint-disable-next-line no-template-curly-in-string
      parseData += format.replace('${data}', extraData)
    }
    return parseData
  }
  callItemCallback (field, itemValue) {
    if (typeof field === 'object' && typeof field.callback === 'function') {
      return field.callback(itemValue)
    }
    return itemValue
  }
  getNestedData (key, item) {
    const field = typeof key === 'object' ? key.field : key

    let valueFromNestedKey = null
    let keyNestedSplit = field.split('.')

    valueFromNestedKey = item[keyNestedSplit[0]]
    for (let j = 1; j < keyNestedSplit.length; j++) {
      valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]]
    }

    valueFromNestedKey = this.callItemCallback(key, valueFromNestedKey)

    valueFromNestedKey =
      valueFromNestedKey === null || valueFromNestedKey === undefined
        ? ''
        : valueFromNestedKey // 过滤null、undefined的值

    return valueFromNestedKey
  }
  base64ToBlob (data, mime) {
    let base64 = window.btoa(window.unescape(encodeURIComponent(data)))
    let bstr = atob(base64)
    let n = bstr.length
    let u8arr = new Uint8ClampedArray(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime
    })
  }
}
