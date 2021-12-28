<template>
  <tw-form
    @primary="onSubmit"
    :primaryLabel="twFormParams.primaryLabel"
    :secondary="twFormParams.secondary"
    :secondaryLabel="twFormParams.secondaryLabel"
    actionAlign="left"
    @secondary="onSave"
  >
    <div class="row">
      <tw-select-edit
        style="min-width:125px;"
        class="col-auto"
        v-if="moduleType=='notice'"
        withIcon
        rounded
        outlined
        dense
        module="notice"
        field="NoticeType"
        :editable="!!$myinfo.auth.role.isSystemAdministrator"
        :label="$t('project.typeNotes')"
        :value="submitModel.noticeType"
        :guide="guide"
        @input="noticeTypeSelect"
      />
    </div>
    <upload-file
      v-if="moduleType === 'notice'&&isUploadNotice"
      class="q-py-md"
      ref="uploadFile"
      folder="notice"
      @initCallBack="initCallBack"
      :files="initFile"
      :isReUpload="showUploadDialog"
      @uploaded="uploaded"
      :showClear="!(openType==='edit')"
      :goIntoAction="goIntoAction"
      :isDeleteInitFileIfAddFile="showUploadDialog"
    />
    <q-input
      v-if="!(moduleType === 'notice'&&isUploadNotice)"
      v-model="submitModel.title"
      input-class="text-center"
      class="text-h6"
      :placeholder="$t('document.field.placeholder.title')"
      lazy-rules
      :rules="[
            val => !!val && !!val.trim() || $t('document.field.rule.title'),
            val => val.length <= $global.options.titleLength || $t('notice.tooLongTitle',{length:$global.options.titleLength})
            ]"
      ref="title"
      autofocus
      debounce="500"
    />
    <quasar-editor
      v-if="!(moduleType === 'notice'&&isUploadNotice)"
      @input="(val)=>{submitModel.content=val}"
      :value="oldContent"
      :folder="category"
      :focus="false"
      :applied="goIntoAction"
      :placeholder="$t('document.field.placeholder.notes')"
      class="q-mt-none q-px-none"
    ></quasar-editor>
    <!-- 添加标签 -->
    <tw-select-tag
      filled
      stack-label
      multiple
      v-model="submitModel.tags"
      :label="$t('task.item.tag')"
      placeholder=""
      emit-value
    />
    <!-- 仅自己可编辑 -->
    <tw-only-i-can-handle
      v-if="(submitModel.authorID === myself||$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isSeniorManager)&&moduleType === 'document'"
      :meEdit.sync="submitModel.onlyICanEdit"
    />
    <tw-secrecy-acl
      v-if="moduleType=='document'&&openType==='add'"
      :secrecy.sync="secrecy"
      :initWhiteListScope="currentModelParent.acl?currentModelParent.whiteList:[]"
    />
    <tw-choose-notify
      v-if="!categoryModel.isTemplate"
      :module="{category,id:+objectID}"
      :widget="{category:moduleType,id: +id}"
      :category="category"
      :objectID="+objectID"
      :always="moduleType==='notice'"
      :subscribers.sync="subscribers"
    />
  </tw-form>
</template>

