<template>
  <tw-form
    @primary="()=>{twFormParams.secondary?onSave():onSubmit()}"
    :primaryLabel="twFormParams.primaryLabel"
    :secondary="twFormParams.secondary"
    :secondaryLabel="twFormParams.secondaryLabel"
    :buttonDisable="twFormParams.buttonDisable"
    actionAlign="left"
    @secondary="onSubmit"
  >
    <!-- 上传区 -->
    <upload-file
      ref="uploadFile"
      folder="document"
      :isReUpload="showUploadDialog"
      @initCallBack="initCallBack"
      :files="initFile"
      :multiple="!(openType==='edit')"
      :showClear="!(openType==='edit')"
      :goIntoAction="goIntoAction"
      :isDeleteInitFileIfAddFile="showUploadDialog"
      :formAction.sync="formAction"
    />
    <!-- <q-separator /> -->
    <!-- 权限和选择通知人员 -->
    <!-- 仅自己可编辑 -->
    <q-field
      color="grey-8"
      filled
      :label="$t('document.authoritySet')"
      stack-label
    >
      <template v-slot:control>
        <div class="self-center full-width no-outline q-gutter-y-sm q-py-sm">
          <tw-only-i-can-handle
            v-if="submitModel.authorID === myself||$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isSeniorManager|| openType === 'add'"
            :meEdit.sync="onlyICanEdit"
          />
          <!-- 仅自己可下载 -->
          <tw-only-i-can-handle
            v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager|| openType === 'add'"
            :meEdit.sync="otherCannotDownload"
            :label="$t('document.cannotDownload')"
          />
          <tw-secrecy-acl
            v-if="openType==='add'"
            :secrecy.sync="secrecy"
            :initWhiteListScope="parentModel.acl?parentModel.whiteList:[]"
          />
        </div>
      </template>
    </q-field>
    <!-- <tw-only-i-can-handle
      v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager|| openType === 'add'"
      :meEdit.sync="onlyICanEdit"
    />
    仅自己可下载
    <tw-only-i-can-handle
      v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager|| openType === 'add'"
      :meEdit.sync="otherCannotDownload"
      :label="$t('document.cannotDownload')"
    />
    <tw-secrecy-acl
      v-if="openType==='add'"
      :secrecy.sync="secrecy"
      :initWhiteListScope="parentModel.acl?parentModel.whiteList:[]"
    /> -->
    <tw-choose-notify
      :module="{category,id:+objectID}"
      :widget="{category:'document',id:+id}"
      :always="false"
      :subscribers.sync="subscribers"
    />
  </tw-form>

</template>

