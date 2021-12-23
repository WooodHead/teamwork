<template>
  <q-page class="page-quasar-tiptap-all">
    <section
      class="tiptap tiptap-editor quasar-tiptap"
      v-on:paste="handlePaste"
      v-intersection="onEditorIntersection"
      :class="`view-${pageView}`"
    >
      <div
        v-intersection="intersectionOptions"
        class="fixed-menus"
      ></div>
      <!-- 操作按钮 -->
      <o-editor-menu-bar
        :editor="editor"
        :toolbar="editorMenuBar"
        :tableToolbar="editorMenuTable"
        :folder="folder"
        :class="!isEditorIntersecting?'no-menu':!isIntersecting?'menu-hiden':''"
      >
        <template slot="left">
          <q-separator
            vertical
            inset
          />
          <!-- <o-menubar-btn
            v-if="!$q.platform.is.mobile"
            :icon="$q.fullscreen.isActive ? `fullscreen_exit` : `fullscreen`"
            tooltip="全屏"
            @click.native="$q.fullscreen.toggle()"
          /> -->
          <o-menubar-btn
            v-if="!$q.platform.is.mobile"
            :icon="pageView==='page'?'mdi-overscan':'mdi-fit-to-page-outline'"
            :tooltip="pageView==='page'?'放大':'还原'"
            @click.native="toolbarChange()"
          />
          <!-- <o-menubar-btn
            v-if="!$q.platform.is.mobile"
            icon="mdi-fit-to-page-outline"
            tooltip="还原"
            @click.native="pageView='page'"
          /> -->
        </template>
        <template slot="right">
          <slot name="toolbar-right" />
        </template>
      </o-editor-menu-bar>

      <!-- 选中弹出菜单按钮 -->
      <o-editor-menu-bubble
        :editor="editor"
        :toolbar="editorMenuBubble"
        :selected-cell-size="selectedCellSize"
        v-if="editable && showBubble"
      />
      <!-- 内容区 -->
      <q-scroll-area
        ref="editorScroll"
        class="editor-scroll-area view-page edit-main"
        :class="isIntersecting?'':'menu-hiden'"
      >
        <q-scroll-observer @scroll="onScroll" />
        <at>
          <editor-content
            class="editor__content o--note-preview note-step-side-editor"
            :editor="editor"
          />
        </at>
        <slot name="footer"></slot>
      </q-scroll-area>
    </section>
  </q-page>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import {
  // eslint-disable-next-line no-unused-vars
  BulletList,
  // eslint-disable-next-line no-unused-vars
  CodeBlock,
  CodeBlockHighlight,
  HardBreak,
  // eslint-disable-next-line no-unused-vars
  ListItem,
  // eslint-disable-next-line no-unused-vars
  OrderedList,
  // eslint-disable-next-line no-unused-vars
  TodoList,
  // eslint-disable-next-line no-unused-vars
  Bold,
  // eslint-disable-next-line no-unused-vars
  Code,
  // eslint-disable-next-line no-unused-vars
  Italic,
  // Link,
  // eslint-disable-next-line no-unused-vars
  Strike,
  // eslint-disable-next-line no-unused-vars
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  // eslint-disable-next-line no-unused-vars
  Placeholder,
  Focus,
  // eslint-disable-next-line no-unused-vars
  HorizontalRule,
  TrailingNode
  // Image
} from 'tiptap-extensions'

