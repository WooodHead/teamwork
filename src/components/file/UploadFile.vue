<template>
  <q-uploader
    :accept="accept"
    class="upload-header"
    flat
    color='white'
    ref="qUploader"
    :filter="checkFileType"
    :multiple="multiple"
    :factory="_factory"
    @added="_added"
    @start="start"
    @uploaded="_uploaded"
    @factory-failed="_factoryFailed"
    @failed="_failed"
    @rejected="onRejected"
    style="width: fit-content;max-height: fit-content;"
  >
    <!-- 上传文件按钮 -->
    <template v-slot:header>
      <div
        v-show="showUploadArea"
        class="rounded-borders text-center q-pt-lg"
        :class="`${$q.platform.is.mobile?'q-mx-sm':'q-mx-md'}`"
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
    <!-- 已经上传的文件列表 -->
    <template v-slot:list="scope">
      <div v-if="scope.files.length">
        <q-card
          v-for="(file,index) in sortFile(scope.files)"
          :key="file.name"
          :class="`${$q.screen.lt.sm?showRemark?'q-mt-lg q-pa-xs q-mx-sm':'q-mt-lg q-pa-sm q-mx-md':'q-ma-xl q-pa-lg q-card'}`"
        >
          <div
            class="row no-wrap"
            v-if="showClear"
          >
            <q-space />
            <q-btn
              round
              color="red"
              icon="clear"
              class="btn-position"
              @click="removeFile(file)"
              dense
            />
          </div>

          <q-item class="attach-content">
            <q-item-section
              caption
              class="col-2 attach-img"
            >
              <div class="relative-position">
                <template v-if="file.__status==='uploaded'">
                  <attach-default-img
                    class="upload-file"
                    :path="getFilePathName(file)"
                    :extension="(file.subName||file.name).slice((file.subName||file.name).lastIndexOf('.')+1)"
                    :title="file.subName||file.name"
                  ></attach-default-img>
                  <div class="column items-center">{{file.__sizeLabel | formatSize}}</div>
                </template>
                <q-linear-progress
                  v-if="file.__status!=='uploaded'&&!$q.screen.lt.sm"
                  rounded
                  size="20px"
                  :value="file.__uploaded / file.size"
                  color="positive"
                  class="absolute-center"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="positive"
                      :label="file.__progressLabel"
                    />
                  </div>
                </q-linear-progress>
              </div>
            </q-item-section>

            <q-item-section :class="`${$q.screen.lt.sm?'col-12 q-mt-md':'col-10'}`">
              <div
                v-if="!canEdit"
                :class="`${!$q.screen.lt.sm ? 'q-ml-md' : 'text-center'}`"
              >{{(file.subName||file.name)}}</div>
              <template v-if="canEdit">
                <q-input
                  :class="{ 'q-mb-md': file.showEditor }"
                  dense
                  outlined
                  :value="getFileName(file)"
                  @input="setFileName($event,file)"
                >
                  <template v-slot:after>
                    <span class="text-bold">{{(file.subName||file.name).slice((file.subName||file.name).lastIndexOf('.'))}}</span>
                  </template>
                </q-input>
                <template v-if="showRemark">
                  <q-input
                    v-if="!file.showEditor"
                    class="q-mt-md"
                    type="text"
                    :placeholder="$t('document.field.placeholder.notes')"
                    outlined
                    dense
                    @click="setShowEditor(file)"
                  />
                  <quasar-editor
                    @input="(val)=>{setContent(val,file)}"
                    :value="content[index]||file.content"
                    :folder="folder"
                    :applied="goIntoAction"
                    :placeholder="$t('document.field.placeholder.notes')"
                    v-if="file.showEditor"
                    class="UploadLoadFile"
                  ></quasar-editor>
                </template>
              </template>
              <q-linear-progress
                v-if="$q.screen.lt.sm&&file.__progressLabel.replace('%','')/100!==1"
                rounded
                size="20px"
                :value="file.__progressLabel.replace('%','')/100"
                color="positive"
                class="q-mt-sm"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="positive"
                    :label="file.__progressLabel"
                  />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </template>
  </q-uploader>
