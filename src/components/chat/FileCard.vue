<template>
  <q-card 
    class="cursor-pointer widget-card">
    <div
      class='widget-card-section'
      style="position:flex;flex-direction:column;height:100%"
    >
      <q-card-section class="adjustment">
        <attach-icon
          :path="file.path"
          :extension="file.extension"
          class="chat-fileCard"
        />
        <div
          style="word-wrap: break-word;"
          class="text-subtitle2 text-weight-bold q-pb-none q-mt-sm text-center ellipsis-2-lines"
        >
          {{file.title}}
        </div>
      </q-card-section>
      <q-card-section class="chat-tag">
        <div>
          <a
            v-if="canPreview"
            :href="`javascript:previewFile('${file.path}','${file.title}','${file.extension}')`"
            class="text-body2"
          > 点击预览</a>
          <span v-if="canPreview"> • </span>
          <a
            href="javascript:void(0);"
            title="下载文件时您的ip会被记录，请安全阅读~"
            class="cursor-pointer"
            @click="download(file.path)"
          > 点击下载</a>
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { download } from '@/boot/file'
import { mapGetters } from 'vuex'
export default {
  name: 'FileCard',
  props: {
    model: { type: Object }
  },
  computed: {
    ...mapGetters('file', ['canPreviewExts']),
    file () {
      return this.model.text[0]
    },
    canPreview () {
      return this.file.extension &&
        this.canPreviewExts.includes(this.file.extension.toLowerCase())
    }
  },
  methods: {
    download
  },
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
  }
}
</script>

<style lang="scss" scoped>
.widget-card:before {
  content: "";
  display: block;
  padding-top: 133% !important;
}
.widget-card {
  width: 100%;
}
@media (min-width: $breakpoint-xs-max) {
  .widget-card {
    width: 12rem !important;
    display: block;
  }
}
.adjustment {
  padding-top: 22px;
  flex: 1;
  height: 70%;
  text-align: center;
}
.chat-tag {
  height: 30%;
  text-align: center;
}
.chat-fileCard {
  height: 75%;
}
</style>
