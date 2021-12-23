/**
 * Utils: print
 * @author Leecason
 * @license MIT, https://github.com/Leecason/element-tiptap/blob/master/LICENSE
 * @see https://github.com/Leecason/element-tiptap/blob/master/src/utils/print.ts
 */
const IS_TEST = false

export function printHtml (dom) {
  let style = Array.from(document.querySelectorAll('style, link'))
    .reduce((str, style) => str + style.outerHTML, '')
  style = style.replace(new RegExp('<link href=".*.js" .*[ht]">', 'g'), '')
  // style = style.replace(new RegExp('href="', 'g'), 'href="/')
  style = style.replace(new RegExp('fonts/', 'g'), '/fonts/')
  // 去掉文本绘图头部信息
  let domOuterHTML = _.cloneDeep(dom.outerHTML)
  let divDom = document.createElement('div')
  divDom.innerHTML = domOuterHTML
  let toolbarDiagram = divDom.querySelectorAll('.editor__content .ProseMirror .o-card-toolbar')
  if (toolbarDiagram && toolbarDiagram.length) {
    const length = toolbarDiagram.length
    for (let index = 0; index < length; index++) {
      toolbarDiagram[index].remove()
    }
  }
  // 去掉文件预览下载信息
  let toolbarFile = divDom.querySelectorAll('.ProseMirror .q-item__label.q-item__label--caption.text-caption')
  if (toolbarFile && toolbarFile.length) {
    const length = toolbarFile.length
    for (let index = 0; index < length; index++) {
      toolbarFile[index].remove()
    }
  }
  // 去掉不必要的HTML片段
  let errorHtml = divDom.querySelectorAll('.editor__content .ProseMirror .o-image-view')
  errorHtml.forEach(element => {
    let itemDom = element.querySelector('.q-item.q-item-type.row.no-wrap.text-left')
    if (itemDom) {
      element.innerHTML = itemDom.outerHTML
    } else {
      element.parentElement.remove()
    }
  })
  // 去掉空行
  let emptyHtml = divDom.querySelectorAll('.editor__content .ProseMirror .is-empty')
  emptyHtml.forEach(element => {
    element.remove()
  })
  // divDom.querySelectorAll('.q-avatar__content.row.flex-center.overflow-hidden')
  // 获取placeholder
  let contentHtml = divDom.innerHTML
    .replaceAll('class=""', '')
  const content = style + `<section class="tiptap tiptap-editor quasar-tiptap">${contentHtml}</section>`
  // console.log('html', content)

  if (IS_TEST) {
    // open a new window, for test
    let newWindow = window.open('print window', '_blank')
    newWindow.document.write(content)
    newWindow.document.close()
  } else {
    // iframe, for print
    const iframe = document.createElement('iframe')
    iframe.id = 'quasar-tiptap-iframe'
    iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: -10px; left: -10px;')
    document.body.appendChild(iframe)

    const frameWindow = iframe.contentWindow
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)

    if (doc) {
      doc.open()
      doc.write(content)
      doc.close()
    }

    if (frameWindow) {
      iframe.onload = function () {
        try {
          setTimeout(() => {
            frameWindow.focus()
            try {
              if (!frameWindow.document.execCommand('print', false)) {
                frameWindow.print()
              }
            } catch (e) {
              frameWindow.print()
            }
            frameWindow.close()
          }, 10)
        } catch (err) {
          console.error(err)
        }

        setTimeout(function () {
          document.body.removeChild(iframe)
        }, 100)
      }
    }
  }
}