import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
// require('@/components/base/q-editor/statics/iconfont/iconfont')
import {
  // eslint-disable-next-line no-unused-vars
  // OTitle,
  // eslint-disable-next-line no-unused-vars
  ODoc,
  // eslint-disable-next-line no-unused-vars
  OParagraph,
  // eslint-disable-next-line no-unused-vars
  OBlockquote,
  // eslint-disable-next-line no-unused-vars
  OTodoItem,
  // eslint-disable-next-line no-unused-vars
  OAlignment,
  // eslint-disable-next-line no-unused-vars
  OIndent,
  // eslint-disable-next-line no-unused-vars
  OItalic,
  // eslint-disable-next-line no-unused-vars
  OLineHeight,
  // eslint-disable-next-line no-unused-vars
  OBackColor,
  // eslint-disable-next-line no-unused-vars
  OForeColor,
  // eslint-disable-next-line no-unused-vars
  OFontFamily,
  // eslint-disable-next-line no-unused-vars
  OHeading,
  // eslint-disable-next-line no-unused-vars
  OIframe,
  // eslint-disable-next-line no-unused-vars
  ODiagram,
  // eslint-disable-next-line no-unused-vars
  OKatexBlock,
  // eslint-disable-next-line no-unused-vars
  OKatexInline,
  // eslint-disable-next-line no-unused-vars
  OFormatClear,
  // eslint-disable-next-line no-unused-vars
  OPrint,
  // eslint-disable-next-line no-unused-vars
  OImage,
  // eslint-disable-next-line no-unused-vars
  OEmbed,
  RecommendedExtensions
} from '@/components/base/q-editor/extentions'
import DynamicClass from '@/components/base/q-editor/extentions/dynamic'
import OEditorMenuBar from '@/components/base/q-editor/menubars/OEditorMenuBar'
import OEditorMenuBubble from '@/components/base/q-editor/menubars/OEditorMenuBubble'
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import { DefaultToolbar, MobileToolbar, DefaultBubble, TableToolbar } from '@/components/base/q-editor/data/editor'
import { upload } from '@/boot/file'
const config = require('app/app.config.js')
export default {
  name: 'QuasarEditor',
  data () {
    return {
      pageView: 'page',
      // editor
      editor: null,
      selectedCellSize: 0,
      // pageView: 'page',
      extensions: [
        ...RecommendedExtensions,
        new Placeholder({
          mptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.placeholder || 'placeholder',
          showOnlyWhenEditable: true,
          showOnlyCurrent: true
        })
      ],
      intersectionOptions: {
        handler: this.toolbarIntersection,
        cfg: {
          threshold: [0, 1],
          rootMargin: '-50px 0px 0px 0px'
        }
      },
      isIntersecting: true, // 编辑器工具栏是否在当前窗口
      isEditorIntersecting: true // 编辑器是否在当前窗口
    }
  },
  props: {
    placeholder: {
      type: String,
      default: 'Write something …',
      description: 'placeholder初始值'
    },
    value: {
      type: String,
      default: '',
      description: '编辑器内容。请注意：调用时input与value不能为同一属性值，否则清除功能会出错，可参考DocForm'
    },
    folder: {
      type: String,
      default: 'project',
      description: '业务类型：project|team|productDev,注意,这里指的是业务类型，而非工具类型(document,notice,task...)'
    },
    focus: {
      type: Boolean,
      default: true,
      description: '自动聚焦'
    },
    applied: {
      type: Boolean,
      required: true,
      default: false,
      description: '是否已经用上,默认是false,当提交或保存时，设为true'
    },
    editable: {
      type: Boolean,
      default: true,
      description: '是否可编辑'
    },
    showBubble: {
      type: Boolean,
      default: true,
      description: '是否显示弹出气泡菜单'
    },
    editorProps: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    toolbar: {
      type: Array,
      default: function () {
        return []
      },
      description: '自定义头部菜单'
    },
    tableToolbar: {
      type: Array,
      default: function () {
        return []
      },
      description: '自定义表格菜单'
    },
    bubble: {
      type: Array,
      default: function () {
        return []
      },
      description: '自定义气泡菜单'
    }
  },
  components: {
    EditorContent,
    OEditorMenuBar,
    OEditorMenuBubble,
    OMenubarBtn,
    At: () => import('components/at/At')
  },
  computed: {
    editorMenuBar () {
      if (this.toolbar.length) {
        return this.toolbar
      } else if (this.$q.platform.is.mobile) {
        return MobileToolbar
      } else {
        return DefaultToolbar
      }
    },
    editorMenuTable () {
      return this.tableToolbar.length > 0 ? this.tableToolbar : TableToolbar
    },
    editorMenuBubble () {
      return this.bubble.length > 0 ? this.bubble : DefaultBubble
    }
  },
  methods: {
    toolbarChange () {
      const obj = {
        full: 'page',
        page: 'full'
      }
      this.pageView = obj[this.pageView]
    },
    initEditor () {
      const customExtensions = this.generateExtensions()
      const extensions = [
        // custom
        ...customExtensions,
        // required
        new HardBreak(),
        new History(),
        new Focus({
          className: 'has-focus',
          nested: true
        }),
        new TrailingNode({
          node: 'paragraph',
          notAfter: ['paragraph']
        })
      ]
      this.editor = new Editor({
        editorProps: this.editorProps,
        extensions: extensions,
        autoFocus: this.focus,
        editable: this.editable,
        content: this.getContent(),
        onInit: ({ state, view }) => {
          this.$emit('init', { state, view })
        },
        onFocus: ({ event, state, view }) => {
          this.$emit('focus', { event, state, view })
        },
        onBlur: ({ event, state, view }) => {
          this.$emit('blur', { event, state, view })
        },
        onUpdate: ({ getJSON, getHTML, state, transaction }) => {
          this.$nextTick(() => {
            setTimeout(() => {
              let html = this.getHTML()
              !html && (html = '')
              html = html.replaceAll('class=""', '')
              window.RichTextChange = (html !== this.value)
              this.$emit('input', html)
            }, 1000)
          })
        },
        onTransaction: ({ getJSON, getHTML, state, transaction }) => {
          const selectedCellElements = this.editor.view.dom.querySelectorAll('.selectedCell')
          this.selectedCellSize = selectedCellElements.length

          this.$emit('transaction', { getJSON, getHTML, state, transaction })
        }
      })
    },
    getHTML () {
      // 去除文本绘图标签
      let focusProseMirror = document.querySelector('.editor__content .ProseMirror.ProseMirror-focused')
      if (!focusProseMirror) {
        focusProseMirror = document.querySelector('.editor__content .ProseMirror')
      }
      let domInnerHTML = _.cloneDeep(focusProseMirror.innerHTML)
      let imageDom = document.querySelectorAll('.editor__content .ProseMirror .o-image-view')
      if (imageDom.length > 0) {
        for (let index = 0; index < imageDom.length; index++) {
          const element = imageDom[index]
          let textAlign = element.parentElement.getAttribute('data-text-align')
          let outHL = _.cloneDeep(element.parentElement.outerHTML)
          if (textAlign && !element.className.includes(`text-${textAlign}`)) {
            element.className += ` text-${textAlign}`
          }

          domInnerHTML = domInnerHTML.replace(outHL, element.parentElement.innerHTML)
        }
      }
      // 去掉空的标签
      let divDom = document.createElement('div')
      divDom.innerHTML = domInnerHTML
      let errorHtml = divDom.querySelectorAll('.editor__content .ProseMirror .is-empty')
      errorHtml.forEach(element => {
        element.remove()
      })
      // 去掉表格中的空行
      let tableWrapperInnerHtml = divDom.getElementsByClassName('tableWrapper')
      if (tableWrapperInnerHtml.length) {
        for (let index = 0; index < tableWrapperInnerHtml.length; index++) {
          const element = tableWrapperInnerHtml[index]
          let brArray = element.querySelectorAll('table tr p br')
          for (let j = 0; j < brArray.length; j++) {
            brArray[j].remove()
          }
        }
      }
      return divDom.innerHTML
    },
    generateExtensions () {
      let extensions = []
      for (let extension of this.extensions) {
        if (typeof extension === 'string') {
          if (!RecommendedExtensions.includes(extension)) {
            continue
          }
          switch (extension) {
            // tiptop
            case 'CodeBlockHighlight':
              extension = new CodeBlockHighlight({
                languages: { java, javascript, css }
              })
              break
            case 'Table':
              extension = new Table({
                resizable: true
              })
              extensions.push(extension)
              extensions.push(new TableHeader())
              extensions.push(new TableCell())
              extensions.push(new TableRow())
              continue

            // quasar-tiptop
            case 'OTodoItem':
              extension = new OTodoItem({ nested: true })
              break
            case 'OHeading':
              extension = new OHeading({ levels: [1, 2, 3, 4, 5] })
              break
            case 'Link':
              extension = new DynamicClass('OLink')
              break
            default:
              try {
                extension = new DynamicClass(extension)
              } catch (e) {
                console.error(e.message)
              }
              break
          }
        }
        extensions.push(extension)
      }
      return extensions
    },
    // content
    getContent () {
      let content = this.value || ''
      if (content && content.type) {
        return content // parsed json
      }
      if (typeof content === 'string') {
        try {
          return JSON.parse(content) // json
        } catch (e) {
          return content // html
        }
      }
    },
    // 剪切上传
    handlePaste (event) {
      if (event.clipboardData || event.originalEvent) {
        // not for ie11  某些chrome版本使用的是event.originalEvent
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
        // 如果粘贴板中没有数据，直接返回
        if (!(clipboardData && clipboardData.items)) {
          return
        }
        const items = clipboardData.items
        Array.from(items).forEach(item => {
          if (item.kind === 'file') {
            // 原文件
            const file = item.getAsFile()
            // 新文件名
            const newFileName = 'screenshot_' + new Date().getTime() + file.name.substring(file.name.lastIndexOf('.'))
            // newFile新文件；file 原文件；newFileName 新文件名
            const newFile = new File([file], newFileName, { type: file.type })
            // 发送截图
            upload(this.folder, [newFile], process => { }, result => {
              _.forEach(result, file => {
                let src = `/api/files/preview?filePath=${encodeURIComponent(file.PathName)}&extranet=` + (!!((config.extranet && config.oss && config.oss.enable)))
                if (src) {
                  this.editor.commands.image({
                    src,
                    file:
                    {
                      title: file.Title,
                      size: file.Size,
                      path: file.PathName,
                      extension: file.Extension
                    }
                  })
                }
              })
            })
          }
        })
      }
    },
    setContent () {
      this.editor.setContent(this.getContent(), true)
    },
    cleanContent () {
      this.editor.clearContent(false)
    }, // 编辑器工具栏是否在当前窗口
    toolbarIntersection (entry) {
      this.isIntersecting = entry.isIntersecting
    },
    // 编辑器是否在当前窗口
    onEditorIntersection (entry) {
      this.isEditorIntersecting = entry.isIntersecting
    },
    onScroll (scroll) {
      this.$emit('scroll', scroll)
    },
    showSidePanel () { },
    onSlideShow () { }
  },
  watch: {
    value: {
      handler: function (newV, oldV) {
        this.editor && this.editor.setContent(newV)
      },
      immediate: true
    },
    applied: {
      handler: function (newV, oldV) {
        window.RichTextEditting = !newV
      },
      immediate: true
    }
  },
  mounted: function () {
    window.RichTextEditting = true
    window.RichTextChange = false
    this.initEditor()
  },
  deactivated () {
  },
  beforeDestroy () {
    window.RichTextEditting = false
    this.editor.destroy()
  }
}
</script>

