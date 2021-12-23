/**
 *判断array1中是否包含array2
 * @param {*} array1
 * @param {*} array2
 */
export function arrayIncludes (array1, array2) {
  let flag = true
  array2.forEach(item => {
    if (!array1.includes(item)) {
      flag = false
    }
  })
  return flag
}
