<template>
  <o-menubar-btn
    icon="attach_file"
    :tooltip="$t('editor.fileNote')"
    class="o-photo-btn"
    @click.native="pickFile()"
  >
    <!-- 上传文件 -->
    <q-uploader
      style="display:none;"
      ref="qUploader"
      :filter="checkFileType"
      :factory="_factory"
      @added="_added"
      @start="start"
      @uploading="uploading"
      @uploaded="_uploaded"
      multiple
      @rejected="onRejected"
    >
    </q-uploader>
  </o-menubar-btn>
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'

import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { download, upload } from '@/boot/file'
// import { format } from 'quasar'
import { DOMParser } from 'prosemirror-model'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
import fileState from '@/store/file/state'
const config = require('app/app.config.js')
// destructuring to keep only what is needed
// const { humanStorageSize } = format

export default {
  name: 'o-photo-btn',
  data () {
    return {
    }
  },
  mixins: [mixinxquasarupload],
  props: {
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    },
    folder: {
      type: String,
      default: 'project',
      description: '业务类型：project|team|productDev,注意,这里指的是业务类型，而非工具类型(document,notice,task...)'
    }
  },
  computed: {
    ...mapState('file', ['imgExts'])
  },
  components: {
    OMenubarBtn
    // OMetaInput
  },
  methods: {
    pickFile () {
      this.$refs.qUploader.pickFiles()
      this.$refs.qUploader.reset()
    },
    /** 校验文件类型。过滤掉无扩展名的文件 */
    checkFileType (files) {
      return files.filter(file => file.name.substr(file.name.lastIndexOf('.')).length > 1)
    },
    start () {
      this.$q.loading.show({
        message: '正在上传中，请稍等...'
      })
    },
    onRejected () {
      showWarningMessage(i18n.t(`file.error.fileFormatNotSupported`))
    },
    download,
    uploading (info) {

    },
    uploaded (files) {
      this.$q.loading.hide()
      _.forEach(files, file => {
        var extension = file.PathName.substring(file.PathName.lastIndexOf('.'))
        let src = this.$logo['favicon-32x32.png']
        if (fileState.videoExts.includes(extension.toLowerCase())) {
          src = '/api/files/previewvideo?filePath=' + encodeURIComponent(file.PathName) + '&extranet=' + (!!((config.extranet && config.oss && config.oss.enable)))
        } else {
          src = '/api/files/preview?filePath=' + encodeURIComponent(file.PathName) + '&extranet=' + (!!((config.extranet && config.oss && config.oss.enable)))
        }
        if (src) {
          this.commands.image({
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
    },
    elementFromString (value) {
      const element = document.createElement('div')
      element.innerHTML = value.trim()
      return element
    },
    insertHTML ({ state, view }, value) {
      const { selection } = state
      const element = this.elementFromString(value)
      const slice = DOMParser.fromSchema(state.schema).parseSlice(element)
      const transaction = state.tr.insert(selection.anchor, slice.content)

      view.dispatch(transaction)
    },
    // 编辑器工具栏是否在当前窗口
    toolbarIntersection (entry) {
      this.isIntersecting = entry.isIntersecting
    },
    // 编辑器是否在当前窗口
    onEditorIntersection (entry) {
      this.isEditorIntersecting = entry.isIntersecting
    },
    // @人员
    mentionedPersons (value) {
      this.$emit('mentioned', value)
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
            upload('person', [newFile], process => { }, result => {
              _this.fileCommend = _this.editor.commands.image
              _this.uploaded(result)
            })
          }
        })
      }
    },
    selectableTemplateEvent () {
      this.$nextTick(() => {
        this.loadEditorTemplates().then(res => {
          this.selectableTemplate = true
        })
      })
    },
    selectTemplate (val) {
      this.editor.focus()
      this.editor.setContent(val)
      this.$emit('input', val)
      this.selectableTemplate = false
      return true
    },
    beforeDestroy () {
      window.RichTextEditting = false
      this.editor.destroy()
    },
    insertImage (file) {
      if (src) {
        this.commands.image({ src, file: file })
      }

      // this.$refs.photoPopover.hide()
    }
  }
}
</script>
