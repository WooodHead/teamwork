<template>
  <o-menubar-btn
    :icon="config.icon"
    :tooltip="config.tooltip"
    :class="{ 'is-active': config.isActive }"
    @click.native="config.command"
  />
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
export default {
  name: 'o-simple-command-btn',
  data () {
    return {
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    }
  },
  components: {
    OMenubarBtn
  },
  methods: {
    command () {
      if (this.name === 'table') {
        this.config.command()
      } else {
        this.config.command()
      }
    }
  },
  computed: {
    configs () {
      return {
        bold: { icon: 'format_bold', tooltip: this.$q.lang.editor.bold, isActive: this.isActive.bold(), command: this.commands.bold },
        italic: { icon: 'format_italic', tooltip: this.$q.lang.editor.italic, isActive: this.isActive.italic(), command: this.commands.italic },
        strike: { icon: 'format_strikethrough', tooltip: this.$q.lang.editor.strikethrough, isActive: this.isActive.strike(), command: this.commands.strike },
        underline: { icon: 'format_underline', tooltip: this.$q.lang.editor.underline, isActive: this.isActive.underline(), command: this.commands.underline },
        code: { icon: 'code', tooltip: this.$q.lang.editor.code, isActive: this.isActive.code(), command: this.commands.code },
        code_block: { icon: 'mdi-code-braces', tooltip: this.$t('editor.codeBlock'), isActive: this.isActive.code_block(), command: this.commands.code_block },
        horizontal: { icon: 'remove', tooltip: this.$q.lang.editor.hr, isActive: false, command: this.commands.horizontal_rule },
        bullet_list: { icon: 'format_list_bulleted', tooltip: this.$q.lang.editor.unorderedList, isActive: this.isActive.bullet_list(), command: this.commands.bullet_list },
        ordered_list: { icon: 'format_list_numbered', tooltip: this.$q.lang.editor.orderedList, isActive: this.isActive.ordered_list(), command: this.commands.ordered_list },
        todo_list: { icon: 'mdi-check-box-outline', tooltip: this.$t('editor.todoList'), isActive: this.isActive.todo_list(), command: this.commands.todo_list },
        blockquote: { icon: 'format_quote', tooltip: this.$t('editor.blockquote'), isActive: this.isActive.blockquote(), command: this.commands.blockquote },
        table: { icon: 'mdi-table', tooltip: this.$t('editor.table'), isActive: false, command: this.commands.createTable },
        undo: { icon: 'undo', tooltip: this.$q.lang.editor.undo, isActive: false, command: this.commands.undo },
        redo: { icon: 'redo', tooltip: this.$q.lang.editor.redo, isActive: false, command: this.commands.redo },
        indent: { icon: 'format_indent_increase', tooltip: this.$q.lang.editor.indent, isActive: false, command: this.commands.indent },
        outdent: { icon: 'format_indent_decrease', tooltip: this.$q.lang.editor.outdent, isActive: false, command: this.commands.outdent },
        format_clear: { icon: 'format_clear', tooltip: this.$q.lang.editor.removeFormat, isActive: false, command: this.commands.formatClear },
        print: { icon: 'print', tooltip: this.$q.lang.editor.print, isActive: false, command: this.commands.print }
      }
    },
    config () {
      let config = {
        icon: '',
        isActive: false,
        command: function () {
        }
      }
      config = this.configs[this.name] || config
      return config
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
  .o-simple-command-btn {
  }
</style>
