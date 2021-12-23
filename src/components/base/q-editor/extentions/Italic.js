/**
 * Extension: indent
 *
 * @author Leecason
 * @license MIT, https://github.com/Leecason/element-tiptap/blob/master/LICENSE
 * @see https://github.com/Leecason/element-tiptap/blob/master/src/extensions/indent.ts
 */
import { Italic as ItalicE } from 'tiptap-extensions'

export default class Italic extends ItalicE {
  inputRules ({ type }) {
    return []
  }
  pasteRules ({ type }) {
    return []
  }
}
