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
            <div class="text-bold">说明</div>
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
// import OEmbedMenu from '@/components/base/q-editor/buttons/OEmbedMenu'
import OCommonItem from '@/components/base/q-editor/common/OCommonItem'
// import OMetaInput from '@/components/base/q-editor/common/OMetaInput'
// import OTableGrid from 'sr@c/components/base/q-editor/common/OTableGrid'
export default {
  name: 'o-add-more-btn',
  data () {
    return {
    }
  },
  props: {
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
    // OEmbedMenu,
    OCommonItem
    // OMetaInput,
    // OTableGrid
  },
  methods: {
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
    embedServices () {
      return (this.opt && this.opt.embed) ? this.opt.embed : null
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
  .o-add-more-btn {
  }
</style>
