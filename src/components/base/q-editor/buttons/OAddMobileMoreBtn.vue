<template>
  <o-menubar-btn
    icon="add"
    :tooltip="$t('editor.addMore')"
    class="text-blue o-add-more-btn"
  >
    <q-menu
      ref="addPopover"
      anchor="bottom left"
      self="top left"
      content-class="o-menu"
    >
      <section>
        <template v-for="(item, index) of toolbar">
          <o-common-item
            ref="commonItem"
            :key="`${item}-${index}`"
            icon="format_italic"
            :label="oAddMobileMore[item].label"
            class="add-mobile-more-btn"
            @click.native="itemClick(item)"
          >
            <template #itemIcon>
              <component
                :key="`${item}-${index}`"
                :name="item"
                :is="getName(item)"
                :editor="editor"
                v-bind="{commands:commands,isActive:isActive,opt: opt}"
                v-if="typeof item === 'string'"
                @selectItem="selectItem"
                ref="buttonItem"
              />
              <component
                :key="`${item}-${index}`"
                :name="item.name"
                :is="getName(item.name)"
                :opt="item.options"
                :editor="editor"
                v-bind="{commands:commands,isActive:isActive,opt: opt}"
                v-else-if="typeof item === 'object' && item.type === 'menu'"
              />
              <component
                :key="`${item}-${index}`"
                :is="item"
                :editor="editor"
                v-bind="{commands:commands,isActive:isActive,opt: opt}"
                v-else
              />
            </template>
          </o-common-item>
          <q-separator
            :key="`${item}-${index}`"
            v-if="['back-color','line-height','table','redo'].includes(item)"
          />
        </template>
        <!-- <o-common-item
          icon="photo"
          :label="$t('editor.image')"
        >
          <q-menu
            ref="photoPopover"
            anchor="top right"
            self="top left"
            :offset="[2, 0]"
          >
            <o-meta-input
              :title="$t('editor.image')"
              icon="image"
              @primaryAction="insertImage(commands.image, $event)"
            >
            </o-meta-input>
          </q-menu>
        </o-common-item> -->
        <o-common-item
          icon="mdi-sitemap"
          :label="$t('diagram.name')"
          @click.native="commands.diagram"
          v-close-popup
        >
          <q-tooltip
            anchor="center right"
            self="center left"
          >
            <div class="text-bold">Mermaid</div>
            <div class="text-white">{{$t('diagram.tips')}}</div>
          </q-tooltip>
        </o-common-item>
        <q-separator />
        <!-- <o-common-item
          icon="mdi-iframe-outline"
          :label="$t('editor.thirdPartyService')"
          side-icon="keyboard_arrow_right"
        >
          <q-menu
            ref="formulaPopover"
            anchor="center right"
            self="center left"
            content-class="o-menu"
            :offset="[2, 0]"
          >
            <o-embed-menu
              :embed-services="embedServices"
              @select="onSelectService"
            />
          </q-menu>
        </o-common-item> -->
      </section>
    </q-menu>
  </o-menubar-btn>
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import OEmbedMenu from '@/components/base/q-editor/buttons/OEmbedMenu'
import OCommonItem from '@/components/base/q-editor/common/OCommonItem'
import { CommandComponents, MobileAddToolbar } from '@/components/base/q-editor/data/editor'
// import OMetaInput from '@/components/base/q-editor/common/OMetaInput'
// import OTableGrid from '@/components/base/q-editor/common/OTableGrid'
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
import OBlockSystemQuoteBtn from '@/components/base/q-editor/buttons/OBlockSystemQuoteBtn'

import OTableBtn from '@/components/base/q-editor/buttons/OTableBtn'
import OTableGroup from '@/components/base/q-editor/buttons/OTableGroup'

import OSimpleCommandBtn from '@/components/base/q-editor/buttons/OSimpleCommandBtn'
import OMetaInput from '@/components/base/q-editor/common/OMetaInput'

export default {
  name: 'o-add-more-btn',
  data () {
    return {
      oAddMobileMore: {
        italic: { label: this.$q.lang.editor.italic, click: this.commands.italic },
        underline: { label: this.$q.lang.editor.underline, click: this.commands.underline },
        strike: { label: this.$q.lang.editor.strikethrough, click: this.commands.strike },
        code: { label: this.$q.lang.editor.code, click: this.commands.code },
        'back-color': { label: this.$t('editor.highlightColor'), click: this.commands.backColor },
        format_clear: { label: this.$q.lang.editor.removeFormat, click: this.commands.formatClear },
        indent: { label: this.$q.lang.editor.indent, click: this.commands.indent },
        outdent: { label: this.$q.lang.editor.outdent, click: this.commands.outdent },
        'line-height': { label: this.$t('editor.lineHeight'), click: this.commands.lineHeight },
        horizontal: { label: this.$q.lang.editor.hr, click: this.commands.horizontal_rule },
        blockquote: { label: this.$t('editor.blockquote'), click: this.commands.blockquote },
        code_block: { label: this.$t('editor.codeBlock'), click: this.commands.code_block },
        link: { label: this.$t('editor.hyperlink'), click: this.commands.link },
        table: { label: this.$t('editor.table'), click: this.commands.createTable },
        undo: { label: this.$q.lang.editor.undo, click: this.commands.undo },
        redo: { label: this.$q.lang.editor.redo, click: this.commands.redo }
      }
    }
  },
  props: {
    editor: {
      type: Object
    },
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    },
    opt: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    OMenubarBtn,
    OEmbedMenu,
    OCommonItem,
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
    OTableGroup
    // OMetaInput,
    // OTableGrid
  },
  methods: {
    itemClick (item) {
      if (!['line-height', 'back-color', 'link', 'table'].includes(item)) {
        this.oAddMobileMore[item].click()
      }
      if (item === 'line-height') {
        document.getElementsByClassName('o-line-height-dropdown').length &&
          document.getElementsByClassName('o-line-height-dropdown')[0].click()
      } else if (item === 'back-color') {
        document.getElementsByClassName('o-back-color-dropdown').length &&
          document.getElementsByClassName('o-back-color-dropdown')[0].click()
      } else if (item === 'link') {
        document.getElementsByClassName('o-link-btn').length &&
          document.getElementsByClassName('o-link-btn')[0].click()
      } else if (item === 'table') {
        document.getElementsByClassName('o-table-btn').length &&
          document.getElementsByClassName('o-table-btn')[0].click()
      }
    },
    selectItem () {
      this.$refs.addPopover.hide()
    },
    getName (item) {
      return CommandComponents[item] || 'o-simple-command-btn'
    },
    insertIframe (command, src) {
      if (src) {
        command({ src })
      }
    },
    insertImage (command, src) {
      if (src) {
        command({ src })

        this.$refs.addPopover.hide()
      }
    },
    onSelectService (service) {
      this.commands.embed({ service: service.value })
    }
  },
  computed: {
    toolbar () {
      return MobileAddToolbar
    },
    embedServices () {
      return (this.opt && this.opt.embed) ? this.opt.embed : null
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
  .o-add-more-btn {
  }
</style>
