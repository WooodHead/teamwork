<template>
  <div>
    <template>
      <slot
        v-if="showButton&&showSubmitButton"
        name="header"
      />
    </template>
    <at v-on:at="mentionedPersons">
      <q-editor
        :value="editor"
        @input="inputValue($event)"
        v-add-toolbar
        :toolbar="toolbar"
        min-height="1rem"
        :content-class="{ 'tweditor-special-color': isShowClass }"
        :placeholder="placeholder"
        ref="editor"
      />
    </at>
    <div v-if="showButton&&showSubmitButton">
      <template>
        <slot name="footer" />
      </template>
    </div>
    <q-card-actions
      align="right"
      class="q-pr-none"
      v-if="showButton&&showSubmitButton"
    >
      <q-btn
        unelevated
        rounded
        :label="$t(`twEdit.buttonLabel.${business||'default'}`)"
        color="primary"
        @click="submit"
      />
    </q-card-actions>

  </div>

</template>

<script>
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'TwEditor',
  components: {
    At: () => import('components/at/At')
  },
  props: {
    placeholder: {
      type: String,
      default: 'Remark...',
      description: '说明信息placeholder'
    },
    initContent: {
      type: String,
      default: '',
      description: '初始化编辑器内容'
    },
    height: {
      type: String,
      default: '5rem',
      description: '编辑器高度'
    },
    showToolbar: {
      type: Boolean,
      default: false,
      description: '如果是true，则直接打开编辑器'
    },
    business: {
      type: String,
      default: '',
      description: '使用编辑器的业务类型，用于确定按钮的label，如果showButton是false则不用传改参数'
    },
    showButton: {
      type: Boolean,
      default: false,
      description: '如果是true，则确定按钮会在点击编辑器的时候显示出来'
    }
  },
  data () {
    return {
      toolbar: [],
      isEmptyEditor: false,
      editor: '',
      showSubmitButton: false
    }
  },
  mounted () {
    if (this.showToolbar) {
      this.$refs.editor.focus()
    }
  },
  computed: {
    isShowClass () {
      if (this.initContent.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    mentionedPersons (value) {
      this.$emit('mentioned', value)
    },
    inputValue (value) {
      this.editor = value
      if (htmlToText(value).trim() !== '') {
        return this.$emit('update:initContent', value)
      } else {
        return this.$emit('update:initContent', '')
      }
    },
    submit () {
      // 还原文本框
      if (htmlToText(this.editor).trim() !== '') {
        this.toolbar = []
        this.editor = ''
        this.showSubmitButton = false
        document.querySelector('.q-editor__content').style.minHeight = '1rem'
        this.$emit('click')
      }
    }
  },
  directives: {
    addToolbar: {
      inserted (el, binding, vnode) {
        let that = vnode
        let editor = el.querySelector('.q-editor__content')
        editor.addEventListener('focus', () => {
          if (that.context.toolbar.length === 0) {
            editor.style.minHeight = that.context.height
            that.context.toolbar = [
              ['left', 'center', 'right', 'justify'],
              ['bold', 'italic', 'strike', 'underline']
            ]
            that.context.showSubmitButton = true
            that.context.$nextTick(() => {
              that.context.$refs.editor.focus()
            })
          }
        })
      }
    }
  },
  created () {
    this.editor = this.initContent
  },
  watch: {
    initContent () {
      this.editor = this.initContent
    }
  }
}
</script>

<style>
  .tweditor-special-color {
    color: gray;
  }
</style>
