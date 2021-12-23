/**
 * Extension: todo item
 *
 * @author Leecason
 * @license MIT, https://github.com/Leecason/element-tiptap/blob/master/LICENSE
 * @see https://github.com/Leecason/element-tiptap/blob/master/src/extensions/todo_item.ts
 */
import { TodoItem as TiptapTodoItem } from 'tiptap-extensions'
import OTodoItemView from '@/components/base/q-editor/views/OTodoItemView'

function getAttrs (dom) {
  let childNodes = dom.childNodes
  if (childNodes.length) {
    let childNodes1 = childNodes[0]
    if (childNodes1.getAttribute('class') === 'row col-12 items-center todo-checkbox') {
      dom.removeChild(childNodes1)
    }
  }
  let {
    textAlign,
    lineHeight
  } = dom.style

  let align = dom.getAttribute('data-text-align') || textAlign || ''

  return {
    textAlign: align || null,
    lineHeight: lineHeight || null,
    done: dom.getAttribute('data-done') === 'true',
    dom: dom
  }
}

function toDOM (node) {
  const {
    done,
    textAlign
  } = node.attrs

  let style = ''
  const attrs = {}

  attrs['data-type'] = 'todo_item'
  attrs['data-done'] = done.toString()

  if (textAlign && textAlign !== 'left') {
    attrs['data-text-align'] = textAlign
  }

  style && (attrs.style = style)

  return [
    'li',
    attrs,
    ['span', { class: 'todo-checkbox', contenteditable: 'false' }],
    ['div', { class: 'todo-content' }, 0]
  ]
}

export default class TodoItem extends TiptapTodoItem {
  get schema () {
    return {
      attrs: {
        done: { default: false },
        textAlign: { default: null },
        lineHeight: { default: null },
        dom: { default: null }
      },
      draggable: true,
      content: this.options.nested ? '(paragraph|todo_list)+' : 'paragraph+',
      parseDOM: [{
        priority: 51,
        tag: `[data-type="${this.name}"]`,
        getAttrs
      }],
      toDOM
    }
  }

  get view () {
    return OTodoItemView
  }
}
