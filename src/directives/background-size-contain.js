/**
 * carousel组件的图片完整显示指令（因该组件默认cover覆盖图片超出部分）
 */
export const backgroundSizeContain = {
  inserted (el) {
    el.style.backgroundSize = 'contain'
    el.style.backgroundRepeat = 'no-repeat'
  }
}
