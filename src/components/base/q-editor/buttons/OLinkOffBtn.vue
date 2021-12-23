<template>
  <o-menubar-btn
    icon="link_off"
    :tooltip="$t('link.off')"
    @click.native="onLinkOff"
    class="o-link-off-btn"
  />
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import OMetaInput from '@/components/base/q-editor/common/OMetaInput'
export default {
  name: 'o-link-off-btn',
  data () {
    return {
      href: ''
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
    // eslint-disable-next-line vue/no-unused-components
    OMetaInput
  },
  methods: {
    onLinkOff () {
      this.commands.link({ href: '' })
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus">
  .o-link-off-btn {
  }
</style>
