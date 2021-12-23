<template>
  <div
    class="full-width"
    :class="{ 'emoji-font':$q.platform.is.win}"
  >
    <!-- 快捷服务入口 -->
    <chat-quick-entry
      :objectID="objectID"
      :category="category"
      :person="person"
    />
    <!-- 文本输入 -->
    <div
      v-on:paste="handlePaste"
      :class="['row bg-white items-end my-chat-editor',borderActive?'border-active':'',unset?'unset-class':'']"
    >
      <at-ta
        :objectID='objectID'
        :category="category"
        v-on:at="mentionedPersons"
      >
        <q-input
          flat
          borderless
          :dense="dense"
          :placeholder="!$q.platform.is.mobile?'回车发送':''"
          :autofocus="!$q.platform.is.mobile"
          :autogrow="autogrow"
          v-model="html"
          @focus="focus"
          @blur="blur"
          @keydown.enter.prevent.capture="send(html)"
          class="col q-px-sm my-chat-input scroll"
          ref="chatEditorInput"
        >
          <template v-slot:append>
            <tw-emoji-btn @addEmoji="addEmoji" />
            <q-btn
              dense
              round
              flat
              size="sm"
              v-if="!$q.platform.is.mobile||($q.platform.is.mobile&&!html)"
              class="text-info"
              @click.stop="pickFiles"
            >
              <q-avatar icon="attach_file" />
              <q-uploader
                ref="qUploader"
                class="hidden"
                multiple
                :filter="checkFileType"
                :factory="_factory"
                @added="_added"
                @uploaded="_uploaded"
                @factory-failed="_factoryFailed"
                @failed="_failed"
                @rejected="onRejected"
              />
            </q-btn>
            <q-btn
              unelevated
              padding="3px 12px"
              dense
              v-else
              @click="send(html)"
              color="positive"
              label="发送"
            ></q-btn>
          </template>
        </q-input>
      </at-ta>
    </div>
  </div>
</template>
<script>
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { upload } from '@/boot/file'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
export default {
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    autogrow: {
      type: Boolean,
      default: false
    },
    unset: {
      type: Boolean,
      default: false
    },
    objectID: {
      type: [Number, String],
      required: false
    },
    category: {
      type: String,
      required: false
    },
    person: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      folder: 'chat',
      html: '',
      borderActive: false
    }
  },
  mixins: [mixinxquasarupload],
  components: {
    TwEmojiBtn: () => import('components/emoji/TwEmojiBtn'),
    AtTa: () => import('components/at/AtTextarea'),
    ChatQuickEntry: () => import('components/chat/ChatQuickEntry')
  },
  methods: {
    // 选择文件
    pickFiles () {
      this.$refs.qUploader.reset() // 清空上传列表
      this.$refs.qUploader.pickFiles() // 打开选择文件窗口
    },
    // 添加表情
    addEmoji (cls) {
      this.$nextTick(() => {
        if (cls.indexOf('.gif') > 0) {
          let jingdiaoImg = {
            url: cls,
            type: 'jingdiaojun'
          }
          this.$emit('send', jingdiaoImg)
        } else {
          this.html += cls
        }
        const length = this.html.length
        this.$refs.chatEditorInput.focus()
        this.$refs.chatEditorInput.selectionStart = length
        this.$refs.chatEditorInput.selectionEnd = length
      })
    },
    /** 校验文件类型。过滤掉无扩展名的文件 */
    checkFileType (files) {
      return files.filter(file => file.name.substr(file.name.lastIndexOf('.')).length > 1)
    },
    onRejected () {
      showWarningMessage(i18n.t(`file.error.fileFormatNotSupported`))
    },
    // 上传附件后回调
    uploaded (files) {
      this.send(files)
    },
    // 发送消息
    send (m) {
      this.$nextTick(() => {
        this.$emit('send', m)
        this.html = ''
        this.$refs.chatEditorInput.focus()
      })
    },
    focus () {
      this.borderActive = true
    },
    blur () {
      this.borderActive = false
    },
    // 粘贴发送
    handlePaste (event) {
      var _this = this
      // 打印粘贴事件的内容
      // console.info(event)
      // 判断是否支持此类事件
      if (event.clipboardData || event.originalEvent) {
        // not for ie11  某些chrome版本使用的是event.originalEvent
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
        // 如果粘贴板中没有数据，直接返回
        if (!(clipboardData && clipboardData.items)) {
          return
        }
        // 阻止默认行为即不让剪贴板内容在div中显示出来
        // event.preventDefault()
        // 否则取出里面的内容进行处理（目前只处理图片）
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
              // 如果发送图片的时候，如果输入框有文本，先发送文本后，在发送图片内容
              if (_this.html && _this.html !== '') {
                _this.send(_this.html)
              }
              _this.send(result)
            })
          }
        })
      }
    },
    mentionedPersons (value) {
      this.$emit('mentioned', value)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.my-chat-editor textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
}
/deep/.my-chat-editor textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
}
/deep/.my-chat-editor textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999;
}
/deep/.my-chat-editor textarea::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999;
}
.my-chat-editor {
  border-radius: 0.4rem;
  border: 2px solid #d9d9d9;
}
.my-chat-input {
  max-height: 200px;
}
.border-active {
  border-color: rgb(164, 210, 255);
}
.unset-class {
  border-radius: unset;
  border: unset;
}
/deep/ .q-avatar {
  font-size: 30px;
}
</style>