<script>
// const onCanIEditTrue = ['productCaseFileUpload']
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
import Document from '@/store/document/model'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'FileUpload',
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
    },
    fileTag: {
      type: String,
      default: '',
      required: false,
      desc: '文件是否有tag标签'
    }
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself').id,
      onlyICanEdit: 0,
      otherCannotDownload: 0,
      formAction: [{ label: this.$t('action.submitEdit'), action: 'submit' }],
      submitModel: [],
      initFile: [],
      oldContent: '',
      subscribers: [],
      secrecy: { acl: 0, whiteList: [] },
      goIntoAction: false,
      twFormParams: { primaryLabel: this.$t('action.submitEdit'), secondary: false },
      tag: ''
    }
  },
  mounted () {
    if (this.category === 'productCase') {
      this.onlyICanEdit = 1
    }
    this.tag = _.cloneDeep(this.fileTag)
    // 1、是否添加保存按钮
    if ((this.openType === 'add' ||
      (this.openType === 'edit' && !this.model.isPublish)) && this.category !== 'productCase') {
      this.formAction.unshift({ label: this.$t('action.saveDraft'), action: 'save' })
    }
    // 2、如果是编辑需要获取数据
    if (this.openType === 'edit') {
      if (Object.keys(this.model).length === 0) {
        this.loadDocument(+this.id || 0)
          .then(res => {
            this.submitModel = Object.assign({}, res)
            this.oldContent = res.content
            this.initFile = this.model.classify === 'file' ? [this.model] : []
            this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
            this.onlyICanEdit = this.submitModel.onlyICanEdit
            this.otherCannotDownload = this.submitModel.onlyICanDownload
          })
      } else {
        this.submitModel = Object.assign({}, this.model)
        this.oldContent = this.submitModel.content
        this.initFile = this.model.classify === 'file' ? [this.model] : []
        this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
        this.onlyICanEdit = this.submitModel.onlyICanEdit
        this.otherCannotDownload = this.submitModel.onlyICanDownload
      }
      this.tag = this.submitModel.tag
    }
    if (+this.model.id !== +this.$route.params.id) {
      this.loadResource()
    }
  },
  watch: {
    formAction: {
      handler (newVal, oldVal) {
        if (this.formAction.length === 1) {
          this.twFormParams = Object.assign({}, this.twFormParams, { secondary: false, primaryLabel: this.formAction[0].label, buttonDisable: this.formAction[0].disable || false })
        } else {
          this.twFormParams = Object.assign({}, this.twFormParams,
            {
              secondary: true,
              primaryLabel: this.formAction[0].label,
              secondaryLabel: this.formAction[1].label,
              buttonDisable: this.formAction[0].disable || false
            }
          )
        }
      },
      deep: true
    }
  },
  computed: {
    model () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    parentModel () {
      return this.model ? _.find(this.$store.state.document.documentList, d => d.id === this.model.parentId) || {} : {}
    }
  },
  methods: {
    ...mapActions('document', ['batchAddDocument', 'updateDocument', 'loadDocument', 'reUploadDocument']),
    // 上传文件打开选择文件窗口
    initCallBack () {
      if (this.openType === 'add' || this.showUploadDialog) {
        this.$refs.uploadFile.$refs.qUploader.reset()
        this.$refs.uploadFile.$refs.qUploader.pickFiles()
      }
    },
    onSubmit (event) {
      this.submitData('submit')
    },
    onSave (event) {
      this.submitData('save')
    },
    submitData (submitType) {
      this.goIntoAction = true
      let oldAuthor = {}
      if (this.openType === 'edit') {
        Object.assign(oldAuthor, { authorID: this.submitModel.authorID, authorName: this.submitModel.authorName })
      }
      this.submitModel = []
      const files = this.$refs.uploadFile.$refs.qUploader.files
      // 1、防呆校验
      if (!files.length) {
        showSuccessMessage('请选择文件上传')
        return false
      }
      // 2、将files写入submitModel中
      _(files).forEach(file => {
        const newModel = new Document(this.model.objectType || this.category, this.model.objectID || this.objectID, 'file')
        const fileModel = {
          title: (file.newName || file.subName || file.name).slice(0, (file.newName || file.subName || file.name).lastIndexOf('.')),
          filePath: file.pathName || '',
          extension: file.extension,
          size: file.Size,
          content: file.content || ''
        }
        const newWhiteList = _.difference(this.secrecy.whiteList, this.subscribers)
        this.whiteList = [...this.subscribers, ...newWhiteList]
        this.secrecy.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []
        const otherPropertyModel = {
          isPublish: (submitType === 'submit') ? 1 : 0,
          subscribers: this.subscribers, // 订阅人员处理
          acl: this.secrecy.acl, // 保密文档白名单
          whiteList: this.secrecy.acl ? _.uniq(this.whiteList) : [],
          parentId: this.openType === 'add' ? +this.id : this.model.parentId,
          level: this.openType === 'add' ? this.model.level + 1 : this.model.level,
          path: this.model.path || '',
          orderNumber: this.openType === 'add' ? '' : this.model.orderNumber,
          onlyICanEdit: this.onlyICanEdit,
          onlyICanDownload: this.otherCannotDownload
        }
        let obj = Object.assign({}, newModel, fileModel, otherPropertyModel, oldAuthor)
        if (this.tag) {
          obj.tag = this.tag
        }
        this.submitModel.push(obj)
      })

      // 提交文件数据维护
      if (this.openType === 'add') {
        this.batchAddDocument(this.submitModel).then(doc => {
          doc && this.routeTo(doc, submitType)
        })
      } else {
        this.submitModel = this.submitModel[0]
        this.submitModel.id = this.model.id
        if (this.showUploadDialog) {
          // 重新上传
          this.reUploadDocument(this.submitModel).then(doc => {
            doc && this.routeTo([doc], submitType)
          })
        } else {
          this.updateDocument(this.submitModel).then(doc => {
            doc && this.routeTo([doc], submitType)
          })
        }
      }
    },
    loadResource () {
      if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
        this.$store.dispatch(`document/loadResourceDocument`, { objectType: this.category, objectID: Number(this.objectID) })
      } else {
        this.loadDocument(+this.$route.params.id || 0)
      }
    },
    routeTo (doc, submitType) {
      // 如果是数组
      if (submitType === 'submit' && this.openType === 'add') {
        // 跳转到文件夹页面
        const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
        let params = inDocumentCenter
          ? { id: this.id }
          : { category: this.category, objectID: this.objectID, id: this.id }

        this.$router.push({
          name: this.model.objectType === 'productCase' ? 'productCaseDetail' : 'folder',
          params
        })
      } else if (this.openType === 'edit' && submitType === 'submit') {
        let params = {
          category: this.model.objectType === 'productCase' ? 'select-product-case' : this.model.objectType,
          objectID: this.model.objectID,
          id: this.model.id
        }
        this.model.objectID === 0 && (params = _.omit(params, ['objectID']))

        this.$router.push({
          name: 'fileDetail',
          params
        })
      } else {
        let params = {
          category: this.category,
          objectID: this.objectID,
          id: doc[0].parentId
        }
        this.$router.push({
          name: 'draftDocuments',
          params
        })
      }
    }
  },
  components: {
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    UploadFile: () => import('components/file/UploadFile'),
    TwSecrecyAcl: () => import('components/base/TwSecrecyAcl'),
    TwOnlyICanHandle: () => import('components/base/TwOnlyICanHandle'),
    TwForm: () => import('components/base/TwForm')
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
    width: auto !important;
    max-height: fit-content;
  }
  .editor {
    min-height: calc(100vh - 450px);
  }
</style>
