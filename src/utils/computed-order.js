/**
 *计算拖动后的order
 * @param {string} order1 第1个位置的order
 * @param {string} order2 第2个位置的order
 */
export function computedOrder (order1, order2) {
  let o1 = order1
  let o2 = order2
  order1.length > order2.length && (o2 = _.padEnd(o2, order1.length, '0'))
  order2.length > order1.length && (o1 = _.padEnd(o1, order2.length, '0'))

  let mindum = (Number(o1) + Number(o2)) / 2
  return _.replace(mindum.toString(), '.', '')
}
