/**
 * Extension: indent
 *
 * @author Leecason
 * @license MIT, https://github.com/Leecason/element-tiptap/blob/master/LICENSE
 * @see https://github.com/Leecason/element-tiptap/blob/master/src/extensions/indent.ts
 */
import { Extension } from 'tiptap'
import { createIndentCommand } from '@/components/base/q-editor/utils/indent'

export default class Indent extends Extension {
  get name () {
    return 'indent'
  }

  get defaultOptions () {
    return {
      minIndent: 0,
      maxIndent: 7
    }
  }

  commands () {
    return {
      indent: () => createIndentCommand(1),
      outdent: () => createIndentCommand(-1)
    }
  }

  keys ({ type, state, view }) {
    return {
      'Cmd-]': createIndentCommand(1),
      'Cmd-[': createIndentCommand(-1)
    }
  }
}
