
export default function htmlToText (str) {
  if (str) {
    const html = document.createElement('div')
    html.innerHTML = str
    // 判断是否有图片标签,如果有图片则提取图片中的alt属性
    let imgTags = html.getElementsByTagName('img')
    if (imgTags.length) {
      imgTags.forEach((element, index) => {
        let imgAlt = element.alt || '图片'
        let imgDom = html.getElementsByClassName('o-image-view')[index]
        imgDom && (imgDom.innerText = imgAlt)
      })
    }
    return html.innerText || html.textContent
  } else {
    return str
  }
}
