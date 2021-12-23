<template>
  <o-menubar-btn
    icon="link"
    :tooltip="$q.lang.editor.hyperlink"
    class="o-link-btn"
  >
    <q-menu
      ref="linkPopover"
      anchor="bottom middle"
      self="top middle"
      class="shadow-5"
      @show="onShow"
    >
      <o-meta-input
        :val="href"
        :title="$q.lang.editor.hyperlink"
        icon="link"
        @primaryAction="insertLink(commands.link, $event)"
      >
        <div slot="header-right">
          <q-checkbox
            v-model="openInNewTab"
            :label="$t('link.open_in_new_tab')"
          />
        </div>
      </o-meta-input>
    </q-menu>
  </o-menubar-btn>
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import OMetaInput from '@/components/base/q-editor/common/OMetaInput'
export default {
  name: 'o-link-btn',
  data () {
    return {
      href: '',
      openInNewTab: true
    }
  },
  props: {
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    },
    getMarkAttrs: {
      type: Function
    }
  },
  components: {
    OMenubarBtn,
    OMetaInput
  },
  methods: {
    onShow () {
      this.href = ''
      this.openInNewTab = true

      let link = this.getMarkAttrs('link')
      if (link && link.href) {
        this.href = link.href
        this.openInNewTab = link.openInNewTab
      }
    },
    insertLink (command, href) {
      command({
        href: href,
        openInNewTab: this.openInNewTab
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus">
  .o-link-btn {
  }
</style>
