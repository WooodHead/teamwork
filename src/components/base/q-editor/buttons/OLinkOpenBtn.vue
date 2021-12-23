<template>
  <o-menubar-btn
    icon="open_in_new"
    :tooltip="$t('link.open')"
    @click.native="onLinkOpen"
    class="o-link-open-btn"
  />
</template>

<script>
import { openUrl } from '@/components/base/q-editor/utils/shared'
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
export default {
  name: 'o-link-open-btn',
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
    OMenubarBtn
  },
  methods: {
    onLinkOpen () {
      let link = this.getMarkAttrs('link')
      if (link && link.href) {
        openUrl(link.href)
      }
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus">
  .o-link-open-btn {
  }
</style>
