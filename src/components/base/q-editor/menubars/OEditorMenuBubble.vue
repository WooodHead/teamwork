<template>
  <editor-menu-bubble
    :editor="editor"
    v-slot="editorContext"
  >
    <section
      class="tiptap-menububble"
      :class="{ 'is-active': editorContext.menu.isActive &&
                                    selectedCellSize === 0 &&
                                    !(editorContext.isActive.image && editorContext.isActive.image()) &&
                                    !(editorContext.isActive.diagram && editorContext.isActive.diagram()) &&
                                    !(editorContext.isActive.embed && editorContext.isActive.embed()) &&
                                    !(editorContext.isActive.katex_block && editorContext.isActive.katex_block()) }"
      :style="`left: 0px; bottom: ${editorContext.menu.bottom + 8}px;`"
    >
      <template>
        <o-menubar-btn
          v-if="showBack"
          icon="arrow_back"
          :tooltip="$t('link.back')"
          @click.native="onBackToMain(editorContext)"
        />
        <q-separator
          vertical
          inset
        />
      </template>
      <!-- 弹出气泡按钮 -->
      <template v-for="(item, index) of bubbleToolbar">
        <q-separator
          vertical
          inset
          :key="index"
          v-if="item==='separator'"
        />
        <component
          :key="index"
          :name="item"
          :is="getName(item)"
          :editor="editor"
          v-bind="editorContext"
          v-else-if="typeof item === 'string'"
        />
        <component
          :key="index"
          :is="item"
          :editor="editor"
          v-bind="editorContext"
          v-else
        />
      </template>
    </section>
  </editor-menu-bubble>
</template>

<script>
import { EditorMenuBubble } from 'tiptap'
import { getMarkRange } from 'tiptap-utils'
import { CommandComponents, LinkBubble } from '@/components/base/q-editor/data/editor'

import OForeColorDropdown from '@/components/base/q-editor/buttons/OForeColorDropdown'
import OBackColorDropdown from '@/components/base/q-editor/buttons/OBackColorDropdown'
import OFontFamilyDropdown from '@/components/base/q-editor/buttons/OFontFamilyDropdown'
import OAlignDropdown from '@/components/base/q-editor/buttons/OAlignDropdown'
import OAlignGroup from '@/components/base/q-editor/buttons/OAlignGroup'
import OLineHeightDropdown from '@/components/base/q-editor/buttons/OLineHeightDropdown'
import OHeadingDropdown from '@/components/base/q-editor/buttons/OHeadingDropdown'
import OHeadingList from '@/components/base/q-editor/buttons/OHeadingList'
import OListDropdown from '@/components/base/q-editor/buttons/OListDropdown'
import OIndentDropdown from '@/components/base/q-editor/buttons/OIndentDropdown'
import OTextFormatDropdown from '@/components/base/q-editor/buttons/OTextFormatDropdown'

import OAddMoreBtn from '@/components/base/q-editor/buttons/OAddMoreBtn'
import OLinkBtn from '@/components/base/q-editor/buttons/OLinkBtn'
import OLinkOffBtn from '@/components/base/q-editor/buttons/OLinkOffBtn'
import OLinkOpenBtn from '@/components/base/q-editor/buttons/OLinkOpenBtn'
import OLinkEditBtn from '@/components/base/q-editor/buttons/OLinkEditBtn'
import OPhotoBtn from '@/components/base/q-editor/buttons/OPhotoBtn'
import OTableBtn from '@/components/base/q-editor/buttons/OTableBtn'
import OTableGroup from '@/components/base/q-editor/buttons/OTableGroup'

import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import OSimpleCommandBtn from '@/components/base/q-editor/buttons/OSimpleCommandBtn'
import OMetaInput from '@/components/base/q-editor/common/OMetaInput'

export default {
  name: 'o-editor-menu-bubble',
  data () {
    return {
      backToMain: false
    }
  },
  props: {
    editor: {
      type: Object
    },
    toolbar: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectedCellSize: {
      type: Number,
      default: 0
    },
    imgSelected: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EditorMenuBubble,
    OMenubarBtn,
    OSimpleCommandBtn,
    OMetaInput,
    OForeColorDropdown,
    OBackColorDropdown,
    OFontFamilyDropdown,
    OAlignDropdown,
    OAlignGroup,
    OLineHeightDropdown,
    OHeadingDropdown,
    OHeadingList,
    OListDropdown,
    OIndentDropdown,
    OTextFormatDropdown,
    OAddMoreBtn,
    OLinkBtn,
    OLinkOffBtn,
    OLinkOpenBtn,
    OLinkEditBtn,
    OPhotoBtn,
    OTableBtn,
    OTableGroup
  },
  methods: {
    getName (item) {
      return CommandComponents[item] || 'o-simple-command-btn'
    },
    isLinkSelection (selection) {
      const { schema } = this.editor
      const linkType = schema.marks.link
      if (!linkType) return false
      if (!selection) return false

      const { $from, $to } = selection
      const range = getMarkRange($from, linkType)
      if (!range) return false

      return range.to === $to.pos
    },
    onBackToMain (editorContext) {
      this.backToMain = true
    }
  },
  computed: {
    bubbleToolbar () {
      let toolbar = this.toolbar
      if (!this.backToMain) {
        if (this.isLinkSelected) {
          toolbar = LinkBubble
        }
      }
      return toolbar
    },
    showBack () {
      return !this.backToMain && this.isLinkSelected
    },
    isLinkSelected () {
      if (this.editor) {
        const { state } = this.editor
        const { tr } = state
        const { selection } = tr

        return this.isLinkSelection(selection)
      } else {
        return false
      }
    }
  },
  watch: {
    isLinkSelected (to, from) {
      this.backToMain = false
    }
  },
  mounted () {
  },
  deactivated () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="stylus"></style>
