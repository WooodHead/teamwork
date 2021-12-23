<template>
  <div>
    <q-item class="q-pa-none">
      <q-item-section>
        <q-item-label
          lines="1"
          style="font-size:1rem;"
        >
          {{itemTitle}}
        </q-item-label>
        <q-item-label caption>
          <slot>
            <span v-if="loaded">{{`${humanStorageSize(1024 * file.size)}/${file.createTime}`}}</span>
            <q-linear-progress
              v-else
              stripe
              rounded
              size="14px"
              :value="linerProgressVal"
              color="secondary"
            >
              <div class="absolute-full flex flex-center text-white">{{`${sizeLabel}/${progressLabel}`}}</div>
            </q-linear-progress>
          </slot>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="row q-gutter-lg">
          <q-btn
            v-if="loaded&&canPreview"
            flat
            round
            stack
            size="sm"
            color="primary"
            icon="subject"
            :label="$t('action.preview')"
            @click="setShowFile()"
          />
          <q-btn
            v-if="loaded"
            flat
            round
            stack
            size="sm"
            color="positive"
            icon="cloud_download"
            :label="$t('action.download')"
            @click="download(file.url)"
          />
          <q-btn
            v-if="showDeleteBtn"
            flat
            round
            stack
            size="sm"
            color="negative"
            icon="close"
            :label="$t('action.delete')"
            @click="removeFile"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-separator />
    <!-- 预览图片 -->
    <image-viewer
      :viewImage="viewImage"
      :url="file.url"
      @close-dialog="viewImage=false"
    />
  </div>
</template>

<script>
import { format } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
import { download } from '@/boot/file'
import { showConfirm } from '@/utils/show-confirm'
const { humanStorageSize } = format
export default {
  name: 'FileItem',
  props: {
    loaded: { type: Boolean, default: false, desc: '是否上传完成' },
    showDeleteBtn: { type: Boolean, default: false, desc: '是否显示删除按钮' },
    file: { type: [Object, File], default: () => { }, desc: '文件对象' },
    sizeLabel: { type: String, default: '0.0B', desc: '上传的文件大小' },
    progressLabel: { type: String, default: '0.00%', desc: '上传的文件进度' }
  },
  data () {
    return {
      viewImage: false
    }
  },
  components: {
    ImageViewer: () => import('components/attach/ImageViewer')
  },
  computed: {
    ...mapState('file', ['imgExts']),
    ...mapGetters('file', ['canPreviewExts']),
    itemTitle () {
      return this.loaded
        ? `${this.file.title}${this.file.ext}`
        : this.file.name
    },
    linerProgressVal () {
      return +this.progressLabel.slice(0, this.progressLabel.length - 1) / 100
    },
    canPreview () {
      return this.file.ext && this.canPreviewExts.includes(this.file.ext.toLowerCase())
    }
  },
  methods: {
    ...mapActions('file', ['deleteFile']),
    humanStorageSize,
    download,
    removeFile () {
      let that = this
      showConfirm(this.$t('product.notifies.confirmDelete'),
        () => {
          that.loaded
            ? that.deleteFile(that.file.id)
            : that.$emit('removeFile', that.file)
        },
        () => { })
    },
    setShowFile () {
      // 图片预览和文件预览分开
      if (this.canPreview && this.file.ext && this.imgExts.includes(this.file.ext.toLowerCase())) {
        this.viewImage = true
      } else {
        this.canPreview && previewFile(
          this.file.url,
          this.file.title,
          this.file.ext,
          this,
          this.file.id
        )
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
