function fallback (text) {
  const area = document.createElement('textarea')
  area.value = text
  area.contentEditable = true
  area.style.position = 'fixed' // avoid scrolling to bottom

  document.body.appendChild(area)
  selectText(area, 0, text.length)

  const res = document.execCommand('copy')

  area.remove()
  return res
}
// input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
// 选择文本。createTextRange(setSelectionRange)是input方法
function selectText (textbox, startIndex, stopIndex) {
  if (textbox.createTextRange) { // ie
    const range = textbox.createTextRange()
    range.collapse(true)
    range.moveStart('character', startIndex)// 起始光标
    range.moveEnd('character', stopIndex - startIndex)// 结束光标
    range.select()// 不兼容苹果
  } else { // firefox/chrome
    textbox.setSelectionRange(startIndex, stopIndex)
    textbox.focus()
  }
}
export default function (text) {
  return navigator.clipboard !== void 0
    ? navigator.clipboard.writeText(text)
    : new Promise((resolve, reject) => {
      const res = fallback(text)
      if (res) {
        resolve(true)
      } else {
        reject(res)
      }
    })
}
