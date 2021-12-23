import { Loading } from 'quasar'
import html2canvas from 'html2canvas'
export default function htmlToImg (name, ele = document.body) {
  Loading.show()
  html2canvas(ele, {
    width: ele.clientWidth,
    height: ele.clientHeight,
    windowWidth: ele.clientWidth,
    windowHeight: ele.clientHeight,
    allowTaint: true,
    scale: 1
  }).then(canvas => {
    let aEle = document.createElement('a')
    aEle.href = canvas.toDataURL('image/png', 1.0)
    aEle.download = name + new Date().getTime() + '.png'
    aEle.dispatchEvent(new MouseEvent('click'))
    aEle.remove()
    Loading.hide()
  }).catch((e) => {
    console.log(e)
    Loading.hide()
  })
}
