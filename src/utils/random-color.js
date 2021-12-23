import { random } from 'lodash'

const _color = {
  0: 'lime',
  1: 'pink',
  2: 'purple',
  3: 'deep-purple',
  4: 'indigo',
  5: 'blue',
  6: 'light-blue',
  7: 'cyan',
  8: 'teal',
  9: 'amber',
  10: 'orange',
  11: 'deep-orange',
  12: 'brown'
}
const _randomColor = {
  0: 'pink-6',
  1: 'purple-6',
  2: 'indigo-6',
  3: 'lime-9',
  4: 'cyan-7'
}
/**
 * 获取随机颜色
 */
export function randomColor () {
  return _randomColor[random(4, false)]
}

/**
 * 获取颜色列表
 */
export function colorList () {
  return _color
}

/**
 * 获取所有颜色
 */
export function allColor () {
  return {
    0: 'primary',
    1: 'secondary',
    2: 'accent',
    3: 'brown',
    4: 'positive',
    5: 'negative',
    6: 'info',
    7: 'warning'
  }
}
