/**
 * JSON对象层次构造 *
 * @export
 * @param {Object} data 待构造对象
 * @param {Object} res 构造结果，必传，eg.{}
 * @returns 返回构造结果
 */
export function modelConstruction (data, res) {
  for (let item in data) {
    let arr = item.split('.')
    arr.reduce((pre, cur, index) => {
      if (index === arr.length - 1) {
        pre[cur] = data[item]
      } else {
        if (!pre.hasOwnProperty(cur)) {
          pre[cur] = {}
        }
        return pre[cur]
      }
    }, res)
  }
  return res
}

/**
 * JSON对象层次解构
 * @param {Object} data 待解构对象
 * @param {Object} path 对象从根属性到当前属性的路径，必传，eg.''
 * @param {Object} res 解构结果，必传，eg.{}
 * @param {String} sym 替换空值
 * @returns 返回解构结果
 */
export function modelDeconstruction (data, path, res, sym) {
  for (let item in data) {
    if (data[item] instanceof Object && !Array.isArray(data[item])) {
      let childPath = (path === '' ? `${item}.` : `${path}${item}.`)
      modelDeconstruction(data[item], childPath, res, sym)
    } else {
      res[`${path}${item}`] = sym ? (data[item] ? data[item] : sym) : data[item]
    }
  }
  return res
}

/**
 * 对象中的空值美化
 * @param {Object} data 待美化的对象
 * @param {String} sym 替换空值
 * @returns 返回美化结果
 */
export function modelEmptyPrettier (data, sym) {
  for (let item in data) {
    if (data[item] instanceof Object && !Array.isArray(data[item])) {
      modelEmptyPrettier(data[item], sym)
    } else {
      data[item] = (data[item] === void 0 || data[item] === '' || data[item] === null) ? sym : data[item]
    }
  }
  return data
}
