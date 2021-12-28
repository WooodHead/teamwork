<template>
  <tw-form
    @primary="onSave"
    :primaryLabel="twFormParams.primaryLabel"
    :secondary="twFormParams.secondary"
    :secondaryLabel="twFormParams.secondaryLabel"
    actionAlign="left"
    @secondary="onSubmit"
  >
    <!-- 标题 -->
    <q-input
      v-model="submitModel.title"
      input-class="text-center"
      class="text-h6"
      :placeholder="$t('document.field.placeholder.title')"
      lazy-rules
      :rules="[val => !!val || $t('document.field.rule.title')]"
      ref="title"
      autofocus
      debounce="500"
    />
    <!-- 文档链接 -->
    <q-input
      v-model="submitModel.filePath"
      input-class="text-subtitle1"
      class="text-h6 q-mt-none"
      :placeholder="$t('document.field.placeholder.filePath')"
      lazy-rules
      :rules="[val => !!val || $t('document.field.rule.filePath')]"
      ref="link"
    />
    <!-- 内容说明区 -->
    <quasar-editor
      @input="(val)=>{submitModel.content=val}"
      :value="content"
      :folder="category"
      :focus="false"
      :applied="goIntoAction"
      :placeholder="$t('document.field.placeholder.notes')"
      class="q-mt-none"
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
    <!-- <q-field
      color="grey-8"
      filled
      :label="$t('document.authoritySet')"
      stack-label
    >
      <template v-slot:control>
        <div class="self-center full-width no-outline q-gutter-y-md q-py-sm">
          <tw-only-i-can-handle
            v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
            :meEdit.sync="submitModel.onlyICanEdit"
          />
          <tw-secrecy-acl
            v-if="openType==='add'"
            :secrecy.sync="secrecy"
            :initWhiteListScope="currentModelParent.acl?currentModelParent.whiteList:[]"
          />

        </div>
      </template>
    </q-field> -->
    <tw-only-i-can-handle
      v-if="submitModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
      :meEdit.sync="submitModel.onlyICanEdit"
    />
    <tw-secrecy-acl
      v-if="openType==='add'"
      :secrecy.sync="secrecy"
      :initWhiteListScope="currentModelParent.acl?currentModelParent.whiteList:[]"
    />

    <tw-choose-notify
      :module="{category,id:+objectID}"
      :widget="{category:'document',id:+id}"
      :always="false"
      :subscribers.sync="subscribers"
    />
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
// import { showSuccessMessage } from '@/utils/show-message'
import Document from '@/store/document/model'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
export default {
  name: 'LinkForm',
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
    }
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself').id,
      submitModel: new Document(this.category, this.objectID, 'link'),
      formAction: [{ label: this.$t('action.submitEdit'), action: 'submit' }],
      subscribers: [],
      content: '',
      secrecy: { acl: 0, whiteList: [] },
      goIntoAction: false,
      twFormParams: { primaryLabel: this.$t('action.submitEdit'), secondary: false }
    }
  },
  mounted () {
    if (this.openType === 'add' ||
      (this.openType === 'edit' && !this.submitModel.isPublish)) {
      this.formAction.unshift({ label: this.$t('action.saveDraft'), action: 'save' })
      this.twFormParams = Object.assign(this.twFormParams, { secondary: true, primaryLabel: this.$t('action.saveDraft'), secondaryLabel: this.$t('action.submitEdit') })
    }
    if (this.openType === 'edit') {
      if (Object.keys(this.currentModel).length === 0) {
        this.loadDocument(+this.id || 0)
          .then(res => {
            this.submitModel = Object.assign({}, res)
            this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
          })
      } else {
        this.submitModel = Object.assign({}, this.currentModel)
        this.secrecy = { acl: this.submitModel.acl, whiteList: this.submitModel.whiteList }
      }
      this.content = this.submitModel.content
    }
    if (+this.currentModel.id !== +this.$route.params.id) {
      this.loadResource()
    }
  },
  computed: {

    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id)
    },
    currentModelParent () {
      return this.currentModel ? _.find(this.$store.state.document.documentList, d => d.id === this.currentModel.parentId) || {} : {}
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    TwSecrecyAcl: () => import('components/base/TwSecrecyAcl'),
    // 仅自己可编辑
    TwOnlyICanHandle: () => import('components/base/TwOnlyICanHandle'),
    TwForm: () => import('components/base/TwForm'),
    TwSelectTag: () => import('components/base/TwSelectTag')
  },
  methods: {
    ...mapActions('document', ['addDocument', 'loadDocument', 'updateDocument']),
    onSubmit () {
      this.submitData('submit')
    },
    onSave () {
      this.submitData('save')
    },
    submitData (submitType) {
      if (this.$refs.title.validate() && this.$refs.link.validate()) {
        this.goIntoAction = true
        submitType === 'submit' ? this.submitModel.isPublish = 1 : this.submitModel.isPublish = 0
        // 订阅人员处理
        this.submitModel.subscribers = this.subscribers
        // 保密文档白名单
        this.submitModel.acl = this.secrecy.acl
        const newWhiteList = _.difference(this.secrecy.whiteList, this.subscribers)
        this.whiteList = [...this.subscribers, ...newWhiteList]
        this.submitModel.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []
        this.secrecy.whiteList = this.secrecy.acl ? _.uniq(this.whiteList) : []

        this.submitModel.objectType = this.currentModel.objectType || this.category
        this.submitModel.objectID = this.currentModel.objectID || this.objectID

        // 维护方式
        if (this.openType === 'add') {
          this.submitModel.parentId = +this.id
          this.addDocument(this.submitModel)
            .then(doc => {
              if (this.guide) {
                this.$emit('hiddenLinkForm')
              } else {
                this.routeTo(doc)
              }
            })
        } else {
          this.updateDocument(this.submitModel)
            .then(doc => {
              this.routeTo(doc)
            })
        }
      }
    },
    loadResource () {
      if (this.category.length > 0 && Number(this.objectID) > 0 && Number(this.id) === 0) {
        this.$store.dispatch(`document/load${capitalize(this.category)}Document`, Number(this.objectID))
      } else {
        this.loadDocument(+this.$route.params.id || 0)
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
          name: 'linkDetail',
          params
        })
      } else {
        this.$router.push({
          name: 'draftDocuments',
          params
        })
      }
    }
  }
}
</script>

<style scoped>
  .page-quasar-tiptap-all {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
</style>