<script>
import { format, debounce, LocalStorage } from 'quasar'
import { showSuccessMessage } from '@/utils/show-message'
import { mapState, mapMutations } from 'vuex'
const { capitalize } = format
import Document from '@/store/document/model'
import Notice from '@/store/notice/model'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'DocForm',
  mixins: [getCategory],
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    category: {
      type: String,
      default: 'document'
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0
    },
    guide: {
      type: Boolean,
      default: false
    },
    showUploadDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself').id,
      moduleType: 'document',
      submitModel: { id: 0 },
      oldContent: '',
      subscribers: [],
      secrecy: { acl: 0, whiteList: [] },
      goIntoAction: false,
      isUploadNotice: false,
      initFile: [],
      twFormParams: { primaryLabel: this.$t('action.submitEdit'), secondary: false }

    }
  },
  created () {
    // 确定模块，公告还是文档
    this.moduleType = _.intersection(this.$route.path.split('/'), ['notice', 'document'])[0]
    if (this.openType === 'edit') {
      this.$store.dispatch(`${this.moduleType}/load${capitalize(this.moduleType)}`, +this.id).then(res => {
        this.submitModel = _.cloneDeep(res)
        this.initFile = [this.submitModel]
        this.oldContent = this.submitModel.content
        if (!this.submitModel.isPublish) {
          this.twFormParams = Object.assign(this.twFormParams, { secondary: true, primaryLabel: this.$t('action.submitEdit'), secondaryLabel: this.$t('action.saveDraft') })
        }
        if (this.moduleType === 'document') {
          this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
        } else {
          this.isUploadNotice = !!this.submitModel.filePath
        }
      })
    } else {
      this.isUploadNotice = this.moduleType === 'notice' && this.$route.path.split('/') && this.$route.path.split('/')[4] === 'upload'
      this.twFormParams = Object.assign(this.twFormParams, { secondary: true, primaryLabel: this.$t('action.submitEdit'), secondaryLabel: this.$t('action.saveDraft') })
      if (this.moduleType === 'document') {
        this.submitModel = new Document(this.currentModel.objectType || this.category, this.currentModel.objectID || this.objectID)
        this.submitModel.parentId = +this.id
      } else if (this.moduleType === 'notice') {
        this.submitModel = new Notice({ objectType: this.category, objectID: +this.objectID })
        this.twFormParams = Object.assign(this.twFormParams, { secondary: true, primaryLabel: this.$t('action.submitEdit'), secondaryLabel: this.$t('action.saveDraft') })
      }
    }
  },
  mounted () {
    if (this.guide && this.moduleType === 'notice') {
      this.submitModel.title = this.$t('guide.sampleTitle')
      this.oldContent = this.$t('guide.sampleMessage', { name: LocalStorage.getItem('myself').name })
    }
  },
  computed: {
    ...mapState('guide', ['guideModule']),
    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    currentModelParent () {
      return this.currentModel ? _.find(this.$store.state.document.documentList, d => d.id === this.currentModel.parentId) || {} : {}
    }
  },
  watch: {
    'submitModel.title' () {
      if (this.moduleType === 'document') {
        if (!this.submitModel.title) {
          document.title = `${this.$route.meta.label} | TeamWork`
        } else {
          document.title = `${this.submitModel.title} | TeamWork`
        }
      }
    }
  },
  methods: {
    ...mapMutations('guide', ['setGuideModule']),
    // 通过防抖函数防止表单短时间内重复提交
    onSubmit: debounce(function () {
      this.submitData('submit')
    }, 3000, true),
    onSave: debounce(function () {
      this.submitData('save')
    }, 3000, true),
    submitData (submitType) {
      this.goIntoAction = true
      if (this.moduleType === 'notice' && this.isUploadNotice) {
        const files = this.$refs.uploadFile.$refs.qUploader.files
        // 1、防呆校验
        if (!files.length) {
          showSuccessMessage('请选择文件上传')
          return false
        }
        this.submitModel.content = files[0].content
        this.submitModel.title = (files[0].subName || files[0].name).slice(0, (files[0].subName || files[0].name).lastIndexOf('.'))
      }
      const titleValidate = (this.moduleType === 'notice' && this.isUploadNotice) ? true : this.$refs.title.validate()
      if (titleValidate) {
        this.submitModel.isPublish = (submitType === 'submit') ? 1 : 0
        // 订阅人员处理
        this.submitModel.subscribers = this.subscribers
        // 保密文档白名单
        if (this.moduleType === 'document') {
          this.submitModel.acl = this.secrecy.acl
          const newWhiteList = _.difference(this.secrecy.whiteList, this.subscribers)
          this.whiteList = [...this.subscribers, ...newWhiteList]
          this.submitModel.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []
          this.secrecy.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []

          this.submitModel.objectType = this.currentModel.objectType || this.category
          this.submitModel.objectID = this.currentModel.objectID || this.objectID
        }
        // 维护方式
        if (this.openType === 'add') {
          this.$store.dispatch(`${this.moduleType}/add${capitalize(this.moduleType)}`, this.submitModel)
            .then(res => {
              if (this.guide) {
                this.$emit('hiddenDocForm')
                if (res) {
                  showSuccessMessage(this.$t(`guide.submitSuccess`))
                  this.submitModel.title = this.$t('guide.sampleTitle')
                  this.oldContent = this.$t('guide.sampleMessage', { name: LocalStorage.getItem('myself').name })
                }
              } else {
                res && this.routeTo(res)
              }
            })
        } else {
          this.$store.dispatch(`${this.moduleType}/update${capitalize(this.moduleType)}`, this.submitModel)
            .then(res => {
              this.$emit('updateDoc', this.submitModel)
              res && this.routeTo(res)
            })
        }
      }
    },
    routeTo (doc) {
      let id = doc.isPublish ? doc.id : doc.parentId
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id }
        : { category: this.category, objectID: this.objectID, id }

      if (doc.isPublish) {
        this.$router.push({
          name: this.moduleType === 'document' ? 'docDetail' : 'noticeDetail',
          params
        })
      } else {
        this.$router.push({
          name: this.moduleType === 'document' ? 'draftDocuments' : 'noticeDrafts',
          params
        })
      }
    },
    noticeTypeSelect (noticeTypeDict) {
      this.submitModel.noticeType =
        noticeTypeDict.dictValue === '所有'
          ? ''
          : `${noticeTypeDict.icon}${noticeTypeDict.dictValue}`
    },
    subscriberOption (option) {
      console.log(option)
    },
    // 上传文件吊起选择文件窗口
    initCallBack () {
      if (this.openType === 'add' || this.showUploadDialog) {
        this.$refs.uploadFile.$refs.qUploader.pickFiles()
        this.$refs.uploadFile.$refs.qUploader.reset()
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
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    TwSecrecyAcl: () => import('components/base/TwSecrecyAcl'),
    UploadFile: () => import('components/file/UploadFile'),
    TwOnlyICanHandle: () => import('components/base/TwOnlyICanHandle'),
    TwForm: () => import('components/base/TwForm'),
    TwSelectTag: () => import('components/base/TwSelectTag')
  }
}
</script>

<style scoped lang="scss">
  .editor {
    min-height: calc(100vh - 450px);
  }
  .hr {
    border: none;
    height: 1px;
    background-color: lightgray;
  }
  /deep/.page-quasar-tiptap-all .editor__content {
    min-height: calc(100vh - 450px) !important;
  }
  /deep/.tiptap .editor__content .ProseMirror {
    min-height: calc(100vh - 450px) !important;
  }
  .page-quasar-tiptap-all {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
</style>
