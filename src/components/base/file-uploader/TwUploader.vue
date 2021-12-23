<template>
  <q-uploader
    flat
    color="white"
    multiple
    class="full-width"
    :accept="accept"
    :filter="checkFileType"
    :factory="_factory"
    @added="_added"
    @uploaded="_uploaded"
    @factory-failed="_factoryFailed"
    @failed="_failed"
    ref="qUploader"
    @rejected="onRejected"
  >
    <template v-slot:header>
      <q-btn
        v-show="showUploadArea"
        unelevated
        color="primary"
        icon="cloud_upload"
        :label="btnLabel"
      >
        <q-uploader-add-trigger />
      </q-btn>
    </template>

    <template v-slot:list="scope">
      <!-- 文件列表 -->
      <slot :unloadFiles="scope.files"></slot>
    </template>
  </q-uploader>
</template>

<script>
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'

export default {
  name: 'TwUploader',

  components: {},

  mixins: [mixinxquasarupload],

  props: {
    showUploadArea: { type: Boolean, default: false },
    accept: { type: String, default: '*' },
    btnLabel: { type: String, default: '上传' },
    folder: { type: String, default: '' }
  },

  data () {
    return { }
  },

  methods: {
    checkFileType (files) {
      return files.filter(
        file => file.name.substr(file.name.lastIndexOf('.')).length > 1
      )
    },
    onRejected () {
      showWarningMessage(i18n.t(`file.error.fileFormatNotSupported`))
    },
    uploaded (files) {
      this.$emit('uploaded', files)
    },
    removeFile (file) {
      this.$refs.qUploader.removeFile(file)
    },
    removeFileUploaded (fileName) {
      this.$refs.qUploader.removeFile(
        _.find(this.$refs.qUploader.files, { name: fileName })
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