<style lang="stylus">
@import './css/tiptap.styl'

.page-quasar-tiptap-all
  min-height auto !important

  .editor-scroll-area
    background #f7f8fa
    flex 1

    .scroll
      overflow unset

  .editor__content
    background #fff
    padding 20px
    min-height 100px

  .tiptap .editor__content .ProseMirror
    min-height 100px

  .view-page
    .editor__content
      max-width 1500px
      box-sizing border-box
      border 1px solid #e5e5e5
      border-top none
      flex 1
      position static

    .absolute.full-width
      position static

  .view-full
    position fixed
    left 0
    top 0
    bottom 0
    z-index 99
    overflow-y scroll

    .fixed-menus
      display none

    .editor__content
      min-height calc(100vh - 128px)
      margin 0 auto
      max-width 930px
      box-shadow 0 1px 10px 2px rgba(0, 0, 0, .06)
      box-sizing border-box
      border 1px solid #e5e5e5
      border-top none
      flex 1
      position static

    .absolute.full-width
      position static
      width 100vw !important

    .edit-main.menu-hiden
      padding-top 128px

  @media (max-width $breakpoint-sm-min)
    .view-full
      position fixed
      left 0
      top 0
      bottom 0
      z-index 99
      overflow-y scroll

      .fixed-menus
        display none
</style>
<style lang="sass" scoped>
.tiptap-menubar.menu-hiden
  position: fixed
  top: 50px
  z-index: 50
  left: 0
  right: 0
  margin: auto
  width: 100%
  height: auto
  max-width: 990px

.tiptap-menubar.no-menu
  display: none

.edit-main.menu-hiden
  padding-top: 100px

@media (max-width: $breakpoint-xs-max)
  .edit-main.menu-hiden
    padding-top: 180px
</style>