</template>
<script>
import { download, getUrl } from '@/boot/file'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { mapState } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
const config = require('app/app.config.js')
import { date } from 'quasar'
// import { format } from 'quasar'
// const { humanStorageSize } = format
export default {
  name: 'UploadFile',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default: () => []
    },
    folder: {
      type: String,
      default: 'project'
    },
    showClear: {
      type: Boolean,
      default: true
    },
    showRemark: {
      type: Boolean,
      default: true
    },
    goIntoAction: {
      type: Boolean,
      default: false,
      description: '如果不显示备注信息，则不用传此值，此属性主要是为了监听富文本框的离开提醒事件'
    },
    isDeleteInitFileIfAddFile: {
      type: Boolean,
      default: false
    },
    formAction: {
      type: Array,
      default: () => { return [] },
      description: '提交按钮，是一个对象数组，例如：[{ label: this.$t("action.submitEdit"), action: "submit" }]'
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    },
    isReUpload: {
      type: Boolean,
      default: false,
      description: '是否重新上传。重新上传会给原文件名加时间戳。'
    }
  },
  data () {
    return {
      showUploadArea: true,
      allFile: [], // 添加此参数主要是为了响应式，this.$refs.update.files无响应式
      // isFirstAddFile: true,
      content: [] // 此属性主要是为了设置富文本编辑器的内容，防止光标乱跳
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'videoExts'])
  },
  mixins: [mixinxquasarupload],
  mounted () {
    // 初始化加载
    this.$emit('initCallBack')
    // 初始化文件
    this.initLoadFiles()
  },
  watch: {
    // 监听初始化的文件是否发生改变，如果改变重新渲染
    files (val) {
      this.initLoadFiles()
    }
  },
  filters: {
    /**
     * 格式化文件大小
     */
    formatSize (size) {
      let reg = /[a-zA-Z]+/
      let match
      let copySize = _.cloneDeep(size)
      while (copySize.match(reg)) {
        match = copySize.match(reg)[0]
        copySize = copySize.replace(match, '')
      }
      if (copySize >= 1024) {
        let k = 1024
        var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let i = Math.floor(Math.log(copySize) / Math.log(k))
        return (copySize / Math.pow(k, i)).toPrecision(3) + '' + sizes[i]
      } else {
        return size
      }
    }
  },
  methods: {
    round: _.round,
    // 初始化显示文件
    initLoadFiles () {
      let initFiles = _.map(this.files, item => {
        let file = {
          id: item.id,
          name: this.isReUpload ? (item.title.split(',')[0] + '.' + date.formatDate(Date.now(), 'YYYYMMDDHHmmss') + item.extension) : (item.title.split(',')[0] + item.extension),
          subName: item.title.split(',')[0] + item.extension,
          Size: Number(item.size),
          type: item.extension,
          pathName: item.filePath,
          __status: 'uploaded',
          __uploaded: Number(item.size) * 1024,
          __progress: 1,
          __sizeLabel: Number(item.size) + 'KB',
          __progressLabel: '100.00%',
          content: item.content || '',
          showEditor: true,
          extension: item.extension,
          initFile: true
        }
        if (this.imgExts.includes(item.extension.toLowerCase())) {
          const src = getUrl(item.filePath)
          file['__img'] = { src }
        }
        return file
      })
      // 初始化的文件push到上传组件
      let newInitFiles = _.differenceBy(initFiles, this.$refs.qUploader.files, 'subName')
      this.showUploadArea = newInitFiles.length === 0
      this.multiple && (this.showUploadArea = true)
      this.$refs.qUploader && this.$refs.qUploader.files.push(...newInitFiles)
      this.$refs.qUploader.files.forEach(element => {
        this.content.push(element.content)
      })
      this.setAllFile()
    },
    /** 校验文件类型。过滤掉无扩展名的文件 */
    checkFileType (files) {
      return files.filter(file => file.name.substr(file.name.lastIndexOf('.')).length > 1)
    },
    start () {
      if (this.formAction.length) {
        const actions = _.map(this.formAction, item => {
          item.disable = true
          item.oldLabel = item.oldLabel || item.label
          item.label = this.$t('action.uploading')
          return item
        })
        this.$emit('update:formAction', actions)
      }

      if (this.isDeleteInitFileIfAddFile) {
        let file = _.cloneDeep(this.$refs.qUploader.files)
        const deleteFiles = _.filter(file, file => { return file.initFile })
        _(deleteFiles).forEach(file => {
          this.$refs.qUploader.removeFile(file)
        })
      }
      this.showUploadArea = !!this.multiple
      this.$emit('start')
      // document.querySelectorAll('.q-uploader__list .q-card').length
      //   ? (this.isFirstAddFile = false)
      //   : (this.isFirstAddFile = true)
      // if (!this.isFirstAddFile) {
      //   // 跳转到最后一个元素
      //   const length = document.querySelectorAll('.q-uploader__list .q-card').length
      //   document.querySelectorAll('.q-uploader__list .q-card')[length - 1].scrollIntoView({
      //     behavior: 'smooth'
      //   })
      // }
    },
    // 文件上传后的回调
    uploaded (files) {
      this.setAllFile()
      let uploadFiles = this.$refs.qUploader.files
      _(files).forEach(function (value) {
        let f = _.find(uploadFiles, item => {
          return item.subName === value.Title + value.Extension || item.name === value.Title + value.Extension
        })
        f && (f.pathName = value.PathName)
        f && (f.extension = value.Extension)
        f && (f.Size = value.Size)
      })
      const uploadingFile = _.find(uploadFiles, { '__status': 'uploading' })
      if (uploadingFile) {
        return false
      }
      if (this.formAction.length) {
        const actions = _.map(this.formAction, item => {
          item.disable = false
          item.label = item.oldLabel || item.label
          return item
        })
        this.$emit('update:formAction', actions)
      }
      this.$emit('uploaded', files)
    },
    onRejected () {
      showWarningMessage(i18n.t(`file.error.fileFormatNotSupported`))
    },
    // 下载文件
    downloadFile (file) {
      if (file.__progress === 1) {
        let pathName = ''
        if (config.extranet && config.oss && config.oss.enable) {
          pathName = this.folder + '/' + file.subName || JSON.parse(file.xhr.responseText).data[0].PathName
        } else {
          pathName = file.pathName || JSON.parse(file.xhr.responseText).data[0].PathName
        }
        download(pathName)
      } else {
        this.$q.notify({ message: '等待文件上传成功，再点击下载！', icon: 'warning' })
      }
    },
    removeFile (file) {
      this.$refs.qUploader.removeFile(file)
      this.$emit('removeFile', file)
      this.showUploadArea = true
      this.setAllFile()
    },
    getFilePathName (file) {
      if (config.extranet && config.oss && config.oss.enable) {
        return this.folder + '/' + (file.subName || file.name || JSON.parse(file.xhr.responseText).data[0].PathName)
      } else {
        return file.pathName || (file.xhr && file.xhr.response && JSON.parse(file.xhr.response).data && JSON.parse(file.xhr.response).data[0].PathName) || ''
      }
    },
    getFileName (file) {
      if (this.allFile) { }
      return file.newName ? file.newName.slice(0, file.newName.lastIndexOf('.'))
        : (file.subName || file.name).slice(0, (file.subName || file.name).lastIndexOf('.'))
    },
    setFileName (fileName, file) {
      const newName = fileName + (file.subName || file.name).slice((file.subName || file.name).lastIndexOf('.'))
      file.newName = newName
      this.setAllFile()
    },
    setShowEditor (file) {
      !file.showEditor && (file.showEditor = true)
      this.setAllFile()
    },
    setAllFile () {
      this.allFile = []
      this.allFile.push(...this.$refs.qUploader.files)
    },
    sortFile (files) {
      let f = _.cloneDeep(files)
      return _.reverse(f)
    },
    setContent (content, file) {
      let f = _.find(this.$refs.qUploader.files, ['name', file.name])
      f.content = content
    }
  },
  components: {
    AttachDefaultImg: () => import('components/attach/AttachDefaultImg'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  }
}
</script>

<style lang="scss" scoped>
  .file-title:hover {
    color: $primary;
  }
  .q-uploader {
    width: 100% !important;
  }
  .q-uploader__list img {
    width: 100%;
  }
  // 拖拽上传区域样式
  .upload-header {
    border: 0.15rem dashed $grey-5;
  }
  .btn-position {
    position: absolute;
    top: -1.2rem;
    right: -0.7rem;
  }
  /deep/ .q-uploader__list.scroll {
    margin-top: -20px;
  }
  .attach-icon /deep/ .q-img__image {
    background-size: contain !important;
  }
  /deep/ .q-uploader__dnd {
    display: none !important;
  }
  // .attach-img {
  //   width: 11%;
  //   margin-right: 3%;
  // }
  @media (max-width: $breakpoint-xs-max) {
    .attach-content {
      display: block;
    }
    .attach-img {
      margin: 0 auto;
      width: 100%;
    }
  }
  /deep/ .exceptImg,
  /deep/ .upload-file .rounded-borders {
    max-width: 5rem;
    height: 5rem;
    /* top: 50%; */
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
