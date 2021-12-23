<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="display:flex;flex-direction:column;">
      <q-card-section
        class="flex items-center"
        :class="[{'q-py-none':!$q.platform.is.safari}, {'q-mb-sm':$q.platform.is.safari}]"
      >
        <div
          class="col text-bold ellipsis"
          style="line-height:34px;"
        >{{title}}</div>
        <div class="col-auto">
          <q-btn
            v-if="showDownloadBtn"
            icon="cloud_download"
            flat
            round
            dense
            color="positive"
            class="q-mr-xs"
            @click="download(url)"
          />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="hide"
          />
        </div>
      </q-card-section>
      <q-card-section
        class="col q-pa-none text-center"
        style="minHeight:calc(100vh - 34px);"
      >
        <attach-icon
          :id="id"
          :path="url"
          :extension="extension"
          directShow
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { download } from '@/boot/file'
export default {
  name: 'AttachViewer',
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
  },
  props: {
    showDownloadBtn: { type: Boolean, default: false, desc: '是否显示下载' },
    id: { type: Number, default: 0, desc: '文件id' },
    title: { type: String, default: '', desc: '文件标题' },
    url: { type: String, required: true, desc: '文件路径' },
    extension: { type: String, required: false, default: '', desc: '文件扩展后缀' }
  },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    download,
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
