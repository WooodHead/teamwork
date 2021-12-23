<!-- 头部操作按钮 -->
<template>
  <editor-menu-bar
    :editor="editor"
    v-slot="editorContext"
  >
    <section class="row col-12 justify-between items-center bg-light tiptap-menubar">
      <!-- Toolbar: left -->
      <section
        class="row q-px-xs menubar"
        :class="{ 'is-focused': editorContext.focused }"
      >
        <!-- Table -->
        <template v-if="editorContext.isActive.table && editorContext.isActive.table()">
          <template v-for="(item, index) of tableToolbar">
            <q-separator
              vertical
              inset
              :key="`${item}-${index}`"
              v-if="item==='separator'"
            />
            <component
              :key="`${item}-${index}`"
              :name="item"
              :is="getName(item)"
              :editor="editor"
              v-bind="editorContext"
              v-else-if="typeof item === 'string'"
            />
            <component
              :key="`${item}-${index}`"
              :name="item.name"
              :is="getName(item.name)"
              :opt="item.options"
              :editor="editor"
              v-bind="editorContext"
              v-else-if="typeof item === 'object' && item.type === 'menu'"
            />
            <component
              :key="`${item}-${index}`"
              :is="item"
              :editor="editor"
              v-bind="editorContext"
              v-else
            />
            <o-table-group
              v-bind="editorContext"
              :key="`table-${index}`"
              v-if="item==='table'"
            />
          </template>
        </template>

        <!-- Normal -->
        <template v-else>
          <template v-for="(item, index) of toolbar">
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
              :folder="folder"
            />
            <component
              :key="index"
              :name="item.name"
              :is="getName(item.name)"
              :opt="item.options"
              :editor="editor"
              v-bind="editorContext"
              v-else-if="typeof item === 'object' && item.type === 'menu'"
            />
            <component
              :key="index"
              :is="item"
              :editor="editor"
              v-bind="editorContext"
              v-else
            />
          </template>
        </template>

        <!-- Extra -->
        <slot name="left" />
      </section>

      <!-- Toolbar: right -->
      <section class="row q-px-xs">
        <slot name="right" />
      </section>
    </section>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar } from 'tiptap'
// eslint-disable-next-line no-unused-vars
import { CommandComponents, TableToolbar } from '@/components/base/q-editor/data/editor'

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
import OAddMobileMoreBtn from '@/components/base/q-editor/buttons/OAddMobileMoreBtn'
import OPhotoBtn from '@/components/base/q-editor/buttons/OPhotoBtn'
import OLinkBtn from '@/components/base/q-editor/buttons/OLinkBtn'
import OInsertTemplate from '@/components/base/q-editor/buttons/OInsertTemplate'

import OBlockSystemQuoteBtn from '@/components/base/q-editor/buttons/OBlockSystemQuoteBtn'

import OTableBtn from '@/components/base/q-editor/buttons/OTableBtn'
import OTableGroup from '@/components/base/q-editor/buttons/OTableGroup'

import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import OSimpleCommandBtn from '@/components/base/q-editor/buttons/OSimpleCommandBtn'
import OMetaInput from '@/components/base/q-editor/common/OMetaInput'

export default {
  name: 'o-editor-menu-bar',
  data () {
    return {
      pageView: 'page',
      isSlideShow: false
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
    tableToolbar: {
      type: Array,
      default: function () {
        return []
      }
    },
    folder: {
      type: String,
      default: 'project',
      description: '业务类型：project|team|productDev,注意,这里指的是业务类型，而非工具类型(document,notice,task...)'
    }
  },
  components: {
    EditorMenuBar,
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
    OAddMobileMoreBtn,
    OPhotoBtn,
    OLinkBtn,
    OBlockSystemQuoteBtn,
    OTableBtn,
    OTableGroup,
    OInsertTemplate
  },
  methods: {
    getName (item) {
      return CommandComponents[item] || 'o-simple-command-btn'
    },
    showSidePanel () { },
    onSlideShow () { }
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
