/**
 * Quasar Tiptap Extensions
 *
 * @author Micle Bu, micle@oriovo.com
 * @version 1.0
 * @date 2020.04.11
 */

// --------------------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------------------
// Nodes
// export { default as OTitle } from '@/components/base/q-editor/extentions/Title'
// export { default as ODoc } from '@/components/base/q-editor/extentions/Doc'
export { default as OParagraph } from '@/components/base/q-editor/extentions/Paragraph'
export { default as OBlockquote } from '@/components/base/q-editor/extentions/Blockquote'
export { default as OTodoItem } from '@/components/base/q-editor/extentions/TodoItem'
export { default as ODiagram } from '@/components/base/q-editor/extentions/Diagram'
export { default as OHeading } from '@/components/base/q-editor/extentions/Heading'
export { default as OIframe } from '@/components/base/q-editor/extentions/Iframe'
export { default as OKatexBlock } from '@/components/base/q-editor/extentions/KatexBlock'
export { default as OKatexInline } from '@/components/base/q-editor/extentions/KatexInline'
// Marks
export { default as OBackColor } from '@/components/base/q-editor/extentions/BackColor'
export { default as OForeColor } from '@/components/base/q-editor/extentions/ForeColor'
export { default as OFontFamily } from '@/components/base/q-editor/extentions/FontFamily'

// Extensions
export { default as OItalic } from '@/components/base/q-editor/extentions/Italic'
export { default as OAlignment } from '@/components/base/q-editor/extentions/Alignment'
export { default as OIndent } from '@/components/base/q-editor/extentions/Indent'
export { default as OLineHeight } from '@/components/base/q-editor/extentions/LineHeight'
export { default as OFormatClear } from '@/components/base/q-editor/extentions/FormatClear'
export { default as OPrint } from '@/components/base/q-editor/extentions/Print'
export { default as OImage } from '@/components/base/q-editor/extentions/Image'
export { default as OEmbed } from '@/components/base/q-editor/extentions/Embed'
export { default as OInsertHtml } from '@/components/base/q-editor/extentions/InsertHtml'
export { default as OLink } from '@/components/base/q-editor/extentions/Link'

// --------------------------------------------------------------------------------
// Exposed Extension List
// --------------------------------------------------------------------------------
export const TipTapExtensions = [
  'Bold',
  'Strike',
  'Underline',
  'Code',
  'CodeBlock',
  'CodeBlockHighlight',
  'BulletList',
  'OrderedList',
  'ListItem',
  'TodoList',
  'HorizontalRule',
  'Table',
  'Link'
  // 'Image',
]

export const QuasarTipTapExtensions = [
  // 'OTitle',
  // 'ODoc',
  'OItalic',
  'OParagraph',
  'OBlockquote',
  'OTodoItem',
  'OHeading',
  'OAlignment',
  'OIndent',
  'OLineHeight',
  'OForeColor',
  'OBackColor',
  'OFontFamily',
  'OIframe',
  'ODiagram',
  'OKatexBlock',
  'OKatexInline',
  'OFormatClear',
  'OPrint',
  'OImage',
  'OEmbed',
  'OInsertHtml',
  'OLink'
]

export const RecommendedExtensions = [
  ...TipTapExtensions,
  ...QuasarTipTapExtensions
]
