<template>
  <q-banner class="bg-grey-3">
    <q-btn
      class="float-right"
      round
      icon="close"
      flat
      dense
      outline
      @click="$emit('close')"
    />
    <div class="text-center q-pa-lg">
      <div class="text-weight-bold text-subtitle1">{{$t('document.shareDraft.notesTitle')}}</div>
      <div class="q-pt-sm">{{$t('document.shareDraft.notesContent')}}</div>
      <div class=" q-pt-md">
        <q-input
          rounded
          outlined
          v-model="link"
        >
          <template
            v-slot:append
            v-if="link"
          >
            <q-btn
              @click="copyLinkToClipboard"
              icon="file_copy"
              rounded
              class="bg-positive text-white"
              :label="$t('publicLink.copyLinkToClipboard')"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-banner>
</template>
<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'ShareDraft',
  computed: {
    link () {
      return `${window.location.protocol}//${window.location.host}${this.$route.path}`
    }
  },
  methods: {
    // 复制到剪切板
    copyLinkToClipboard () {
      copyToClipboard(this.link)
        .then(() => {
          // 成功!
          this.$q.notify({
            message: '复制成功',
            color: 'accent',
            position: 'center',
            timeout: '500'
          })
        })
        .catch(() => {
          // 失败
          this.$q.notify({
            message: '复制失败，请重试',
            color: 'warning',
            timeout: '500'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
