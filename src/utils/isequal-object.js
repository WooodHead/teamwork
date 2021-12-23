
/**
 *判断对象是否相等，_.isEqual虽然是深比较，但是有时候参数中会有'2'和2这种情况无法比较出来
 * @param {*} object1
 * @param {*} object2
 */
export function isEqualObject (object1, object2) {
  let keys1 = _.keys(object1)
  let keys2 = _.keys(object2)
  let isEqual = true
  if (!_.isEqual(keys1, keys2)) {
    return false
  }
  if (keys1.length === 0 && keys2.length === 0) {
    return true
  }
  for (let i = 0; i < keys1.length; i++) {
    let value1 = _.isNumber(object1[keys1[i]]) ? +object1[keys1[i]] : object1[keys1[i]]
    let value2 = _.isNumber(object2[keys1[i]]) ? +object2[keys1[i]] : object2[keys1[i]]
    if (!_.isEqual(keys1, keys2)) {
      isEqual = false
      break
    } else if (_.isPlainObject(value1) && _.isPlainObject(value12)) {
      isEqualObject(value1, value2)
    }
  }
  return isEqual
}
