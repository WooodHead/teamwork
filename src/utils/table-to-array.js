/**
 * table HTML转二维数组
 * 要求：table中要有table、tr、td这3个必要的标签元素
 * 说明：对于合并的单元格，转化时会拆分，拆分后的单元格有相同的值
 * @export
 * @param {String} tableHtml 输入的table HTML 字符串
 * @returns
 */
export function tableToArray (tableHtml) {
  // result
  const arrTable = []

  const div = document.createElement('div')
  div.innerHTML = tableHtml

  const tbody = div.querySelector('tbody')
  if (tbody) {
    const trs = Array.prototype.slice.call(tbody.childNodes)

    // get rows count
    const rowsCount = trs.length

    // get columns count
    let columnsCount = 0
    const tds = Array.prototype.slice.call(trs[0].childNodes)
    tds.forEach(td => {
      columnsCount += td.colSpan
    })

    // set every td a default value
    for (let i = 0; i < rowsCount; i++) {
      arrTable[i] = []
      for (let j = 0; j < columnsCount; j++) {
        arrTable[i].push({ hasValue: false })
      }
    }

    // set real value of td in loop
    trs.forEach((tr, trCountSum) => {
      // record td's offset
      let tdCountSum = 0

      const tds = Array.prototype.slice.call(tr.childNodes)

      tds.forEach(td => {
        const rowSpan = td.rowSpan
        const colSpan = td.colSpan

        // separate td in row direction
        for (let i = 0; i < colSpan; i++) {
          for (let k = 0; k < columnsCount; k++) {
            const tdObj = arrTable[trCountSum][k]
            if (!tdObj.hasValue) {
              tdObj.text = getTdText(td)
              tdObj.hasValue = true

              // fix tdCountSum
              tdCountSum = k
              break
            } else continue
          }

          // separate td in column direction
          for (let j = 0; j < rowSpan; j++) {
            const tdObj2 = arrTable[trCountSum + j][tdCountSum]
            if (!tdObj2.hasValue) {
              tdObj2.text = getTdText(td)
              tdObj2.hasValue = true
            }
          }

          tdCountSum++
        }
      })
    })
  }

  return arrTable.length > 0
    ? arrTable.map(tr => { return tr.map(td => { return td.text }) })
    : arrTable
}

/**
 * 二维数组转table HTML
 * 要求：table HTML中不能有合并的单元格
 * 说明：此方法专门对接富文本表格
 * @export
 * @param {Array} tableArray 二维数组
 * @returns
 */
export function arrayToTable (tableArray) {
  let res = '<table><tbody>'
  tableArray.forEach(row => {
    res += '<tr>'
    row.forEach(td => {
      res += '<td><p>'
      res += td
      res += '</p></td>'
    })
    res += '</tr>'
  })
  res += '</tbody></table>'
  return res
}

/**
 * 获取td中的文本，如果有图片，返回img标签字符串
 *
 * @param {Object} td
 * @returns
 */
function getTdText (td) {
  let imgObj = td.querySelector('img')
  if (imgObj) {
    // 移除图片路径中的转义字符（eg. &amp; => &）
    let imgHtml = imgObj.parentNode.innerHTML
    return imgHtml
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '\\')
  } else {
    return td.innerText
  }
}
