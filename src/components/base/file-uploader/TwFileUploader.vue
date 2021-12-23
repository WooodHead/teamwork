<template>
  <div>
    <!-- 添加文件 -->
    <q-uploader
      flat
      color="white"
      multiple
      class="full-width"
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
        <div
          v-if="showUploadArea"
          class="rounded-borders text-center upload-header"
        >
          <q-icon
            name="cloud_upload"
            color="grey-5"
            size="xl"
          />
          <div class="q-px-sm text-caption text-grey-5">{{$t('file.draggableNotes')}}</div>

          <q-uploader-add-trigger />
        </div>
      </template>

      <template v-slot:list="scope">
        <!-- 文件列表 -->
        <slot
          :loadedFiles="lstFile"
          :unloadFiles="scope.files"
        >
          <div
            v-if="lstFile.length===0&&scope.files.length===0"
            class="text-center text-caption text-warning"
          >{{$t('file.blankFileList')}}</div>
          <q-list separator>
            <!-- 未写入后台 -->
            <file-item
              v-for="file in scope.files"
              :key="file.name"
              :file="file"
              :sizeLabel="file.__sizeLabel"
              :progressLabel="file.__progressLabel"
              @removeFile="scope.removeFile(file)"
            />
            <!-- 已写入后台 -->
            <file-item
              loaded
              :showDeleteBtn="showDeleteBtn"
              v-for="file in lstFile"
              :key="file.name"
              :file="file"
            />
          </q-list>
        </slot>
      </template>
    </q-uploader>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'TwFileUploader',
  components: {
    FileItem: () => import('components/base/file-uploader/FileItem')
  },
  mixins: [mixinxquasarupload],
  props: {
    showUploadArea: { type: Boolean, default: false },
    showDeleteBtn: { type: Boolean, default: false },

    objectType: { type: String, default: '' },
    objectId: { type: Number, default: 0 }
  },
  data () {
    return {
      folder: this.objectType
    }
  },
  computed: {
    ...mapGetters('file', ['files']),
    lstFile () {
      return _.orderBy(_.filter(this.files, f =>
        f.objectType === this.objectType &&
        f.objectId === this.objectId &&
        f.usedBy !== 'carousel'), 'createTime', 'desc')
    }
  },
  methods: {
    ...mapMutations('file', ['setSort']),
    ...mapActions('file', ['loadFiles', 'deleteFile']),
    /** 校验文件类型。过滤掉无扩展名的文件 */
    checkFileType (files) {
      return files.filter(file => file.name.substr(file.name.lastIndexOf('.')).length > 1)
    },
    onRejected () {
      showWarningMessage(this.$t(`file.error.fileFormatNotSupported`))
    },
    uploaded (files) {
      this.$emit('uploaded', files)
    },
    removeFile (file) {
      this.$refs.qUploader.removeFile(file)
    },
    removeFileUploaded (fileName) {
      this.$refs.qUploader.removeFile(_.find(this.$refs.qUploader.files, { name: fileName }))
    }
  },
  mounted () {
    this.setSort('orderNumber')
    let query = [
      { Key: 'ObjectType', Value: this.objectType, Oper: 'eq' },
      'and',
      { Key: 'ObjectID', Value: this.objectId, Oper: 'eq' },
      'and',
      { Key: 'UsedBy', Value: 'carousel', Oper: 'ne' }
    ]
    this.loadFiles({ query })
  }
}
</script>

<style lang='scss' scoped>
// 解除默认最大高度限制
/deep/.q-uploader {
  max-height: none;
}

/deep/.q-uploader__list {
  padding: 0;
}

// 解决拖动排序时出现虚线框的问题
// /deep/.q-uploader__dnd {
//   display: none;
// }

// 拖拽上传区域样式
.upload-header {
  height: 80px;
  border: 0.15rem dashed $grey-5;
}
</style>
