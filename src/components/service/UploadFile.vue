<template>
  <q-uploader
    flat
    color='white'
    ref="qUploader"
    :multiple="multiple"
    :accept="accept"
    :capture="capture"
    :factory="_factory"
    @added="_added"
    @uploaded="_uploaded"
    @factory-failed="_factoryFailed"
    @failed="_failed"
    style="width: fit-content;"
  >
    <template v-slot:header="scope">
      <div>
        <q-btn
          v-if="scope.canAddFiles"
          v-show="showAddBtn"
          type="a"
          :label="label||$t('document.action.upload')"
          icon="file_upload"
          rounded
          color="primary"
        >
          <q-uploader-add-trigger />
          <q-tooltip>选择文件</q-tooltip>
        </q-btn>
      </div>
    </template>

    <template v-slot:list="scope">
      <q-list separator>
        <q-item
          v-for="file in scope.files"
          :key="file.name"
        >
          <q-item-section style="flex: 0 0 auto;">
            <q-item-label class="full-width ellipsis">
              {{ file.name}}
            </q-item-label>
            <q-item-label caption>
              {{ file.__sizeLabel }} / {{ file.__progressLabel }}
            </q-item-label>
          </q-item-section>
          <q-item-section style="flex: 1 1 auto;">
            <attach-icon
              v-if="file.__status==='uploaded'"
              :path="file.filePath"
              :extension="file.extension"
              style="height: 90px;"
            />
          </q-item-section>
          <q-item-section
            top
            side
          >
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              v-if="file.__progress===1"
              @click="deleteFile(file)"
            ></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </template>

  </q-uploader>
</template>
<script>
import { format } from 'quasar'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { getUrl } from '@/boot/file'
import { mapState } from 'vuex'
const { humanStorageSize } = format
export default {
  name: 'UploadFile',
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
  },
  props: {
    showAddBtn: { type: Boolean, default: true },
    accept: { type: String },
    capture: { type: String },
    multiple: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    folder: {
      type: String,
      default: 'service'
    }
  },
  computed: {
    ...mapState('file', ['imgExts'])
  },
  mixins: [mixinxquasarupload],
  watch: {
    files: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        this.$nextTick(() => {
          this.initLoadFiles(newVal)
        })
      }
    }
  },
  methods: {
    deleteFile (file) {
      this.files.splice(this.files.findIndex(f => f.name === file.name), 1)
    },
    initLoadFiles (files) {
      let initFiles = _.map(files, item => {
        let file = {
          id: item.id,
          name: item.title.split('.')[0] + item.extension,
          size: item.size,
          type: item.extension,
          filePath: item.filePath,
          extension: item.extension,
          __status: 'uploaded',
          __uploaded: item.size * 1024,
          __progress: 1,
          __sizeLabel: humanStorageSize(item.size * 1024),
          __progressLabel: '100.00%'
        }
        if (this.imgExts.includes(item.extension.toLowerCase())) {
          const src = getUrl(item.filePath)
          file['__img'] = { src }
          return file
        } else {
          return file
        }
      })
      this.$refs.qUploader && (this.$refs.qUploader.files = initFiles)
    },
    uploaded (files) {
      let fileFromEnd = files[0]
      this.files.push({
        title: fileFromEnd.Title,
        filePath: fileFromEnd.PathName,
        extension: fileFromEnd.Extension,
        size: fileFromEnd.Size
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.q-uploader {
  width: 100% !important;
}
.q-uploader__list img {
  width: 100%;
}
/deep/.q-uploader__list {
  padding: 0;
}
</style>
