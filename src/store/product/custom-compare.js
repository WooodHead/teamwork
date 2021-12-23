import ProductState from './state'

// 排序字段数组、排序规则数组
let ORDERFIELDS = ['classification', 'level', 'orderNo', 'specModel', 'title']
let ORDERS = []

// 指定字段的排序规则数组
const arrClassification = ProductState.arrClassification

/**
 * 获取一个数符号
 *
 * @param {Number} num
 * @returns 正数返回1，负数返回-1，0返回0
 */
function getNumSign (num) {
  return num === 0 ? 0 : num / Math.abs(num)
}

/**
 * 自定义排序（数值）
 * 类似【JDHGT1200、JDHGT800】结构，【JDHGT1200】排在【JDHGT800】后面
 * 类似【83主轴、150主轴】结构，【150主轴】排在【83主轴】后面
 * @param {string} aVal 第一个值
 * @param {string} bVal 第二个值
 * @param {string} [sort='asc'] 排序规则
 * @returns 0/1/-1
 */
function customCompareVal (aVal, bVal, sort = 'asc') {
  if (!isNaN(aVal) && !isNaN(bVal)) {
    return getNumSign(aVal - bVal) * (sort === 'asc' ? 1 : -1)
  } else {
    if (new RegExp('\\D+\\d+\\D*').test(aVal) && new RegExp('\\D+\\d+\\D*').test(bVal)) {
      // 类似【JDHGT1200、JDHGT800】结构
      const leftWordA = new RegExp('\\D+').exec(aVal)[0]
      const rightNumberA = new RegExp('\\d+').exec(aVal)[0]
      const leftWordB = new RegExp('\\D+').exec(bVal)[0]
      const rightNumberB = new RegExp('\\d+').exec(bVal)[0]
      if (leftWordA === leftWordB && rightNumberA !== rightNumberB) {
        return getNumSign(+rightNumberA - +rightNumberB) * (sort === 'asc' ? 1 : -1)
      } else {
        return aVal.localeCompare(bVal) * (sort === 'asc' ? 1 : -1)
      }
    } else if (new RegExp('\\d+\\D+\\D*').test(aVal) && new RegExp('\\d+\\D+\\D*').test(bVal)) {
      // 类似【83主轴、150主轴】结构
      const leftNumberA = new RegExp('\\d+').exec(aVal)[0]
      const leftNumberB = new RegExp('\\d+').exec(bVal)[0]
      if (leftNumberA === leftNumberB) {
        return aVal.localeCompare(bVal) * (sort === 'asc' ? 1 : -1)
      } else {
        return getNumSign(+leftNumberA - +leftNumberB) * (sort === 'asc' ? 1 : -1)
      }
    } else {
      return aVal.localeCompare(bVal) * (sort === 'asc' ? 1 : -1)
    }
  }
}

/**
 * 自定义排序（对象）
 * @param {object} a 第一项
 * @param {object} b 第二项
 * @returns 0/1/-1
 */
function customCompareItem (a, b) {
  let aVal = null, bVal = null
  for (const field of ORDERFIELDS) {
    if (new RegExp('\\.').test(field)) {
      // index grow from 1,for json object
      aVal = field.split('.').reduce((pre, cur, index) => {
        return index === 1 ? a[pre][cur] : pre[cur]
      }) || 0
      bVal = field.split('.').reduce((pre, cur, index) => {
        return index === 1 ? b[pre][cur] : pre[cur]
      }) || 0
    } else {
      if (field === 'classification') {
        aVal = arrClassification.findIndex(k => k === a[field]) || 0
        bVal = arrClassification.findIndex(k => k === b[field]) || 0
      } else if (field === 'specModel') {
        if (['machinetool', 'sample'].includes(a.classification)) continue
        else {
          aVal = a[field] === void 0 ? 0 : a[field]
          bVal = b[field] === void 0 ? 0 : b[field]
        }
      } else {
        aVal = a[field] === void 0 ? 0 : a[field]
        bVal = b[field] === void 0 ? 0 : b[field]
      }
    }

    aVal = aVal.toString()
    bVal = bVal.toString()

    if (aVal === bVal) {
      // 终止条件
      if (field === ORDERFIELDS[ORDERFIELDS.length - 1]) return 0
      else continue
    } else {
      let fieldIndex = ORDERFIELDS.indexOf(field)
      let sort = ORDERS.length > fieldIndex ? ORDERS[fieldIndex] : 'asc'
      return customCompareVal(aVal, bVal, sort)
    }
  }
}

/**
 * 自定义排序
 * @param {Array} list 待排序数组
 * @param {Array} orderFields 排序字段数组
 * @param {Array} [orders=[]] 排序规则数组
 * @returns 排序后的数组
 */
function customOrderBy (list, orderFields, orders = []) {
  orderFields && (ORDERFIELDS = orderFields)
  orders && (ORDERS = orders)
  if (list && list.length) {
    if (Object.prototype.toString.call(list[0]) === '[object Object]') {
      return list.sort(customCompareItem)
    } else {
      return list.sort(customCompareVal)
    }
  } else {
    return list
  }
}

export { customCompareVal, customCompareItem, customOrderBy }
