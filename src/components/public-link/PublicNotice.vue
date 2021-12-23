<template>
  <q-card-section class="q-pt-xl q-gutter-y-sm">
    <div class="row no-wrap col">
      <div class="col q-gutter-y-sm">
        <div class="text-subtitle2">
          {{currentNotice.modifyBy}}
          {{$t('document.modify.lastUpdated')}}
          {{currentNotice.modifyTime}}
        </div>
        <div style="font-size:12px;">{{currentNotice.noticeType}}</div>
        <div class="text-h6">
          <span class="text-weight-bold">{{currentNotice.title}}</span>
        </div>
      </div>
    </div>
    <div
      v-html="currentNotice.content"
      class="tiptap-content editor__content"
    ></div>
  </q-card-section>
</template>

<script>
import Notice from '@/store/notice/model'
export default {
  name: 'PublicNotice',
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentNotice: {}
    }
  },
  created () {
    if (this.publicContent) {
      this.currentNotice = Notice.from(this.publicContent)
    }
  }
}
</script>

<style scoped>
</style>
