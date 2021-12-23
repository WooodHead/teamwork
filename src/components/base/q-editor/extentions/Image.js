import { Image as TiptapImage } from 'tiptap-extensions'
import OFileView from '@/components/base/q-editor/views/OFileView'

function getAttrs (dom) {
  let {
    width,
    height
  } = dom.style

  width = width || dom.getAttribute('width') || null
  height = height || dom.getAttribute('height') || null

  return {
    src: dom.getAttribute('src') || '',
    caption: dom.getAttribute('caption') || '',
    ref: dom.getAttribute('ref') || '',
    width: width == null ? null : parseInt(width, 10),
    height: height == null ? null : parseInt(height, 10),
    file: null,
    dom: dom,
    isFile: true
  }
}

function toDOM (node) {
  const {
    src,
    caption,
    ref,
    width,
    height,
    dom
  } = node.attrs

  const attrs = {
    src,
    caption,
    ref,
    width,
    height,
    file: null,
    dom,
    isFile: true
  }

  return [
    'div',
    attrs
  ]
}

export default class Image extends TiptapImage {
  get schema () {
    return {
      attrs: {
        src: { default: '' },
        caption: { default: '' },
        ref: { default: '' },
        width: { default: null },
        height: { default: null },
        file: { default: null },
        dom: { default: null },
        isFile: { default: true }
      },
      inline: 'true',
      group: 'inline',
      draggable: true,
      parseDOM: [{
        // tag: 'img[src]',
        tag: '[data-type="file-upload"]',
        getAttrs
      }],
      toDOM
    }
  }

  get view () {
    return OFileView
  }
}
