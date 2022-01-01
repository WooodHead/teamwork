<template>
  <component
    :id="id"
    :is="isPublicLink?'document-public-detail':'document-detail'"
    :isPublicLink="isPublicLink"
    :category="category"
    :objectID="objectID"
    :type="type"
  >
    <template slot="content">
      <q-card-section class="file-detail">
        <!-- 仅创建者可编辑时，对其他人不显示重新上传 -->
        <attach-card
          :attach="{createBy:currentModel.createBy, modifyBy:currentModel.authorName,filePath:currentModel.filePath,extension:currentModel.extension,title:currentModel.title,size:currentModel.size,snapshotPath:currentModel.snapshotPath,modifyTime:currentModel.modifyTime,tags:currentModel.tags}"
          @attachIconClick="setShowFile"
          @reupdate="reupdate"
          @version="version"
          :tooltip="canPreview?'点击预览':''"
          :showDownload="currentModel.onlyICanDownload === 0||currentModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
          :showEdit="isPublicLink?false:currentModel.onlyICanEdit === 0||currentModel.authorID === myself||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
          :showVersion="type==='document'"
        />
        <template v-if="currentModel.content">
          <q-separator class="q-mt-md" />
          <p
            v-html="currentModel.content"
            class="q-mt-lg tiptap-content editor__content"
            style="text-align: initial;"
          ></p>
        </template>
      </q-card-section>
    </template>
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
export default {
  name: 'FileDetail',
  data () {
    return {
      fullScreen: false,
      myself: LocalStorage.getItem('myself').id
    }
  },
  props: {
    category: {
      type: String,
      default: ''
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    isPublicLink: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'document'
    }
  },
  computed: {
    ...mapGetters('file', ['canPreviewExts']),
    currentModel () {
      return this.$store.getters[`${this.type}/currentModel`](+this.id)
    },
    canPreview () {
      return this.currentModel.extension &&
        this.canPreviewExts.includes(this.currentModel.extension.toLowerCase())
    }
  },
  created () {
    if (!this.$route.name === 'publicLink') {
      this.$store.dispatch(`${this.type}/load${capitalize(this.type)}`, this.id)
    }
  },
  methods: {
    ...mapActions('document', ['loadDocument']),
    setShowFile () {
      this.canPreview && previewFile(
        this.currentModel.filePath,
        this.currentModel.title,
        this.currentModel.extension,
        this
      )
    },
    reupdate () {
      let params = { id: +this.id, showUploadDialog: true }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: this.type === 'notice' ? 'noticeEdit' : 'fileEdit', params })
    },
    version () {
      let params = { id: +this.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: 'fileVersion', params })
    }
  },
  components: {
    DocumentDetail: () => import('components/document/DocumentDetail'),
    DocumentPublicDetail: () => import('components/document/DocumentPublicDetail'),
    AttachCard: () => import('components/attach/AttachCard')
  }
}
</script>

<style lang="scss" scoped>
  .q-zoom__no-scroll {
    overflow: auto;
  }
  /deep/ .file-detail video,
  /deep/.file-detail img {
    width: auto !important;
    max-height: 500px !important;
  }
</style>
