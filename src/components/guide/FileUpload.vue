<template>
  <q-card class="card-grow-in-page q-pt-lg q-px-xxl">
    <q-form>
      <!-- 上传区 -->
      <q-card-section class="q-pa-none">
        <div class="row justify-center">
          <q-uploader
            flat
            color='white'
            ref="qUploader"
            :filter="checkFileType"
            :factory="_factory"
            @uploaded="_uploaded"
            @added="_added"
            @factory-failed="_factoryFailed"
            @failed="_failed"
            @rejected="onRejected"
            class="full-width"
          >
            <template v-slot:header="scope">
              <div class="q-mb-lg text-center">
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  :label="label||$t('guide.document.uploadBtn')"
                  color="green"
                  @click="$emit('hiddenAllForm')"
                >
                  <q-uploader-add-trigger />
                  <q-tooltip>{{$t('guide.document.selectFile')}}</q-tooltip>
                </q-btn>
                <span
                  class="q-my-md text-grey-8"
                  style="display: block;"
                >{{$t('guide.document.or')}}</span>
                <q-btn
                  unelevated
                  outline
                  color="green"
                  :label="$t('guide.document.newDoc')"
                  class="q-mr-md"
                  @click="showDocForm()"
                ></q-btn>
                <q-btn
                  unelevated
                  outline
                  color="green"
                  :label="$t('guide.document.newLink')"
                  class="q-mr-md"
                  @click="showLinkForm()"
                ></q-btn>
                <q-btn
                  unelevated
                  outline
                  color="green"
                  :label="$t('guide.document.newMarkMap')"
                  @click="showMarkMapForm()"
                ></q-btn>
              </div>
            </template>
            <template v-slot:list="scope">
              <div
                class="bg-green-1 q-pa-md"
                v-if="scope.files.length"
              >
                <q-list
                  separator
                  class="q-pa-none q-pb-lg"
                >
                  <q-item
                    v-for="file in scope.files"
                    :key="file.name"
                    class="bg-green-2 items-center"
                  >
                    <q-item-section
                      clickable
                      v-ripple
                      class="cursor-pointer file-title"
                    >
                      <img
                        v-if="file.__img"
                        :src="file.__img.src"
                        style="margin-bottom:4px;"
                      >
                      <q-item-label
                        class="full-width ellipsis"
                        v-else
                      >
                        {{ file.name}}
                      </q-item-label>
                      <q-item-label caption>
                        {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                      </q-item-label>
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
                        @click="scope.removeFile(file)"
                      ></q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
                <!-- 内容说明区 -->
                <div v-if="scope.files.length">
                  <quasar-editor
                    @input="(val)=>{submitModel.content=val}"
                    :value="oldContent"
                    :folder="category"
                    :applied="goIntoAction"
                    :placeholder="$t('document.field.placeholder.notes')"
                  ></quasar-editor>
                  <tw-choose-notify
                    :module="{category,id:+objectID}"
                    :widget="{category:'document',id:+id}"
                    :always="false"
                    :subscribers.sync="subscribers"
                  />
                  <!-- 保存和提交按钮 -->
                  <form-action
                    :action="formAction"
                    class="q-pr-md"
                    @submit="onSubmit"
                    @save="onSave"
                  >
                  </form-action>
                </div>
              </div>
            </template>
          </q-uploader>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Document from '@/store/document/model'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
import { showWarningMessage } from '@/utils/show-message'
import { i18n } from '@/boot/i18n'
export default {
  name: 'FileUpload',
  mixins: [mixinxquasarupload],
  props: {
    category: {
      type: String,
      default: 'document'
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    },
    id: {
      type: [Number, String],
      default: 0
    },
    showUploadDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formAction: [{ label: this.$t('action.submitEdit'), action: 'submit' }],
      submitModel: new Document(this.category, this.objectID, 'file'),
      mergeData: [],
      oldContent: '',
      subscribers: [],
      label: '',
      goIntoAction: false
    }
  },
  mounted () {
    // this.uploadFile()
    if (this.openType === 'add' ||
      (this.openType === 'edit' && !this.currentModel.isPublish)) {
      this.formAction.unshift({ label: this.$t('action.saveDraft'), action: 'save' })
    }
    if (+this.currentModel.id !== +this.$route.params.id) {
      this.loadResource()
    }
  },
  computed: {
    ...mapState('file', ['imgExts']),
    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id)
    }
  },
  methods: {
    ...mapActions('document', ['addDocument', 'updateDocument', 'loadDocument']), // 初始化显示文件
    showDocForm () {
      this.$emit('showDocForm')
      this.$refs.qUploader.files = []
    },
    showLinkForm () {
      this.$emit('showLinkForm')
      this.$refs.qUploader.files = []
    },
    showMarkMapForm () {
      this.$emit('showMarkMapForm')
      this.$refs.qUploader.files = []
    },
    onRejected () {
      showWarningMessage(i18n.t(`file.error.fileFormatNotSupported`))
    },
    /** 校验文件类型。过滤掉无扩展名的文件 */
    checkFileType (files) {
      return files.filter(file => file.name.substr(file.name.lastIndexOf('.')).length > 1)
    },
    // 打开文件上传窗口之后的回调
    addedCallback (files) {
      this.$refs.qUploader.removeUploadedFiles()
      this.$refs.qUploader.files = files
    },
    // 上传文件吊起选择文件窗口
    uploadFile () {
      if (this.openType === 'add' || this.showUploadDialog) {
        this.$refs.qUploader.pickFiles()
        this.$refs.qUploader.reset()
      }
    },
    // 选择文件后的回调方法
    uploaded (files) {
      if (files.length === 0) {
        showSuccessMessage('请选择文件上传')
        return {}
      }
      var file = {
        title: files[0].Title,
        filePath: files[0].PathName,
        extension: files[0].Extension,
        size: files[0].Size
      }
      this.submitModel = Object.assign(this.submitModel, file)
    },
    onSubmit (event) {
      this.submitData('submit')
    },
    onSave (event) {
      this.submitData('save')
    },
    submitData (submitType) {
      this.goIntoAction = true
      // 不确定是否需要校验submitModel，暂时保持原校验逻辑
      if (Object.keys(this.submitModel).length) {
        this.submitModel.isPublish = (submitType === 'submit') ? 1 : 0
      }

      if (this.openType === 'add') {
        if (Object.keys(this.submitModel).length) {
          // 订阅人员处理
          this.submitModel.subscribers = this.subscribers
          this.submitModel.parentId = +this.id
          this.addDocument(this.submitModel).then(res => {
            this.$refs.qUploader.files = []
          })
        }
      } else {
        this.submitModel.id = this.currentModel.id
        this.updateDocument(this.submitModel).then(doc => {
          doc && this.routeTo(doc)
        })
      }
    },
    loadResource () {
      if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
        this.$store.dispatch(`document/loadResourceDocument`, { objectType: this.category, objectID: Number(this.objectID) })
      } else {
        this.loadDocument(+this.$route.params.id || 0)
      }
    }
  },
  components: {
    FormAction: () => import('components/base/TwFormAction'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwChooseNotify: () => import('components/base/TwChooseNotify')
  }
}
</script>

<style lang="scss" scoped>
.q-btn-item {
  color: black;
}
/deep/.q-item__label {
  line-height: 1.4em !important;
}
/deep/.q-uploader {
  max-height: fit-content;
}
.editor {
  min-height: calc(100vh - 500px);
}
</style>
