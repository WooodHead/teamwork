<template>
  <q-btn
    dense
    round
    :flat="flat"
    :size="size"
    class="text-accent"
    :class="{ 'emoji-font':$q.platform.is.win}"
    @click="dialog=!$q.screen.gt.xs"
  >
    <q-avatar icon="mood" />
    <q-popup-proxy v-if="$q.screen.gt.xs">
      <tw-emoji-panel @add="addEmoji" />
    </q-popup-proxy>
    <q-dialog
      v-else
      position="bottom"
      v-model="dialog"
    >
      <tw-emoji-panel @add="addEmoji" />
    </q-dialog>
  </q-btn>
</template>

<script>
export default {
  name: 'TwEmojiBtn',
  components: {
    TwEmojiPanel: () => import('components/emoji/TwEmojiPanel')
  },
  props: {
    size: {
      type: String,
      required: false,
      default: 'sm'
    },
    flat: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    addEmoji (emoji) {
      this.dialog = false
      this.$emit('addEmoji', emoji)
    }
  }
}
</script>

<style>
</style>
